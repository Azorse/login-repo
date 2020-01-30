var exports = (module.exports = {});

exports.register = function(req, res) {
  res.render("register");
};

exports.login = function(req, res) {
  res.render("login");
};

exports.index = function(req, res) {
  res.render("index");
};

exports.home = function(req, res) {
  res.render("index", { name: req.user.firstName });
};

exports.lists = function(req, res) {
  res.render("lists", { name: req.user.firstName });
};

exports.logout = function(req, res) {
  req.session.destroy(function(err) {
    res.redirect("/");
  });
};



