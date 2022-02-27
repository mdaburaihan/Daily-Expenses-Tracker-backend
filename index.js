const dotenv = require('dotenv')
dotenv.config()
const session = require('express-session');
const mongoose = require('mongoose');
const expense = require('./routes/expense');
const auth = require('./routes/auth');
const autoIncrement = require('mongoose-auto-increment');
const express = require('express');
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

app.use('/auth', auth);
app.use('/expense', expense);

const port = process.env.PORT || 3000;
app.listen(port,  () => console.log(`Listening to port ${port}...`));