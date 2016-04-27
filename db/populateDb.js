var mongo = require('./mongo.js');
var fs = require('fs');
var btoa = require('btoa')

// Individual image promise. Givem caption and folder location of
var imageReadPromise = function (page, cap) {
  var pageFolder = 'page' + page; // page folder i.e. dir 'page1'

  return new Promise(function (resolve, reject) {
    fs.readFile('../imageCache/' + pageFolder + '/' + cap.filename, (err, data) => {
      if (err) reject(err);
      // Create the mongo document for the image
      var piece = new mongo.Piece({ caption: {
          artist: cap.caption.artist,
          title: cap.caption.title,
          year: cap.caption.year
        },
        filename: cap.filename,
        image: btoa(data),
        id: (((page - 1) * 48) + Number(cap.filename.split('.')[0]))
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
        return imageReadPromise(page, caption);
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
var storePages = function (page, end) {
  console.log('Starting page ' + page);
  var singlePage = pagePromise(page); // Promise on single page
  singlePage.then(function (result) {
    console.log(result);
    if (result < 38) {
      storePages(++result);
    }
    end();
  });
};

// EXECUTE HERE
storePages(1, function () {
  console.log('DONE POPULATING');
});

