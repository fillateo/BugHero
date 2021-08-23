const GoogleStrategy = require('passport-google-oauth20').Strategy
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

// const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
      },
      (email, password, done) => {
        User.findOne({
          email: email.toLowerCase(),
        }).then((user) => {
          if (!user) {
            return done(null, false, {
              message: `No user found with email ${email}`,
            })
          }
          if (!user.password) {
            return done(null, false, {
              message: 'User is not connected via Email',
            })
          }
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              throw err
            }

            if (isMatch) {
              return done(null, user)
            }
            return done(null, false, { message: 'Incorrect password' })
          })
        })
      }
    )
  )

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          process.env.NODE_ENV == 'development'
            ? '/auth/google/callback'
            : `${process.env.ABSOLUTE_URL}/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
          email: profile.emails[0].value,
        }

        try {
          let user = await User.findOne({ googleId: profile.id })

          if (user) {
            done(null, user)
          } else {
            user = await User.create(newUser)
            done(null, user)
          }
        } catch (err) {
          console.error(err)
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })
}
