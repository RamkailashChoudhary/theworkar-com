const Services = require('../models/Services');

exports.findAllServices = (req,res) => {
   
    const mServices = Services.find({},{ _id : 0 , __v : 0}).then(user =>{
        res.send(user);
    });
    console.log(mServices);
}