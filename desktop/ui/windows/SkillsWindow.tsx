"use client";

import { skills } from "@/data/skills";
import React from "react";

export const SkillsWindow: React.FC = () => {
  return (
    <div
      style={{
        fontFamily: "Tahoma, Arial, sans-serif",
        fontSize: "11px",
        maxHeight: "100%",
        overflowY: "auto",
      }}
    >
      {skills.map((skill) => (
        <div key={skill.category} className="xp-panel" style={{ marginBottom: "8px" }}>
          <h3
            style={{
              fontWeight: "bold",
              fontSize: "12px",
              margin: "0 0 8px 0",
            }}
          >
            {skill.category}
          </h3>
          {skill.items.map((item) => (
            <div key={item.name} style={{ marginBottom: "6px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "2px",
                }}
              >
                <span>{item.name}</span>
                <span>{item.proficiency}%</span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "14px",
                  background: "#ECE9D8",
                  border: "1px solid #ACA899",
                  borderRadius: "1px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${item.proficiency}%`,
                    background:
                      "linear-gradient(180deg, #3C87E0 0%, #2B6FCA 50%, #2060BE 100%)",
                    borderRadius: "1px",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
