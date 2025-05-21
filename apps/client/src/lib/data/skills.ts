import type { Option } from "@/components/ui/multiselect";
import { Building, Home } from "lucide-react";
import { IconArrowBarBoth } from "@tabler/icons-react";

export const preferredJobType_data = [
  { value: "remote", icon: Home, label: "Remote" },
  { value: "onsite", icon: Building, label: "Onsite" },
  { value: "hybrid", icon: IconArrowBarBoth, label: "Hybrid" },
];

export const skills_data: Option[] = [
  // Programming Languages
  { value: "JavaScript", label: "JavaScript" },
  { value: "TypeScript", label: "TypeScript" },
  { value: "Python", label: "Python" },
  { value: "Java", label: "Java" },
  { value: "C#", label: "C#" },
  { value: "C++", label: "C++" },
  { value: "Ruby", label: "Ruby" },
  { value: "PHP", label: "PHP" },
  { value: "Swift", label: "Swift" },
  { value: "Kotlin", label: "Kotlin" },
  { value: "Go", label: "Go" },
  { value: "Rust", label: "Rust" },
  { value: "Scala", label: "Scala" },

  // Frontend Frameworks & Libraries
  { value: "React", label: "React" },
  { value: "Next.js", label: "Next.js" },
  { value: "Vue.js", label: "Vue.js" },
  { value: "Angular", label: "Angular" },
  { value: "Svelte", label: "Svelte" },
  { value: "Redux", label: "Redux" },
  { value: "GraphQL", label: "GraphQL" },
  { value: "Tailwind CSS", label: "Tailwind CSS" },
  { value: "Bootstrap", label: "Bootstrap" },
  { value: "Sass", label: "Sass" },
  { value: "Webpack", label: "Webpack" },
  { value: "Vite", label: "Vite" },

  // Backend Frameworks & Technologies
  { value: "Node.js", label: "Node.js" },
  { value: "Express.js", label: "Express.js" },
  { value: "Django", label: "Django" },
  { value: "Flask", label: "Flask" },
  { value: "Spring Boot", label: "Spring Boot" },
  { value: "ASP.NET", label: "ASP.NET" },
  { value: "Laravel", label: "Laravel" },
  { value: "Ruby on Rails", label: "Ruby on Rails" },
  { value: "FastAPI", label: "FastAPI" },
  { value: "NestJS", label: "NestJS" },

  // Databases
  { value: "PostgreSQL", label: "PostgreSQL" },
  { value: "MySQL", label: "MySQL" },
  { value: "MongoDB", label: "MongoDB" },
  { value: "Redis", label: "Redis" },
  { value: "Elasticsearch", label: "Elasticsearch" },
  { value: "DynamoDB", label: "DynamoDB" },
  { value: "Cassandra", label: "Cassandra" },

  // DevOps & Cloud
  { value: "AWS", label: "AWS" },
  { value: "Azure", label: "Azure" },
  { value: "Google Cloud", label: "Google Cloud" },
  { value: "Docker", label: "Docker" },
  { value: "Kubernetes", label: "Kubernetes" },
  { value: "Terraform", label: "Terraform" },
  { value: "Jenkins", label: "Jenkins" },
  { value: "GitHub Actions", label: "GitHub Actions" },
  { value: "CI/CD", label: "CI/CD" },

  // Testing
  { value: "Jest", label: "Jest" },
  { value: "Cypress", label: "Cypress" },
  { value: "Selenium", label: "Selenium" },
  { value: "JUnit", label: "JUnit" },
  { value: "PyTest", label: "PyTest" },
  { value: "Playwright", label: "Playwright" },

  // Mobile Development
  { value: "React Native", label: "React Native" },
  { value: "Flutter", label: "Flutter" },
  { value: "iOS Development", label: "iOS Development" },
  { value: "Android Development", label: "Android Development" },

  // Other Tools & Technologies
  { value: "Git", label: "Git" },
  { value: "Linux", label: "Linux" },
  { value: "REST API", label: "REST API" },
  { value: "Microservices", label: "Microservices" },
  { value: "Serverless", label: "Serverless" },
  { value: "WebSockets", label: "WebSockets" },
  { value: "OAuth", label: "OAuth" },
  { value: "JWT", label: "JWT" },
  { value: "OAuth 2.0", label: "OAuth 2.0" },
  { value: "Web Security", label: "Web Security" },
  { value: "Agile", label: "Agile" },
  { value: "Scrum", label: "Scrum" },
  { value: "Test-Driven Development", label: "Test-Driven Development" },
  { value: "Clean Code", label: "Clean Code" },
  { value: "Design Patterns", label: "Design Patterns" },
  { value: "System Design", label: "System Design" },
  { value: "Data Structures", label: "Data Structures" },
  { value: "Algorithms", label: "Algorithms" },
  { value: "Machine Learning", label: "Machine Learning" },
  { value: "Artificial Intelligence", label: "Artificial Intelligence" },
];
