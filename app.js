/*const logger = require('./logger');

logger.log("HELLO WORLD!!");*/


//Event Module BEGIN
/* const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('loggedMessage', function(){
	console.log('Listener Called');
});

 emitter.emit('loggedMessage'); */
 //Event Module END
 
 //Http Module BEGIN
 /*const http = require('http');
 const server = http.createServer();
 
 server.on('Connection',(Socket)=>{
	 console.log("New Connection...");
 });
 
 server.listen(3000);
 
 console.log("Listening to port 3000...");*/
 //Http Module END
 
 
 /* var http = require("http");
http.createServer(function (request, response) {
// Send the HTTP header
// HTTP Status: 200 : OK
// Content Type: text/plain
response.writeHead(200, {'Content-Type': 'text/plain'});
// Send the response body as "Hello World"
response.end('Hello World\n');
}).listen(8081);
// Console will print the message
console.log('Server running at http://127.0.0.1:8081/'); */

const express = require('express');
const app = express();

app.use(express.json());

const courses = [
	{ id:1, name: 'course1'},
	{ id:2, name: 'course2'},
	{ id:3, name: 'course3'}
];

app.get('/',(req, res)=>{
	res.send("HELLO WORLD!");
});

/*app.get('/api/courses',(req, res)=>{
	res.send([1,2,3]);
});

app.post('/api/courses',(req, res)=>{
	res.send([1,2,3]);
});*/

app.post('/api/courses',(req, res)=>{
	const course = {
		id: courses.length+1,
		name: req.body.name
	};
	
	courses.push(course);
	res.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port,  () => console.log(`Listening to port ${port}...`));