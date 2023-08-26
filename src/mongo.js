const mongoose =  require('mongoose');

const HOST = process.env.MONGODB_HOST || "localhost";
console.log('process.env.MONGODB_HOST - ', HOST);

const uri = `mongodb://127.0.0.1:27017/simple-e-commerce`
const options = {};


const log = (msg) => console.log(msg);

const connectWithDb = () => {
    mongoose.connect(uri, options, (err, db) => {
        if (err) {
            console.error(err);
        }

        else log("database connection established");
    });
};

module.exports = {uri, connectWithDb}
