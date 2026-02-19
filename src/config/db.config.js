const mongoose = require("mongoose");


const connectToDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}${process.env.DB_NAME}`);
        console.log(`Server is Connected to Database ==> ${process.env.DB_NAME}`);

    } catch (error) {
        console.error('Error connecting to database:', error.message);
        process.exit(1)
    }
};

module.exports = connectToDB
