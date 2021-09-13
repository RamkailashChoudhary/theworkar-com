const signale = require('signale')
const Appointment = require('../models/Appointment');
const PayloadSchema = require('../utiliy/PayloadValidationSchema');
const BaseResponse = require('../utiliy/BaseResponse');
var payloadChecker = require('payload-validator');
const ServiceProviderUser = require('../models/ServiceProviderUser');
var FCM = require('fcm-node');
var serverKey = 'AAAAUgL_YSw:APA91bGZcssYDFmO4X4WDUyIbPjk3VSHGAyUaOrN74IVVT0pZQIVaoo0Q2NbdicpKPejn8ixWVTsJt2rRy3bpGWc7tFsF-J2XWwu1jI5yY0LpRtqU5ml18_Sg52DN1g1KqtCaq5IQY8o'; // put your server key here
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
        Appointment.create({
                userName: req.body.userName,
                userPhone: req.body.userPhone,
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
                res.status(200).json(BaseResponse.success("OK",appointment,res.statusCode));
            });
        }else{
            signale.success('Inside AppoinmentController adminCreateAppointment() method validationFailed');
            res.status(400).json(BaseResponse.error('Please send a valid payload data'+err,res.statusCode));
        }
}

exports.findNearByVender = async (req, res) => {

    signale.success('Inside AppoinmentController findNearByVender() method validationFailed');
    const lat = parseFloat(req.query.lat)
    const lng = parseFloat(req.query.lng)
    const dist = parseInt(req.query.distance)
     if (lat && lng && dist) {
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
         },{ _id : 0 , __v : 0}).exec(function (err, stores) {
           if (err) {
             signale.success('Inside AppoinmentController findNearByVender() method :'+err);
             return res.send({ error: err });
           } else {
            return res.status(200).json(BaseResponse.success("OK",stores,res.statusCode));
           }
         })
       } else {
         signale.success('Inside AppoinmentController findNearByVender() method validationFailed');
         return res.send({ error: 'I parametri sono obbligatori'})
       }
}

exports.assignAppointmentToVender = async (req, res) => {
  signale.success('Inside AppoinmentController assignAppointmentToVender() method');
  var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
       registration_ids: ['ffDvDsC4LBo:APA91bEp46BkAuoTpTqCBuWKic2AbYHcKonLyAjMlCYgTQxATmeq4z_3sET7OAqRuZ_NjsNeDzuAordv56Yn3GIa2XYQNWwo9Uwp9Pm44UX5FNLae1NhojGO52o6DJbZL11lLLK9xo0E',
      'cZ_8lPdQ2hY:APA91bElUrkWEM61SQHPuBg6l4ZfHschUBYEcghHSWQu86Fvk28Vpgm-UFcftcYZUFQWC-KRiM2Ipw2e-dXGSTlgYlRbu9T_ygOX7FuDKCnaXyMjm8-sOcLnknpFeMcbXFSeNtSql33e'], 
        
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
        } else {
          res
            console.log("Successfully sent with response: ", response);
            return res.status(200).json(BaseResponse.success("OK",response,res.statusCode));
        }
    });
}

