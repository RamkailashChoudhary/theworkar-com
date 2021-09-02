const mongoose = require("mongoose")

const schema = mongoose.Schema({
    name:{
        type : String,
        require : true
    },
    userId: String,
    serviceProviderId: String,
    orderStatus: String,
    point: Object,
    orderDate: Date, 
},{
    timestamps: true,
})

module.exports = mongoose.model("Order", schema)