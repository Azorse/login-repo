var authController = require('../controllers/authcontroller.js');

module.exports = function(app, passport) {

  app.get("/", authController.index)

  app.get("/home", checkAuthenticated, authController.home)
  
  app.get("/login", authController.login);
  
  app.get("/register", authController.register)

  app.post('/register', passport.authenticate('local-signup', {
    successRedirect: '/login',
    failureRedirect: '/register',
    faliureFlash: true
  }));

  app.post("/login", passport.authenticate('local-signin', {
    successRedirect: '/home',
    failureRedirect: '/login',
    faliureFlash: true
  }));

  app.get("/lists", checkAuthenticated, authController.lists)

  app.get("/logout", authController.logout)

  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  }

  app.get("*", function(req, res) {
    res.render("404");
  });
};

