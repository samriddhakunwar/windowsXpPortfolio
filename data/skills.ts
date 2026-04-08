import { Skill } from "@/types";

export const skills: Skill[] = [
  {
    category: "Frontend",
    items: [
      { name: "React", proficiency: 95 },
      { name: "Next.js", proficiency: 90 },
      { name: "TypeScript", proficiency: 88 },
      { name: "Tailwind CSS", proficiency: 92 },
      { name: "CSS/SCSS", proficiency: 90 },
      { name: "JavaScript", proficiency: 95 },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Node.js", proficiency: 85 },
      { name: "Django", proficiency: 88 },
      { name: "Django REST Framework", proficiency: 85 },
      { name: "Python", proficiency: 90 },
      { name: "Express.js", proficiency: 80 },
      { name: "PostgreSQL", proficiency: 85 },
    ],
  },
  {
    category: "Tools & DevOps",
    items: [
      { name: "Git", proficiency: 95 },
      { name: "Docker", proficiency: 82 },
      { name: "Linux", proficiency: 85 },
      { name: "VS Code", proficiency: 95 },
      { name: "CI/CD", proficiency: 80 },
      { name: "AWS", proficiency: 75 },
    ],
  },
  {
    category: "Other",
    items: [
      { name: "REST APIs", proficiency: 90 },
      { name: "GraphQL", proficiency: 75 },
      { name: "Web Design", proficiency: 85 },
      { name: "Problem Solving", proficiency: 92 },
      { name: "Agile/Scrum", proficiency: 80 },
      { name: "Technical Writing", proficiency: 80 },
    ],
  },
];
