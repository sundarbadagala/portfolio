import { IQueryField } from "@/components/landing-page/index.interface";
import * as assets from "./assets";
import { ILoginField } from "@/components/login/interface";

export const TYPE_WRITER = ["Sundar Rao", "Frontend Developer", "Software Engineer"];

export const CONTENT_TAGS = [
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "javascript", label: "Javascript" },
  { value: "react", label: "React" },
  { value: "material", label: "Material UI" },
  { value: "bootstrap", label: "Bootstrap" },
  { value: "programming", label: "Programming" },
  { value: "development", label: "Development" },
  { value: "dsa", label: "DSA" },
];

export const SEO_BLOGS = {
  title: "blogs",
  description: "description",
  keywords: "one, two, three",
  name: "name",
  type: "type",
  author: "sundar",
};

export const MY_SKILLS = [

  //---------
  {
    skillName: "Frontend Technologies",
    subSkills: [
      {
        skill: "React",
        icon: "react",
        percentage: 80,
      },
      {
        skill: "Next",
        icon: "nextdotjs",
        percentage: 60,
      },
      {
        skill: "Java Script",
        icon: "javascript",
        percentage: 70,
      },
      {
        skill: "Type Script",
        icon: "typescript",
        percentage: 60,
      },
      {
        skill: "HTML",
        icon: "html5",
        percentage: 90,
      },
      {
        skill: "CSS",
        icon: "css3",
        percentage: 70,
      },

    ],
  },
  {
    skillName: "Styling",
    subSkills: [
      {
        skill: "TAILWIND",
        icon: "tailwind",
        percentage: 50,
      },
      {
        skill: "MATERIAL UI",
        icon: "mui",
        percentage: 90,
      },
      {
        skill: "BOOTSTRAP",
        icon: "bootstrap",
        percentage: 80,
      },
      {
        skill: "CHAKRA UI",
        icon: "chakraui",
        percentage: 90,
      },
      {
        skill: "STYLED COMPONENTS",
        icon: "styled",
        percentage: 90,
      },
      {
        skill: "SASS",
        icon: "sass",
        percentage: 40,
      },
    ],
  },
  {
    skillName: "State Management",
    subSkills: [
      {
        skill: "Redux Toolkit",
        icon: "redux",
        percentage: 80,
      },
      {
        skill: "Recoil",
        icon: "recoil",
        percentage: 50,
      },
      {
        skill: "Contect API",
        icon: "react",
        percentage: 90,
      },
    ],
  },
  {
    skillName: "Backend Technologies",
    subSkills: [
      {
        skill: "Node",
        icon: "nodedotjs",
        percentage: 40,
      },
      {
        skill: "Mongo DB",
        icon: "mongo",
        percentage: 30,
      },
      {
        skill: "Express.js",
        icon: "express",
        percentage: 30,
      },
    ],
  },
  {
    skillName: "Tools",
    subSkills: [
      {
        skill: "GIT",
        icon: "git",
        percentage: 70,
      },
      {
        skill: "JIRA",
        icon: "jira",
        percentage: 50,
      },
      {
        skill: "AXIOS",
        icon: "axios",
        percentage: 90,
      },
      {
        skill: "MIXPANEL",
        icon: "mixpanel",
        percentage: 60,
      },
    ],
  },
];

export const WORK_EXPERIENCE = [
  {
    id: 1,
    role: "Frontend Developer",
    organization: "Greater Than Education Technologies (GTET)",
    duration: {
      from: "Jun 2022",
      to: "Present",
    },
    keyPoints: [
      "Architected scalable project with efficient state management solutions, improving application maintainability and performance; optimized REST API interactions for reliable and efficient data flow",
      "Owned multiple frontend initiatives using React.js and Next.js, and mentored junior developers, driving improvements in feature adoption and user engagement",
      "Enforced best practices through code reviews, improving code quality, scalability, and team development standards"
    ],
  },
  {
    id: 2,
    role: "Frontend Developer",
    organization: "Nspira Management Services Pvt Ltd (NSPIRA)",
    duration: {
      from: "Feb 2022",
      to: "May 2022",
    },
    keyPoints: [
      "Collaborated with cross-functional teams (backend, QA, product) to drive end-to-end feature delivery in Agile environments, ensuring high-quality and timely releases",
      "Resolved performance bottlenecks and optimized API interactions, improving user experience by ~20% and reducing load time by ~25%",
    ],
  },
  {
    id: 3,
    role: "Intern",
    organization: "Nspira Management Services Pvt Ltd (NSPIRA)",
    duration: {
      from: "Aug 2021",
      to: "Jan 2022",
    },
    keyPoints: [
      "Worked as Intern",
      "Gained robust knowledge on React JS functional programming, state management library like Redux Saga and styling library like Styled Components, Material UI",
      "Experienced in working on re usable components by using React JS for the future use.",
      "Experienced in working on responsive and interactive web application",
      "Experienced in integrating front-end application with back-end services.",
    ],
  },
];

export const QUERY_FIELDS: IQueryField[] = [
  {
    type: "text",
    label: "Name",
    id: "sender",
    placeholder: "Enter Your Name",
  },
  {
    type: "text",
    label: "Email",
    id: "email",
    placeholder: "Enter Your Email",
  },
  {
    type: "textarea",
    label: "Message",
    id: "message",
    placeholder: "Write your message here...",
  },
];

export const LOGIN_FIELDS: ILoginField[] = [
  {
    type: 'text',
    label: 'Email',
    id: 'email',
    placeholder: "Enter Email",
  },
  {
    type: 'password',
    label: 'Password',
    id: 'password',
    placeholder: "Enter Password",
  },
]

export const MEDIA_CONNECTS = [
  {
    name: "LinkedIn",
    link: "https://www.linkedin.com/in/sundarbadagala/",
    icon: assets.LINKEDIN,
  },
  {
    name: "GitHub",
    link: "https://github.com/sundarbadagala",
    icon: assets.GIT_HUG,
  },
  {
    name: "Dev",
    link: "https://dev.to/sundarbadagala081",
    icon: assets.DEV_TO,
  },
  {
    name: "Mail",
    link: "mailto:sundar.badagala@gmail.com",
    icon: assets.GMAIL,
  },
];

export const PROJECTS = [
  {
    id: 1,
    title: "nLearn Kids",
    description: "• Built an interactive online learning platform using React.js\n• Owned scheduling, content access, and activity modules",
    technologies: ["React", "Node.js", "Firebase", "Express", "PostgreSQL"],
    link: "https://github.com/sundarbadagala",
    image: assets.REACT_ICON,
  },
  {
    id: 2,
    title: "CNAPS (Olympiad Platform)",
    description: "• Developed a scalable platform for conducting nationwide online exams\n• Led secure proctoring features to ensure exam integrity\n• Optimized performance to handle high concurrent users",
    technologies: ["React", "Node.js", "Socket.io", "AWS", "Proctoring"],
    link: "https://github.com/sundarbadagala",
    image: assets.NEXT_ICON,
  },
  {
    id: 3,
    title: "nMonitor",
    description: "• Led a real-time student exam monitoring system\n• Automated attendance tracking and supervision, reducing manual workload",
    technologies: ["React", "WebRTC", "Python", "MongoDB", "Kubernetes"],
    link: "https://github.com/sundarbadagala",
    image: assets.NODE_ICON,
  },
];

export const TOAST_MESSAGE = {
  offline: "Please check your internet connection.",
};
