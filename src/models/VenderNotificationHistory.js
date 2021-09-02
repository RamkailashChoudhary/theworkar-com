const mongoose = require("mongoose")

const schema = mongoose.Schema({

    venderId: {
        type: String,
        required: true,
        trim: true
    },
    appoinmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
        required: true
      },
    status: String,
    category: String,
    address: String,
    point: Object,
},{
    timestamps: true,
})

module.exports = mongoose.model("VenderNotification", schema)