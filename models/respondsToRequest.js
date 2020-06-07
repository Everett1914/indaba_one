// Database functions most closely related to the Responds_To_Request table

var	dbcon = 	require('../config/dbcon.js'),
	sql =   	require('mysql2/promise');

// Create row with the given information
module.exports.createResponse = async function(user_id, eventId, response) {
	try {
		const connection = await sql.createConnection(dbcon);
		await connection.query(
		"INSERT INTO `responds_to_request`" +
		"(`fk_user_id`,`fk_event_id`, `attending`) VALUES (?,?,?)",
		  [user_id, eventId, response]);
		connection.end();
	}
	catch (err) {
		console.log(err);
	}
};

// Update attending to the specified value for a given user_id and eventId
module.exports.updateResponse = async function(user_id, eventId, response) {
	try {
		const connection = await sql.createConnection(dbcon);
		await connection.query(
		"UPDATE `responds_to_request` " +
		"SET `attending` = ? " +
		"WHERE `fk_user_id`= ? AND `fk_event_id`= ?",
		[response, user_id, eventId]);
		connection.end();
	}
	catch (err) {
		console.log(err);
	}
};

// Get the value of attending from a row with the given user_id and eventId
// Returns the entire rows array (even if empty), not just the response
module.exports.getResponse = async function(user_id, eventId) {
	try {
const connection = await sql.createConnection(dbcon);
		const [rows, fields] = await connection.query(
		"SELECT `attending` " +
		"FROM `responds_to_request` " +
		"WHERE `fk_user_id` = ? AND `fk_event_id` = ?",
		  [user_id, eventId]);
		connection.end();
		return rows;
	}
	catch (err) {
		console.log(err);
	}
};

// Delete a row with the given eventId
module.exports.deleteResponsesForEvent = async function(eventId) {
	try {
		const connection = await sql.createConnection(dbcon);
		const [rows, fields] = await connection.query(
		"DELETE FROM `responds_to_request` " +
		"WHERE `fk_event_id` = ?",
		[eventId]);
		connection.end();
		return rows;
	}
	catch (err) {
		console.log(err);
	}
};
