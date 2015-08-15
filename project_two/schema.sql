DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS topics;
DROP TABLE IF EXISTS comments;
PRAGMA foreign_keys = ON;
CREATE TABLE users (
  id INTEGER PRIMARY KEY autoincrement,
  username VARCHAR,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE topics (
  id INTEGER PRIMARY KEY autoincrement,
  topic_text TEXT,
  creator_id INTEGER,
  natty_votes INTEGER,
  broseph_votes INTEGER,
  trump_votes INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(creator_id) REFERENCES users(id)
);
CREATE TABLE comments (
  id INTEGER PRIMARY KEY autoincrement,
  comment TEXT,
  topic_id INTEGER,
  ccreator_id INTEGER,
  cnatty_votes INTEGER,
  cbroseph_votes INTEGER,
  ctrump_votes INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(topic_id) REFERENCES topics(id),
  FOREIGN KEY(ccreator_id) REFERENCES users(id)
);