const Services = require('../models/Services');
const BaseResponse = require('../utiliy/BaseResponse');

exports.findAllServices = (req,res) => {
   
    if(req.params.id){
        Services.findById(req.params.id,{ _id : 0 , __v : 0}).then(user =>{
                res.status(200).json(BaseResponse.success("OK",user,res.statusCode));
            });
    }else{
        res.status(500).json(BaseResponse.error('Please provide valid params '+err,res.statusCode));
    }
}

exports.registerService = (req, res) => {
    Services.create({
        "name": req.body.name,
        "address": req.body.address,
        "city": req.body.city,
        "category": req.body.category,
        "price": req.body.price,
        "categoryId": req.body.categoryId,
        "imgUrl": req.file.cloudStoragePublicUrl
    },function(err,data){
        if (err) return res.status(500).json(BaseResponse.error('Error on the server. '+err,res.statusCode));
        res.status(200).json(BaseResponse.success("OK",data,res.statusCode));
    });
}