const mongoose = require("mongoose")
const Role = require('./Role');
const schema = mongoose.Schema({
    userId: String,
    userName: String,
    userPhone: Number,
    category: String,
    point: Object,
    orderDate: Date, 
    amount: Number,
    address: String,
    status: String,
    point: Object,
    role: {
        type: String,
        default: Role.User
    }
},{
    timestamps: true,
})

module.exports = mongoose.model("Appointment", schema)