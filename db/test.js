var mongo = require('./mongo.js');

mongo.Piece.findOne({id: 1}, function (err, piece) {
  if (err) console.log('fuck');
  else console.log(piece);
});
