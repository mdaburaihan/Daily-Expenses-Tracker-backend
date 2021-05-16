const express = require('express');
const auth = require('./middleware/auth')
const app = express();


app.use(express.json());

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/db_employee', { useNewUrlParser: true })
 .then(() => console.log('Connected to MongoDB'))
 .catch(err =>  console.error('Could Not Connect to MongoDB...',err));
 mongoose.set('useCreateIndex', true);



const port = process.env.PORT || 3000;
app.listen(port,  () => console.log(`Listening to port ${port}...`));