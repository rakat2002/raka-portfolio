export interface Education {
  institution: string
  degree: string
  period: string
  details: string[]
}

export interface Project {
  name: string
  description: string
  technologies: string[]
  features: string[]
  github: string
  liveDemo: string
}

export interface Experience {
  role: string
  organization: string
  period: string
  highlights: string[]
}

export interface Activity {
  title: string
  organization: string
  period: string
}

export interface Profile {
  name: string
  role: string
  location: string
  email: string
  github: string
  linkedin: string
  photo: string
  interests: string[]
  currentlyLearning: string[]
  education: Education[]
  skills: { technical: string[]; tools: string[] }
  projects: Project[]
  experience: Experience[]
  activities: Activity[]
  achievements: string[]
}

// Anything that starts with "TODO:" is a placeholder for you to fill in.
export const profile: Profile = {
  name: "Rakat E Jannat Raka", // TODO: confirm the spelling you want shown
  role: "Undergraduate Student of CS, Brac University", // TODO: your role or title
  location: "Bangladesh",
  email: "rjannat1311@gmail.com , rakat.ejannat.raka@g.bracu.ac.bd",
  github: "https://github.com/rakat2002",
  linkedin: "TODO: https://linkedin.com/in/your-username",
  photo: "/profile.jpg",
  interests: [
    "Software Engineering",
    "Problem Solving",
    "Digital Art",
  ],
  currentlyLearning: [
    "Software Engineering",
    "Machine Learning",
    "Python",
    "AI Engineering",
  ],
  education: [
    {
      institution: "Brac University",
      degree: "Bachelor of Science in Computer Science and Engineering",
      period: "2024 - Present",
      details: [],
    },
  ],
  skills: {
    technical: [], // TODO: languages and technologies you actually know
    tools: [], // TODO: tools you actually use
  },
  projects: [
    {
      name: "TODO: project name",
      description: "TODO: one sentence about it",
      technologies: [],
      features: [],
      github: "TODO: repo link",
      liveDemo: "",
    },
    // TODO: copy this block for each of your projects
  ],
  experience: [], // TODO: add only real experience
  activities: [], // TODO: clubs, leadership, activities
  achievements: [], // TODO: only real achievements
}