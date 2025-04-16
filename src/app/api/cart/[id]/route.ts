import ConnectDB from "@/lib/connectDB";
import { getSession } from "@/lib/getSession";
import User from "@/lib/models/User";
import Product from "@/lib/models/Product";
import { isValidObjectId } from "mongoose";
import { CartInterface } from "@/Interfaces";

export async function POST(_request: Request, {params}: {params: Promise<{id: string}>}) {
    const session = await getSession();
    if(!session?.user) {
        return Response.json({success: false, message: "Active Session is required"},{status: 400});
    }
    
    try {
        const userId = session.user.id;
        const {id} = await params;
        
        if (!isValidObjectId(id)) {
            return Response.json({success: false, message: "Invalid product ID"}, {status: 400});
        }
        
        await ConnectDB();
        
        // Check if product exists
        const product = await Product.findById(id);
        if (!product) {
            return Response.json({success: false, message: "Product not found"}, {status: 404});
        }
        
        const user = await User.findById(String(userId));
        if (!user) {
            return Response.json({success: false, message: "User not found"}, {status: 404});
        }

        // Initialize cart if it doesn't exist
        if (!user.cartitems) {
            user.cartitems = [];
        }
        
        // Check if product already in cart
        let productFound = false;
        
        if (user.cartitems && user.cartitems.length > 0) {
            for (let item of user.cartitems) {
                if (String(item.product) === id) {
                    // Product already in cart, increase quantity
                    item.quantity += 1;
                    productFound = true;
                    break;
                }
            }
        }
        
        // If product not in cart, add it
        if (!productFound) {
            user.cartitems.push({
                product: id,
                quantity: 1
            });
        }
        
        await user.save();
        
        return Response.json({
            success: true, 
            message: "Product added to cart successfully",
        });
        
    } catch (error) {
        console.error("Error adding product to cart:", error);
        return Response.json({
            success: false, 
            message: "Failed to add product to cart"
        }, {status: 500});
    }
}

export async function DELETE(_request: Request, {params}: {params: Promise<{id: string}>}) {
    const session = await getSession();
    if(!session?.user) {
        return Response.json({success: false, message: "Active Session is required"},{status: 400});
    }
    
    try {
        const userId = session.user.id;
        const {id} = await params;
        
        await ConnectDB();
        
        const user = await User.findById(String(userId));
        if (!user || !user.cartitems) {
            return Response.json({success: false, message: "Cart not found"}, {status: 404});
        }
        
        // Find product in cart
        let itemIndex = user.cartitems.findIndex((item: CartInterface) => String(item.product) === id);
        
        if (itemIndex === -1) {
            return Response.json({success: false, message: "Product not in cart"}, {status: 404});
        }
        
        // If quantity > 1, decrement; otherwise remove item
        if (user.cartitems[itemIndex].quantity > 1) {
            user.cartitems[itemIndex].quantity -= 1;
        } else {
            user.cartitems.splice(itemIndex, 1);
        }
        
        await user.save();
        
        return Response.json({
            success: true, 
            message: "Cart updated successfully",
        });
        
    } catch (error) {
        console.error("Error removing product from cart:", error);
        return Response.json({
            success: false, 
            message: "Failed to update cart"
        }, {status: 500});
    }
}