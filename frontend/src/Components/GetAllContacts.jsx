import React, { useEffect, useState } from "react";

export default function GetAllContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const options = [
    { value: "est", label: "As a customer" },
    { value: "cst", label: "As an employer" },
    { value: "mst", label: "Become a new employer" },
    { value: "bst", label: "Become a third-party investor" },
    { value: "ast", label: "None" },
  ];

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/contacts");
        const data = await res.json();

        console.log("Response from API:", data); // Log the data for debugging

        if (res.ok) {
          // Check if the response contains a 'contacts' property and is an array
          if (Array.isArray(data.contacts)) {
            setContacts(data.contacts);
          } else {
            console.error(
              "Expected 'contacts' to be an array, but got:",
              data.contacts
            );
          }
        } else {
          console.error("Error fetching contacts:", data.message);
        }
      } catch (err) {
        console.error("Fetch failed:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleDelete = async (contactId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/contacts/${contactId}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        setContacts(contacts.filter((contact) => contact._id !== contactId));
        console.log("Contact deleted successfully.");
      } else {
        const data = await res.json();
        console.error("Error deleting contact:", data.message);
      }
    } catch (err) {
      console.error("Delete failed:", err.message);
    }
  };

  return (
    <div className="p-10 text-white ">
      <h1 className="mb-6 text-4xl font-bold">All Comments</h1>

      {loading ? (
        <p className="text-white/70">Loading contacts...</p>
      ) : contacts.length === 0 ? (
        <p className="text-white/70">No contacts found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {contacts.map((contact) => (
            <div
              key={contact._id}
              className="p-5 bg-gray-800 border border-white/20 rounded-xl"
            >
              <h2 className="text-xl font-semibold">
                {contact.firstName} {contact.lastName}
              </h2>
              <p className="mt-1 text-white/70">
                <strong>Email:</strong> {contact.email}
              </p>
              <p className="text-white/70">
                <strong>Mobile:</strong> {contact.contactNumber}
              </p>
              <p className="text-white/70">
                <strong>Service Type:</strong>
                {
                  // Find the label based on the serviceType value
                  options.find((option) => option.value === contact.serviceType)
                    ?.label || "Unknown"
                }
              </p>

              <p className="mt-2 text-white/70">
                <strong>Message:</strong>
                <br /> {contact.comment}
              </p>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(contact._id)}
                className="p-2 mt-4 text-white bg-red-600 rounded-xl hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
}
