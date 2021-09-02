const { MongoClient } = require('mongodb');

const connectDB = async () =>{

    try{

        const uri = "mongodb://localhost:27017/";

        const client = new MongoClient(uri);
        console.log(`MongoDB connected :`);
        return client;
    }catch(error){
        console.error(error);
    }
};

module.exports = connectDB