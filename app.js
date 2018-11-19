var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var session = require('express-session');
var passport = require('passport')
var TwitterStrategy = require('passport-twitter').Strategy;

const cron = require('cron').CronJob;


var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');

var app = express();
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: '8a9091715584c2ee', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/login/new', loginRouter);
app.use('/logout', logoutRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handlera
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(new TwitterStrategy({
  consumerKey:'nO0iAhOwyCJe16EMesrolKu4i',//TwitterのconsumerKey
  consumerSecret:'ISJd1o2cXCWMEXVNyzli2hX5jgvYQfSQgxsW81SmQalj3V9pfI',//TwitterのconsumerSecret
  callbackURL: "http://localhost:8000/auth/twitter/callback"//認証成功時の戻り先URL
},
  function(token, tokenSecret, profile, done) {
      return done(null,profile);
  }
));

//自作サービス中でtwitter認証を行うURLを設定する
app.get('/auth/twitter',
passport.authenticate('twitter'));

//認証正常時の戻り先URLの設定をする
app.get('/auth/twitter/callback',
passport.authenticate('twitter', {
  failureRedirect: '/login' }),//認証失敗時のリダイレクト先を書く
function(req, res) {
  // ここでは認証成功時のルーティング設定を書く
  // ちなみにreq.userでログインユーザの情報が取れる
  //例) req.user.useridでユーザIDがとれます
  res.redirect('/');
});

module.exports = app;
