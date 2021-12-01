const signale = require('signale')
const Appointment = require('../models/Appointment');
const PayloadSchema = require('../utiliy/PayloadValidationSchema');
const BaseResponse = require('../utiliy/BaseResponse');
var payloadChecker = require('payload-validator');
const ServiceProviderUser = require('../models/ServiceProviderUser');
var FCM = require('fcm-node');
const { await } = require('signale');
const User = require('../models/User');
const VenderNotificationHistory = require('../models/VenderNotificationHistory');
var serverKey = 'AAAApP26UXI:APA91bFCLqrCIh11Zr6Re1kKknCHsaQ7W0Cqnp0QfnzMoyIyZUph0tAcg8jsELwXaGEU3r7zuJUZFCzUEqlABtfvpwarqv6gLxzwdqffxHSucUR3wbKvET8qP1n9KbKjFUJdUXuPgEX7'; // put your server key here
var fcm = new FCM(serverKey);

exports.findAllAppointmentList = async (req, res) =>{
    signale.success('Inside AppoinmentController findAllAppointmentList() method');
    Appointment.find(function(err,listOfAppoinment){
        if (err) return res.status(500).send('Error on the server.')
        if (!listOfAppoinment) return res.status(400).json(BaseResponse.success("No Appoinment.", res.statusCode));
        res.status(200).json(BaseResponse.success("OK", listOfAppoinment, res.statusCode));
    });
}

exports.adminCreateAppointment = async (req, res) =>{

    signale.success('Inside AppoinmentController adminCreateAppointment() method');
    var result = payloadChecker.validator(req.body, PayloadSchema.adminCreateAppointmentPayloadValidation, ["userName", "userPhone","category","scheduleDate","address","lng","lat","status"], false);
     if(result.success){

          if(req.body.userId){
                Appointment.create({
                  userId: req.body.userId, userName: req.body.userName, userPhone: req.body.userPhone, category: req.body.category,
                  scheduleDate: req.body.scheduleDate, address: req.body.address,
                  point: {
                    type: 'Point',
                    coordinates: [Number(req.body.lng), Number(req.body.lat)]
                  },
                  status: 'PENDING',
                  role: req.body.role               
                },function(err,appointment){

                    if (err) return res.status(500).json(BaseResponse.error('Error on the server. '+err,res.statusCode));
                    res.status(200).json(BaseResponse.success("OK",appointment,res.statusCode));
                });
          }else{
              User.create({
                name: req.body.userName,
                phoneNo: req.body.userPhone,
                password: '12345',
                address: req.body.address,
                category: req.body.category,
                point: {
                      type: 'Point',
                      coordinates: [Number(req.body.lng), Number(req.body.lat)]
                    },
              },
              function (err, user) {
                console.log('Error msg :'+err);
                if (err) return res.status(500).send({'message':'Try with different user and after some time '+err})

                  Appointment.create({
                    userId: user._id, userName: req.body.userName, userPhone: req.body.userPhone, category: req.body.category,
                    scheduleDate: req.body.scheduleDate, address: req.body.address,
                    point: {
                      type: 'Point',
                      coordinates: [Number(req.body.lng), Number(req.body.lat)]
                    },
                    status: 'PENDING',
                    role: req.body.role               
                  },function(err,appointment){

                      if (err) return res.status(500).json(BaseResponse.error('Error on the server. '+err,res.statusCode));
                      res.status(200).json(BaseResponse.success("OK",appointment,res.statusCode));
                  });
                });
          }
        }else{
            signale.success('Inside AppoinmentController adminCreateAppointment() method validationFailed');
            res.status(400).json(BaseResponse.error('Please send a valid payload data'+err,res.statusCode));
        }
}

exports.findNearByVender = async (req, res) => {

    signale.success('Inside AppoinmentController findNearByVender() method validationFailed');
    var result = payloadChecker.validator(req.body, PayloadSchema.adminCreateAppointmentPayloadValidation, ["lat", "lng","distance","role","category"], false);
    
    if (result.success) {
        const lat = parseFloat(req.body.lat)
        const lng = parseFloat(req.body.lng)
        const dist = parseInt(req.body.distance)
     
         ServiceProviderUser.find({
           point: {
             $near: {
               $geometry: {
                 type: 'Point',
                 coordinates: [lng, lat]
               },
               $maxDistance: dist,
               $minDistance: 0
             }
           }
         },{__v : 0, point : 0, password: 0}).exec(function (err, stores) {
           if (err) {
             signale.success('Inside AppoinmentController findNearByVender() method :'+err);
             return res.send({ error: err });
           } else {
             
             //signale.success('After JSON convert data ='+stores.length);
             Appointment.findById(req.body.appoinmentId,function(err,appointmentData){
              if (err) return res.status(500).send('Error on the server.')
              if (!appointmentData) return res.status(400).json(BaseResponse.success("No Appoinment.", res.statusCode));
                 
                  getVenderListFromNearby(stores,appointmentData);
                  return res.status(200).json(BaseResponse.success("OK",stores,res.statusCode));
             });
           }
         })
       } else {
         signale.success('Inside AppoinmentController findNearByVender() method validationFailed');
         return res.send({ error: 'Inside AppoinmentController findNearByVender() method validationFailed'})
       }
}

exports.assignAppointmentToVender =  (req, res) => {
  signale.success('Inside AppoinmentController assignAppointmentToVender() method');
  signale.success('METHOD START ::');
  getVendersListOfIds(req).then(data =>{

    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)    
      registration_ids: data, 
         
         notification: {
             title: 'Notification', 
             body: 'Nodejs testing purpose' 
         },
         
         data: {  //you can send only notification or only data(or include both)
             my_key: 'my value',
             my_another_key: 'my another value'
         }
     };
     
      fcm.send(message, function(err, response){
          if (err) {
              console.log("Something has gone wrong!"+err);
              return res.status(400).json(BaseResponse.error(''+err,res.statusCode));
          } else {
            res
              console.log("Successfully sent with response: ", response);
              return res.status(200).json(BaseResponse.success("OK",response,res.statusCode));
          }
      });
  });
  signale.success('METHOD END ::');
}

function getVenderListFromNearby(venderList,appointmentData){
   for(i = 0; i < venderList.length; i++ ){
      signale.success('DEVICE TOKEN '+venderList[i].deviceId);
      venderDeviceTokens.push(venderList[i].deviceId); 

      const data = {'venderId':venderList[i]._id,'status':appointmentData.status,'appoinmentId':appointmentData._id.toString(),'address':appointmentData.address,
        point: appointmentData.point
      };
      VenderNotificationHistory.create(data,function(err,docs){
        //if (err) return res.status(500).json(BaseResponse.error('Error on the server.',res.statusCode));
       // res.status(200).json(BaseResponse.success("OK",docs,res.statusCode));
       console.log('PRINT VENDER NOTIFICATION ID :'+docs._id);
      });
   }

  
   var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)    
    registration_ids: venderDeviceTokens, 
       
       notification: {
           title: 'Theworkar.com', 
           body: 'Theworkar.com send data to test'
       },
       
       venderDeviceTokens: {  //you can send only notification or only data(or include both)
           my_key: 'my value',
           my_another_key: 'my another value'
       }
   };
    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!"+err);
            //return res.status(400).json(BaseResponse.error(''+err,res.statusCode));
        } else {
            console.log("Successfully sent with response: ", response);
            //return res.status(200).json(BaseResponse.success("OK",response,res.statusCode));
        }
    });
}

var venderDeviceTokens = [];
async function getVendersListOfIds(req){
   
        for(i=0; i< req.body.venderIds.length; i++) {
         await ServiceProviderUser.findById(req.body.venderIds[i],function(err,venderData){
            if(!err){
             // signale.success('DEVICE TOKEN '+venderData.deviceId);
              //venderDeviceTokens.push(venderData.deviceId);  
             venderDeviceTokens.push('cmfKuA4XS6k:APA91bFH_DZEWXh9rXNX7l1ucizuL--4bHXcEJTEa1pWCQq6b7L4vAHFMa31swOUT0lVZvn-gM9IGEsAGEqTE3Clhfde9AYS82k0OCuUd_k82Dzb43Ka9nGfhrW692h2Ej0_Wc1wU5a_');  
            }
          });
      };
      return venderDeviceTokens;
}

