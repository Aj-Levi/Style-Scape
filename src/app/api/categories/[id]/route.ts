import { UpdatedCategoryInterface } from "@/Interfaces";
import ConnectDB from "@/lib/connectDB";
import { getSession } from "@/lib/getSession";
import Category from "@/lib/models/Category";

export async function GET(
  _Req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await ConnectDB();

    const category = await Category.findById(id);

    if (!category) {
      return Response.json("Category does not exist", { status: 404 });
    }

    return Response.json(category, { status: 200 });
  } catch (err) {
    console.error("some error occured while getting the Category ", err);
    return Response.json("some error occured while getting the Category", {
      status: 500,
    });
  }
}

export async function DELETE(
  _Req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user) {
    return Response.json("An active admin session is required", {
      status: 400,
    });
  }

  if (session.user.role === "user") {
    return Response.json("Access Denied", { status: 400 });
  }

  try {
    const { id } = await params;

    await ConnectDB();

    await Category.findByIdAndDelete(id);

    return Response.json(
      { message: "Category Deleted Successfully" },
      { status: 200 }
    );
  } catch (err) {
    return Response.json("some error occured while deleting the Category", {
      status: 500,
    });
  }
}

export async function PATCH(
  Req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user) {
    return Response.json("An active admin session is required", {
      status: 400,
    });
  }

  if (session.user.role === "user") {
    return Response.json("Access Denied", { status: 400 });
  }

  try {
    const { id } = await params;

    const body = await Req.json();
    await ConnectDB();
    const category = await Category.findById(id);

    if (!Category) {
      return Response.json("Category not found", { status: 404 });
    }

    let updateData: UpdatedCategoryInterface = {
      name: body?.name || category.name,
      image: body?.image || category.image,
      description: body?.description || category.description,
      metadesc: body?.metadesc || category.metadesc,
      metatitle: body?.metatitle || category.metatitle,
      metakeywords: body?.metakeywords || category.metakeywords,
    };

    if (body?.isfeatured === true || body?.isfeatured === false) {
      updateData.isfeatured = body?.isfeatured;
    }

    await Category.updateOne({ _id: id }, { $set: updateData });

    return Response.json(
      { message: "Category Updated Successfully" },
      { status: 200 }
    );
  } catch (err) {
    return Response.json("some error occured while updating the Category", {
      status: 500,
    });
  }
}
