var bcrypt = require("bcrypt");

module.exports = function(passport, user) {
  var User = user;
  var LocalStrategy = require('passport-local').Strategy

  passport.use("local-signup", new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true 
    },

    function(req, email, password, done) {
      var generateHash = function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
      };

      User.findOne({
        where: {
          email: email
        }
      }).then(function(user) {
        if (user) {
          return done(null, false, {
            message: "That email is already taken"
          });
        } else {
          var userPassword = generateHash(password);

          var data = {
            email: email,
            password: userPassword,
            firstname: req.body.firstName,
            lastname: req.body.lastName
          };

          User.create(data).then(function(newUser, created) {
            if (!newUser) {
              return done(null, false);
            }

            if (newUser) {
              return done(null, newUser);
            }
          });
        }
      });
    }));

  //LOCAL SIGNIN
  passport.use("local-signin", new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true 
      },
      function(req, email, password, done) {
        var User = user
        var isValidPassword = function(userpass, password) {
          return bcrypt.compareSync(password, userpass);
        };
        User.findOne({
          where: {
            email: email
          }
        })
          .then(function(user) {
            if (!user) {
              return done(null, false, {
                message: "Email does not exist"
                
              });
            }
            
            if (!isValidPassword(user.password, password)) {
              return done(null, false, {
                message: "Incorrect password."
            
              });
            }
            
            var userinfo = user.get();
            return done(null, userinfo);
          })
          .catch(function(err) {
            console.log("Error:", err);
            return done(null, false, {
              message: "Something went wrong with your Signin"
            });
          });
      }
    )
  );

  //serialize
  passport.serializeUser(function(user, done){
    done(null, user.id);
  })


  //deserialize
   passport.deserializeUser(function(id, done) {
    User.findByPk(id, function(err, user) {
      if(err) throw err
      done(err, user);
    });
  });

};
