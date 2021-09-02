const mongoose = require("mongoose")

const schema = mongoose.Schema({
	name:{
        type : String,
        require : true
    },
	address: String,
    city: String,
    phoneNo: {
        type: Number,
        unique: true,
        required: true,
        trim: true
    },
    password: String,
    category: String,
    deviceId: String,
    point: Object
},{
    timestamps: true,
})

module.exports = mongoose.model("User", schema)