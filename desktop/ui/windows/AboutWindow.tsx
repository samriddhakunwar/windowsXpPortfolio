"use client";

import React from "react";

export const AboutWindow: React.FC = () => {
  return (
    <div style={{ fontFamily: "Tahoma, Arial, sans-serif", fontSize: "11px" }}>
      <div className="xp-panel" style={{ marginBottom: "8px" }}>
        <h2
          style={{
            fontWeight: "bold",
            fontSize: "13px",
            marginBottom: "6px",
            margin: 0,
            paddingBottom: "6px",
          }}
        >
          About Me
        </h2>
        <p style={{ lineHeight: "1.5", margin: 0 }}>
          Hi! I&apos;m a full-stack developer passionate about building innovative
          web applications. With expertise in modern JavaScript frameworks and
          backend technologies, I create scalable solutions that solve
          real-world problems.
        </p>
      </div>

      <div className="xp-panel" style={{ marginBottom: "8px" }}>
        <h3
          style={{
            fontWeight: "bold",
            fontSize: "12px",
            marginBottom: "6px",
            margin: 0,
            paddingBottom: "6px",
          }}
        >
          Skills Highlights
        </h3>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
          }}
        >
          <li style={{ padding: "2px 0" }}>✓ Full-stack web development</li>
          <li style={{ padding: "2px 0" }}>✓ React &amp; Next.js expertise</li>
          <li style={{ padding: "2px 0" }}>✓ Backend API design</li>
          <li style={{ padding: "2px 0" }}>
            ✓ Database design &amp; optimization
          </li>
          <li style={{ padding: "2px 0" }}>✓ DevOps &amp; cloud deployment</li>
        </ul>
      </div>

      <div className="xp-panel">
        <h3
          style={{
            fontWeight: "bold",
            fontSize: "12px",
            marginBottom: "6px",
            margin: 0,
            paddingBottom: "6px",
          }}
        >
          Current Focus
        </h3>
        <p style={{ lineHeight: "1.5", margin: 0 }}>
          Building scalable web applications with Next.js, exploring AI/ML
          applications, and contributing to open-source projects.
        </p>
      </div>
    </div>
  );
};
