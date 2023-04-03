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
    if (stringData[8] === "i") {
      stringData.replace("instagram.com", "www.instagram.com");
    }
    console.log(stringData.split("/"));
    console.log(stringData.split("/")[5]);
    const response = await axios.post(
      stringData.split("/")[4]
        ? "https://dowmate.com/api/allinone/"
        : "https://dowmate.com/api/instadp/",
      requ
    );
    console.log(response.data);
    const arrayList = [];
    if (stringData.split("/")[4]) {
      if (response.data.data.Type.includes("Carousel")) {
        console.log(response.data.data.media);
        response.data.data.media.map((item, indx) => {
          arrayList.push(item);
        });
      } else {
        arrayList.push(response.data.data.media);
      }
    } else {
      arrayList.push(response.data.img);
    }
    console.log(arrayList);
    res.send({ url_list: arrayList });
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
