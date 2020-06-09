const express = require('express');
const multer = require('multer');
const path = require('path');
const AWS = require('aws-sdk');
const fs = require('fs');
const cred = require('./cred.js');
const app = express();
let Sequelize = require('sequelize');
const basicAuth = require('express-basic-auth');
const helmet = require('helmet');

let sequelize = new Sequelize('sqlite:./db/catalog.db', {
  logging: false,
});

app.use(helmet());
app.use(express.static('public'));

AWS.config.update({
  accessKeyId: cred.access_id,
  secretAccessKey: cred.secret,
  region: 'us-east-1',
});

const s3 = new AWS.S3();
const BUCKET = 'art-camp-library';

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

const Catalog = sequelize.define('catalog', {
  filename: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  artist: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  year: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

sequelize.sync();

app.get('/get', (req, res) => {
  Catalog.findOne({
    attributes: ['id', 'filename', 'artist', 'title', 'year'],
    order: sequelize.random(),
  }).then((art) => res.send(JSON.stringify(art)));
});

function getUnauthorizedResponse(req) {
  return req.auth ? 'Nope' : 'No credentials provided';
}

app.get(
  '/upload',
  basicAuth({
    users: { admin: cred.password },
    unauthorizedResponse: getUnauthorizedResponse,
    challenge: true,
  }),
  (req, res) => {
    res.sendFile('./admin/upload.html');
  }
);

app.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.body);
  uploadFile(req.file.path, req.file.filename, res);
  Catalog.create({
    filename: req.file.filename,
    artist: req.body.artist,
    title: req.body.title,
    year: req.body.year,
  });
  res.send('<h1>Yuuuur!!</h1>');
});

async function uploadFile(source, targetName, res) {
  console.log('source:', source, 'target:', targetName);

  let fileStream = fs.createReadStream('./uploads/' + targetName);

  let params = {
    Bucket: BUCKET,
    Key: targetName,
    Body: fileStream,
    ACL: 'public-read',
  };

  let storage = await s3
    .upload(params, (err, data) => {
      console.log(err, data);
      return res.send("Didn't work :(");
    })
    .promise();

  console.log(storage.Location);

  fs.unlink(source, (err) => console.log(err));

  console.log('Sweet!!!');
  // return res.send('<h1>Nice!!</h1>');
}

const port = '8080';
const ip = '100.26.18.204';

app.listen(port, ip, () => console.log(`Running on http://${ip}:${port}/`));
