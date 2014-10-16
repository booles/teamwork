
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.login = function(req, res){
  res.render("login")
};

exports.chartRoom = function(req, res){
  res.render("chart-room")
};

exports.mysql = function(req, res){
  res.render("mysql")
};

exports.mongodb = function(req, res){
  res.render("mongodb")
};

exports.mongo_test = function(req, res){

  	res.render("mongo_test/mongo_test");
};