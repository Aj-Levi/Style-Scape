import mongoose from "mongoose";

const ConnectDB = async() => {
    try {
        const mongoUri = process.env.MONGO_URI as string;
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