const mongoose = require("mongoose");

const searchSchema = new mongoose.Schema(
    {
        name: String,
        count:Number
    }
)


const search_info = mongoose.model("search_info",searchSchema);

module.exports = search_info;