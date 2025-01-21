const Product = require('../models/productModel');

// app.post('/product',

const createProduct = async (req, res) => {
    try {
        const createdProduct = await Product.create(req.body);
        res.status(200).json(createdProduct);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};




module.exports={
    createProduct
}