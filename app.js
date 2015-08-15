var express = require('express');
var app = express();
var ejs = require('ejs');

app.set('view_engine', 'ejs');


app.get('/', function(req, res){
  res.render('test.html.ejs');
});

app.listen(3000, function(){
  console.log('listening on 3000');
});