"use client";

import { skills } from "@/data/skills";
import { motion, useInView } from "framer-motion";
import React, { useRef } from "react";

const categoryMeta: Record<string, { icon: string; color: string; barColor: string }> = {
  Frontend:       { icon: "🎨", color: "#1466E5", barColor: "linear-gradient(90deg, #3C87E0 0%, #1466E5 100%)" },
  Backend:        { icon: "⚙️", color: "#0A6A00", barColor: "linear-gradient(90deg, #34C724 0%, #0A8A00 100%)" },
  "Tools & DevOps": { icon: "🛠", color: "#8B4513", barColor: "linear-gradient(90deg, #E07040 0%, #C05020 100%)" },
  Other:          { icon: "🌐", color: "#6B00A8", barColor: "linear-gradient(90deg, #A040D0 0%, #7000B0 100%)" },
};

interface AnimatedBarProps {
  proficiency: number;
  barColor: string;
  delay: number;
}

const AnimatedBar: React.FC<AnimatedBarProps> = ({ proficiency, barColor, delay }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        height: "13px",
        background: "#ECE9D8",
        border: "1px solid #ACA899",
        borderRadius: "1px",
        overflow: "hidden",
      }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={inView ? { width: `${proficiency}%` } : { width: 0 }}
        transition={{ duration: 0.9, delay, ease: [0.4, 0, 0.2, 1] }}
        style={{
          height: "100%",
          background: barColor,
          borderRadius: "1px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Shine sweep */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={inView ? { x: "200%" } : { x: "-100%" }}
          transition={{ duration: 0.6, delay: delay + 0.7, ease: "easeOut" }}
          style={{
            position: "absolute",
            top: 0, bottom: 0,
            width: "40%",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
          }}
        />
      </motion.div>
    </div>
  );
};

export const SkillsWindow: React.FC = () => {
  return (
    <div style={{
      fontFamily: "Tahoma, Arial, sans-serif",
      fontSize: "11px",
      maxHeight: "100%",
      overflowY: "auto",
    }}>
      {skills.map((skill, catIdx) => {
        const meta = categoryMeta[skill.category] ?? {
          icon: "📌",
          color: "#316AC5",
          barColor: "linear-gradient(90deg, #3C87E0 0%, #2060BE 100%)",
        };

        return (
          <div key={skill.category} className="xp-panel" style={{ marginBottom: "8px" }}>
            {/* Category header */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "10px",
              paddingBottom: "6px",
              borderBottom: `2px solid ${meta.color}30`,
            }}>
              <span style={{ fontSize: "16px" }}>{meta.icon}</span>
              <h3 style={{
                fontWeight: "bold",
                fontSize: "12px",
                margin: 0,
                color: meta.color,
              }}>
                {skill.category}
              </h3>
            </div>

            {/* Skills */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {skill.items.map((item, itemIdx) => (
                <div key={item.name}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "3px",
                  }}>
                    <span style={{ fontWeight: "bold", color: "#222" }}>{item.name}</span>
                    <span style={{
                      color: meta.color,
                      fontWeight: "bold",
                      fontSize: "10px",
                      background: `${meta.color}15`,
                      padding: "1px 5px",
                      borderRadius: "2px",
                      border: `1px solid ${meta.color}30`,
                    }}>
                      {item.proficiency}%
                    </span>
                  </div>
                  <AnimatedBar
                    proficiency={item.proficiency}
                    barColor={meta.barColor}
                    delay={catIdx * 0.1 + itemIdx * 0.06}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
