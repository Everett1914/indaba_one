// Defines routes for login, logout, and homepage

var Router = 		require('express-promise-router'),
	router = 		new Router(),						// allows asynchronous route handlers
	session = 		require('express-session'),
	createsEvent =	require('../models/createsEvent.js'),
	helpers = 		require('../helpers/helpers.js'),
	email =			require('../helpers/email.js'),
	passport = 		require('passport'); 

//
router.get('/', async function(req, res, next) {
	res.redirect('/home');
})

// Displays user's personal homepage
router.get('/home', async function (req, res, next) {
	// If there is no session established, redirect to the landing page
	if (!req.user) {
		res.redirect('/login');
	}
	// If there is a session, check if user was trying to reach a particular event's reservation page
	else if (req.session.eventId) {
		let eventId = req.session.eventId;
		delete req.session.eventId;
		res.redirect('/make-reservations/' + eventId);

	}
	// There is a session. Send user to their homepage
	else {
		let context = {};
		context.eventsManaging = await createsEvent.getUpcomingUserEvents(req.user.user_id);
		context.eventsAttending = await helpers.processUpcomingReservationsForDisplay(req.user.user_id);
		context.name = req.user.name;
		context.stylesheets = ['main.css'];
		context.scripts = ['convertISOToLocal.js', 'home.js'];
		res.render('home', context);
	}

});

// Displays landing page
router.get('/login', async function (req, res, next) {
	let context = {};
	context.layout = 'no_navbar.handlebars';
	context.stylesheets = ['main.css', 'login.css'];
	res.render('login.handlebars', context);
});

// Authenticate user with google OAuth
router.get('/login/google',
	passport.authenticate('google', {scope: ['profile', 'email']}));		// send user to google sign in; retrieve their profile and email

// Check for valid authentication after user is redirected from google sign in
router.get('/auth/google',
	passport.authenticate('google', { failureRedirect: '/login/failed' }),	// check authentication, redirect on failure
	function(req, res) { res.redirect('/home'); }							// authentication is valid; redirect to homepage
);

// Destroys current session and redirects to landing page
router.get('/logout', async function (req, res, next) {
	if (req.session) {
		req.session.destroy(function(err) {
			if(err){
				return next(err);
			}
			else {
				return res.redirect('/');
			}
		});
	}
});

module.exports = router;
