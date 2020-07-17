const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const cmd = require('node-cmd');
var request = require('request');

const verifyWebhook = (req) => {
  // if (!req.headers['user-agent'].includes('Coding.net Hook')) {
  //   return false;
  // }
// Compare their hmac signature to our hmac signature
// (hmac = hash-based message authentication code)
  // const theirSignature = req.headers['x-coding-signature'];
  // console.log(theirSignature);
  // const payload = req.body;
  // const secret = process.env.SECRET_TOKEN; 
  // const ourSignature = `sha1=${crypto.createHmac('sha1', secret).update(payload).digest('hex')}`;
  // return crypto.timingSafeEqual(Buffer.from(theirSignature), Buffer.from(ourSignature));
  return true
};

const app = express();
app.use(bodyParser.text({ type : '*/*' }));

const notAuthorized = (req, res) => {
  // console.log('Someone who is NOT Coding is calling, redirect them');
  // res.redirect(301, '/'); // Redirect to domain root
  res.writeHead(200, { 'Content-Type' : 'text/plain' });
  res.end('Thanks Coding <3');
};

const authorizationSuccessful = () => {
  console.log('Coding is calling, do something here');
  cmd.get(
    'C:\\Users\\lance.zhao\\Desktop\\testWEbhook\\autoBuild.sh',
    function(err, data, stderr){
        console.log(data);
    }
  );
};

app.post('*', (req, res) => {
  if (verifyWebhook(req)) {
    // Coding calling
    authorizationSuccessful();
    console.log(JSON.parse(req.body).head_commit.modified);
    let commitInfor = JSON.parse(req.body).head_commit
    console.log('Modified Author:'+commitInfor.author.name);
    console.log('Modified Author Email:'+commitInfor.author.email);
    for(let i=0;i<commitInfor.modified.length;i++){
      console.log('Modified File:'+commitInfor.modified[i]);
    }

    request.post({url:'http://10.150.253.19:8080', form:{
      "req": req,
    }}, function(error, response, body) {
      console.log(error,response,body)
    })

    res.writeHead(200, { 'Content-Type' : 'text/plain' });
    res.end('Thanks Coding <3');
  } else {
    // Someone else calling
    notAuthorized(req, res);
  }
});

app.all('*', notAuthorized); // Only webhook requests allowed at this address

app.listen(3000);

console.log('Webhook service running at http://localhost:3000');