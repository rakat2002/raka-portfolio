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

export interface SpokenLanguage {
  name: string
  level: string
}

export interface Publication {
  title: string
  venue: string
  year: string
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
    tagline: string
  summary: string
  cvFile: string
  languages: SpokenLanguage[]
  publications: Publication[]
  artLink: string
}

// Anything that starts with "TODO:" is a placeholder for you to fill in.
export const profile: Profile = {
  name: "Rakat E Jannat Raka", // TODO: confirm the spelling you want shown
  role: "CS Undergraduate student @Brac University", // TODO: your role or title
  location: "Rajshahi,Bangladesh",
  email: "rjannat1311@gmail.com",
  github: "https://github.com/rakat2002",
  linkedin: "https://www.linkedin.com/in/rjannat1311/",
  photo: "/profile1.png",
    tagline: "Code • Intelligence • Problem Solving • Creativity", // edit to taste
  summary: "I'm a Computer Science student at Brac University, aiming to become a software engineer with a strong foundation in AI and machine learning. I like taking a problem apart, finding a clean way through it, and building something real out of the solution. Outside of code, I create digital art, which keeps my eye for detail and design sharp. Right now I'm focused on strengthening my skills in software engineering, AI/ML, and Python to get there.", // TODO: 2-3 sentences about you. Leave it empty to get an automatic summary.
  cvFile: "/cv.pdf",
   languages: [
  { name: "English", level: "Fluent" },
  { name: "Bengali", level: "Native" },
  { name: "Hindi", level: "Conversational" }, // add as many as you like
], // TODO: for example { name: "English", level: "Fluent" }, only true ones
  publications: [], // TODO: papers, posters, thesis... leave empty if you have none
  artLink: "", // TODO: link to your digital art. Leave empty to hide it // a PDF you put in the public folder (added in the next part)
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
    },{
    institution: "Rajshahi University School",
    degree: "Higher Secondary Certificate (HSC), Science",
    period: "2020 - 2022",
    details: ["GPA 5.00"],
  },
  {
    institution: "Rajshahi University School",
    degree: "Secondary School Certificate (SSC), Science",
    period: "2010 - 2020",
    details: ["GPA 5.00"],
  }
  ],
 skills: {
  technical: [
    "Java",
    "Python",
    "Data Structures",
    "Algorithms",
    "Problem Solving",
    "SQL",
    "Web Development"
  ],

  tools: [
    "Git",
    "GitHub",
    "VS Code",
    "MySQL",
    "PyOpenGL"
  ],
},
 
  experience: [{
    role: "Senior Executive of Event Management",
    organization: "BRAC University Computer Club",
    period: "",
    highlights: [],
  }, {
    role: "Secretary of HR",
    organization: "BRAC University Leadership Development Forum",
    period: "",
    highlights: [],
  },
], // TODO: add only real experience
  activities: [], // TODO: clubs, leadership, activities
  achievements: [], 
   projects: [{
  name: "BRACU Club Management System",

  description:
    "A comprehensive web application for managing club activities, members, events, finances, announcements, and sponsorships at BRAC University.",

  technologies: [
    "Next.js",
    "TypeScript",
    "JavaScript",
    "MySQL",
    "Raw SQL",
    "mysql2"
  ],

  features: [
    "Club registration and management",
    "User authentication",
    "Club member registration",
    "Registered clubs dashboard",
    "Event calendar and event management",
    "Financial tracking and analytics",
    "Budget submission system",
    "Announcement posting",
    "Sponsorship management",
    "Club announcements and updates",
    "Club activity overview",
    "Database-driven management system"
  ],

  github: "https://github.com/hh-abir/bracu-club-management-sys",
  liveDemo: ""
},
  {
    name: "Loan Approval Prediction",
    description: "A machine learning pipeline that predicts loan approval outcomes from applicant demographic, financial, and credit data, comparing five supervised models against an unsupervised K-Means baseline.",
    technologies: ["Python", "scikit-learn", "Pandas", "Machine Learning"],
    features: [
      "Cleaned and preprocessed a 45,000-row imbalanced dataset (outlier removal, ordinal/one-hot encoding, feature scaling)",
      "Trained and compared KNN, Decision Tree, Logistic Regression, Naive Bayes, and a Neural Network (MLP)",
      "Best model (Neural Network) reached 91.8% accuracy and 0.967 AUC on the held-out test set",
      "Evaluated with accuracy, precision, recall, F1-score, and ROC/AUC to account for class imbalance",
    ],
    github: "", // TODO: add the repo link if it's public
    liveDemo: "",
  },
  {
    name: "Machine Translation of Bangla Regional Dialects",
    description: "A comparative research study translating Chittagong and Sylhet Bangla dialects into Standard Bangla, spanning lexical baselines to fine-tuned transformer models.",
    technologies: ["Python", "PyTorch", "Hugging Face Transformers", "TensorFlow/Keras", "NLP"],
    features: [
      "Built and evaluated 6 models: dictionary lookup, co-occurrence baseline, Seq2Seq LSTM, LSTM with Bahdanau attention, fine-tuned BanglaT5, and fine-tuned mBART-50",
      "Fine-tuned mBART-50 achieved the best results (BLEU 0.43-0.48, chrF 0.82-0.83), roughly doubling the LSTM baseline",
      "Preprocessed a 1,866-pair parallel corpus derived from the ONUBAD dataset with an 80/10/10 stratified split",
      "Co-authored a full IEEE-format research paper analyzing dialect-level translation difficulty",
    ],
    github: "", // TODO: add the repo link if it's public
    liveDemo: "",
  },
 {
  name: "Space Plumber",
  description:"A 3D space rescue game where the player pilots a spaceship through a hazardous space corridor, repairs damaged satellites, battles aliens and meteors, collects health pods, and tries to achieve the highest score.",

  technologies: [
    "Python",
    "PyOpenGL",
    "OpenGL",
    "GLUT",
    "GLU"
  ],

  features: [
    "3D spaceship gameplay",
    "Satellite repair mission",
    "Alien enemies with projectile attacks",
    "Falling meteor hazards",
    "Missile and repair laser systems",
    "Health pickup system",
    "Ship health and damage system",
    "First-person and third-person camera modes",
    "Cheat mode with invincibility and auto-repair",
    "Pause and restart system",
    "Score and persistent high-score system",
    "Mission completion and game-over scorecards",
    "Dynamic space corridor with stars and animated environment",
    "Distance tracking and gameplay HUD",
    "Animated spaceship engines and navigation lights"
  ],

  github: "",
  liveDemo: ""
},
],// TODO: only real achievements
}