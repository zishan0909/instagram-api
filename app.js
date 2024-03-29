const express = require("express");
const http = require("http");
const https = require("https");
const app = express();
const instagramGetUrl = require("instagram-url-direct");
const cors = require("cors");
const CC = require("currency-converter-lt");
const axios = require("axios");
require("dotenv").config();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

let currencyConverter = new CC();

app.post("/media", async (req, res) => {
  try {
    const response = await instagramGetUrl(req.body.url);
    res.send(response);
  } catch (err) {
    res.send({ message: err });
  }
});

// app.get("/social/insta", async (req, res) => {
//   const stringData = req.query.stringData;
//   if (!stringData) {
//     res.status(400).send("stringData parameter is missing");
//     return;
//   }
//   const apiUrl = "https://igram.live/wp-json/igram/video-data/";
//   const body = { url: stringData, token: "" };
//   try {
//     const response = await axios.post(apiUrl, body);
//     const filteredMedia = response.data.medias.filter(
//       (media) => media.quality !== "480p" && media.quality !== "370p"
//     );
//     const urlList = filteredMedia.map((media) => media.url);
//     res.send({ message: "Success", url_list: urlList });
//   } catch (err) {
//     res.send({ message: err.message, url_list: [] });
//   }
// });

// app.get("/social/insta", async (req, res) => {
//   const stringData = req.query.stringData;
//   if (!stringData) {
//     res.status(400).send("stringData parameter is missing");
//     return;
//   }
//   const apiUrl = `${stringData.split("?")[0]}?__a=1&__d=dis`;
//   console.log("API: " + apiUrl);

//   try {
//     const axiosConfig = {
//       headers: {
//         "User-Agent": "PostmanRuntime/7.32.2",
//         Cookie:
//           "csrftoken=isXlAfB09td1dnXsYc8VQBuRjhicl0VV; ig_did=62B29824-9137-4F24-988E-11DD63E57059; ig_nrcb=1; mid=ZChA2wAEAAH8rXmBOv13EVlz6Hc_",
//       },
//     };
//     const response = await axios.get(apiUrl, axiosConfig);
//     console.log(response);
//     const post = response.data.graphql.shortcode_media;
//     const urlList = [];

//     if (post.is_video) {
//       urlList.push(post.video_url);
//     } else if (post.edge_sidecar_to_children) {
//       const edges = post.edge_sidecar_to_children.edges;
//       edges.forEach((edge) => {
//         if (edge.node.is_video) {
//           urlList.push(edge.node.video_url);
//         } else {
//           urlList.push(edge.node.display_url);
//         }
//       });
//     } else {
//       urlList.push(post.display_url);
//     }

//     res.send({ message: "Success", url_list: urlList });
//   } catch (err) {
//     console.log(err);
//     res.send({ message: err.message, url_list: [] });
//   }
// });

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
//     res.send({ message: "success", url_list: arrayList });
//   } catch (err) {
//     res.send({ message: err, url_list: [] });
//   }
// });
headers = {
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Encoding": "gzip, deflate, br",
  "Accept-Language": "en-US,en;q=0.5",
  Connection: "keep-alive",
  Host: "instasupersave.com",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/113.0",
};

app.get("/social/insta", async (req, res) => {
  let stringData = req.query.stringData;
  if (!stringData) {
    res
      .status(400)
      .send({ message: "stringData parameter is missing", url_list: [] });
    return;
  }
  if (stringData[8] === "i") {
    stringData = stringData.replace("instagram.com", "www.instagram.com");
  }

  if (stringData.includes("stories")) {
    try {
      const response = await axios.get(
        `https://igram.world/api/ig/story?url=${stringData}`,
        (headers = headers)
      );
      const story = response.data.result[0];

      if (story.video_versions) {
        const url =
          // "https://cute-blue-lizard-gear.cyclic.app/social/insta/media?mediaUrl=" +
          story.video_versions[0].url;
        res.send({ message: "success", url_list: [url] });
      } else if (story.image_versions2) {
        const url =
          // "https://cute-blue-lizard-gear.cyclic.app/social/insta/media?mediaUrl=" +
          story.image_versions2.candidates[0].url;
        res.send({ message: "success", url_list: [url] });
      } else {
        res.send({ message: "No media found", url_list: [] });
      }
    } catch (err) {
      res.send({ message: err, url_list: [] });
    }
  } else {
    // const requ = {
    //   url: stringData,
    // };

    // try {
    //   const response = await axios.post(
    //     stringData.split("/")[4]
    //       ? "https://dowmate.com/api/allinone/"
    //       : "https://dowmate.com/api/instadp/",
    //     requ
    //   );

    //   const arrayList = [];
    //   if (stringData.split("/")[4]) {
    //     if (response.data.data.Type.includes("Carousel")) {
    //       response.data.data.media.map((item) => {
    //         arrayList.push(
    //           // "https://cute-blue-lizard-gear.cyclic.app/social/insta/media?mediaUrl=" +
    //           item
    //         );
    //       });
    //     } else {
    //       arrayList.push(
    //         // "https://cute-blue-lizard-gear.cyclic.app/social/insta/media?mediaUrl=" +
    //         response.data.data.media
    //       );
    //     }
    //   } else {
    //     arrayList.push(
    //       // "https://cute-blue-lizard-gear.cyclic.app/social/insta/media?mediaUrl=" +
    //       response.data.img
    //     );
    //   }

    //   res.send({ message: "success", url_list: arrayList });
    // } catch (err) {
    //   res.send({ message: err, url_list: [] });
    // }

    const apiUrl = "https://igram.live/wp-json/igram/video-data/";
    const body = { url: stringData, token: "" };
    try {
      const response = await axios.post(apiUrl, body);
      const filteredMedia = response.data.medias.filter(
        (media) => media.quality === "720p"
      );
      const urlList = filteredMedia.map((media) => media.url);
      const uniqueList = urlList.filter(
        (value, index, array) => array.indexOf(value) === index
      );
      res.send({ message: "Success", url_list: uniqueList });
    } catch (err) {
      res.send({ message: err.message, url_list: [] });
    }
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

app.get("/calculator/currency", async (req, res) => {
  const from_code = req.query.from_code;
  const to_code = req.query.to_code;
  const amount = req.query.amount;
  currencyConverter
    .from(from_code)
    .to(to_code)
    .amount(parseFloat(amount))
    .convert()
    .then((response) => {
      console.log(response); //or do something else

      res.send({ success: true, value: response });
    })
    .catch((err) => {
      res.send({ success: false, value: 0 });
    });
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
