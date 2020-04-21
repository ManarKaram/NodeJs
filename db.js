const mongoose = require('mongoose');
mongoose.connect(
    "mongodb+srv://userTest:usertest@cluster0-raiix.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
        console.log("db connected")
    }).catch((err) => {
        console.log(err);
    });
module.exports = mongoose;



