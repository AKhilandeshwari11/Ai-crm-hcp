import { useState, useEffect } from "react";
import { useSelector } from "react-redux";


function InteractionForm() {


  const workflowData = useSelector(
    (state) => state.workflow
  );


  const [formData, setFormData] = useState({

    name: "",
    email: "",
    notes: ""

  });



  // Chat nundi AI data vachinappudu form update

  useEffect(() => {

    setFormData({

      name: workflowData.name || "",
      email: workflowData.email || "",
      notes: workflowData.notes || ""

    });


  }, [workflowData]);




  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    });

  };




  const saveInteraction = async () => {


    console.log(
      "Interaction Data:",
      formData
    );


    alert(
      "Interaction saved successfully!"
    );


  };




  return (

    <div className="h-full border rounded-lg p-4">


      <h2 className="text-xl font-bold mb-4">

        Customer Interaction Form 📋

      </h2>




      <div className="space-y-3">



        <input

          type="text"

          name="name"

          value={formData.name}

          onChange={handleChange}

          placeholder="Customer Name"

          className="w-full border rounded p-2"

        />



        <input

          type="email"

          name="email"

          value={formData.email}

          onChange={handleChange}

          placeholder="Customer Email"

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

          Save Interaction

        </button>



      </div>


    </div>

  );

}


export default InteractionForm;