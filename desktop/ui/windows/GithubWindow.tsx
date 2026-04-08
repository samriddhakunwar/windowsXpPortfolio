"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics: string[];
}

export const GithubWindow: React.FC = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://api.github.com/users/samriddhakunwar/repos?sort=updated&per_page=12")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch repositories");
        return r.json();
      })
      .then((data) => {
        setRepos(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const langColor: Record<string, string> = {
    TypeScript: "#3178C6",
    JavaScript: "#F7DF1E",
    Python: "#3572A5",
    "C#": "#178600",
    Java: "#B07219",
    HTML: "#E34C26",
    CSS: "#563D7C",
    Go: "#00ADD8",
  };

  if (loading) {
    return (
      <div style={{ fontFamily: "Tahoma, Arial, sans-serif", fontSize: "11px" }}>
        <div className="xp-panel" style={{ padding: "16px", textAlign: "center" }}>
          <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
            🔄 Fetching repositories from GitHub...
          </div>
          <div className="xp-progress-bar" style={{ maxWidth: "240px", margin: "0 auto" }}>
            <div className="xp-progress-fill" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ fontFamily: "Tahoma, Arial, sans-serif", fontSize: "11px" }}>
        <div className="xp-panel" style={{ padding: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#CC0000" }}>
            <Image src="/assets/error.png" alt="Error" width={20} height={20} />
            <span style={{ fontWeight: "bold" }}>Could not load repositories</span>
          </div>
          <p style={{ marginTop: "8px", color: "#666" }}>{error}</p>
          <p style={{ color: "#666" }}>Check your internet connection or visit{" "}
            <a href="https://github.com/samriddhakunwar" target="_blank" rel="noopener noreferrer"
              style={{ color: "#0066CC" }}>
              github.com/samriddhakunwar
            </a> directly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Tahoma, Arial, sans-serif", fontSize: "11px", maxHeight: "100%", overflowY: "auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
        <Image src="/assets/github.png" alt="GitHub" width={24} height={24} />
        <div>
          <div style={{ fontWeight: "bold", fontSize: "13px" }}>samriddhakunwar</div>
          <div style={{ color: "#666" }}>GitHub Repositories ({repos.length})</div>
        </div>
        <a
          href="https://github.com/samriddhakunwar"
          target="_blank"
          rel="noopener noreferrer"
          className="xp-button"
          style={{ marginLeft: "auto", textDecoration: "none", color: "#000", display: "inline-flex", alignItems: "center", gap: "4px" }}
        >
          <Image src="/assets/github.png" alt="" width={14} height={14} />
          Open Profile
        </a>
      </div>

      {/* Repo list */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
        {repos.map((repo) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              className="xp-panel xp-project-card"
              style={{
                marginBottom: 0,
                cursor: "pointer",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <div style={{ fontWeight: "bold", fontSize: "11px", color: "#0066CC", marginBottom: "2px" }}>
                📁 {repo.name}
              </div>
              <p style={{ margin: 0, color: "#444", lineHeight: "1.4", flex: 1, fontSize: "10px" }}>
                {repo.description || "No description available"}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                {repo.language && (
                  <span style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "10px" }}>
                    <span style={{
                      width: "8px", height: "8px", borderRadius: "50%",
                      background: langColor[repo.language] ?? "#aaa",
                      display: "inline-block",
                      border: "1px solid rgba(0,0,0,0.15)",
                    }} />
                    {repo.language}
                  </span>
                )}
                <span style={{ fontSize: "10px", color: "#666" }}>⭐ {repo.stargazers_count}</span>
                <span style={{ fontSize: "10px", color: "#666" }}>🍴 {repo.forks_count}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
