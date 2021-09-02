const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const morgan = require('morgan');

//const connectDB = require('./dbconnect/DBConnection');
//./routes/Routes
const routersObj = require('./src/routes/Routes');


// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
//setup app & its routes
const app = express();
app.use(cors());

// log requests
app.use(morgan('tiny'));

app.use(express.json());

// use body-parser middleware
//app.use(bodyParser.json());

//connectDB();

app.use('/api/v1/theworkar/',routersObj);
//localDB URL => mongodb://localhost:27017/theworkardb
//Cloud URL => mongodb+srv://theworkardb:theworkardb@theworkardb-cluster.pmuo5.mongodb.net/theworkardb?retryWrites=true&w=majority
mongoose.connect("mongodb+srv://theworkardb:theworkardb@theworkardb-cluster.pmuo5.mongodb.net/theworkardb?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true
,useFindAndModify: false, useCreateIndex: true }).then(() =>{

    app.listen(PORT, () =>{

        console.log(`http server listening at port: ${PORT} `);
    });    
});

module.exports = { app };