const signale = require('signale')
const BaseResponse = require('../utiliy/BaseResponse');
const VenderNotificationHistory = require('../models/VenderNotificationHistory');
const User = require('../models/User');
const Appointment = require('../models/Appointment');


exports.sendNotification = (req, res)=>{

    signale.success('Inside VenderNotificationController SAVE() method');
    Appointment.create({
      userId: req.body.userId,
      category: req.body.category,
      scheduleDate: req.body.scheduleDate,
      address: req.body.address,
      point: {
        type: 'Point',
        coordinates: [Number(req.body.lng), Number(req.body.lat)]
      },
      status: 'PENDING'
      
    },function(err,appointment){
      
      if (err) return res.status(500).json(BaseResponse.error('Error on the server. '+err,res.statusCode));
      
      const data = {'venderId':'101','status':'PENDING','appoinmentId':appointment._id.toString(),'address':req.body.address,
        point: {
          type: 'Point',
          coordinates: [Number(req.body.lng), Number(req.body.lat)]
        }
      };
      VenderNotificationHistory.create(data,function(err,docs){
        if (err) return res.status(500).json(BaseResponse.error('Error on the server.',res.statusCode));
        res.status(200).json(BaseResponse.success("OK",docs,res.statusCode));
      });
    });
}


exports.findUserNotificationHistoryByVenderId = (req , res)=> {

  VenderNotificationHistory.find({venderId : req.params.venderId},function(err, users){
    if (err) {
      signale.error("Error msg :"+err);
      return res.status(500).json(BaseResponse.error('Error on the server.',res.statusCode))
    }
    if (!users) {
      signale.error("Error msg :"+err);
      return res.status(404).json(BaseResponse.error("No user found.", res.statusCode));
    }
   
    res.status(200).json(BaseResponse.success("OK", users, res.statusCode));
   });
}

