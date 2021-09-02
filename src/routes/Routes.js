const express = require('express');
const serviceProvider = require('../controllers/ServiceProviderController');
const userController = require('../controllers/UserController');
const serviceController = require('../controllers/ServiceController');
const VerifyToken = require('../services/VerifyToken')
const notificationCotroller = require('../controllers/VenderNotificationController');
const route = express.Router()


//VENDER END-POINTS
route.post('/services-providers/',serviceProvider.save);
route.get('/services-providers/',VerifyToken, serviceProvider.findAllData);
route.post('/services-providers/login',serviceProvider.serviceProviderLoginData);
route.get('/services-providers/notification',serviceProvider.findAllNotificationList);
route.get('/services-providers/categories',serviceProvider.findAllCategories);
route.post('/services-providers/categories',serviceProvider.saveCategory);
route.post('/services-providers/updateWallet',serviceProvider.updateWalletAmount);
route.get('/services-providers/wallet',serviceProvider.walletAmount);
route.get('/services-providers/notification/accept',serviceProvider.notificationAcceptOrReject);

//USER END-POINTS
route.post('/users/', userController.save);
route.get('/users',VerifyToken, userController.findNearByUser);
route.post('/users/login',userController.userLoginData);
route.put('/users/:id',VerifyToken, userController.updateUserData);
route.get('/services',VerifyToken, serviceController.findAllServices);


//NOTIFICATION END-POINTS
route.post('/notification',notificationCotroller.sendNotification);
route.get('/services-providers/notifications/:venderId',notificationCotroller.findUserNotificationHistoryByVenderId);


module.exports = route