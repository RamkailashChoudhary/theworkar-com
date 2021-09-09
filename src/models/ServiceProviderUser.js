const mongoose = require("mongoose")
const Role = require('./Role');
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
    role: {
        type: String,
        default: Role.User
    }
},{
    timestamps: true,
})

module.exports = mongoose.model("ServiceProvider", schema)