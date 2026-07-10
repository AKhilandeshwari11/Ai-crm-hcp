import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setResponse, setLoading, updateForm } from "./slices/workflowSlice";
import ChatPanel from "./components/ChatPanel";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  const result = useSelector((state) => state.workflow.response);
  const loading = useSelector((state) => state.workflow.loading);
  const ai = useSelector((state) => state.workflow);

  const [form, setForm] = useState({
    name: "", email: "", interaction_type: "Meeting",
    date: "", time: "", attendees: "", topics: "",
    samples: "", sentiment: "Neutral", outcomes: "", follow_up: ""
  });

  const val = (field) => ai[field] || form[field];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    dispatch(updateForm({ [name]: value }));
  };

  const handleSummarize = async () => {
    if (!form.topics) return;
    dispatch(setLoading(true));
    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: `Summarize this interaction note in 2 sentences: ${form.topics}` })
      });
      const data = await res.json();
      setForm((prev) => ({ ...prev, topics: data.response }));
      dispatch(updateForm({ topics: data.response }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    dispatch(setResponse(null));
    try {
      const payload = { ...form, ...Object.fromEntries(Object.entries(ai).filter(([k]) => !["response","loading"].includes(k) && ai[k])) };
      const res = await fetch("http://127.0.0.1:8000/ai-workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      dispatch(setResponse(data));
    } catch (err) {
      dispatch(setResponse({ error: err.message }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="app-wrapper">
      <h1 className="app-title">AI CRM — Log Interaction</h1>
      <div className="app-layout">

        {/* Left - Log Interaction Form */}
        <div className="panel">
          <h2>Log Interaction Form</h2>
          <form onSubmit={handleSubmit}>

            <label>HCP Name</label>
            <input type="text" name="name" placeholder="Dr. Smith" value={val("name")} onChange={handleChange} />

            <label>Email</label>
            <input type="email" name="email" placeholder="doctor@hospital.com" value={val("email")} onChange={handleChange} />

            <label>Interaction Type</label>
            <select name="interaction_type" value={val("interaction_type")} onChange={handleChange}>
              <option>Meeting</option>
              <option>Call</option>
              <option>Email</option>
              <option>Conference</option>
            </select>

            <label>Date</label>
            <input type="date" name="date" value={val("date")} onChange={handleChange} />

            <label>Time</label>
            <input type="time" name="time" value={val("time")} onChange={handleChange} />

            <label>Attendees</label>
            <input type="text" name="attendees" placeholder="Names of attendees" value={val("attendees")} onChange={handleChange} />

            <label>Topics Discussed</label>
            <textarea name="topics" placeholder="Topics discussed during interaction..." value={val("topics")} onChange={handleChange} />
            <button type="button" className="btn-secondary" onClick={handleSummarize}>
              🎙 Summarize from Voice Note
            </button>

            <label>Materials / Samples Distributed</label>
            <input type="text" name="samples" placeholder="e.g. Product X brochure, 2 samples" value={val("samples")} onChange={handleChange} />

            <label>HCP Sentiment</label>
            <div className="radio-group">
              {["Positive", "Neutral", "Negative"].map((s) => (
                <label key={s} className="radio-label">
                  <input type="radio" name="sentiment" value={s} checked={val("sentiment") === s} onChange={handleChange} />
                  {s}
                </label>
              ))}
            </div>

            <label>Outcomes</label>
            <textarea name="outcomes" placeholder="Outcomes of the interaction..." value={val("outcomes")} onChange={handleChange} />

            <label>Follow-up Actions</label>
            <textarea name="follow_up" placeholder="Next steps and follow-up actions..." value={val("follow_up")} onChange={handleChange} />

            <button type="submit" className="btn-primary">
              {loading ? "Processing..." : "Submit Interaction"}
            </button>
          </form>

          {result && (
            <div className="result">
              <h3>✅ Interaction Logged</h3>
              {result.result?.profile && <p><b>HCP:</b> {result.result.profile.hcp_name} — {result.result.profile.specialty}</p>}
              {result.result?.inventory && <p><b>Inventory:</b> {result.result.inventory.sample} — {result.result.inventory.available ? "✅ In Stock" : "❌ Out of Stock"}</p>}
              {result.result?.followup_task && <p><b>Follow-up:</b> {result.result.followup_task.task} ({result.result.followup_task.due_date})</p>}
              {result.error && <p style={{ color: "red" }}>{result.error}</p>}
            </div>
          )}
        </div>

        {/* Right - AI Chat */}
        <div className="panel">
          <ChatPanel />
        </div>

      </div>
    </div>
  );
}

export default App;
