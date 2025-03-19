const Contact = require("../Model/contactUs");

// Get all contact messages
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    if (!contacts.length) {
      return res.status(404).json({ message: "No contact records found" });
    }
    return res.status(200).json({ contacts });
  } catch (err) {
    return res.status(500).json({ message: "An error occurred", error: err });
  }
};

// Get a single contact message by ID
exports.getContactById = async (req, res) => {
  const { id } = req.params;
  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: "Contact record not found" });
    }
    return res.status(200).json({ contact });
  } catch (err) {
    return res.status(500).json({ message: "An error occurred", error: err });
  }
};

// Add a new contact message
exports.addContact = async (req, res) => {
  try {
    const { firstName, lastName, email, contactNumber, serviceType, comment } = req.body;
    const newContact = new Contact({
      firstName,
      lastName,
      email,
      contactNumber,
      serviceType,
      comment,
    });
    await newContact.save();
    res.status(201).json({ message: "Contact message submitted successfully", contact: newContact });
  } catch (error) {
    res.status(400).json({ message: "Failed to submit contact message", error });
  }
};



// Delete a contact message
exports.deleteContact = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedContact = await Contact.findByIdAndDelete(id);
    if (!deletedContact) {
      return res.status(404).json({ message: "Contact record not found or already deleted" });
    }
    return res.status(200).json({ message: "Contact record deleted successfully", contact: deletedContact });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};
