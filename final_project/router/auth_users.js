const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []

const isValid = (username)=>{ //returns boolean
  let user = users.filter(user => user.username === username);
  if(user.length > 0) {
    return true
  }
  return false

}


//only registered users can login
regd_users.post("/login", (req,res) => {
 
  const username = req.body.username; 
  const password = req.body.password;
 
  const user = users.filter(user =>  user.username === username && user.password === password);

  if(user.length > 0){    

    let jwtSecretKey = "secrete@123"; // just for testing purpose.
    let data = {
        time: Date(),
        username: username,
        password: password,
    }

    const token = jwt.sign(data, jwtSecretKey);
    return res.status(200).json({message: "user logged in successfully", token: token});
  }

  return  res.status(200).json({message: "username and password doesn't match. try again!"});
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  
  let isbn = req.params.isbn;
  let review = req.query.review;
  let user = req.user;
  let book = books[isbn];
  let book_review = book["reviews"];

  if(user.username in book_review) {
    book_review[user.username] = review
    response = "review updated"
  } else {
    let new_review = {}
    new_review[user.username] = review
    book_review = {...book_review, ...new_review}
    response = "review added."
  }
  books[isbn]["reviews"] = book_review;
    
  return res.status(200).json({message: books[isbn]});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;

  if(isbn in books) {
    delete books[isbn];
    return res.status(200).json({message: `deleted isbn ${isbn}`});
  }
  return res.status(200).json({message: `isbn ${isbn} not found`});


});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
