var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');

var index = require('./routes/index');
var users = require('./routes/users');
var session = require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'shhsecret', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.get('/ebooks.xml', function(req, res) {
  var xml = `<?xml version="1.0" encoding="UTF-8"?>
  <feed xmlns:dcterms="http://purl.org/dc/terms/" xmlns:thr="http://purl.org/syndication/thread/1.0" xmlns:app="http://www.w3.org/2007/app" xmlns:opensearch="http://a9.com/-/spec/opensearch/1.1/" xmlns="http://www.w3.org/2005/Atom" xmlns:opds="http://opds-spec.org/2010/catalog" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xml:lang="en" xmlns:odl="http://opds-spec.org/odl" xmlns:schema="http://schema.org">
    <id>https://catalog.feedbooks.com/publicdomain/browse/top.atom</id>
    <title>Most popular</title>
    <updated>2021-02-04T11:11:07Z</updated>
    <icon>/favicon.ico</icon>
    <author>
      <name>Feedbooks</name>
      <uri>http://www.feedbooks.com</uri>
      <email>help@demarque.com</email>
    </author>
    <link rel="self" type="application/atom+xml;profile=opds-catalog;kind=acquisition; charset=utf-8" href="https://catalog.feedbooks.com/publicdomain/browse/top.atom"/>
    <link rel="start" type="application/atom+xml;profile=opds-catalog;kind=navigation" title="Home" href="https://catalog.feedbooks.com/catalog/index.atom"/>
    <link rel="search" href="https://catalog.feedbooks.com/opensearch.xml" type="application/opensearchdescription+xml" title="Search on Feedbooks"/>
    <link rel="http://opds-spec.org/shelf" type="application/atom+xml;profile=opds-catalog;kind=acquisition" title="Bookshelf" href="https://www.feedbooks.com/user/bookshelf.atom"/>
  <opensearch:totalResults>3479</opensearch:totalResults>
  <opensearch:itemsPerPage>50</opensearch:itemsPerPage>
  <opensearch:startIndex>1</opensearch:startIndex>
  <entry>
  <title>ज्ञानार्णव gyanarnav </title>
  <id>https://www.feedbooks.com/book/142111</id>
  <author>
    <name>शुभचन्द्र देव shubhchandradev</name>
    <uri>https://catalog.feedbooks.com/publicdomain/browse/recent.atom?author_id=1&amp;lang=en</uri>
  </author>
  <published>2007-07-19T13:36:30Z</published>
  <updated>2020-09-21T15:35:02Z</updated>
  <dcterms:language>en</dcterms:language>
  <dcterms:publisher>Feedbooks</dcterms:publisher>
  <dcterms:issued>1892</dcterms:issued>
  <summary>यह ज्ञानार्णव ग्रन्थराज आचार्य शुभचन्द्र देव  द्वारा रचित है। जिसमें ध्यान के अभ्यास के लिए आपको कुछ सिखाया जा रहा है।</summary>
  <schema:Series schema:position="9" schema:name="Sherlock Holmes" schema:url="https://catalog.feedbooks.com/series/9"/>
  <category label="Jainism" term="FBFIC000000" scheme="http://www.feedbooks.com/categories"/>
  <category label="Spirituality" term="FBFIC022000" scheme="http://www.feedbooks.com/categories"/>
  <link type="text/html" rel="alternate" title="View on Feedbooks" href="http://www.feedbooks.com/book/142111"/>
  <link type="image/jpeg" rel="http://opds-spec.org/image" href="https://arhamyogacertificates.herokuapp.com/gyanarnav.jpg"/>
  <link type="image/jpeg" rel="http://opds-spec.org/image/thumbnail" href="https://arhamyogacertificates.herokuapp.com/gyanarnav.jpg"/>
  <link type="application/epub+zip" rel="http://opds-spec.org/acquisition" href="https://arhamyogacertificates.herokuapp.com/arhampranayam.epub"/>
  <link type="application/atom+xml;profile=opds-catalog;type=entry" rel="alternate" title="Full entry" href="https://catalog.feedbooks.com/book/142111.atom"/>
  </entry>
  </feed>`
  res.header('Content-Type', 'text/xml');
  res.send(xml);
      
});

app.use('/', index);
app.use('/users', users);
app.use (function (req, res, next) {
  if (!req.secure) {
          // request was via https, so do no special handling
          next();
  } else {
          // request was via http, so redirect to https
          res.redirect('http://' + req.headers.host + req.url);
  }
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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
