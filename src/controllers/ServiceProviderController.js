const ServiceProviderUser = require('../models/ServiceProviderUser');
const jwt = require('jsonwebtoken') // used to create, sign, and verify tokens
const bcrypt = require('bcryptjs')
const config = require('../config/config.json') // get config file
const signale = require('signale')
const VenderWallet = require('../models/VenderWallet');
const { await } = require('signale');
const BaseResponse = require('../utiliy/BaseResponse');
const VenderNotification = require('../models/VenderNotificationHistory');
const VenderCategory = require('../models/VenderCategory');
var payloadChecker = require('payload-validator');
const PayloadSchema = require('../utiliy/PayloadValidationSchema');
const Appointment = require('../models/Appointment');

exports.save = async (req, res) => {

  signale.success('Inside ServiceProviderController SAVE() method');
  var result = payloadChecker.validator(req.body, PayloadSchema.venderPayloadValidation, ["name", "address","city","phoneNo","password","category","lng","lat","role"], false);
   if(result.success){
        ServiceProviderUser.create({
            name: req.body.name,
            address: req.body.address,
            city: req.body.city,
            phoneNo: req.body.phoneNo,
            password: req.body.password,
            category: req.body.category,
            role: req.body.role,
            point: {
              type: 'Point',
              coordinates: [Number(req.body.lng), Number(req.body.lat)]
            }
          },
            function (err, user) {
              console.log('Error msg :' + err);
              if (err) return res.status(500).json(BaseResponse.error('Try with different user and after some time ', res.statusCode));
              const eWallet = new VenderWallet({ 'userAmount': 20, 'operation': 'DEPOSIT', 'serviceProviderUser': user._id.toString() });
              eWallet.save();
              res.status(200).send(user)
            });
      }else{
        signale.error('Inside ServiceProviderController SAVE() validationFailed');
        res.status(404).json(BaseResponse.error(result.response.errorMessage, res.statusCode));
      }
}

exports.serviceProviderLoginData = async (req, res) => {

  signale.success('Inside ServiceProviderController loginData() method');
  var result = payloadChecker.validator(req.body, PayloadSchema.loginExpectedPayload, ["phoneNo", "password"], false);
  if (result.success) {
    ServiceProviderUser.findOne({ phoneNo: req.body.phoneNo, password: req.body.password }, { __v: 0 }, function (err, user) {
      if (err) return res.status(500).send('Error on the server.')
      if (!user) return res.status(404).json(BaseResponse.error("No user found.", res.statusCode));

      // return the information including token as JSON
      const token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });

      // return the information including token as JSON
      res.status(200).send({ data: user, token: token });
    })
  } else {
    signale.success('Inside ServiceProviderController loginData() validationFailed');
    res.status(404).json(BaseResponse.error(result.response.errorMessage, res.statusCode));
  }
};

exports.findAllNotificationList = async (req, res) => {

  if (req.query.venderId) {
    signale.success('Inside ServiceProviderController findAllNotificationList() method :' + req.query.venderId);
    VenderNotification.find({ 'venderId': req.query.venderId }, { __v: 0 }, function (err, notifications) {
      if (err) return res.status(500).send('Error on the server.')
      if (!notifications) return res.status(200).json(BaseResponse.success("No user found.", res.statusCode));
      res.status(200).send(BaseResponse.success("OK", notifications, res.statusCode));
    });
  } else {
    res.status(400).json(BaseResponse.success("Please provide userId", res.statusCode));
  }
}

exports.findAllData = async (req, res) => {

  signale.success('Inside ServiceProviderController loginData() method');
  const servcieProvider = ServiceProviderUser.find({}, { _id: 0, __v: 0 }).then(user => {
    res.send(user);
  });
  console.log(servcieProvider);
}

exports.updateWalletAmount = async (req, res) => {

  signale.success('Inside ServiceProviderController updateWalletAmount() method');
    try {
        VenderWallet.findOneAndUpdate({ "serviceProviderUser": req.body.id }, { $inc: { userAmount: req.body.amount } }, function(err,uWallet){
          if (err) return res.status(500).send('Error on the server.'+err)
          if (!uWallet) return res.status(200).json(BaseResponse.success("No user found.", res.statusCode));
          var amount = parseInt(uWallet.userAmount);
          amount = amount + parseInt(req.body.amount);
          uWallet.userAmount = amount;
          res.status(200).send(BaseResponse.success("OK", uWallet, res.statusCode));
        });
      //  res.status(200).send(BaseResponse.success("OK", 'Wallet amount updated', res.statusCode));
    } catch (error) {
      res.status(400).json(BaseResponse.error(error, res.statusCode));
    }
 }

exports.walletAmount = async (req, res) => {
  signale.success('Inside ServiceProviderController walletAmount() method');
  if (req.query.venderId) {
   
    VenderWallet.findOne({ "serviceProviderUser": req.query.venderId }, { _id: 0, operation: 0, __v: 0, serviceProviderUser: 0 }, function (err, eWallet) {
      if (err) return res.status(500).send('Error on the server.')
      if (!eWallet) return res.status(400).json(BaseResponse.success("No user found.", res.statusCode));
      res.status(200).send(BaseResponse.success("OK", eWallet, res.statusCode));
    });
  } else {
    res.status(400).json(BaseResponse.success("Please provide valid payload data", res.statusCode));
  }
}

exports.findAllCategories = async (req, res) => {
  signale.success('Inside ServiceProviderController findAllCategories() method');
  VenderCategory.find(function (err, categories) {
    if (err) return res.status(500).send('Error on the server.')
    if (!categories) return res.status(400).json(BaseResponse.success("No user found.", res.statusCode));
    res.status(200).json(BaseResponse.success("OK", categories, res.statusCode));
  });
}

exports.saveCategory = async (req, res) => {
  signale.success('Inside ServiceProviderController saveCategory() method');
  VenderCategory.create(req.body, function (err, data) {
    if (err) return res.status(500).send('Error on the server.')
    if (!data) return res.status(400).json(BaseResponse.success("No user found.", res.statusCode));
    res.status(200).json(BaseResponse.success("OK", data, res.statusCode));
  });
}

exports.notificationAcceptOrReject = async (req, res) => {

   signale.success('Inside ServiceProviderController notificationAcceptOrReject() method :'+req.query.appoinmentId);
    Appointment.findById(req.query.appoinmentId,function(err,appointment){
     
      if (err) return res.status(500).send('Error on the server.')
      if (!appointment) return res.status(400).json(BaseResponse.success("No Appointment found.", res.statusCode));
      
      if(appointment.status.toString().trim() === "PENDING"){
        Appointment.findByIdAndUpdate(req.query.appoinmentId,{"status":"ACCEPT"},function(err,appointmentUpdate){
          if (err) return res.status(500).send('Error on the server.')
        });
        signale.success('PENDING :'+appointment);
        VenderNotification.findOneAndUpdate({ "appoinmentId": appointment._id.toString(), "venderId":'101' },{"status":"ACCEPT"},function(err,notificationData){
          if (err) return res.status(500).send('Error on the server.')
      if (!notificationData) return res.status(400).json(BaseResponse.success(notificationData, res.statusCode));
           signale.success('FOUND NotificationData :'+notificationData);
           res.status(200).json(BaseResponse.success("OK", {'data':'ACCEPTED TASK'}, res.statusCode));
        });  
      }else{
        signale.success('NOT FOUND :'+appointment);
        res.status(200).json(BaseResponse.success("OK", {'data':'ALREADY ACCEPTED'}, res.statusCode));
      }
      //
    });
 // Appointment.findOne({ "serviceProviderUser": req.query.venderId });

}