var mongoose = require('mongoose');

// Connect to mongo server
mongoose.connect('mongodb://localhost/hathyst', function (err) {
  if (err && err.message.includes('ECONNREFUSED')) {
    console.log('Error connecting to mongodb database: %s.\nIs "mongod" running?', err.message);
    process.exit(0);
  } else if (err) {
    throw err;
  } else {
    console.log('DB successfully connected. Adding seed data...');
  }
});

// Store the persistent connection
var db = mongoose.connection;

// Define Schema for
var pieceSchema = new mongoose.Schema({
  caption: {
    artist: String,
    title: String,
    year: String
  },
  filename: String,
  image: String,
  id: Number
});

var Piece = mongoose.model('Pieces', pieceSchema);

module.exports = {
  Piece: Piece,
  mongoose: mongoose,
  db: db.collection('pieces')
}
