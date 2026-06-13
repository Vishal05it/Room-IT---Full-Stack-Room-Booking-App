const mongoose = require("mongoose");
const connectToDB = async () => {
    try {
        if (!process.env.DB_URL) throw new Error(`Database string is missing`);
        await mongoose.connect(process.env.DB_URL);
        console.log(`Connected to DB`);
    } catch (error) {
        console.log(`Error connecting to DB`, error);
        throw error;
    }
}
module.exports = connectToDB;