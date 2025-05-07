// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // Mongoose 6 doesn't need these options anymore, but good to know:
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true, // if using older mongoose
            // useFindAndModify: false // if using older mongoose
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;