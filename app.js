const { createApi } = require('unsplash-js');
const nodeFetch = require('node-fetch');
const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT;

app.use(cors())

app.get('/', (req, res) => {

    // Sending the response
    res.send('Hello World!')

    // Ending the response 
    res.end()
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
        console.log(result);
        res.send(result.response);
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
}
); 
