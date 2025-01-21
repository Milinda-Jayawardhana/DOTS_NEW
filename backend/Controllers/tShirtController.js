const Tshirt = require('../models/tshirt');

// app.post('/product',

const createTshirt = async (req, res) => {
    try {
        const createTshirt = await Tshirt.create(req.body);
        res.status(200).json(createTshirt);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};




module.exports={
    createTshirt
}