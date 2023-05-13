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
  const apiUrl = `${stringData.split("?")[0]}?__a=1&__d=dis`;
  console.log("API: " + apiUrl);

  try {
    const axiosConfig = {
      headers: {
        "User-Agent": "PostmanRuntime/7.32.2",
        Cookie:
          "csrftoken=isXlAfB09td1dnXsYc8VQBuRjhicl0VV; ig_did=62B29824-9137-4F24-988E-11DD63E57059; ig_nrcb=1; mid=ZChA2wAEAAH8rXmBOv13EVlz6Hc_",
      },
    };
    const response = await axios.get(apiUrl, axiosConfig);
    console.log(response);
    const post = response.data.graphql.shortcode_media;
    const urlList = [];

    if (post.is_video) {
      urlList.push(post.video_url);
    } else if (post.edge_sidecar_to_children) {
      const edges = post.edge_sidecar_to_children.edges;
      edges.forEach((edge) => {
        if (edge.node.is_video) {
          urlList.push(edge.node.video_url);
        } else {
          urlList.push(edge.node.display_url);
        }
      });
    } else {
      urlList.push(post.display_url);
    }

    res.send({ message: "Success", url_list: urlList });
  } catch (err) {
    console.log(err);
    res.send({ message: err.message, url_list: [] });
  }
});

// app.get("/social/insta", async (req, res) => {
//   let stringData = req.query.stringData;
//   if (!stringData) {
//     res.status(400).send("stringData parameter is missing");
//     return;
//   }
//   const requ = {
//     url: stringData,
//   };
//   try {
//     // const url = req.body.url;
//     if (stringData[8] === "i") {
//       stringData = stringData.replace("instagram.com", "www.instagram.com");
//     }
//     console.log(stringData.split("/"));
//     console.log(stringData.split("/")[5]);
//     const response = await axios.post(
//       stringData.split("/")[4]
//         ? "https://dowmate.com/api/allinone/"
//         : "https://dowmate.com/api/instadp/",
//       requ
//     );
//     console.log(response.data);
//     const arrayList = [];
//     if (stringData.split("/")[4]) {
//       if (response.data.data.Type.includes("Carousel")) {
//         console.log(response.data.data.media);
//         response.data.data.media.map((item, indx) => {
//           arrayList.push(item);
//         });
//       } else {
//         arrayList.push(response.data.data.media);
//       }
//     } else {
//       arrayList.push(response.data.img);
//     }
//     console.log(arrayList);
//     res.send({ url_list: arrayList });
//   } catch (err) {
//     res.send({ message: err });
//   }
// });

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
