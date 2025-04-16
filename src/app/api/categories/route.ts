import ConnectDB from "@/lib/connectDB";
import Category from "@/lib/models/Category";
import { CategoryInterface } from "@/Interfaces";
import { getSession } from "@/lib/getSession";

export async function GET() {
  try {
    await ConnectDB();
    const allCategories: CategoryInterface[] = await Category.find({});
    return allCategories ? Response.json(allCategories, {status: 200}) : Response.json([], {status: 200});
  } catch (err) {
    console.error("some error occured while getting all the Categories");
    return Response.json("some error occured while getting all the Categories", {
      status: 500,
    });
  }
}

export async function POST(Req: Request) {
  const session = await getSession();
  if (!session?.user) {
    return Response.json(
      "An active admin session is required",
      { status: 400 }
    );
  }

  if (session.user.role === "user") {
    return Response.json(
      "Access Denied",
      { status: 400 }
    );
  }

  const body = await Req.json();
  const {
    name,
    isfeatured,
    image,
    description,
    metatitle,
    metadesc,
    metakeywords,
  } = body;

  await ConnectDB();

  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    return Response.json("This Category Already Exists", {status: 500});
  }

  await Category.create({
    name,
    isfeatured,
    image,
    description,
    metatitle,
    metadesc,
    metakeywords,
  });

  return Response.json({message: "Registered Successfully" } ,{status: 200} );
}
