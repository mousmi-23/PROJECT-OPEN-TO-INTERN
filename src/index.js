const express = require('express');
var bodyParser = require('body-parser');
const route = require('./routes/route.js');
const mongoose = require('mongoose')
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://Mousmi23:dUdaV8w8MnmYpHwY@cluster0.mkiuo.mongodb.net/group74Database?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
    .then(() => console.log('Mongodb connected successfully'))
    .catch(err => console.log(err))

app.use('/functionup', route);

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});