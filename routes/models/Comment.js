const mongoose = require("mongoose");
/*export type IComment = {
  id: number;
  title: string;
  content: string;
  username: string;
  upvote: number;
};*/

const commentSchema = new mongoose.Schema({
  id: Number,
  title: String,
  content: String,
  username: String,
  upvote: Number,
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
