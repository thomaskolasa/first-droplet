##Planning

USER STORIES:
A user will be able to add topics that all users will be able to post comments on.
The user will also be able to look at topics listed by categories and organized by comments and different voting systems.
The user will be able to delete her own comments.
The administrator will be able to delete and edit all topics, delete comments, and edit the vote counts.

ROUTES: (INCLUDE URL ROUTE)
on index page:
  -get top voted topics and their votecounts (/broletariat/)
  -put to update addition to votes(/broletariat)
on new topic page
  -post to add new topic or comment(/broletariat/new)(new.ejs)
  -delete topic (only if admin)(/broletariat/topic/delete) (delete_topic.ejs)
on topic page:
  -get top voted comments and their votecounts (/broletariat/topics/:id)
  -put to update addition to votes(/broletariat/topics/:id/vote) (topic.ejs)
  -put to add new comment (/broletariat/topics/:id/)
  -delete topic or comment (only if admin)

(charts in img folder
![ERD](folder/erd_image.jpg))

PSEUDOCODE:
-use node modules express, sqlite3, ejs, body-parser, method-override
-create db
-give db schema for user table, topic table, and comment table
-seed db
-first get list of topics and ORDER BY votes DESC
-make index.html.ejs
-allow creating, editing, destroying topics
-for a topic, get list of comments and ORDER BY votes DESC
-make topic.html.ejs
-allow creating, editing, destroying comments
-css