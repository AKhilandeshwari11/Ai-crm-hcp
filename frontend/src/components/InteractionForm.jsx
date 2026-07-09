import { useState } from "react";
import axios from "axios";

function InteractionForm() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialty: "",
    hospital: "",
    location: "",
    notes: ""
  });


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const saveInteraction = async () => {

    try {

      const response = await axios.post(
        "http://127.0.0.1:8000/hcp",
        formData
      );

      alert(response.data.message);

      setFormData({
        name: "",
        email: "",
        specialty: "",
        hospital: "",
        location: "",
        notes: ""
      });

    } catch (error) {

      console.log(error);
      alert("Failed to save HCP data");

    }
  };


  return (
    <div className="h-full border rounded-lg p-4">

      <h2 className="text-xl font-bold mb-4">
        HCP Interaction Form 📋
      </h2>


      <div className="space-y-3">

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="HCP Name"
          className="w-full border rounded p-2"
        />


        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border rounded p-2"
        />


        <input
          type="text"
          name="specialty"
          value={formData.specialty}
          onChange={handleChange}
          placeholder="Specialty"
          className="w-full border rounded p-2"
        />


        <input
          type="text"
          name="hospital"
          value={formData.hospital}
          onChange={handleChange}
          placeholder="Hospital"
          className="w-full border rounded p-2"
        />


        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full border rounded p-2"
        />


        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Interaction Notes"
          className="w-full border rounded p-2 h-32"
        />


        <button
          onClick={saveInteraction}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save HCP
        </button>

      </div>

    </div>
  );
}

export default InteractionForm;