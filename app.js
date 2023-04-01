const express = require("express");
const http = require("http");
const https = require("https");
const app = express();
const instagramGetUrl = require("instagram-url-direct");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/media", async (req, res) => {
  try {
    const response = await instagramGetUrl(req.body.url);
    res.send(response);
  } catch (err) {
    res.send({ message: err });
  }
});

app.get("/social/insta", async (req, res) => {
  const stringData = req.query.stringData;
  if (!stringData) {
    res.status(400).send("stringData parameter is missing");
    return;
  }
  const requ = {
    url: stringData,
  };
  try {
    // const url = req.body.url;
    const response = await axios.post(
      "https://dowmate.com/api/allinone/",
      requ
    );
    console.log(response.data);
    res.send(response.data);
  } catch (err) {
    res.send({ message: err });
  }
});

app.get("/social/insta/media", async (req, res) => {
  const mediaUrl = req.query.mediaUrl;
  if (!mediaUrl) {
    res.status(400).send("mediaUrl parameter is missing");
    return;
  }

  console.log(mediaUrl);

  const protocol = mediaUrl.startsWith("https") ? https : http;
  protocol.get(mediaUrl, (resp) => {
    const contentType = resp.headers["content-type"];
    res.setHeader("Content-Type", contentType);
    resp.pipe(res);
  });
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
