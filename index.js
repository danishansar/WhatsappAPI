const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
require("dotenv").config();

const cors = require("cors");
const http = require("http");

const app = express();

app.use(bodyParser.json());

const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
io.on("connection", () => {
  console.log("Connected!");
});

const token =
  "EAAEYKeUEL5kBOxOSM1xWi1KJi6LiiaN74CcLT8TXbMfDb6CloCXTwe4Re4EEZAgIabfWpreUopLAwh1BxFed1nKhw1xnvpvgZC5JaRLsZBPZCx2kCDgF26LF4Bh2VymUwCtfvqbbsF5IbnRgnTu8NWc5A1QkU1hEjstOGunpsNOnwOUExIK21A7PpYZAQdCiMIht2N3NwBCEHAFkBNYuj";
const mytoken = "justcheckingwhatsappwebhookapi123"; //danish_token

app.listen(process.env.PORT, () => {
  console.log("Whatsapp API webhook is listening :", process.env.PORT);
});

app.get("/webhook", (req, res) => {
  let mode = req.query["hub.mode"];
  let challange = req.query["hub.challenge"];
  let token = req.query["hub.verify_token"];

  if (mode && token) {
    if (mode === "subscribe" && token === mytoken) {
      res.status(200).send(challange);
    } else {
      res.status(403);
    }
  }
});

app.post("/webhook", (req, res) => {
  let body_param = req.body;

  console.log(JSON.stringify(body_param, null, 2));
  let socket = (i) => {
    io.emit("WhatApp Message", JSON.stringify(body_param, null, 2));
  };
  if (body_param.object) {
    console.log("inside body param");
    if (
      body_param.entry &&
      body_param.entry[0].changes &&
      body_param.entry[0].changes[0].value.messages &&
      body_param.entry[0].changes[0].value.messages[0]
    ) {
      let phon_no_id =
        body_param.entry[0].changes[0].value.metadata.phone_number_id;
      let from = body_param.entry[0].changes[0].value.messages[0].from;
      let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

      console.log("phone number " + phon_no_id);
      console.log("from " + from);
      console.log("boady param " + msg_body);

      request({
        method: "POST",
        url:
          "https://graph.facebook.com/v17.0/" +
          phon_no_id +
          "/messages?access_token=" +
          token,
        data: {
          messaging_product: "whatsapp",
          to: from,
          text: {
            body: "Hi.. I'm Danish ANsari, your message is " + msg_body,
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      });

      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }
});

app.get("/", (req, res) => {
  res.status(200).send("hello this is webhook setup");
});
