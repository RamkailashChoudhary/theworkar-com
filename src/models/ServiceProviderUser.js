const mongoose = require("mongoose")

const schema = mongoose.Schema({
	name:{
        type : String,
        require : true
    },
	address: String,
    phoneNo: {
        type: Number,
        unique: true,
        required: true,
        trim: true
    },
    password: String,
    city: String,
    category: String,
    deviceId: String,
    point: Object,
    rateing: {
        type: Number,
        default: 3.5
    },
},{
    timestamps: true,
})

module.exports = mongoose.model("ServiceProvider", schema)