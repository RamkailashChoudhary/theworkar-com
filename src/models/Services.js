const mongoose = require("mongoose")

const schema = mongoose.Schema({
	name:{
        type : String,
        require : true
    },
	address: String,
    city: String,
    category: String,
    price: Number,
    imgUrl: String,
    categoryId: String,
},{
    timestamps: true,
})

module.exports = mongoose.model("Service", schema)