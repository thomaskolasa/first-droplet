//first made json file with empty
var net = require('net');
var fs = require('fs');
var port = 3000;
//var ejs = require('ejs');

var server = net.createServer(function(c) {
  console.log('client connected');

  c.on('data', function(data) {
    console.log(data.toString().trim());
  });
  var id = 0;
  c.on('data', function(data) {
    var inbox = JSON.parse(fs.readFileSync('messages.json','utf8'));
    var message = data.toString().trim();
    if (message === "\/list") {
      console.log(inbox);
      for (var i in inbox) {
        var text = i + '. ' + inbox[i] +'\n';
        c.write(text);
      }
    } else if (message === "\/clear") {
      //var startingLength = Object.keys(inbox).length;
      //for (var j=startingLength-1; j>=0; j--) {
        //(inbox).remove(j);
      //}
      inbox = {};
      fs.writeFile('messages.json', JSON.stringify(inbox));
    } else if (/\/delete/.test(message)) { //delete specific message
      // var messageNumberArray = message.match(/\d+/g);
      // var messageNumber = messageNumberArray.toString();
      // console.log(messageNumber);
      // delete inbox[messageNumber];
      // fs.writeFile('messages.json', JSON.stringify(inbox));
      // //id=length of it???
    } else { //add messages
      id++;
      inbox[id] = message;
      fs.writeFile('messages.json', JSON.stringify(inbox));
    }
      
    
  });
  c.on('end', function() {
    console.log('client disconnected');
  });
});

server.listen(port, function() {
  console.log('listening on '+port);
});