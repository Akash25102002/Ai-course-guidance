export const CATEGORIES = [
  { label: "Software Engineering", value: "Software Engineering" },
  { label: "Data Science & AI", value: "Data Science & AI" },
  { label: "Product Management", value: "Product Management" },
  { label: "Design & UX", value: "Design & UX" },
  { label: "Marketing & Growth", value: "Marketing & Growth" },
  { label: "Business & Finance", value: "Business & Finance" },
];

export const DIFFICULTIES = [
  { label: "Beginner", value: "Beginner" },
  { label: "Intermediate", value: "Intermediate" },
  { label: "Advanced", value: "Advanced" },
];

export const DURATIONS = [
  { label: "2 Weeks (Express)", value: "2 Weeks" },
  { label: "4 Weeks (Standard)", value: "4 Weeks" },
  { label: "8 Weeks (Comprehensive)", value: "8 Weeks" },
  { label: "12 Weeks (Mastery)", value: "12 Weeks" },
];

export const LANGUAGES = [
  { label: "English", value: "English" },
  { label: "Spanish", value: "Spanish" },
  { label: "French", value: "French" },
  { label: "German", value: "German" },
  { label: "Chinese", value: "Chinese" },
  { label: "Hindi", value: "Hindi" },
];

export const FEATURES = [
  {
    title: "AI-Powered Curriculum",
    description: "Instantly compile weeks of reading materials, lecture structures, and module progressions from simple topic keywords.",
    icon: "Sparkles",
  },
  {
    title: "Interactive Coding Practice",
    description: "Write code directly on the platform with instant syntax checking, guidelines, and custom-generated tasks.",
    icon: "Code",
  },
  {
    title: "AI Quizzes & Exams",
    description: "Evaluate your cognitive progress with dynamically compiled multiple-choice questions, fill-in-the-blanks, and coding exams.",
    icon: "GraduationCap",
  },
  {
    title: "Milestone-Driven Projects",
    description: "Get real-world architectural guidelines, file configurations, and task details to implement complete applications from scratch.",
    icon: "FolderGit",
  },
  {
    title: "Professional Certificates",
    description: "Earn validated e-certificates automatically upon completing 100% of the lessons, verifying your expertise.",
    icon: "Award",
  },
  {
    title: "Interactive Streak Analytics",
    description: "Track consecutive learning days and streaks. Monitor your completed hours, certificates, and achievements.",
    icon: "Flame",
  },
];

export const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Senior Frontend dev @ Vercel",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    feedback: "This tool generated an 8-week Rust course that took me from absolute zero to writing low-level server engines. The project instructions and architecture blueprints were spot-on.",
  },
  {
    name: "Liam O'Connor",
    role: "Computer Science Student",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    feedback: "The coding practice tasks and standard interview questions saved me weeks of prep time. I passed my machine learning internship interview thanks to this custom curriculum.",
  },
  {
    name: "Amina Al-Jamil",
    role: "Lead Designer @ Figma",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    feedback: "I needed to understand the technical side of WebAssembly. The generated 4-week path was highly visual, perfectly simplified, and tailored for a design architect.",
  },
];

export const PRICING_PLANS = [
  {
    name: "Hobbyist",
    price: "0",
    description: "Kickstart your learning adventure with AI helper generation.",
    features: [
      "Generate 2 courses per month",
      "Standard lesson explanations",
      "Progress tracking & bookmarks",
      "Community support",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro Learner",
    price: "19",
    description: "Maximize your skill growth with unlimited courses and interactive exercises.",
    features: [
      "Unlimited course generation",
      "Interactive coding panels with test cases",
      "Premium projects & deployment blueprints",
      "Generative quiz sheets",
      "Priority certificate validation",
      "Dedicated 24/7 AI Chat Tutor",
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Team Access",
    price: "49",
    description: "Perfect for engineering groups and enterprise training tracks.",
    features: [
      "Everything in Pro Learner",
      "Collaborative course blueprints",
      "Manager/Admin course assignments",
      "Advanced progress analytics boards",
      "SAML SSO Authentication Integration",
    ],
    cta: "Contact Enterprise",
    popular: false,
  },
];

export const FAQS = [
  {
    question: "How does the AI Course Generator work?",
    answer: "Our system combines Gemini's advanced 2.5-flash model with specialized system architecture rules. When you choose a topic, difficulty, and goal, it drafts a complete module curriculum. As you study, the AI generates explanations, tests, and real-world project guides on-demand to save loading times and avoid thin content.",
  },
  {
    question: "Can I earn certificates for generated courses?",
    answer: "Yes! When you complete all lessons in a course, our database registers a unique certificate under your profile, which can be viewed or printed anytime.",
  },
  {
    question: "What languages are supported?",
    answer: "You can generate courses in English, Spanish, French, German, Chinese, and Hindi. The course structure and details will compile completely in your chosen language.",
  },
  {
    question: "Is there a limit on how many courses I can generate?",
    answer: "The free Hobbyist tier lets you generate up to 2 full courses per month. The Pro Learner tier provides unlimited generations, unlimited interactive coding practice tasks, and custom certificates.",
  },
];
