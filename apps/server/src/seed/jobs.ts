import db from "../db";
import { job } from "../db/schema";
import { voyageai } from "../lib/voyageai";

const jobs = [
  {
    id: 1,
    title: "Full Stack Developer",
    company: "Sarika Consultant Services",
    location: "Salt Lake, Kolkata",
    jobType: "Onsite",
    skills: ["Apache", "Bootstrap", "MySQL", "JavaScript"],
    createdAt: new Date("2025-05-10"),
  },
  {
    id: 2,
    title: "Software Developer",
    company: "CoralRidge Management Consultant",
    location: "Kolkata",
    jobType: "Onsite",
    skills: ["MySQL", "CSS", "API Testing", "JSON"],
    createdAt: new Date("2025-05-11"),
  },
  {
    id: 3,
    title: "Developer",
    company: "Shipdockets Pvt Ltd",
    location: "JLN Marg, Jaipur",
    jobType: "Onsite",
    skills: ["ASP.NET", "SQL", "jQuery", "JavaScript"],
    createdAt: new Date("2025-05-12"),
  },
  {
    id: 4,
    title: "Automation Tester",
    company: "Conquest Technology Solutions Pvt. Ltd",
    location: "Hyderabad",
    jobType: "Onsite",
    skills: ["API Testing", "JSON", "XML"],
    createdAt: new Date("2025-05-13"),
  },
  {
    id: 5,
    title: "Vue.js Developer",
    company: "Florican Enterprises Pvt Ltd",
    location: "Lower Parel, Mumbai",
    jobType: "Onsite",
    skills: ["HTML", "CSS", "JavaScript", "REST API"],
    createdAt: new Date("2025-05-14"),
  },
  {
    id: 6,
    title: "PHP Developer / Backend Developer",
    company: "Florican Enterprises Pvt Ltd",
    location: "Thane",
    jobType: "Onsite",
    skills: ["PHP", "MySQL", "API Testing", "JSON"],
    createdAt: new Date("2025-05-15"),
  },
  {
    id: 7,
    title: "UI Developer",
    company: "Rapsys Technologies",
    location: "Gurgaon",
    jobType: "Hybrid",
    skills: ["HTML", "CSS", "Canva", "Adobe Suite"],
    createdAt: new Date("2025-05-16"),
  },
  {
    id: 8,
    title: "ServiceNow IRM/GRC Developer",
    company: "Whitelotus Corporation Pvt Ltd",
    location: "Remote",
    jobType: "Remote",
    skills: ["ServiceNow", "Risk Management", "Compliance", "Audit Management"],
    createdAt: new Date("2025-05-17"),
  },
  {
    id: 9,
    title: "Associate Software Developer",
    company: "Crum & Forster",
    location: "Bengaluru",
    jobType: "Hybrid",
    skills: [
      "Application Development",
      "Software Configuration",
      "Digital Services",
    ],
    createdAt: new Date("2025-05-18"),
  },
  {
    id: 10,
    title: "Hybrid Developer",
    company: "IntersoftKK",
    location: "India",
    jobType: "Hybrid",
    skills: ["React Native", "Flutter", "Ionic", "REST API"],
    createdAt: new Date("2025-05-19"),
  },
  {
    id: 11,
    title: "Software Engineer",
    company: "Tata Consultancy Services",
    location: "Bangalore",
    jobType: "Onsite",
    skills: ["Java", "Spring Boot", "SQL", "Git", "REST APIs"],
    createdAt: new Date("2025-05-10"),
  },
  {
    id: 12,
    title: "Frontend Developer",
    company: "Infosys",
    location: "Pune",
    jobType: "Hybrid",
    skills: ["JavaScript", "React", "HTML", "CSS", "Redux"],
    createdAt: new Date("2025-05-11"),
  },
  {
    id: 13,
    title: "Backend Developer",
    company: "Wipro",
    location: "Hyderabad",
    jobType: "Onsite",
    skills: ["Python", "Django", "PostgreSQL", "AWS", "Docker"],
    createdAt: new Date("2025-05-12"),
  },
  {
    id: 14,
    title: "Full Stack Developer",
    company: "Accenture",
    location: "Mumbai",
    jobType: "Hybrid",
    skills: ["JavaScript", "Node.js", "React", "Express.js", "MongoDB"],
    createdAt: new Date("2025-05-13"),
  },
  {
    id: 15,
    title: "Data Engineer",
    company: "Capgemini",
    location: "Chennai",
    jobType: "Onsite",
    skills: ["Python", "Spark", "Hadoop", "SQL", "AWS"],
    createdAt: new Date("2025-05-14"),
  },
  {
    id: 16,
    title: "DevOps Engineer",
    company: "HCLTech",
    location: "Noida",
    jobType: "Hybrid",
    skills: ["Docker", "Kubernetes", "Jenkins", "AWS", "Terraform"],
    createdAt: new Date("2025-05-15"),
  },
  {
    id: 17,
    title: "Mobile App Developer (Android)",
    company: "Reliance Jio",
    location: "Mumbai",
    jobType: "Onsite",
    skills: ["Kotlin", "Java", "Android SDK", "REST APIs"],
    createdAt: new Date("2025-05-16"),
  },
  {
    id: 18,
    title: "Mobile App Developer (iOS)",
    company: "Flipkart",
    location: "Bangalore",
    jobType: "Hybrid",
    skills: ["Swift", "Objective-C", "Xcode", "Cocoa Touch", "REST APIs"],
    createdAt: new Date("2025-05-17"),
  },
];

async function seedJobs(): Promise<void> {
  for (const _job of jobs) {
    const embeddingInput = `
      Job Title: ${_job.title}
      Required Skills: ${_job.skills.join(", ")}
      Location: ${_job.location}
      Job Type: ${_job.jobType}
    `.trim();

    const embeddings = await voyageai.embed({
      input: embeddingInput,
      model: "voyage-3-large",
    });

    const insertJobs = await db.insert(job).values({
      ..._job,
      embedding: embeddings.data?.[0].embedding,
    });

    if (!insertJobs) {
      console.log("Failed to insert jobs");
      return;
    }

    console.log(`Inserted ${jobs.indexOf(_job) + 1} / ${jobs.length}`);
  }
}

seedJobs();
