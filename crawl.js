/**
Core file to rip images and captions from MOMA site using async promises.
*/

var fillCache = require('./fillCache.js');
var fs = require('fs');

/* Promise on a single page of 48 images. Resolves when promises associated
with each image on the page have all resolved sucessfully. Writes the captions
for each image on the page to labeled text file 'page#.txt'
*/
var pagePromise = function (page) {
  return new Promise(function (resolve, reject) {
    var rip = fillCache(0, 47, String(page));

    rip.then(function (results) {
      fs.writeFile('page' + String(page) + '.txt', JSON.stringify(results), 'utf8', (err) => {
        if (err) throw err;
        console.log('Page ' + String(page) + ' saved!');
      });
      resolve(page);
    }).catch(function (err) {
      // Individual image promise failed to resolve. Crash page.
      console.log('Shoot hit an error');
      reject();
    });

  });
};

/*
Blocking loop to grab one page at a time. Prevents stack overflow.
*/
var getPage = function (page) {
  var allPages = pagePromise(page);
  allPages.then(function (result) {
    console.log(result);
    if (result < 50) { // Grabs up  to 50 pages
      getPage(++result);
    }
  });
};

getPage(1); // Start the chain by grabbing the first page.
console.log('Grabbed all images');


