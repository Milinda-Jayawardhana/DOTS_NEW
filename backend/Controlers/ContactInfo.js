const ContactInfo = require("../Model/ContactInfo");

// Get contact info
exports.getContactInfo = async (req, res) => {
  try {
    let info = await ContactInfo.findOne();
    if (!info) {
      // Create default if not exists
      info = await ContactInfo.create({
        location: "Boralegamuwa, Colombo",
        phone: "+94 71 550 8827",
        email: "dotsshirt@gmail.com",
      });
    }
    res.json({ success: true, data: info });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update contact info (admin only)
exports.updateContactInfo = async (req, res) => {
  try {
    const { location, phone, email } = req.body;
    const info = await ContactInfo.findOneAndUpdate(
      {},
      { location, phone, email },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: info });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};