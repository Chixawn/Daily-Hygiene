import React, { useState, useEffect } from "react";
import addNotification, { Notifications } from "react-push-notification";

function safeRate(numerator, denominator) {
  const num = parseInt(numerator, 10);
  const den = parseInt(denominator, 10);
  if (isNaN(num) || isNaN(den) || den === 0) return "0%";
  return ((num / den) * 100).toFixed(1) + "%";
}

export default function DailyHygieneTracker() {
  // Load daily tasks from localStorage or default false
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("dailyTasks");
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem("tasksDate");
    if (saved && savedDate === today) {
      return JSON.parse(saved);
    }
    return {
      dmRecruits: false,
      dmClients: false,
      linkedinEngage: false,
    };
  });

  // Save tasks state daily
  useEffect(() => {
    localStorage.setItem("dailyTasks", JSON.stringify(tasks));
    localStorage.setItem("tasksDate", new Date().toDateString());
  }, [tasks]);

  // Funnel inputs state
  const [funnel, setFunnel] = useState({
    icebreakers: "",
    connectAccepts: "",
    chitchats: "",
    demoAccepts: "",
    demoShows: "",
    signUps: "",
  });

  // Show daily notification on app load
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
    if (Notification.permission === "granted") {
      addNotification({
        title: "KrissAI Reminder",
        subtitle: "Daily Hygiene",
        message: "Don't forget to complete your daily tasks!",
        theme: "teal",
        native: true,
      });
    }
  }, []);

  // Toggle task completion
  function toggleTask(taskName) {
    setTasks((prev) => ({ ...prev, [taskName]: !prev[taskName] }));
  }

  // Handle funnel input changes (only numbers)
  function handleFunnelChange(e) {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) {
      setFunnel((prev) => ({ ...prev, [name]: value }));
    }
  }

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "auto",
        padding: 20,
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f0f9ff",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      {/* Notification container */}
      <Notifications />

      <h1 style={{ textAlign: "center", color: "#0284c7" }}>
        KrissAI Daily Hygiene Tracker
      </h1>
      <p style={{ textAlign: "center", fontStyle: "italic", color: "#0369a1" }}>
        Another day is another step closer to our micro goal!
      </p>

      <section style={{ marginTop: 30 }}>
        <h2 style={{ color: "#065f46" }}>Today's Hygiene Tasks</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {[
            { key: "dmRecruits", label: "DM 10 Recruits on TikTok" },
            { key: "dmClients", label: "DM 10 Potential Clients" },
            {
              key: "linkedinEngage",
              label: "Post, repost, or comment on LinkedIn",
            },
          ].map(({ key, label }) => (
            <li key={key} style={{ marginBottom: 15 }}>
              <label style={{ cursor: "pointer", fontSize: 18 }}>
                <input
                  type="checkbox"
                  checked={tasks[key]}
                  onChange={() => toggleTask(key)}
                  style={{ marginRight: 12, transform: "scale(1.3)" }}
                />
                {label}
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2 style={{ color: "#1e40af" }}>Sales Funnel Inputs & Rates</h2>
        {[
          { name: "icebreakers", label: "Icebreakers" },
          { name: "connectAccepts", label: "Connect Accepts" },
          { name: "chitchats", label: "Chitchats" },
          { name: "demoAccepts", label: "Demo Accepts" },
          { name: "demoShows", label: "Demo Shows" },
          { name: "signUps", label: "Sign-Ups" },
        ].map(({ name, label }) => (
          <div key={name} style={{ marginBottom: 15 }}>
            <label
              htmlFor={name}
              style={{ display: "block", marginBottom: 6, fontWeight: "bold" }}
            >
              {label}
            </label>
            <input
              id={name}
              name={name}
              type="number"
              min="0"
              value={funnel[name]}
              onChange={handleFunnelChange}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 4,
                border: "1px solid #ccc",
                fontSize: 16,
              }}
              placeholder="Enter number"
            />
          </div>
        ))}

        <div
          style={{
            marginTop: 20,
            backgroundColor: "#fff",
            padding: 15,
            borderRadius: 6,
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ marginBottom: 12 }}>Your Rates Today:</h3>
          <p>
            <strong>Connect Accept Rate:</strong>{" "}
            {safeRate(funnel.connectAccepts, funnel.icebreakers)}
          </p>
          <p>
            <strong>Chitchat Rate:</strong>{" "}
            {safeRate(funnel.chitchats, funnel.connectAccepts)}
          </p>
          <p>
            <strong>Demo Accept Rate:</strong>{" "}
            {safeRate(funnel.demoAccepts, funnel.chitchats)}
          </p>
          <p>
            <strong>Demo Show Rate:</strong>{" "}
            {safeRate(funnel.demoShows, funnel.demoAccepts)}
          </p>
          <p>
            <strong>Close Sign-Up Rate:</strong>{" "}
            {safeRate(funnel.signUps, funnel.demoShows)}
          </p>
        </div>
      </section>
    </div>
  );
}
