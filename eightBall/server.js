var net = require('net');

var port = 3000;

var predictions = {
  1:"GA will pivot to become an arms company",
  2:"Trump only ran so that Hillary would let him buy the Empire State Building and put his bust on top when she becomes president",
  3:"pigs will fly",
};

var server = net.createServer(function(c){
  console.log('client connected');
  

  c.on('data', function(data){
    var command = data.toString().trim();
    var randomNumber = 1 + Math.floor(Math.random()*Object.keys(predictions).length);
    c.write(predictions[randomNumber]);
    
  });

  c.on('end', function(){
    console.log("client disconnected");
  });
});

server.listen(port, function(){
  console.log("listening on", port);
});