INSERT INTO users (id,username) VALUES (1,"bob");
INSERT INTO users (id,username) VALUES (2,"ann");

INSERT INTO topics (id,topic_text,creator_id,natty_votes,broseph_votes,trump_votes) VALUES (1,"life",1,0,0,0);
INSERT INTO topics (id,topic_text,creator_id,natty_votes,broseph_votes,trump_votes) VALUES (2,"GA",2,0,0,0);

INSERT INTO comments (id,comment,topic_id,ccreator_id,cnatty_votes,cbroseph_votes,ctrump_votes) VALUES (1,"first comment",1,1,0,0,0);
INSERT INTO comments (id,comment,topic_id,ccreator_id,cnatty_votes,cbroseph_votes,ctrump_votes) VALUES (2,"epic comment",1,2,0,0,0);