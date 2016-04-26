var getImage = require('./getImage.js');

/* Returns a promise that resolves when the promises for all of the images
on a single page resolve.
*/
var fillCache = function (lower, upper, page) {
  return new Promise(function (resolve, reject) {

    var images = [];
    for (var i = lower; i <= upper; i++) { images.push(i); }

    // Establish promises for each individual image
    var imagePromises = images.map(function (val) {
      return getImage(String(val), page, val);
    });

    // Condition the fill cache promise on fulfill of individual images
    Promise.all(imagePromises).then(function (results) {
      resolve(results);
    }, function (error) {
      reject(error);
    });
  });
};

module.exports = fillCache;
