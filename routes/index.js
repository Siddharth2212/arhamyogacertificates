var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');
const Bluebird = require('bluebird');
fetch.Promise = Bluebird;
var passport = require('passport');

/* GET home page. */
router.get('/certificate/:resultid', function (req, res, next) {
  res.render("certificate", {resultid: req.params.resultid, imageurl: "http://arham-cds.ap-south-1.elasticbeanstalk.com/certificates/"+req.params.resultid})
});
router.get('/arhamqrcodegenerator', function (req, res, next) {
  res.render("qrcodegenerator");
});

router.get('/arhamqrcodegenerator/csv', function (req, res, next) {
  res.render("qrcodegeneratorcsv");
});

router.post('/certificate/', function (req, res, next) {
  res.render("certificate", {resultid: req.body.resultid, imageurl: "http://arham-cds.ap-south-1.elasticbeanstalk.com/certificates/"+req.body.resultid})
});

router.get("/sharecertificate/:resultid", function(req, res, next){
  res.render("sharecertificate", {resultid: req.params.resultid});
})

router.get('/downloadpdf', function (req, res, next) {
  const http = require('http');
  const fs = require('fs');

  const file = fs.createWriteStream("certificate.pdf");
  const request = http.get("http://arhamyogacertificates.herokuapp.com/certificatepdf/0/6264078200", function(response) {
    response.pipe(file);
  });
});

router.get('/certificatepdf/:certificate/:phone', function (req, response, next) {
  fetch('http://arham-cds.ap-south-1.elasticbeanstalk.com/results/1001/search?mobile='+req.params.phone)
    .then(res => res.json())
    .then(certificates => {
      var certificate = certificates[req.params.certificate];
      // if(certificate.obtainedMarks && certificate.totalMarks){
      //   res.render("certificate", { certificate: req.params.certificate, phone: req.params.phone, name: certificate.user.name, "totalMarks": certificate.totalMarks,
      // "obtainedMarks": certificate.obtainedMarks, moment: moment, display: certificate.display});
      // }
      if(certificate.obtainedMarks && certificate.totalMarks){
        var fs = require('fs');
        var pdf = require('html-pdf');
       
        var html = "<html>" +
            "<head>" +
            "<style>" +
              ``+
            "body{" +
            "height:100vh;}" +
            "</style>" +
            "</head>" +
            `<body style="background: url(http://arhamyogacertificates.herokuapp.com/certificate.jpg) no-repeat center center fixed; 
            -webkit-background-size: cover;
            -moz-background-size: cover;
            -o-background-size: cover;
            background-size: cover; padding:20px; text-align:center;">`+
            `<div><h4 style="position: absolute;
            top: 100vh;
            left: 50%;">${certificate.user.name}</h4></div>`+
            `<div><h4 style="position: absolute;
            top: 110vh;
            left: 70%;">${certificate.display}</h4></div>`+
            `<div><h4 style="position: absolute;
            top: 110vh;
            left: 37.5%;">${certificate.obtainedMarks}</h4></div>`+
            "</body>" +
            "</html>"
            console.log(html);
        var options = { orientation: "landscape", "type": "pdf" };
  
        pdf.create(html, options).toStream(function (err, pdfStream) {
            if (err) {
                // handle error and return a error response code
                console.log(err)
                return response.sendStatus(500)
            } else {
                // send a status code of 200 OK
                response.statusCode = 200;
  
                response.setHeader('Content-type', 'application/pdf');
                // res.setHeader('Content-disposition', 'attachment; filename=' + user.local.name+'_'+course.course_name+'_'+'certificate');
  
                // once we are done reading end the response
                pdfStream.on('end', function () {
                    // done reading
                    return response.end();
                });
  
                // pipe the contents of the PDF directly to the response
                pdfStream.pipe(response)
            }
        });
    }
      else{
        response.json(1);
        // res.render("certificatewithoutmarks", {certificate: req.params.certificate, phone: req.params.phone, name: certificate.user.name, moment: moment, display: certificate.display});  
      }    
    });
});

router.get('/privacypolicy', function (req, res, next) {
  res.render("privacypolicy")
});

router.get('/arhamibooks/privacypolicy', function (req, res, next) {
  res.render("ibookprivacypolicy")
});

router.get('/termsofservice', function (req, res, next) {
  res.render("termsofservice")
});

router.post('/shareimage', function (req, res, next) {
  res.json(req.body);
});

router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));

router.get('/', function (req, res, next) {
  fetch('http://arham-cds.ap-south-1.elasticbeanstalk.com/events')
    .then(res => res.json())
    .then(events => {
      res.render("index", {events: events})  
    });
});

function compare( a, b ) {
  if ( a.obtainedMarks < b.obtainedMarks ){
    return -1;
  }
  if ( a.obtainedMarks > b.obtainedMarks ){
    return 1;
  }
  return 0;
}

router.post('/getcertificates', function (req, response, next) {
  // response.json(req.body.eventid);
  // return;
  fetch('http://arham-cds.ap-south-1.elasticbeanstalk.com/events/'+req.body.eventid+'/exams')
    .then(res => res.json())
    .then(json => {
      const examId = json[0].examId;
      const phone = req.body.phone;
      fetch('http://arham-cds.ap-south-1.elasticbeanstalk.com/results/'+examId+'/search?mobile='+phone)
      .then(res => res.json())
      .then(events => {
        // response.json(events);
        var results = [];
        for (const key in events) {
          const arr = events[key];
          results.push(arr.sort( compare )[0])
        }
        // response.json(results);
      response.render("certificatelist", {events: results, logo: req.body.logo});
    });
    }).catch((err)=>{
      console.log(err);
    });
});

module.exports = router;
