import ConnectDB from "@/lib/connectDB";
import Category from "@/lib/models/Category";
import { CategoryInterface } from "@/Interfaces";

export async function GET() {
  try {
    await ConnectDB();
    const allCategories: CategoryInterface[] = await Category.find({});
    return allCategories ? Response.json(allCategories) : Response.json([]);
  } catch (err) {
    console.error("some error occured while getting all the Categories");
    return new Response("some error occured while getting all the Categories", {
      status: 500,
    });
  }
}

export async function POST(Req: Request) {
  const body = await Req.json();
  const {name, isfeatured, image, description, metatitle, metadesc, metakeywords} = body;

  await ConnectDB();

  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    return Response.json({ success: false, message: "This Category Already Exists" });
  }

  await Category.create({name, isfeatured, image, description, metatitle, metadesc, metakeywords});
  console.log("------ Category registered successfully ------");

  return Response.json({ success: true, message: "Registered Successfully" });
}
