var port = 3000;
var express = require('express');
var app = express();
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('broletariat.db');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var urlencodedBodyParser = bodyParser.urlencoded({extended: false});
var methodOverride = require('method-override');

app.set('view_engine', 'ejs');
app.use(urlencodedBodyParser);
app.use(methodOverride('_method'));
app.use('/static', express.static('public'));

app.get('/', function(req, res){
  res.redirect('/broletariat');
});

//read index page
app.get('/broletariat', function(req, res){
  db.all("SELECT topics.id,topic_text,creator_id,natty_votes,broseph_votes,trump_votes,username FROM topics INNER JOIN users ON topics.creator_id = users.id ORDER BY natty_votes DESC", function(err, table){
    if (err) throw err;
    else{
      var topics = table;
      db.all('SELECT comments.id,comments.topic_id FROM topics LEFT JOIN comments ON topic_id = topics.id', function(err, table){
        var comments = table;
        res.render('index.html.ejs', {topics: topics, comments: comments});
      });
    }
  });
});

//read new user page
app.get('/broletariat/users/new', function(req, res){
  res.render('new_account.html.ejs');
});

//create new user
app.post('/broletariat/users/new', function(req, res){
  db.run('INSERT INTO users (username) VALUES (?)', req.body.username, function(err){
    if (err) throw err;
    else{
      //console.log(this);
      res.redirect('/broletariat');
    }
  })
});

//read topic page
app.get('/broletariat/topic/:id', function(req, res){
  db.all('SELECT username,topics.id,topic_text,natty_votes,broseph_votes,trump_votes FROM topics INNER JOIN users ON creator_id = users.id WHERE topics.id = (?)', req.params.id, function(err, table){
    if (err) throw err;
    else{
      var topics = table;
      db.all('SELECT username,users.id,comments.id AS comment_id,comment,topic_id,cnatty_votes,cbroseph_votes,ctrump_votes FROM comments LEFT JOIN users ON ccreator_id = users.id WHERE comments.topic_id = (?) ORDER BY cnatty_votes DESC',req.params.id, function(err, table){
        var comments = table;
        res.render('topic.html.ejs', {topic: topics, comments: comments});
      });
    }
  });
});

//read new topic form page
app.get('/broletariat/topics/new', function(req, res){
  res.render('new_topic.html.ejs');
});

//create new topic
app.post('/broletariat/topics/new_post', function(req, res){
  db.all('SELECT id FROM users WHERE users.username = (?)', req.body.username, function(err,table){
    if (err) throw err;
    else if (table[0]){
    // only works if name is defined
      console.log('table defined')
      var creator_id = table[0].id;
      db.run('INSERT INTO topics (topic_text,creator_id,natty_votes,broseph_votes,trump_votes) VALUES (?,?,?,?,?)',req.body.topic_text,parseInt(creator_id),0,0,0,function(err){
        if(err) {
          console.log('got an error')
          res.redirect('/broletariat/error');
        }
        else{
          //read last created topic & redirect to its brand new page
          db.all('SELECT topics.id,topic_text,username,natty_votes,broseph_votes,trump_votes FROM topics INNER JOIN users ON creator_id = users.id WHERE topics.id = (SELECT max(id) from topics)', function(err,table){
            res.redirect('/broletariat/topic/'+table[0].id);
          });
        }
      });// insert new topic
    }
  });// select username's users.id
});

// create new comment
app.post('/broletariat/topic/:id/new_comment', function(req, res){
  db.all('SELECT id FROM users WHERE users.username = (?)',req.body.username, function(err,table){
    if (err) throw err;
    else{
      var user_id = table[0].id;
      db.run('INSERT INTO comments (comment,topic_id,ccreator_id,cnatty_votes,cbroseph_votes,ctrump_votes) VALUES (?,?,?,?,?,?)',req.body.newComment,req.params.id,user_id,0,0,0,function(err){
        if (err) throw err;
        else{
          res.redirect('/broletariat/topic/'+req.params.id);
        }
      });
    }
  });
});

// UPDATE VOTES 
// update natty (since I can't easily "SELECT (?) FROM topics" where ? is req.params.vote_type, I separated the code for each vote 
// update natty 
app.put('/broletariat/topic/:id/natty_vote/:index/:comment_id', function(req, res){
  // natty votes for topics
  if (req.params.comment_id == 0){ 
    db.all('SELECT natty_votes FROM topics WHERE topics.id = (?)', req.params.id, function(err, table){
      if (err) throw err;
      else{
        var current_natty_votes = table[0].natty_votes;
        db.run('UPDATE topics SET natty_votes = (?) WHERE topics.id = (?)', current_natty_votes+1, req.params.id, function(err){
          if (err) throw err;
          else{
            if (req.params.index == 1){res.redirect('/broletariat')}
            else {res.redirect('/broletariat/topic/'+req.params.id)}
          }
        });
      }
    });
    // natty votes for comments
  } else {
    db.all('SELECT cnatty_votes FROM comments WHERE comments.id = (?)', req.params.comment_id, function(err, table){
      if (err) throw err;
      else{
        var curent_cnatty_votes = table[0].cnatty_votes;
        db.run('UPDATE comments SET cnatty_votes = (?) WHERE comments.id = (?)',curent_cnatty_votes+1, req.params.comment_id, function(err){
          if (err) throw err;
          else res.redirect('/broletariat/topic/'+req.params.id);
        })
      }
    })
  }
});

// update broseph_vote
app.put('/broletariat/topic/:id/broseph_vote/:index/:comment_id', function(req, res){
  if (req.params.comment_id == 0){
    db.all('SELECT broseph_votes FROM topics WHERE topics.id = (?)', req.params.id, function(err, table){
      if (err) throw err;
      else{
        var current_broseph_votes = table[0].broseph_votes;
        db.run('UPDATE topics SET broseph_votes = (?) WHERE topics.id = (?)', current_broseph_votes+1, req.params.id, function(err){
          if (err) throw err;
          else{
            if (req.params.index == 1){res.redirect('/broletariat')}
            else {res.redirect('/broletariat/topic/'+req.params.id)}
          }
        });
      }
    });
  } else {
    db.all('SELECT cbroseph_votes FROM comments WHERE comments.id = (?)', req.params.comment_id, function(err, table){
      if (err) throw err;
      else{
        var curent_cbroseph_votes = table[0].cbroseph_votes;
        db.run('UPDATE comments SET cbroseph_votes = (?) WHERE comments.id = (?)',curent_cbroseph_votes+1, req.params.comment_id, function(err){
          if (err) throw err;
          else res.redirect('/broletariat/topic/'+req.params.id);
        })
      }
    })
  }
});

//update trump_vote
app.put('/broletariat/topic/:id/trump_vote/:index/:comment_id', function(req, res){
  if (req.params.comment_id == 0){
    db.all('SELECT trump_votes FROM topics WHERE topics.id = (?)', req.params.id, function(err, table){
      if (err) throw err;
      else{
        var current_trump_votes = table[0].trump_votes;
        db.run('UPDATE topics SET trump_votes = (?) WHERE topics.id = (?)', current_trump_votes+1, req.params.id, function(err){
          if (err) throw err;
          else{
            if (req.params.index == 1){res.redirect('/broletariat')}
            else {res.redirect('/broletariat/topic/'+req.params.id)}
          }
        });
      }
    });
  } else {
    db.all('SELECT ctrump_votes FROM comments WHERE comments.id = (?)', req.params.comment_id, function(err, table){
      if (err) throw err;
      else{
        var curent_ctrump_votes = table[0].ctrump_votes;
        db.run('UPDATE comments SET ctrump_votes = (?) WHERE comments.id = (?)',curent_ctrump_votes+1, req.params.comment_id, function(err){
          if (err) throw err;
          else res.redirect('/broletariat/topic/'+req.params.id);
        });
      }
    });
  }
});

app.listen(port, function(){
  console.log('listening on port ' + port);
});