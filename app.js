const express = require('express');
const http = require("http");
const https = require("https");
const app = express();
const instagramGetUrl = require("instagram-url-direct");
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/media', async (req, res)=>{
    try{
        const response = await instagramGetUrl(req.body.url);
        res.send(response);
    }catch(err){
        res.send({message: err});
    }
});


app.get("/social/insta", async (req, res) => {
  const stringData = req.query.stringData;
  if (!stringData) {
    res.status(400).send("stringData parameter is missing");
    return;
  }

  const url = `${
    stringData.split("?")[0]
  }?__a=1&__d=dis`;

  const protocol = url.startsWith("https") ? https : http;
  protocol.get(url, (resp) => {
    let data = "";
    resp.on("data", (chunk) => {
      data += chunk;
    });
    resp.on("end", async () => {
      const responseData = JSON.parse(data).graphql.shortcode_media;
      const contentType = responseData.__typename;

      const linkArray = [];

      if (contentType.includes("GraphSidecar")) {
        const edge_length = responseData.edge_sidecar_to_children.edges.length;
        responseData.edge_sidecar_to_children.edges.map((item, indx) => {
          linkArray.push(item.node.display_resources[0].src);
        });
      } else if (contentType.includes("GraphImage")) {
        linkArray.push(responseData.display_resources[0].src);
      } else if (contentType.includes("GraphVideo")) {
        linkArray.push(responseData.video_url);
      }

      res.json({ links: linkArray });
    });
    resp.on("error", (err) => console.log(err));
  });
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

app.listen(port, ()=>{
    console.log('Server is running on port ' + port);
});
