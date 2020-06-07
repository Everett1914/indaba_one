// Base application. Run from terminal with "node app.js"

var express =       require('express'),
  bodyParser =      require('body-parser'),
  session =         require('express-session'),
  handlebars =      require('express-handlebars'),
  dbcon =           require('./config/dbcon.js'),
  helmet =          require('helmet'),
  MySQLStore =      require('express-mysql-session')(session),
  sessionStore =    new MySQLStore(dbcon),
  passport =        require('passport');

var app = express();

// Configure bodyParser
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// Set handlebars as view engine, allow omission of .handlebars extension
app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  helpers: require('./helpers/handlebarsHelpers.js')
}));
app.set('view engine', 'handlebars');

// Set up access to public folder
app.use(express.static(__dirname + '/public'));

// Configure sessions
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore
}));

// Initialize passport authentication
app.use(passport.initialize());
app.use(passport.session());

// Configure passport authentication strategies
passportConfig =  require('./config/passport.js')(passport);


// Set security-related http headers
app.use(helmet());

// set up routes
app.use(require('./routes/index.js'));
app.use(require('./routes/manage.js'));
app.use(require('./routes/create.js'));
app.use(require('./routes/pastReservations.js'));
app.use(require('./routes/makeReservations.js'));
app.use(require('./routes/pastEvents.js'));


// Handle 404 error
app.use(function(req,res){
  res.status(404);
  res.render('404');
});

// Handle 500 error
app.use(function(err,req,res,next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.send('500');
});

// Start server
app.listen(process.env.PORT || 3000, function(){
  console.log('Indaba One server started!');
});
