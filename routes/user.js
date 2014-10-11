
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