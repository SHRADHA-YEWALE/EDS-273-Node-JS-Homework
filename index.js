//import express module 
var express = require('express');
//create an express app
var app = express();
//require express middleware body-parser
var bodyParser = require('body-parser');
//require express session
var session = require('express-session');
var cookieParser = require('cookie-parser');
const { json } = require('body-parser');

//set the view engine to ejs
app.set('view engine', 'ejs');
//set the directory of views
app.set('views', './views');
//specify the path of static directory
app.use(express.static(__dirname + '/public'));

//use body parser to parse JSON and urlencoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//use cookie parser to parse request headers
app.use(cookieParser());
//use session to store user data between HTTP requests
app.use(session({
    secret: 'cmpe_273_secure_string',
    resave: false,
    saveUninitialized: true
}));

var f = 0;
//Only user allowed is admin
var Users = [{
    "username": "admin",
    "password": "admin"
}];
//By Default we have 3 books
var books = [
    { "BookID": "1", "Title": "Book 1", "Author": "Author 1" },
    { "BookID": "2", "Title": "Book 2", "Author": "Author 2" },
    { "BookID": "3", "Title": "Book 3", "Author": "Author 3" }
]
//route to root
app.get('/', function (req, res) {
    //check if user session exits
    if (req.session.user) {
        res.render('/home');
    } else
        res.render('login');
});

app.post('/login', function (req, res) {
    if (req.session.user) {
        res.render('/home');
    } else {
        console.log("Req Body : ", req.body);
        Users.filter(user => {
            if (user.username === req.body.username && user.password === req.body.password) {
                req.session.user = user;
                res.redirect('/home');
            } else {
                res.render("login", {
                    flag: "1",
                  });
            }
        });
    }

});

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.render("login", {
        flag1: "1",
      });
  });
  


app.get('/home', function (req, res) {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        console.log("Session data : ", req.session);
        res.render('home', {
            books: books
        });
    }
});

app.get('/create', function (req, res) {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        res.render('create');
    }
});

app.post('/create', function (req, res) {

    if (!req.session.user) {
        res.redirect('/');  

    } else {
        console.log("Inside Create a new book function");    
        const addBook = {
            BookID: req.body.bookId,
            Title: req.body.title,
            Author: req.body.author,
        };

        var f = 0;
        //Check if book id already exists
        for (var i = 0; i < books.length; i++) {
            if (books[i].BookID == addBook.BookID) {
                console.log("Book already exists");
                f = 1;
                break;      
            }
        } 

        if (f == 1) {
            res.render('create', {
                flag: "1"
            });
        } else {
            console.log(addBook.BookID, addBook.Title, addBook.Author);
            books.push(addBook);
            console.log("BOOK ADDED SUCCESSFULLY");
            res.redirect('home')
        }
    } 
});

app.get('/delete', function (req, res) {
    console.log("Session Data : ", req.session.user);
    if (!req.session.user) {
        res.redirect('/');
    } else {
        res.render('delete');
    }
});

app.post('/delete', function (req, res) {

    var f = 0;
    if (!req.session.user) {
        res.redirect('/');  
    } else {
        console.log("Inside Delete a book function");
        for (var i = 0; i < books.length; i++) {
            if (books[i].BookID == req.body.bookId) {
                books.splice(i,1);  
                f = 1;
                console.log('book deleted');
                break;          
            }
        } 
        if(f == 0) {
            console.log('Book ID you entered to delete is not present')
            res.render('delete', {
                flag: "1"
            });
        } else {
            res.render('home', {
                books: books
            });
        }   
    }

})

var server = app.listen(3000, function () {
    console.log("Server listening on port 3000");
});