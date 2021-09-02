const mongoose = require("mongoose")

const schema = mongoose.Schema({
    userId: String,
    category: String,
    point: Object,
    orderDate: Date, 
    amount: Number,
    address: String,
    status: String,
    point: Object
},{
    timestamps: true,
})

module.exports = mongoose.model("Appointment", schema)