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
app.use(parser.urlencoded({ extended: true }));

// controllers
app.get('/persons', function(request, response) {
	var messages = [];
	db.query('SELECT * FROM PERSONS_TBL ORDER BY NAME', function(error, results) {
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
		response.status(400);
		response.json({ messages: messages });
		response.end();
	}
	else {
		var onUpdatePerson = function(error, results) {
			if(error) {
				messages.push({type: 'error', text: 'SQL ERROR: ' + error});
				messages.push({type: 'error', text: 'Person not saved.'});
				response.status(500);
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

app.get('/persons/:person_id/telephones', function(request, response) {
	var person_id = request.params.person_id;
	db.query(
		"SELECT * FROM TELS_TBL WHERE PID = ? ORDER BY ID",
		[person_id],
		function(error, telephones) {
			response.json({ 
				telephones: telephones 
			});
			response.end();
		}
	);
});

app.get('/teltypes', function(request, response) {
	db.query("SELECT * FROM TELTYPES_TBL", function(error, rows) {
		response.json({ teltypes: rows });
		response.end();
	});
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

app.get('/telephones/:telephone_id', function(request, response) {
	var telephone_id = parseInt(request.params.telephone_id);
	var messages = [];
	db.query('SELECT * FROM TELS_TBL WHERE ID=?', [telephone_id], function(error, telephones) {
		if(error) {
			response.status(500);
			messages.push({ type: 'error', text: 'SQL ERROR: ' + error});
			response.json({ messages: messages });
		}
		else {
			response.json({ telephone: telephones[0] });
		}
		response.end();
	});
});

app.post(['/telephones/:telephone_id', '/telephones'], function(request, response) {
	var telephone_id = parseInt(request.params.telephone_id);
	var telephone = request.body;
	var messages = [];
	
	if(telephone.NOMER.length < 1) messages.push({type: 'error', text: 'NOMER is empty.'});
	if(parseInt(telephone.TID.length) < 1) messages.push({type: 'error', text: 'TELTYPE is empty.'});

	if(messages.length > 0) {
		messages.push({type: 'error', text: 'Telephone not saved.'});
		response.status(400);
		response.json({ messages: messages });
		response.end();
	}
	else {
		
		var onUpdateTelephone = function(error, results) {
			if(error) {
				messages.push({type: 'error', text: 'SQL ERROR: ' + error});
				messages.push({type: 'error', text: 'Telephone not saved.'});
				response.status(500);
				response.json({ messages: messages });
				response.end();
			}
			else {
				messages.push({type: 'info', text: 'Telephone saved.'});
				if(results.insertId) telephone_id = results.insertId;
				db.query('SELECT * FROM TELS_TBL WHERE ID = ?', [telephone_id], function(error, results){
					response.json({ telephone: results[0], messages: messages });
					response.end();
				});
			}
		};
		
		if(telephone_id > 0) {
			db.query('UPDATE TELS_TBL SET NOMER=?, TID=? WHERE ID=?', [telephone.NOMER, telephone.TID, telephone_id], onUpdateTelephone);
		}
		else {
			db.query('INSERT INTO TELS_TBL SET NOMER=?, TID=?, PID=?', [telephone.NOMER, telephone.TID, telephone.PID], onUpdateTelephone);
		}
	}
});


// set-up static files and index.html
app.use(express.static('client'));

// Binding express app to port
var server = app.listen(port, function() {
	var port = server.address().port;
	console.log('Telbook app listening at http://localhost:%s', port);
});
