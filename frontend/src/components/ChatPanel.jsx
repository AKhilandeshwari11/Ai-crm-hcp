import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateForm } from "../slices/workflowSlice";


function ChatPanel() {

  const [message, setMessage] = useState("");

  const [chat, setChat] = useState([
    {
      sender: "AI",
      text: "Hello! How can I help you today?"
    }
  ]);


  const dispatch = useDispatch();



  const sendMessage = async () => {

    console.log("Send button clicked");


    if (!message.trim()) return;


    const userMessage = message;


    setChat((prev) => [
      ...prev,
      {
        sender: "User",
        text: userMessage
      }
    ]);


    setMessage("");



    try {


      // AI Chat response

      const response = await fetch(
        "http://127.0.0.1:8000/chat",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            message: userMessage
          })
        }
      );


      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();



      setChat((prev) => [
        ...prev,
        {
          sender: "AI",
          text: data.response
        }
      ]);



      // Extract form data automatically

      const extractResponse = await fetch(
        "http://127.0.0.1:8000/extract-form",
        {
          method:"POST",

          headers:{
            "Content-Type":"application/json"
          },

          body:JSON.stringify({
            message:userMessage
          })

        }
      );



      const extractedData = await extractResponse.json();



      if (extractedData.data) {
        try {
          const cleaned = extractedData.data
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();
          const formData = JSON.parse(cleaned);
          dispatch(updateForm(formData));
        } catch (parseError) {
          console.warn("Form extract parse failed:", parseError);
        }
      }



    } catch(error) {


      console.error(
        "Fetch Error:",
        error
      );


      setChat((prev) => [
        ...prev,
        {
          sender: "AI",
          text: "Backend connection failed."
        }
      ]);

    }

  };



  return (

    <div className="h-full border rounded-lg p-4 flex flex-col">


      <h2 className="text-xl font-bold mb-4">

        AI Chat Assistant 🤖

      </h2>



      <div className="flex-1 border rounded p-3 mb-3 overflow-y-auto">


        {chat.map((item, index) => (

          <p key={index} className="mb-2">

            <b>{item.sender}:</b> {item.text}

          </p>

        ))}


      </div>




      <div className="flex gap-2">


        <input

          type="text"

          value={message}

          onChange={(e)=>setMessage(e.target.value)}

          onKeyDown={(e)=>e.key==="Enter" && sendMessage()}

          placeholder="Type your message..."

          className="flex-1 border rounded p-2"

        />



        <button

          onClick={sendMessage}

          className="bg-black text-white px-4 rounded"

        >

          Send

        </button>


      </div>


    </div>

  );

}


export default ChatPanel;