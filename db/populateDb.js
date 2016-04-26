var mongo = require('./mongo.js');
var fs = require('fs');

// Individual image promise. Givem caption and folder location of
var imageReadPromise = function (pagename, cap) {
  return new Promise(function (resolve, reject) {
    fs.readFile('../imageCache/' + pagename + '/' + cap.filename, (err, data) => {
      if (err) reject(err);
      // Create the mongo document for the image
      var piece = new mongo.Piece({ caption: {
          artist: cap.caption.artist,
          title: cap.caption.title,
          year: cap.caption.year
        },
        filename: cap.filename,
        image: data
      });

      piece.save(function (err) {
        if (err) return reject(err);
        resolve();
      })
    });
  });
};

var pagePromise = function (page) {
  return new Promise(function (resolve, reject) {

    var pageStr = 'page' + page + '.txt'; // pagename i.e. 'page1.txt'
    var pageFolder = 'page' + page; // page folder i.e. dir 'page1'

    fs.readFile('../captionsCache/' + pageStr, (err, data) => {
      if (err) throw err;
      console.log('Got data from ' + pageStr);
      var captions = JSON.parse(data);
      debugger;
      // Establish promises for each individual image
      var captionPromises = captions.map(function (caption) {
        return imageReadPromise(pageFolder, caption);
      });

      Promise.all(captionPromises).then(function (results) {
        resolve(page);
      }, function (error) {
        reject(error);
      });
    });
  });
};

// Loop through all page files to store into database
var storePages = function (page) {
  console.log('Starting page ' + page);
  var singlePage = pagePromise(page); // Promise on single page
  singlePage.then(function (result) {
    console.log(result);
    if (result < 38) {
      storePages(++result);
    }
  });
};

// EXECUTE HERE
storePages(1);
console.log('DONE POPULATING');
