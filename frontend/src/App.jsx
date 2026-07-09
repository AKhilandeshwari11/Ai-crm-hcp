import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setResponse, setLoading } from "./slices/workflowSlice";
import "./App.css";

function App() {
  const dispatch = useDispatch();

  const result = useSelector((state) => state.workflow.response);
  const loading = useSelector((state) => state.workflow.loading);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(setLoading(true));
    dispatch(setResponse(null));

    try {
      const response = await fetch("http://127.0.0.1:8000/ai-workflow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      dispatch(setResponse(data));
    } catch (error) {
      dispatch(
        setResponse({
          error: error.message,
        })
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="container">
      <h1>AI CRM - HCP Workflow</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="HCP Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <textarea
          name="notes"
          placeholder="Interaction Notes"
          value={formData.notes}
          onChange={handleChange}
        />

        <button type="submit">
          {loading ? "Processing..." : "Run AI Workflow"}
        </button>
      </form>

      {result && (
        <div className="result">
          <h2>AI Result</h2>

          <h3>Entities</h3>
          <p>{result.result?.entities?.entities?.join(", ")}</p>

          <h3>Summary</h3>
          <p>{result.result?.summary?.summary}</p>

          <h3>Recommendation</h3>
          <p>{result.result?.recommendation?.recommendation}</p>

          <h3>Status</h3>
          <p>{result.result?.log?.status}</p>

          {result.error && (
            <>
              <h3>Error</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;