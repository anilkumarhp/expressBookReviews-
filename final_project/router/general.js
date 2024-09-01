const axios = require('axios').default;
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
let prompt = require('prompt-sync')();
let fs = require('fs');



public_users.post("/register", (req,res) => {
  const username = req.body.username; 
  
  if(isValid(username)) {
    return res.status(200).json({message: "User already exist! please use different username"});
  }

  const password = req.body.password; 
  users.push({"username": username, "password": password})
  return res.status(200).json({message: `${username} registered successfully.`});
});


const getBookData = (url) => {
  return axios.get(url)
    .then(res => res.data)
    .catch(err => err)
}

const getData = async () => {  
  return await books;
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {  
    
  getData()
  .then(data => res.status(200).json({message: data}))
  .catch(err => res.status(200).json({message: err}))  

  // fetching books using axios
  // let books =  getBookData(url)
  // res.status(200).json({message: books}

});

const getBookByIsbn = async (isbn) => {
  if(isbn in books ) {
    let book = books[isbn] 
    return await book;
  } else {
    return await `isbn ${isbn} doesnt exist.`
  }
  
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  getBookByIsbn(isbn)
  .then(data => res.status(200).json({message: data}))
  .catch(err => res.status(200).json({message: err}))   
  
   // fetching books using axios
  // let books =  getBookData(url)
  // res.status(200).json({message: books[isbn]}
 });


 const getBookByAuthor = async (author) => {
  let author_found = []
  Object.entries(books).forEach(([key, val]) => {
    if (val["author"] === author) { author_found.push(val)}
   });
 
   if (author_found.length > 0) {
     return await res.status(200).json({message: author_found[0]});
   }  
   return await res.status(400).json({message: `${author} not found`});
 }
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  
  getBookByAuthor(author)
  .then(data => res.status(200).json({message: data[0]}))
  .catch(err => res.status(200).json({message: err})) 

  // fetching books using axios
  // let books =  getBookData(url)
  // for(const [key, value] in Object.entries(books)){
  //   if (value["author"] === author) {
  //     return res.status(200).json({message: value})
  //   } else {
  //     return res.status(200).json({message: `No book for the author ${author}`})
  //   }
  // }
  
});

const getBookByTitle = async (title) => {
  let title_found = []  
  Object.entries(books).forEach(([key, val]) => {
   if (val["title"] === title) {title_found.push(val)}
  });

  if (title_found.length > 0) {
    return await title_found[0];
  } 
  return await `${title} not found`;
}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  
  getBookByTitle(title)
  .then(data => res.status(200).json({message: data}))
  .catch(err => res.status(200).json({message: err}))

  // fetching books using axios
  // let books =  getBookData(url)
  // for(const [key, value] in Object.entries(books)){
  //   if (value["title"] === title) {
  //     return res.status(200).json({message: value})
  //   } else {
  //     return res.status(200).json({message: `No book found with title ${title}`})
  //   }
  // }
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
