const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username; 
  
  if(isValid(username)) {
    return res.status(200).json({message: "User already exist! please use different username"});
  }

  const password = req.body.password; 
  users.push({"username": username, "password": password})
  return res.status(200).json({message: `${username} registered successfully.`});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {  
  return res.status(200).json({message: books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let book = books[isbn]
  return res.status(200).json({message: book});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let author_found = []
  
  Object.entries(books).forEach(([key, val]) => {
   if (val["author"] === author) {
    author_found.push(val)
   }
  });

  if (author_found.length > 0) {
    return res.status(200).json({message: author_found[0]});
  } 

  return res.status(400).json({message: `${author} not found`});

  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let title_found = []
  
  Object.entries(books).forEach(([key, val]) => {
   if (val["title"] === title) {
    title_found.push(val)
   }
  });

  if (title_found.length > 0) {
    return res.status(200).json({message: title_found[0]});
  } 

  return res.status(400).json({message: `${title} not found`});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let review = []

  Object.entries(books).forEach(([key, val]) => {
    if (key === isbn) {
      review.push(val["reviews"])
    }
   });

   if (review.length > 0) {
    return res.status(200).json({message: review[0]});
  } 
 
  return res.status(400).json({message: `${isbn} not found.`});
});

module.exports.general = public_users;
