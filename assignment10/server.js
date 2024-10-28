var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var hostname = 'localhost';
var port = 3000;
var fs = require('fs');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))


// read from file to user
//ทำให้สมบูรณ์
app.get('/inmsg', async (req, res) => {
  try {
    const data = await readMsg();
    res.json(data);
  } catch (err) {
    res.status(500).send("Error reading messages");
  }
})

//from user, write data to file
//ทำให้สมบูรณ์
app.post('/outmsg', async (req, res) => {
  try {
    const newMsg = req.body;
    await updateMsg(newMsg);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send("Error updating message");
  }
})

// read json data from file
//ทำให้สมบูรณ์
const readMsg = () => {
  return new Promise((resolve,reject) => {
    fs.readFile('log.json', 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data || "{}"));
    });
  })
} 

// update json data
//ทำให้สมบูรณ์
const updateMsg = (new_msg) => {
  return new Promise(async (resolve,reject) => { 
    try {
      const data = await readMsg();
      const key = `msg${Object.keys(data).length + 1}`;
      data[key] = new_msg;
      await writeMsg(data);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

// write json data to file
//ทำให้สมบูรณ์
const writeMsg = (data) => {
  return new Promise((resolve,reject) => {
    fs.writeFile('log.json', JSON.stringify(data, null, 2), (err) => {
      if (err) reject(err);
      else resolve();
    });
  }
)};

app.listen(port, hostname, () => {
  console.log(`Server running at   http://${hostname}:${port}/`);
});