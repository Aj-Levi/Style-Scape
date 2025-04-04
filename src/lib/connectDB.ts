import mongoose from "mongoose";

// connecting to the database
const ConnectDB = async() => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("MONGO_URI environment variable is not defined");
        }
        await mongoose.connect(mongoUri);
        console.log("----------- connected to Db -----------");
    } catch (err: any) {
        console.error("------------ could not connect to Db ----------", err);
        process.exit(1);
    }
}

export default ConnectDB