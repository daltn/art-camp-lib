const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const fs = require('fs');
const cred = require('./cred.js');
const app = express();

let sqlite = require('sqlite3').verbose();
let Sequelize = require('sequelize');
let sequelize = new Sequelize('sqlite:./db/artcamp.db', {
  logging: false,
});

app.use(express.static('public'));

const BUCKET = 'art-camp-library';

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

AWS.config.update({
  accessKeyId: cred.access_id,
  secretAccessKey: cred.secret,
  region: 'us-east-1',
});

const s3 = new AWS.S3();

console.log('Region: ', AWS.config.region);

const Library = sequelize.define('library', {
  filename: {
    type: Sequelize.STRING,
  },
  s3url: {
    type: Sequelize.STRING,
  },
  artist: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  uploaded: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  year: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

sequelize.sync();

app.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.body);
  uploadFile(req.file.path, req.file.filename, res);
  res.send('<h1>Yuuuur!!</h1>');
});

app.get('/get/:file', (req, res) => {
  console.log(req.body);
  retrieveFile(req.params.file, res);
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

  console.log('Success!');
  // return res.send('<h1>Nice!!</h1>');
}

function retrieveFile(filename, res) {
  const getParams = {
    Bucket: BUCKET,
    Key: filename,
  };

  s3.getObject(getParams, function (err, data) {
    if (err) {
      return res.status(400).send({ success: false, err: err });
    } else {
      return res.send(data.Body);
    }
  });
}

app.listen(3000, () =>
  console.log('Listening on port 3000 -> http://localhost:3000')
);
