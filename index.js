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
let bodyParser = require('body-parser')

let sequelize = new Sequelize('sqlite:./db/catalog.db', {
  logging: false,
});

app.use(helmet());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

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
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
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
}, {
  timestamps: false
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

async function getCatalog() {
  try {
    let catalogList = await Catalog.findAll()
    return catalogList
  } catch(e){
      console.error(e)
  }
}

app.get(
  '/admin',
  basicAuth({
    users: { admin: cred.password },
    unauthorizedResponse: getUnauthorizedResponse,
    challenge: true,
  }), (req, res) => {
    res.sendFile(path.join(__dirname, '/admin/', 'upload.html'));
  }
);

app.get(
  '/allitems',
  basicAuth({
    users: { admin: cred.password },
    unauthorizedResponse: getUnauthorizedResponse,
    challenge: true,
  }), (req, res) => {
    res.sendFile(path.join(__dirname, '/admin/', 'allitems.html'));
  }
);

app.get('/all', async (req, res) => {
  const catalogList = await getCatalog()
  return res.json(catalogList)
})

app.post('/upload', upload.single('file'), async (req, res) => {
  console.log(req.body);
  uploadFile(req.file.path, req.file.filename, res);

  const catalogList = await getCatalog()

  let max = catalogList.length + 1;
  console.log('max', max)

  Catalog.create({
    id: max,
    filename: req.file.filename,
    artist: req.body.artist,
    title: req.body.title,
    year: req.body.year,
  });

  res.send('<h1>Yuuuur!!</h1>');
});

app.get('/delete', basicAuth({
    users: { admin: cred.password },
    unauthorizedResponse: getUnauthorizedResponse,
    challenge: true,
  }), async (req, res) => {
  await deleteRow(req.query.id);
  res.send('<h1>Byyyye data!!</h1>');
})

app.post('/update', upload.none(), basicAuth({
    users: { admin: cred.password },
    unauthorizedResponse: getUnauthorizedResponse,
    challenge: true,
  }), async (req, res) => {
      const { filename, artist, title, year } = req.body;
      console.log(req.body)
      try {
        const result = await Catalog.update(
          { filename, title, artist, year},
          { where: { filename } }
        )
      } catch (e) {
        console.error(e)
      }
      res.send('<h1>Updated :)</h1>');
})


async function deleteRow(id) {
  const n = await Catalog.destroy({
    where: {
      filename: id,
    }
  })

  console.log(`number of deleted rows: ${n}`);

  const params = {
    Bucket: BUCKET,
    Key: id
   };

  let del = await s3.deleteObject(params, function(err, data) {
    if (err) console.log(err, err.stack)
  }).promise()
}



async function uploadFile(source, targetName, res) {

  const fileStream = fs.createReadStream('./uploads/' + targetName);

  const params = {
    Bucket: BUCKET,
    Key: targetName,
    Body: fileStream,
    ACL: 'public-read',
  };

  let upload = await s3.upload(params, (err, data) => {
      if (err) console.log(err, err.stack);
    }).promise()

  fs.unlink(source, (err) => console.log(err));
}

const port = '8080';
const ip = '172.31.63.2';

app.listen(port, ip, () => console.log(`Running on http://${ip}:${port}/`));
