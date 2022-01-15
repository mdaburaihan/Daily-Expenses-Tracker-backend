//const config = require('config');
const dotenv = require('dotenv')
dotenv.config()
const session = require('express-session');
const mongoose = require('mongoose');
//const users = require('./routes/users');
const expense = require('./routes/expense');
const auth = require('./routes/auth');
const autoIncrement = require('mongoose-auto-increment');
const express = require('express');
//const passport = require('passport');
//const GoogleStrategy = require('passport-google-oauth2').Strategy;
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(session({ 
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(cors());

const passport = require('passport');

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});
// app.use(passport.initialize());
// app.use(passport.session());

app.use(bodyParser.urlencoded({
    extended: false
 }));
 
 app.use(bodyParser.json());
// if(!config.get('jwtPrivateKey')){
//     console.log("FATL ERROR: jwtPrivateKey is not defined.");
//     process.exit(1);
// }

mongoose.connect(`${process.env.DATABASE_URL}${process.env.DATABASE_NAME}`, { useNewUrlParser: true })
 .then(() => console.log('Connected to MongoDB'))
 .catch(err =>  console.error('Could Not Connect to MongoDB...',err));
 mongoose.set('useCreateIndex', true);

autoIncrement.initialize(mongoose.connection);

//exports.autoIncrement = autoIncrement;

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

    next();
})


// passport.serializeUser(function (user, cb) {
//     cb(null, user);
// });

// passport.deserializeUser(function (obj, cb) {
//     cb(null, obj);
// });

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET_KEY,
//     callbackURL: `${process.env.LOCAL_HOST_URL}auth/google/callback`
// },
// function (req, accessToken, refreshToken, profile, done) {
//     // if user already exist in your dataabse login otherwise
//     console.log("===profile===", profile)
//     // save data and signup
//     return done(null, profile);
// }
// ));

//app.get('/auth/google', passport.authenticate('google', {scope: ['openid','profile', 'email']}));

// app.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/auth/fail'}),
//     (req, res, next) => {
//         console.log(req.user, req.isAuthenticated());
//         res.send('user is logged in');
//     })

// app.get('/auth/fail', (req, res, next) => {
//     res.send('user logged in failed');
// });

app.use('/auth', auth);
app.use('/expense', expense);



const port = process.env.PORT || 3000;
app.listen(port,  () => console.log(`Listening to port ${port}...`));