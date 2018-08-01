const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const saveProgramWorkout = require('./routes/localRoutes/localhostSaveProgramWorkout');
const updateProgramWorkout = require('./routes/localRoutes/localhostUpdateProgramWorkout');
const getProgramWorkout = require('./routes/localRoutes/localhostgetAllProgramWorkout');
const getUserData = require('./routes/localRoutes/localhostgetUserData');
const getUserDataFilterByDay = require('./routes/localRoutes/localhostgetUserDataFilterByDay');

const app = express();

// Enable cors
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/saveProgramWorkout', saveProgramWorkout);
app.use('/updateProgramWorkout', updateProgramWorkout);
app.use('/getProgramWorkout', getProgramWorkout);
app.use('/getUserData', getUserData);
app.use('/getUserDataFilterByDay', getUserDataFilterByDay);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
