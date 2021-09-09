const mongoose = require("mongoose")

const schema = mongoose.Schema({
	name:{
        type : String,
        require : true
    },
   parentId : {
       type: String,
       default: "0"
   }
},
{
    timestamps: true,
})

module.exports = mongoose.model("vendercategory", schema)