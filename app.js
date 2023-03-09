const express = require('express');
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

app.listen(port, ()=>{
    console.log('Server is running on port ' + port);
});