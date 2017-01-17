var express = require('express');
var mysql = require('mysql');

var port = 3000;
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'plovdiv81',
  database : 'telbook'
});
db.connect();

var parser = require('body-parser');
var app = express();

// for parsing `application/json` and `application/x-www-form-urlencoded`
app.use(parser.json()); 
app.use(parser.urlencoded({ extended: true })); // for parsing 

// controllers
app.get('/persons', function(request, response) {
	var messages = [];
	db.query('SELECT * FROM PERSONS_TBL', function(error, results) {
		if(error) {
			response.status(500);
			messages.push({ type: 'error', text: 'SQL ERROR: ' + error});
			response.json({ messages: messages });
		}
		else {
			response.json({ persons: results });
		}
		response.end();
	});
});

app.get('/persons/:person_id', function(request, response) {
	var person_id = request.params.person_id;
	var messages = [];
	db.query('SELECT * FROM PERSONS_TBL WHERE ID=?', [person_id], function(error, persons) {
		if(error) {
			response.status(500);
			messages.push({ type: 'error', text: 'SQL ERROR: ' + error});
			response.json({ messages: messages });
		}
		else {
			response.json({ person: persons[0] });
		}
		response.end();
	});
});

app.post(['/persons/:person_id', '/persons'], function(request, response) {
	var person_id = parseInt(request.params.person_id);
	var person = request.body;
	var messages = [];
	
//	console.log(request.body);
	
	if(person.NAME.length < 1) messages.push({type: 'error', text: 'NAME is empty.'});
	if(person.FAM.length < 1) messages.push({type: 'error', text: 'FAM is empty.'});
	if(person.ADDRESS.length < 3) messages.push({type: 'error', text: 'ADDRESS is shorter than 3 characters.'});

	if(messages.length > 0) {
		messages.push({type: 'error', text: 'Person not saved.'});
		//response.status(400);
		response.json({ messages: messages });
		response.end();
	}
	else {
		
		var onUpdatePerson = function(error, results) {
			if(error) {
				messages.push({type: 'error', text: 'SQL ERROR: ' + error});
				messages.push({type: 'error', text: 'Person not saved.'});
				//response.status(500);
				response.json({ messages: messages });
				response.end();
			}
			else {
				messages.push({type: 'info', text: 'Person saved.'});
				if(results.insertId) person_id = results.insertId;
				db.query('SELECT * FROM PERSONS_TBL WHERE ID = ?', [person_id], function(error, results){
					response.json({ person: results[0], messages: messages });
					response.end();
				});
			}
		};
		
		if(person_id > 0) {
			db.query('UPDATE PERSONS_TBL SET NAME=?, FAM=?, ADDRESS=? WHERE ID=?', [person.NAME, person.FAM, person.ADDRESS, person_id], onUpdatePerson);
		}
		else {
			db.query('INSERT INTO PERSONS_TBL SET NAME=?, FAM=?, ADDRESS=?', [person.NAME, person.FAM, person.ADDRESS], onUpdatePerson);
		}
	}
});

app.delete('/persons/:person_id', function(request, response) {
	var person_id = request.params.person_id;
	var messages = [];
	
	db.query(
		"DELETE FROM PERSONS_TBL WHERE ID = ?", 
		[person_id], 
		function(error, result) {
			if(error) {
				messages.push({type: 'error', text: 'SQL ERROR: ' + error});
				messages.push({type: 'error', text: 'Person not deleted.'});
				//response.status(500);
			}
			else {
				messages.push({type: 'info', text: 'Person deleted.'});
			}
			response.json({ messages: messages });
			response.end();
		}
	);
});

app.get('/telephones/person/:person_id', function(request, response) {
	var person_id = request.params.person_id;
	db.query(
		"SELECT * FROM PERSONS_TBL WHERE ID = ?", 
		[person_id], 
		function(error, persons) {
			db.query(
				"SELECT t.ID, t.NOMER, tt.TELTYPE \
				FROM TELS_TBL t \
				JOIN TELTYPES_TBL tt on(tt.ID = t.TID) \
				WHERE t.PID = ? \
				ORDER BY tt.ID",
				[request.params.person_id],
				function(error, telephones) {
					response.json({ 
						person: persons[0], 
						telephones: telephones 
					});
					response.end();
				}
			);
		}
	);
});

app.get('/teltypes', function(request, response) {
	function xxx(rows) {
		x++;
		console.log(x, rows);	
	}
	var x = 0;
	
	db.query("SELECT * FROM PERSONS_TBL ORDER BY FAM", function(error, rows) {
		xxx(rows);
	});
	db.query("SELECT * FROM TELTYPES_TBL", function(error, rows) {
		xxx(rows);
		response.json({ teltypes: rows });
		response.end();
	});
	console.log(x);
});

app.delete('/persons/:person_id', function(request, response) {
	var person_id = parseInt(request.params.person_id);
	var messages = [];
	
	db.query(
		"DELETE FROM PERSONS_TBL WHERE ID = ?", 
		[person_id], 
		function(error, result) {
			if(error) {
				messages.push({type: 'error', text: 'SQL ERROR: ' + error});
				messages.push({type: 'error', text: 'Person not deleted.'});
				//response.status(500);
			}
			else {
				messages.push({type: 'info', text: 'Person deleted.'});
			}
			response.json({ messages: messages });
			response.end();
		}
	);
});

app.delete('/telephones/:telephone_id', function(request, response) {
	var telephone_id = parseInt(request.params.telephone_id);
	var messages = [];
	
	db.query(
		"DELETE FROM TELS_TBL WHERE ID = ?", 
		[telephone_id], 
		function(error, result) {
			if(error) {
				messages.push({type: 'error', text: 'SQL ERROR: ' + error});
				messages.push({type: 'error', text: 'Telephone not deleted.'});
				//response.status(500);
			}
			else {
				messages.push({type: 'info', text: 'Telephone deleted.'});
			}
			response.json({ messages: messages });
			response.end();
		}
	);
});

// set-up static files and index.html
//app.use(express.static('client'));
app.use(express.static('client'));

// Binding express app to port
var server = app.listen(port, function() {
	var port = server.address().port;
	console.log('Telbook app listening at http://localhost:%s', port);
});