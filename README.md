# MDT 312:Assignment10
MDT 312: WEB PROGRAMMING


**❗ส่งได้ถึงวันที่ 5/11/2567 (ส่งกับ KT,PN)❗**
### โปรดอ่าน  

- โค้ดนี้จัดทำมาเพื่ออธิบายการทำงานของ Node.js ให้เป็นแนวทางการทำงาน Assignment10 เท่านั้น!
  - เราจะทำการสร้าง chatroom ง่าย ๆ โดยการใช้ `node.js` เริ่มจาก 
    - ให้ user กรอกชื่อ 
    - อ่าน json data จาก `log.json` แสดงใน chatroom 
    - ให้ user พิมพ์ข้อความที่ต้องการส่ง 
    - ทำการ save ข้อความที่ user พิมพฺ์ใน chatroom ของเราลงใน file ที่มีชื่อว่า `log.json` และทำการอ่าน file นั้นทุก ๆ 3 วินาทีเพื่อ update ข้อความใน chatroom 
    - ใช้ `Async` และ `Await `
    - แก้แค่ใน `chatter.js` กับ `server.js` เท่านั้น


- ***❗โปรดอ่านคำอธิบายพร้อมทดลองเขียนและทำความเข้าใจด้วยตัวเองก่อน หากไม่เข้าใจสามารถถามมาได้ผมจะตอบในช่วงที่สามารถตอบได้ให้เร็วที่สุด❗***

### Trick(เล็กๆน้อยๆ)
- จัดรูปแบบโค้ด: `Shift + Alt + F` (Windows/Linux) หรือ `Shift + Option + F` (Mac)
- แทรกบรรทัดใหม่: `Ctrl + Enter` (Windows/Linux) หรือ `Cmd + Enter` (Mac)
- เลื่อนบรรทัดขึ้น/ลง: `Alt + Up/Down Arrow` (Windows/Linux) หรือ `Option + Up/Down Arrow` (Mac)


ด้วยความปรารถนาดีจาก ผู้สาวซาโต้จัง🌸🌈 **(sarto_)**

# รายละเอียดโค้ด `chatter.js`

```javascript
window.onload = pageLoad;
var username = "";
var timer = null;
```
- `window.onload = pageLoad;`: ตั้งให้ฟังก์ชัน `pageLoad` ถูกเรียกเมื่อหน้าเว็บโหลดเสร็จ
- `username`: ตัวแปรที่เก็บชื่อผู้ใช้ ซึ่งจะถูกกำหนดเมื่อผู้ใช้ใส่ชื่อ
- `timer`: ตัวแปรที่จะใช้เก็บ ID ของฟังก์ชัน `setInterval` สำหรับการอัปเดตข้อความอัตโนมัติ

#
### ฟังก์ชัน `pageLoad`
```javascript
function pageLoad() {
	var x = document.getElementById("submitmsg");
	x.onclick = sendMsg;
	var x = document.getElementById("clickok");
	x.onclick = setUsername;
}
```
- `pageLoad()`: ฟังก์ชันนี้จะทำงานเมื่อหน้าเว็บโหลดเสร็จ
- `document.getElementById("submitmsg").onclick = sendMsg;`: เมื่อผู้ใช้คลิกปุ่มส่งข้อความ จะเรียกฟังก์ชัน `sendMsg` เพื่อส่งข้อความ
- `document.getElementById("clickok").onclick = setUsername;`: เมื่อผู้ใช้คลิกปุ่ม OK จะเรียกฟังก์ชัน `setUsername` เพื่อกำหนดชื่อผู้ใช้และเริ่มการอัปเดตข้อความอัตโนมัติ

#
### ฟังก์ชัน `setUsername`
```javascript
function setUsername() {
	var x = document.getElementById("userInput");
	username = x.value;
	var x = document.getElementById("username");
	x.innerHTML = username;
	timer = setInterval(loadLog, 3000); // โหลดข้อมูลทุก 3000 มิลลิวินาที (3 วินาที)
	document.getElementById("submitmsg").disabled = false;
	document.getElementById("clickok").disabled = true;
	readLog();
}
```
- `username = x.value;`: กำหนดตัวแปร `username` ให้เป็นค่าที่ผู้ใช้กรอกในช่อง `userInput`
- `document.getElementById("username").innerHTML = username;`: แสดงชื่อผู้ใช้ในส่วนของ HTML ที่มี id เป็น `username`
- `setInterval(loadLog, 3000);`: ตั้งให้เรียก `loadLog()` ทุก ๆ 3 วินาทีเพื่ออัปเดตข้อความ
- `document.getElementById("submitmsg").disabled = false;`: เปิดใช้งานปุ่มส่งข้อความเมื่อผู้ใช้ตั้งค่าชื่อแล้ว
- `document.getElementById("clickok").disabled = true;`: ปิดการใช้งานปุ่ม OK หลังจากตั้งชื่อผู้ใช้แล้ว
- `readLog();`: เรียก `readLog()` ครั้งแรกทันที เพื่อแสดงข้อความล่าสุดก่อนที่จะเริ่มอัปเดตทุก 3 วินาที

#
### ฟังก์ชัน `loadLog`
```javascript
function loadLog() {
	readLog();
}
```
- `loadLog()`: ฟังก์ชันนี้เรียก `readLog()` เพื่อดึงข้อความใหม่จาก server ทุก 3 วินาที

#
### ฟังก์ชัน `sendMsg`
```javascript
function sendMsg() {
	// get msg
	var text = document.getElementById("userMsg").value;
	document.getElementById("userMsg").value = "";
	writeLog(text);
}
```
- `sendMsg()`: ฟังก์ชันนี้ทำงานเมื่อผู้ใช้คลิกปุ่มส่งข้อความ
- `text = document.getElementById("userMsg").value;`: เก็บข้อความที่ผู้ใช้พิมพ์ไว้ในตัวแปร `text`
- `document.getElementById("userMsg").value = "";`: เคลียร์ช่องข้อความหลังจากที่ผู้ใช้ส่งข้อความ
- `writeLog(text);`: เรียก `writeLog()` เพื่อส่งข้อความไปยัง server

#
### ฟังก์ชัน `writeLog`
```javascript
const writeLog = (async (msg) => {
	let d = new Date();
	let messageData = {
        time: d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
        user: username,
        message: msg
    };

    await fetch('/outmsg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
    });
});
```
- `writeLog`: ฟังก์ชัน async ที่ส่งข้อมูลข้อความไปยัง server
- `let d = new Date();`: สร้าง object วันที่และเวลาในปัจจุบัน
- `messageData`: object ที่เก็บข้อมูลของข้อความ ซึ่งประกอบด้วยเวลา (`time`), ชื่อผู้ใช้ (`user`) และข้อความ (`message`)
- `fetch('/outmsg', {...})`: ส่งข้อความไปที่ URL `/outmsg` โดยใช้ HTTP POST
- `{ 'Content-Type': 'application/json' }`: ตั้งค่า header ให้ server รู้ว่าข้อมูลเป็น JSON
- `body: JSON.stringify(messageData)`: แปลง `messageData` เป็น JSON ก่อนส่งไปยัง server

#
### ฟังก์ชัน `readLog`
```javascript
const readLog = (async () => {
	const response = await fetch('/inmsg');
    const data = await response.json();
    postMsg(data);
});
```
- `readLog`: ฟังก์ชัน async ที่ดึงข้อความจาก server
- `await fetch('/inmsg');`: ดึงข้อความทั้งหมดจาก URL `/inmsg`
- `await response.json();`: แปลงข้อมูลที่ได้จาก server เป็น JSON
- `postMsg(data);`: เรียก `postMsg()` เพื่อแสดงข้อมูลใน `chatbox`

#
### ฟังก์ชัน `postMsg`
```javascript
function postMsg(msg) {
	var x = document.getElementById("chatbox");
	while (x.firstChild) {
		x.removeChild(x.lastChild);
	}
	let keys = Object.keys(msg);
	for (var i of keys) {
		var div_d = document.createElement("div");
		div_d.className = "message";
		var timemsg = document.createTextNode("(" + msg[i].time + ") ");
		var boldmsg = document.createElement("b");
		boldmsg.innerHTML = msg[i].user;
		var textmsg = document.createTextNode(": " + msg[i].message);
		
		div_d.append(timemsg, boldmsg, textmsg);
		div_d.appendChild(document.createElement("br"));
		x.appendChild(div_d);
	}
	checkScroll();
}
```
- `postMsg(msg)`: แสดงข้อความที่ได้รับจาก server ใน chatbox
- `while (x.firstChild)`: ลบข้อความเก่าออกก่อนจะแสดงข้อความใหม่
- `Object.keys(msg)`: ดึง key ของ `msg` ซึ่งเป็น JSON ที่มีข้อความและข้อมูลผู้ใช้
- `for (var i of keys)`: วนลูปแสดงข้อความแต่ละข้อความ
  - สร้าง `div` และเพิ่ม `className` เป็น `message`
  - สร้าง `timemsg`, `boldmsg`, และ `textmsg` เพื่อแสดงเวลา, ชื่อผู้ใช้ และข้อความ
  - `div_d.append(...)`: ใส่ข้อมูลทั้งหมดใน `div_d` และเพิ่มลงใน `chatbox`
- `checkScroll();`: เรียก `checkScroll()` เพื่อเลื่อน scroll ไปที่ข้อความล่าสุด

#
### ฟังก์ชัน `checkScroll`
```javascript
function checkScroll() {
	var chatbox = document.getElementById('chatbox');
	var scroll = chatbox.scrollTop + chatbox.clientHeight === chatbox.scrollHeight;
	if (!scroll) {
    	chatbox.scrollTop = chatbox.scrollHeight;
  	}
}
```
- `checkScroll()`: ตรวจสอบว่าหน้าจอเลื่อนไปที่ข้อความล่าสุดหรือไม่
- `scrollTop + clientHeight === scrollHeight`: ตรวจสอบว่าข้อความเลื่อนถึงส่วนล่างสุดของ `chatbox` หรือไม่
- `chatbox.scrollTop = chatbox.scrollHeight;`: ถ้าไม่อยู่ที่ส่วนล่างสุด ให้เลื่อนหน้าจอไปที่ข้อความล่าสุด

# ข้อสรุป `chatter.js`
โค้ดนี้เป็นส่วนของ `chatter.js` ที่ใช้สำหรับการจัดการข้อความในหน้าเว็บ ซึ่งเป็นส่วนของ client ที่จะส่งข้อความไปยัง server และดึงข้อความจาก server มาแสดงใน chatbox ทุก ๆ 3 วินาที


# รายละเอียดโค้ด `server.js`

```javascript
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var hostname = 'localhost';
var port = 3000;
var fs = require('fs');
```
- `express`: โหลดไลบรารี Express สำหรับสร้างและจัดการเซิร์ฟเวอร์
- `bodyParser`: โหลดไลบรารี body-parser เพื่อแปลงข้อมูลที่ส่งมาจาก client ให้เป็น JSON (เพื่อความสะดวกในการใช้งาน)
- `app`: สร้างแอปพลิเคชัน Express
- `hostname` และ `port`: ตั้งค่าให้เซิร์ฟเวอร์รันบน `localhost` และพอร์ต `3000`
- `fs`: โหลดไลบรารี fs (file system) เพื่อจัดการการอ่านและเขียนไฟล์
```javascript
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
```
- `app.use(express.static(__dirname))`: ให้ Express ใช้ไฟล์ทั้งหมดที่อยู่ในไดเรกทอรีปัจจุบัน (เช่นไฟล์ HTML, CSS, และ JavaScript) ทำให้สามารถเปิดใช้งานได้จาก client
- `app.use(bodyParser.json())`: กำหนดให้ body-parser แปลงข้อมูลที่ส่งมาจาก client เป็น JSON
- `app.use(bodyParser.urlencoded({ extended: false }))`: กำหนดให้ body-parser แปลงข้อมูลที่ส่งมาในรูปแบบ URL-encoded (ใช้สำหรับแบบฟอร์ม HTML) แต่ไม่อนุญาต nested object (object ซ้อนกัน)

#
### การอ่านข้อความจากไฟล์ `log.json`
```javascript
app.get('/inmsg', async (req, res) => {
  try {
    const data = await readMsg();
    res.json(data);
  } catch (err) {
    res.status(500).send("Error reading messages");
  }
});
```
- `app.get('/inmsg')`: กำหนด route แบบ GET ที่ URL `/inmsg` ซึ่ง client จะเรียกเพื่อดึงข้อความที่อยู่ในไฟล์ `log.json`
- `try-catch`: ใช้ตรวจสอบว่ามี error ระหว่างการอ่านไฟล์หรือไม่
- `readMsg()`: ฟังก์ชัน async ที่อ่านข้อมูลจากไฟล์ `log.json` และส่งคืนข้อมูลในรูป JSON
- `res.json(data)`: ส่งข้อมูลกลับไปยัง client ในรูป JSON
- หากเกิดข้อผิดพลาด จะส่ง `Error reading messages` และสถานะ `500` กลับไปที่ client **(⚠สถานะ `500` ผมก็ไม่ค่อยรู้รายละเอียดมากนัก แค่รู้ว่ามันเป็นสถานะที่เกิดข้อผิดพลาด)**

#
### การเขียนข้อมูลจาก client ลงไฟล์ `log.json`
```javascript
app.post('/outmsg', async (req, res) => {
  try {
    const newMsg = req.body;
    await updateMsg(newMsg);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send("Error updating message");
  }
});
```
- `app.post('/outmsg')`: กำหนด route แบบ POST ที่ URL `/outmsg` ซึ่ง client จะเรียกใช้งานเมื่อส่งข้อความใหม่
- `req.body`: ข้อความที่ส่งมาจาก client ในรูป JSON (ชื่อผู้ใช้, เวลาส่ง และเนื้อความ)
- `updateMsg(newMsg)`: ฟังก์ชัน async ที่เพิ่มข้อความใหม่ลงในไฟล์ `log.json`
- `res.sendStatus(200)`: ส่งสถานะ 200 (OK) กลับไปที่ client หากบันทึกสำเร็จ
- หากเกิดข้อผิดพลาด จะส่ง `Error updating message` และสถานะ `500` กลับไปที่ client

#
### ฟังก์ชันอ่านข้อมูลจาก `log.json`
```javascript
const readMsg = () => {
  return new Promise((resolve, reject) => {
    fs.readFile('log.json', 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data || "{}"));
    });
  });
};
```
- `readMsg`: ฟังก์ชัน async ที่อ่านข้อมูลจากไฟล์ `log.json`
- `fs.readFile`: อ่านไฟล์ `log.json` และแปลงเป็น JSON ถ้าข้อมูลเป็น null หรือไม่มีข้อมูล จะส่งคืนเป็น object ว่าง (`{}`)
- `Promise`: หากสำเร็จจะส่ง `data` ที่แปลงเป็น JSON ให้ `resolve` และหากมีข้อผิดพลาดจะส่งให้ `reject`

#
### ฟังก์ชันอัปเดตข้อมูลใน `log.json`
```javascript
const updateMsg = (new_msg) => {
  return new Promise(async (resolve, reject) => { 
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
};
```
- `updateMsg(new_msg)`: ฟังก์ชัน async ที่เพิ่มข้อความใหม่เข้าไปใน `log.json`
- `readMsg()`: เรียกฟังก์ชันอ่านข้อมูลจาก `log.json` เพื่อดึงข้อมูลทั้งหมดมาเป็น JSON
- `Object.keys(data).length + 1`: กำหนด key ใหม่สำหรับข้อความที่เพิ่ม โดยใช้ตัวเลขถัดไป เช่น `msg1`, `msg2`
- `data[key] = new_msg`: เพิ่มข้อความใหม่ใน object `data`
- `writeMsg(data)`: เรียกฟังก์ชันเขียนไฟล์ `writeMsg` เพื่อบันทึกข้อมูลใหม่ลงใน `log.json`
- หากสำเร็จจะส่ง `resolve()` และหากมีข้อผิดพลาดจะส่ง `reject`

#
### ฟังก์ชันเขียนข้อมูลลงใน `log.json`
```javascript
const writeMsg = (data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile('log.json', JSON.stringify(data, null, 2), (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};
```
- `writeMsg(data)`: ฟังก์ชัน async ที่เขียนข้อมูลลงในไฟล์ `log.json`
- `fs.writeFile`: เขียน `data` ที่ถูกแปลงเป็น JSON ลงในไฟล์ `log.json` และจัดรูปแบบให้สวยงามด้วย `null, 2`
- หากสำเร็จจะส่ง `resolve()` และหากมีข้อผิดพลาดจะส่ง `reject`

#
### การเริ่มต้นเซิร์ฟเวอร์
```javascript
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```
- `app.listen(port, hostname)`: สั่งให้เซิร์ฟเวอร์เริ่มทำงานที่ `localhost:3000`
- เมื่อเซิร์ฟเวอร์ทำงานสำเร็จจะพิมพ์ข้อความใน console

# ข้อสรุป `server.js`
โค้ดนี้เป็นเซิร์ฟเวอร์ที่สร้างด้วย Node.js และ Express สำหรับที่เก็บและอ่านข้อความในไฟล์ log.json โดยใช้ฟังก์ชัน async/await เพื่อจัดการกับการอ่านและเขียนไฟล์


# วิธีการใช้งาน:
1. ติดตั้ง dependencies ที่จำเป็น
  - เปิด Terminal หรือ Command Prompt แล้วไปยังโฟลเดอร์ที่มีไฟล์โปรเจกต์ (ที่มี `server.js`, `chatter.js`, `index.html`, `style.css`, และ `log.json` *ทั้งหมดต้องอยู่ในโฟลเดอร์เดียวกันนะ)
  - รันคำสั่งด้านล่างเพื่อติดตั้ง `express` และ `body-parser`
  ```bash
  npm install express body-parser
  ```
2. รันเซิร์ฟเวอร์
  - รันคำสั่งด้านล่างใน Terminal เพื่อเริ่มต้นเซิร์ฟเวอร์
  ```bash
  node server.js
  ```
  - เมื่อรันสำเร็จ จะต้องเห็นข้อความแจ้งว่าเซิร์ฟเวอร์กำลังทำงาน
  ```plaintext
  Server running at http://localhost:3000/
  ```
3. เปิดเว็บเบราว์เซอร์เพื่อเข้าถึงแชทรูม
  - เปิดเว็บเบราว์เซอร์แล้วไปที่ URL: http://localhost:3000/ (หรือ กดที่แสดงใน Terminal ก็ได้ กด `Shift+click` ที่ Server running at `http://localhost:3000/`)
  - ให้เปิด 2 หน้าต่างแล้วทดสอบโดยใส่ username ให้ต่างกันและเริ่ม Chat! ได้เลย

### หมายเหตุ
- ข้อความใน chatroom จะอัปเดตอัตโนมัติทุก 3 วินาที โดยจะดึงข้อมูลจาก `log.json` (นั้นหมายความว่าถ้าปิดแล้วเปิดใหม่ ข้อความก็ยังคงถูกบันทึกอยู่ โดยสามารถเข้าไปดูได้ที่ไฟล์ `log.json` ได้เลย)
