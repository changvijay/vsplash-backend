const { createApi } = require('unsplash-js');
const nodeFetch = require('node-fetch');
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const search_info_model = require('./model/topSearch'); // Rename the imported model

const app = express();
const port = process.env.PORT;
const DBurl = process.env.DBURL;



app.use(cors());

// Connection for database
try {
    mongoose.connect(DBurl)
    console.log("db connected") 
} catch (error) {
    console.log("db connected",error) 
}

async function updateOrCreatesearch_info(name) {
    try {
        // Find the document with the given name
        let searchInfo = await search_info_model.findOne({ name }); // Rename the variable

        if (searchInfo) {
            // If the document exists, increment the count
            searchInfo.count += 1;
        } else {
            // If the document doesn't exist, create a new one
            searchInfo = new search_info_model({ name, count: 1 });
        }

        // Save the updated or new document
        await searchInfo.save();
        console.log(`Search info updated for ${name}`);

    } catch (error) {
        console.error('Error updating search info:', error);
    }
}

app.get('/', async (req, res) => {
    try {
        const searchInfoList = await search_info_model
          .find()
          .sort({ count: -1 })
          .limit(10);
    
          console.log(searchInfoList, "pls")
        res.json(searchInfoList)
        
      } catch (err) {
        console.error("Error fetching search info:", err);
        res.status(500).json({ message: "Internal server error" });
      }

    
})

app.get('/search/:query', async (req, res) => {
    const query = req.params.query || 'lion'; // Default value if query parameter is not provided
    const unsplash = createApi({
        accessKey: process.env.UNSPLASH_ACCESS_KEY,
        fetch: nodeFetch.default,
    });

    try {
        const result = await unsplash.search.getPhotos({
            query: query,
            page: 1,
        });
        
        res.send(result.response);
        updateOrCreatesearch_info(query);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, (error) => {
    if (!error)
        console.log("Server is Successfully Running, and App is listening on port " + port)
    else
        console.log("Error occurred, server can't start", error);
});
