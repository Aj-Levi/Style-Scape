import ConnectDB from "@/lib/connectDB";
import User from "@/lib/models/User";
import { UserInterface } from "@/Interfaces";

export async function GET() {
    try {
        await ConnectDB();
        const allusers: UserInterface[] = await User.find({});
        return allusers? Response.json(allusers):Response.json([]);
    } catch (err) {
        console.error("some error occured while getting all the users");
        return new Response("some error occured while getting all the users", {status: 404})
    }
}