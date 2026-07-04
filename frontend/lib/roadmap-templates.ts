export interface RoadmapStep {
  week: number;
  title: string;
  description: string;
}

export const ROADMAPS: Record<string, RoadmapStep[]> = {
  "Frontend Developer": [
    {
      week: 1,
      title: "HTML & CSS",
      description: "Master semantic HTML and responsive layouts.",
    },
    {
      week: 2,
      title: "JavaScript ES6",
      description: "Learn modern JavaScript fundamentals.",
    },
    {
      week: 3,
      title: "React Fundamentals",
      description: "Understand components, props and state.",
    },
    {
      week: 4,
      title: "React Hooks",
      description: "Learn useState, useEffect and custom hooks.",
    },
    {
      week: 5,
      title: "Tailwind CSS",
      description: "Build beautiful responsive UIs.",
    },
    {
      week: 6,
      title: "Next.js",
      description: "Create production-ready React applications.",
    },
    {
      week: 7,
      title: "Performance Optimization",
      description: "Improve loading speed and rendering.",
    },
    {
      week: 8,
      title: "Portfolio Project",
      description: "Build and deploy a complete frontend project.",
    },
  ],

  "Backend Developer": [
    {
      week: 1,
      title: "Node.js Basics",
      description: "Understand Node runtime and modules.",
    },
    {
      week: 2,
      title: "Express.js",
      description: "Build REST APIs.",
    },
    {
      week: 3,
      title: "MongoDB",
      description: "CRUD operations and database design.",
    },
    {
      week: 4,
      title: "Authentication",
      description: "JWT, bcrypt and user management.",
    },
    {
      week: 5,
      title: "PostgreSQL",
      description: "Relational database fundamentals.",
    },
    {
      week: 6,
      title: "Supabase",
      description: "Authentication and database integration.",
    },
    {
      week: 7,
      title: "API Security",
      description: "Protect backend services.",
    },
    {
      week: 8,
      title: "Backend Project",
      description: "Develop a scalable backend application.",
    },
  ],

  "Full Stack Developer": [
    {
      week: 1,
      title: "HTML & CSS",
      description: "Responsive layouts and UI fundamentals.",
    },
    {
      week: 2,
      title: "JavaScript",
      description: "Core JavaScript and ES6 features.",
    },
    {
      week: 3,
      title: "React",
      description: "Components, Hooks and Routing.",
    },
    {
      week: 4,
      title: "Node.js",
      description: "Backend development fundamentals.",
    },
    {
      week: 5,
      title: "Express.js",
      description: "REST APIs and middleware.",
    },
    {
      week: 6,
      title: "MongoDB",
      description: "Database design and CRUD.",
    },
    {
      week: 7,
      title: "Next.js",
      description: "Full-stack React framework.",
    },
    {
      week: 8,
      title: "Authentication",
      description: "JWT, OAuth and security.",
    },
    {
      week: 9,
      title: "Deployment",
      description: "Deploy using Vercel and Supabase.",
    },
    {
      week: 10,
      title: "Capstone Project",
      description: "Build a production-ready full-stack application.",
    },
  ],

  "AI Engineer": [
    {
      week: 1,
      title: "Python",
      description: "Python programming fundamentals.",
    },
    {
      week: 2,
      title: "NumPy & Pandas",
      description: "Data manipulation and analysis.",
    },
    {
      week: 3,
      title: "Machine Learning",
      description: "Supervised and unsupervised learning.",
    },
    {
      week: 4,
      title: "Deep Learning",
      description: "Neural networks and optimization.",
    },
    {
      week: 5,
      title: "TensorFlow",
      description: "Build deep learning models.",
    },
    {
      week: 6,
      title: "PyTorch",
      description: "Advanced deep learning workflows.",
    },
    {
      week: 7,
      title: "LLMs & Generative AI",
      description: "Prompt engineering and transformers.",
    },
    {
      week: 8,
      title: "AI Deployment",
      description: "Deploy ML models using APIs.",
    },
    {
      week: 9,
      title: "MLOps",
      description: "Model versioning and pipelines.",
    },
    {
      week: 10,
      title: "AI Capstone",
      description: "Build an end-to-end AI application.",
    },
  ],

  "Data Scientist": [
    {
      week: 1,
      title: "Python",
      description: "Programming for data science.",
    },
    {
      week: 2,
      title: "Statistics",
      description: "Probability and statistical concepts.",
    },
    {
      week: 3,
      title: "Pandas",
      description: "Data cleaning and analysis.",
    },
    {
      week: 4,
      title: "Data Visualization",
      description: "Matplotlib, Seaborn and Plotly.",
    },
    {
      week: 5,
      title: "Machine Learning",
      description: "Regression and classification.",
    },
    {
      week: 6,
      title: "SQL",
      description: "Querying relational databases.",
    },
    {
      week: 7,
      title: "Feature Engineering",
      description: "Prepare datasets for ML.",
    },
    {
      week: 8,
      title: "Model Evaluation",
      description: "Metrics and validation.",
    },
    {
      week: 9,
      title: "Deployment",
      description: "Serve ML models.",
    },
    {
      week: 10,
      title: "Data Science Project",
      description: "Complete an end-to-end analytics project.",
    },
  ],
};

