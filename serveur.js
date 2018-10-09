const { createServer } = require('https');
const { readFileSync, readFile } = require('fs');
const fs = require('fs');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const session = require('express-session');
const crypto = require('crypto');
const csrf = require('csurf');
const redisStore = require('connect-redis')(session);
const cookieParser = require('cookie-parser');
const fileUploader = require('express-fileupload');
const uuidv4 = require('uuid/v4');
const auth = require('basic-auth')

const { homePage } = require('./home_page.js');

const multer  = require('multer')

const SESSION_SECRET =
  process.env.SESSION_SECRET || crypto.randomBytes(64).toString('hex');

const app = express();
app.use(fileUploader({
      limits: { fileSize: 4 * 1000 * 1000 },
    }));
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ['*'],
      upgradeInsecureRequests: true,
    },
  })
);
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.noSniff());
app.use(
  helmet.hsts({ maxAge: 31536000, includeSubDomains: true, preload: true })
);
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Content-Type", "text/html")
  next();
});
app.use(helmet.ieNoOpen());
app.use(helmet.referrerPolicy({ policy: 'no-referrer' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(csrf({ cookie: true }));
app.use(
  session({
    store: new redisStore({ host: 'localhost', port: 6379 }),
    name: 'SSID',
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true, httpOnly: true, domain: '.myapp.dev', path: '/' },
  })
);


app.get('/', function(req, res) {
    try {
      res.send(
        homePage({csrfToken: req.csrfToken()})
      );
    }catch(err){
      res.send('internal server error.');
      return;
    }
});


app.post('/upload', function(req, res){
  try{
      const filename = uuidv4();
      switch(req.files.upload.mimetype) {
          case 'image/jpeg':
          console.log('jpeg')
          req.files.upload.mv('./image/'+filename+'.jpeg', function(err) {
            if (err)
            console.log(err);
          });
          break;
          case 'image/jpg':
          console.log('jpg')
          req.files.upload.mv('./image/'+filename+'.jpg', function(err) {
            if (err)
              console.log(err);
          });
          break;
          case 'image/png':
          console.log('png')
          req.files.upload.mv('./image/'+filename+'.png', function(err) {
            if (err)
            console.log(err);
          });
          break;
          default:
          res.send('data no accept')
      }
      fs.chmodSync(`./image/${filename}`, '666')
  }

   catch(err){
    console.log(err)
   }

  res.redirect('/');
    
})

app.get('/images', function (req, res) {
  if (!auth(req)) {
    res.set('WWW-Authenticate', 'Basic realm="image access"')
    return res.status(401).send()
  }
  let { name, pass } = auth(req)
  name = escape(name)
  pass = escape(pass)
  if (name === process.env.USER && pass === process.env.PASS) {
    const pathImage = `${__dirname}/image/${req.query.image}`
    fs.readFile(pathImage, function (err, data) {
      if (err) throw err
      res.header('Content-Type', 'image/jpg')
      res.send(data)
    })
  } else {
    return res.status(401).send('bad creds')
  }
})

createServer(
  {
    key: readFileSync(process.env.SSL_KEY),
    cert: readFileSync(process.env.SSL_CERT),
  },
  app
).listen(process.env.PORT);
