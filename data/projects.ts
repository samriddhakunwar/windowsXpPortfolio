import { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "1",
    title: "Smart Traffic Management System",
    description:
      "An AI-powered traffic management system using computer vision and Django. Detects vehicle density in real-time and dynamically adjusts signal timings to reduce congestion.",
    technologies: ["Django", "Python", "OpenCV", "PostgreSQL"],
    github: "https://github.com/samriddhakunwar/traffic-system",
    image: "/assets/work/project-1.png",
  },
  {
    id: "2",
    title: "Search Engine Project",
    description:
      "Full-stack search engine with a custom web crawler and ranking algorithm. Features full-text search, relevance scoring, and a React-based UI.",
    technologies: ["Django", "React", "Elasticsearch", "Python"],
    github: "https://github.com/samriddhakunwar/search-engine",
    image: "/assets/work/project-2.png",
  },
  {
    id: "3",
    title: "Windows XP Portfolio",
    description:
      "Nostalgic portfolio website themed around Windows XP desktop simulation. Built with Next.js 16, React 19, TypeScript, and Framer Motion.",
    technologies: ["Next.js", "React", "TypeScript", "Framer Motion"],
    github: "https://github.com/samriddhakunwar/windowsXpPortfolio",
    image: "/assets/work/project-3.png",
  },
  {
    id: "4",
    title: "Data Analysis Dashboard",
    description:
      "Interactive dashboard for analyzing and visualizing large datasets. Features real-time charts, filter controls, and CSV import/export functionality.",
    technologies: ["React", "D3.js", "Node.js", "MongoDB"],
    github: "https://github.com/samriddhakunwar/data-analysis",
    image: "/assets/work/project-4.png",
  },
  {
    id: "5",
    title: "Machine Learning Model",
    description:
      "Predictive model for time series forecasting using LSTM neural networks. Achieves 92% accuracy on financial market trend prediction.",
    technologies: ["Python", "TensorFlow", "Pandas", "Scikit-learn"],
    github: "https://github.com/samriddhakunwar/ml-model",
    image: "/assets/work/project-5.png",
  },
];
