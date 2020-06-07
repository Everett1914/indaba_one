// Database functions most closely related to the Slot table

var	dbcon = 	require('../config/dbcon.js'),
	sql =   	require('mysql2/promise');

// Query database for all slots which a user has reserved with a
// date of yesterday or earlier
module.exports.findPastUserSlots = async function(user_id) {
	try {
		const connection = await sql.createConnection(dbcon);
		const [rows, fields] = await connection.query(
			"SELECT s.slot_id, s.slot_date," +
			"s.start_time, s.end_time, s.duration, s.slot_location, " +
			"e.event_name, e.description, e.event_id, e.visibility, " +
			"u.name AS creator_name " +
			"FROM `slot` s " +
			"INNER JOIN `reserve_slot` rs ON s.slot_id = rs.fk_slot_id " +
			"INNER JOIN `event` e ON s.fk_event_id = e.event_id " +
			"INNER JOIN `creates_event` ce ON s.fk_event_id = ce.fk_event_id " +
			"INNER JOIN `user` u ON ce.fk_user_id = u.user_id " +
			"WHERE rs.fk_user_id = ? AND s.slot_date < CURDATE() - INTERVAL 1 DAY " +
			"ORDER BY s.slot_date",
			[user_id]);
		connection.end();
		return rows;
	}
	catch (err) {
		console.log(err);
	}
};

// Query database for all slots which a user has reserved with a
// date of yesterday or later
module.exports.findUpcomingUserSlots = async function(user_id) {
	try {
		const connection = await sql.createConnection(dbcon);
		const [rows, fields] = await connection.query(
			"SELECT s.slot_id, s.slot_date," +
			"s.start_time, s.end_time, s.duration, s.slot_location, " +
			"e.event_name, e.description, e.event_id, e.visibility, " +
			"u.name AS creator_name " +
			"FROM `slot` s " +
			"INNER JOIN `reserve_slot` rs ON s.slot_id = rs.fk_slot_id " +
			"INNER JOIN `event` e ON s.fk_event_id = e.event_id " +
			"INNER JOIN `creates_event` ce ON s.fk_event_id = ce.fk_event_id " +
			"INNER JOIN `user` u ON ce.fk_user_id = u.user_id " +
			"WHERE rs.fk_user_id = ? AND s.slot_date >= CURDATE() - INTERVAL 1 DAY " +
			"ORDER BY s.slot_date",
			[user_id]);
		connection.end();
		return rows;
	}
	catch (err) {
		console.log(err);
	}
};

// Query database for slot by its ID and return all columns for that row
module.exports.findSlot = async function(slotId) {
	try {
		const connection = await sql.createConnection(dbcon);
		const [rows, fields] = await connection.query(
		"SELECT * FROM `slot` " +
		"WHERE slot_id = ?",
		[slotId]);
		connection.end();
		return rows[0];
	}
	catch (err) {
		console.log(err);
	}
};

// Query database for all of the individuals who signed up for a slot
module.exports.findSlotAttendees = async function(slotId) {
	try {
		const connection = await sql.createConnection(dbcon);
		const [rows, fields] = await connection.query(
		"SELECT u.name, u.email, u.user_id " +
		"FROM `reserve_slot` rs " +
		"INNER JOIN `slot` s ON rs.fk_slot_id = s.slot_id " +
		"INNER JOIN `user` u ON rs.fk_user_id = u.user_id " +
		"WHERE slot_id = ?", [slotId]);
		connection.end();
		return rows;
	}
	catch (err) {
		console.log(err);
	}
};

// Find all slots for a given event
module.exports.findEventSlots = async function(eventId) {
	try {
		const connection = await sql.createConnection(dbcon);
		const [rows, fields] = await connection.query(
		"SELECT s.slot_id, s.slot_date, s.start_time, s.end_time, " +
		"s.duration, s.slot_location, s.max_attendees " +
		"FROM `slot` s " +
		"INNER JOIN `event` e ON s.fk_event_id = e.event_id " +
		"WHERE s.fk_event_id = ? " +
		"ORDER BY s.slot_date",
		[eventId]);
		connection.end();
		return rows;
	}
	catch (err) {
		console.log(err);
	}
};

// Find all slot reservations for a given event
module.exports.eventSlotResv = async function(eventId){
	try{
		const connection = await sql.createConnection(dbcon);
		const [rows, fields] = await connection.query(
		"SELECT name, slot_id, user_id, " +
		"email, slot_date, start_time, end_time, slot_location FROM  `event` " +
		"INNER JOIN `slot` ON fk_event_id = event_id " +
		"INNER JOIN `reserve_slot` ON fk_slot_id = slot_id " +
		"INNER JOIN `user` ON fk_user_id = user_id " +
		"WHERE event_id = ? " +
		"ORDER BY slot_date",
		[eventId]);
		connection.end();
		return rows;
	}
	catch (err) {
		console.log(err);
	}
};

// Create a slot with the given info
module.exports.createSlot = async function(eventId, location, date, startTime, endTime, duration, maxAttendees){
	try{
		const connection = await sql.createConnection(dbcon);
		await connection.query(
		"INSERT INTO `slot` " +
		"(`fk_event_id`, `slot_location`, `slot_date`, `start_time`, " +
		"`end_time`, `duration`, max_attendees) " +
		"VALUES (?, ?, ?, ?, ?, ?, ?);",
		 [eventId, location, date, startTime, endTime, duration, maxAttendees]);
		connection.end();
	}
	catch (err) {
		console.log(err);
	}
};

// Update a slot with the given info
module.exports.editSlot = async function(location, date, startTime, endTime, duration, maxAttendees, slotId){
	try{
		const connection = await sql.createConnection(dbcon);
		await connection.query(
		"UPDATE `slot` " +
		"SET `slot_location` = ?, `slot_date` = ?, `start_time` = ?, " +
		"`end_time` = ?, `duration` = ?, `max_attendees` = ?" +
		"WHERE `slot_id` = ?",
		 [location, date, startTime, endTime, duration, maxAttendees, slotId]);
		connection.end();
	}
	catch (err) {
		console.log(err);
	}
};

// Delete slot with the given ID
module.exports.deleteSlot = async function(slotId){
	try{
		const connection = await sql.createConnection(dbcon);
		await connection.query(
		"DELETE FROM `slot` " +
		"WHERE `slot_id` = ?;",
		 [slotId]);
		connection.end();
	}
	catch (err) {
		console.log(err);
	}
};

// Delete all slots with the given foreign key event id
module.exports.deleteSlotByEventId = async function(eventId){
	try{
		const connection = await sql.createConnection(dbcon);
		await connection.query(
		"DELETE FROM `slot` " +
		"WHERE `fk_event_id` = ?;",
		 [eventId]);
		connection.end();
	}
	catch (err) {
		console.log(err);
	}
};
