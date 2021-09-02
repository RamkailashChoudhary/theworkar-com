const User = require('../models/User');
const jwt = require('jsonwebtoken') // used to create, sign, and verify tokens
const bcrypt = require('bcryptjs')
const config = require('../config/config.json') // get config file
const signale = require('signale')
const BaseResponse = require('../utiliy/BaseResponse');
var payloadChecker = require('payload-validator');
const PayloadSchema = require('../utiliy/PayloadValidationSchema');

exports.save = async (req, res)=>{
   signale.success('Inside UserController SAVE() method');
    User.create({
        name: req.body.name,
        phoneNo: req.body.phoneNo,
        password: req.body.password,
        address: req.body.address,
        city: req.body.city,
        category: req.body.category,
        point: {
              type: 'Point',
              coordinates: [Number(req.body.lng), Number(req.body.lat)]
            },
      },
      function (err, user) {
        console.log('Error msg :'+err);
        if (err) return res.status(500).send({'message':'Try with different user and after some time '+err})
        res.status(200).send(user)
      });
}


exports.userLoginData = async (req, res)=>{
  signale.success('Inside UserController loginData() method');
  var result = payloadChecker.validator(req.body, PayloadSchema.loginExpectedPayload, ["phoneNo", "password"], false);
  if(result.success){
    User.findOne({ phoneNo: req.body.phoneNo, password: req.body.password },{ __v : 0}, function (err, user) {
        if (err) {
          signale.error("Error msg :"+err);
          return res.status(500).json(BaseResponse.error('Error on the server.',res.statusCode))
        }
        if (!user) {
          signale.error("Error msg :"+err);
          return res.status(404).json(BaseResponse.error("No user found.", res.statusCode));
        }
        // return the information including token as JSON
        const token = jwt.sign({ id: user._id }, config.secret, {
          expiresIn: 86400 // expires in 24 hours
        })
        //"OK", { data: "Some random data" }, res.statusCode)
        res.status(200).json(BaseResponse.success("OK", {user,token }, res.statusCode));
      })
    } else {
      signale.success('Inside UserController loginData() validationFailed');
      res.status(404).json(BaseResponse.error(result.response.errorMessage, res.statusCode));
    }
}


exports.updateUserData = async (req, res)=>{

   signale.success('Inside UserController updateUserData() method :'+req.params.id);
   // res.status(200).send("Data updated successfuly");
    if(req.params.id){
       
      User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send('There was a problem updating the user.')
        res.status(200).send(user)
      })
    }
}

exports.findNearByUser = async (req, res)=>{

  signale.success('Inside UserController findNearByUser() method :');
  const lat = parseFloat(req.query.lat)
  const lng = parseFloat(req.query.lng)
  const dist = parseInt(req.query.distance)

  /*User.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng, lat],
        },
        distanceField: "dist.distance",
        includeLocs: "dist.location",
        $maxDistance: dist,
        spherical: true,
      },
    },
  ]).project({_id: 0, __v: 0}).then(function(users){
    res.status(200).send(users);
  }).catch(error=>{
    res.status(400).send(error);
  });*/
  if (lat && lng && dist) {
    User.find({
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
        return res.send({ error: err });
      } else {
        return res.send(stores);
      }
    })
  } else {
    return res.send({ error: 'I parametri sono obbligatori'})
  }
   /* User.find({
        point: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(req.query.lng),parseFloat(req.query.lat)]
            },
            $maxDistance: 1000,
            $minDistance: 0
          }
        }
      }).exec(function (err, stores) {
        if (err) {
          return res.send({
            error: err
          })
        } else {
          return res.send(stores);
        }
      });
   User.aggregate([{
        $geoNear:{
             near:
             {type:'point',coordinates:[parseFloat(req.query.lng),parseFloat(req.query.lat)]},
               spherical: true ,distanceField: "dist.calulated"}
             }]).then(function(users){
                    res.status(200).send(users);
        }).catch(err => {
            res.status(400).send(err);
        });  */
}