
//VENDER PAYLOAD VALIDATION
exports.loginExpectedPayload = {
    "phoneNo": 1234,
    "password": "",
};

exports.validateVenderId = {
    "venderId": ""
}

exports.acceptNotification = {
    venderId: "",
        id: "",
    status:  ""
}

exports.venderPayloadValidation = {
    "name": "",
    "address": "",
    "city": "",
    "phoneNo": 1234,
    "password": "",
    "category": "",
    "lng": 123.4,
    "lat": 123.4,
    "role": "",
    "categoryId": ""
}

exports.adminCreateAppointmentPayloadValidation = {
    "userName": "",
    "userPhone": 12344,
    "category": "",
    "scheduleDate": "",
    "address": "",
    "lng": 12.45345,
    "lat": 13.543534,
    "status": ""
}

exports.nearByVenderPayloadValidation = {
    
        "lat":28.4595,
      "lng":76.0266,
      "distance":500000,
      "role":"",
      "category":""
    
}