import { UpdatedCategoryInterface } from "@/Interfaces";
import ConnectDB from "@/lib/connectDB";
import Category from "@/lib/models/Category";

export async function GET(
  _Req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await ConnectDB();

    const category = await Category.findById(id);

    if(!category) {
      console.error("Category does not exist");
      return new Response("Category does not exist", {status: 500});
    }

    return Response.json(category);

  } catch (err) {
    console.error("some error occured while getting the Category ",err);
    return new Response("some error occured while getting the Category", {
      status: 404,
    });
  }
}

export async function DELETE(
  _Req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await ConnectDB();

    await Category.findByIdAndDelete(id);

    return new Response("Category deleted successfully", { status: 200 });
  } catch (err) {
    console.error("some error occured while deleting the Category ",err);
    return new Response("some error occured while deleting the Category", {
      status: 500,
    });
  }
}

export async function PATCH(
  Req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await Req.json();
    await ConnectDB();
    const category = await Category.findById(id);
    
    if (!Category) {
      return new Response("Category not found", { status: 500 });
    }
    
    let updateData: UpdatedCategoryInterface = {
      name: body?.name || category.name,
      image: body?.image || category.image,
      description: body?.description || category.description,
      metadesc: body?.metadesc || category.metadesc,
      metatitle: body?.metatitle || category.metatitle,
      metakeywords: body?.metakeywords || category.metakeywords,
    };

    if(body?.isfeatured === true || body?.isfeatured === false) {
      updateData.isfeatured = body?.isfeatured;
    }
    
    await Category.updateOne(
      { _id: id },
      { $set: updateData }
    );

    return new Response("Category updated successfully", { status: 200 });
  } catch (err) {
    console.error("some error occured while updating the Category ", err);
    return new Response("some error occured while updating the Category", {
      status: 500,
    });
  }
}
