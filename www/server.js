var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
 
var app = express();
app.use(bodyParser.json());
 
app.all('/*', function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
 
app.use('/', require('./routes'));
 
/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});*/
 
// Start the server
app.set('port', process.env.PORT || 3000);
//app.set('port', 8100);
 
var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});