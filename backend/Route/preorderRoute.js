const express = require('express');
const router = express.Router();
const {
  createPreorder,
  getAllPreorders,
  getPreorderById,
  getUserPreorders
} = require('../Controlers/preorderController');

// Middleware to protect routes


// ========== Routes ========== //

// 🔒 Create a preorder (user must be logged in)
router.post('/order', createPreorder);

// 🔒 Get all preorders (admin use — optionally protect with role check)
router.get('/order', getAllPreorders);

// 🔒 Get preorders for the logged-in user
router.get('/my-orders', getUserPreorders);

// 🔒 Get a specific preorder by its ID
router.get('/order/:id', getPreorderById);

module.exports = router;
