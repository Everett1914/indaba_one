// Database functions most closely related to the user table

var	dbcon = 	require('../config/dbcon.js'),
	sql =   	require('mysql2/promise');

// Query database for user by google id, return matching row
module.exports.findUserByGoogleId = async function(googleId) {
	try {
		const connection = await sql.createConnection(dbcon);
		const [rows, fields] = await connection.query(
		"SELECT * FROM `user` " +
		"WHERE google_id = ?",
		[googleId]);
		connection.end();
		return rows;
	}
	catch (err) {
		console.log(err);
	}
};

// Query database for user by user id, return matching row
module.exports.findUserByUserId = async function(userId) {
	try {
		const connection = await sql.createConnection(dbcon);
		const [rows, fields] = await connection.query(
		"SELECT * FROM `user` " +
		"WHERE user_id = ?",
		[userId]);
		connection.end();
		return rows;
	}
	catch (err) {
		console.log(err);
	}
};

// Create row in user table with the given information
module.exports.createUser = async function(name, email, googleId) {
	try {
		const connection = await sql.createConnection(dbcon);
		await connection.query(
		"INSERT INTO `user` " +
		"(`name`, `email`, `google_id`) " +
		"VALUES (?, ?, ?);",
		[name, email, googleId]);
		connection.end();
	}
	catch (err) {
		console.log(err);
	}
};
