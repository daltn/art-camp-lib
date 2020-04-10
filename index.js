const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const fs = require('fs');

const app = express();
app.use(express.static('public'));

let sqlite = require('sqlite3').verbose();

const credentials = new AWS.SharedIniFileCredentials({ profile: 'artcamp' });
AWS.config.credentials = credentials;
AWS.config.update({ region: 'us-east-1' });

AWS.config.getCredentials(function (err) {
  if (err) console.log(err.stack);
  else {
    console.log('Access key:', AWS.config.credentials.accessKeyId);
    console.log('Secret access key:', AWS.config.credentials.secretAccessKey);
  }
});

console.log('Region: ', AWS.config.region);
