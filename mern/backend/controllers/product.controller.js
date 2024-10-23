import mongoose from "mongoose";
import Product from "../models/product.model.js";

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({success: true, data: products});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

export const createProduct = async (req, res) => {
    const product = req.body;
    if(!product.name || !product.price || !product.image){
        return res.status(400).json({sucess: false, message: "Please provide name, price and image"});
    }

    const newProduct = new Product(product);

    try {
        await newProduct.save();
        res.status(201).json({success: true, product: newProduct});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

export const updateProduct = async (req, res) => {
    const {id} = req.params;
    const product = req.body;
    if (mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({success: false, message: "Invalid product id"});
    }
    try{
        const updatedProduct = await Product.findByIdAndUpdate(id, product, {new: true});
        res.status(200).json({success: true, product: updatedProduct});
    }catch(error){
        console.error(error.message);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

export const deleteProduct  =  async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if(deletedProduct){
        return res.status(200).json({success: true, message: "Product deleted successfully"});
        }
        res.status(404).json({success: false, message: "Product not found"});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}
