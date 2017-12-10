/*
 * GET home page.
 */

var utils = require("connect").utils;

//  Main Page
exports.index = function(req, res, next) {
  //~ var params = { title : 'OSSII Chat' };
  //~
  //~ //  use request.session.isLogin to check login
  //~ if( req.session.isLogin && req.session.isLogin!==''){
  //~ params.isLogin = true;
  //~ params.user = req.session.user;
  //~ }else{
  //~ params.isLogin = false;
  //~ }
  res.render("index");
};

exports.room = function(req, res, next) {
  res.render("room");
  //~ res.sendfile(__dirname + '../public/room.html');
};

exports.room2 = function(req, res, next) {
  if (!req.params.hasOwnProperty("room")) {
    res.redirect("/");
  }

  Todo.find({ room_id: req.params.room })
    .sort("updated_at", -1)
    .run(function(err, todos) {
      if (err) return next(err);

      res.render("room", {
        title: "Comet Todo list",
        id: req.params.room,
        todos: todos
      });
    });
};

exports.create = function(req, res, next) {
  //res.clearCookie('room_id');
  console.log(1);
  var uid = utils.uid(10);
  console.log("uid = " + uid);
  console.log(2);
  new Hashlist({
    hash_id: uid,
    enable: true,
    updated_at: Date.now()
  }).save(function(err, list, count) {
    console.log(3);
    if (err) res.redirect("/");
    console.log(4);
    res.redirect("/room/" + uid);
  });
};

exports.current_room = function(req, res, next) {
  if (!req.params.hasOwnProperty("room")) {
    res.render("404", { title: "Error 404" });
    return;
  }
  var uid = req.params.room;
  Hashlist.find({
    hash_id: uid
  }).run(function(err, list) {
    if (err) {
      res.render("404", { title: "Error 404" });
      return;
    }

    //res.cookie( 'room_id', uid, {path: '/'});
    next();
  });
};

//  User Logout & clear session.
exports.logout = function(req, res, next) {
  req.session.destroy();
  res.redirect("/");
};
