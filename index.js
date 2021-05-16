const config = require('config');
const mongoose = require('mongoose');
const users = require('./routes/users');
const expense = require('./routes/expense');
const auth = require('./routes/auth');
const autoIncrement = require('mongoose-auto-increment');
const express = require('express');

var cors = require('cors')


const app = express();
app.use(cors());

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: false
 }));
 
 app.use(bodyParser.json());
// if(!config.get('jwtPrivateKey')){
//     console.log("FATL ERROR: jwtPrivateKey is not defined.");
//     process.exit(1);
// }

mongoose.connect('mongodb://localhost/db_shop', { useNewUrlParser: true })
 .then(() => console.log('Connected to MongoDB'))
 .catch(err =>  console.error('Could Not Connect to MongoDB...',err));
 mongoose.set('useCreateIndex', true);

autoIncrement.initialize(mongoose.connection);

//  exports.autoIncrement = autoIncrement;

app.use(express.json());
app.use('/auth', auth);
app.use('/expense', expense);

const port = process.env.PORT || 3000;
app.listen(port,  () => console.log(`Listening to port ${port}...`));