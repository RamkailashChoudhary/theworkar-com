const mongoose = require("mongoose")


const operations = ['DEPOSIT', 'WITHDRAWAL', 'TRANSFER'];

const schema = mongoose.Schema({

    userAmount: {
       type: Number,
       default: 20
    },
    operation: {
        type: String,
        required: true,
        enum: operations,
      },
    cardNumber:{
      type: String
    },
    cardHolderName:{
      type: String
    },
    cardExpData:{
      type: String
    },
    serviceProviderUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceProvider",
        required: true
      }  
},{
    timestamps: true,
})

module.exports = mongoose.model("VenderWallet", schema)