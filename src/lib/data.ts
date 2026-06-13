// Portfolio data — single source of truth for all section content

export const personalInfo = {
  name: 'Karthik Kuramdasu',
  firstName: 'Karthik',
  lastName: 'Kuramdasu',
  title: 'Full-Stack Developer',
  location: 'Visakhapatnam, India',
  email: 'karthikuramdasu@gmail.com',
  phone: '+91 8977733389',
  tagline: 'Full-Stack Developer building scalable systems & intelligent interfaces.',
  subTagline: 'React · Node.js · AI/GenAI · crafting SaaS that solves real problems.',
  objective:
    'Product-focused Full Stack Developer with strong foundations in React, Node.js, Express, and SQL/NoSQL databases. Experienced in building scalable systems with authentication, REST APIs, and deployment workflows. Exploring AI/GenAI, building SaaS solutions integrating LLM APIs for intelligent, user-centric applications.',
  roles: ['FULL STACK', 'REACT', 'AI/GENAI', 'SAAS'],
  socials: {
    github: 'https://github.com/K007-K',
    linkedin: 'https://linkedin.com/in/karthik-kuramdasu',
    leetcode: 'https://leetcode.com/u/karthik_kuramdasu',
    codechef: 'https://codechef.com/users/karthik_kuramdasu',
    email: 'mailto:karthikuramdasu@gmail.com',
    whatsapp: 'https://wa.me/918977733389',
  },
  resumeUrl: '/Karthik_Kuramdasu_Resume.pdf',
}

export const aboutBullets = [
  'Skilled in React, Node.js, Express, SQL/NoSQL databases, and REST APIs',
  'Love turning complex ideas into simple, elegant solutions',
  'Always experimenting with emerging AI tools and GenAI models',
  'Building SaaS products that solve real-world problems',
  'Quick learner who thrives in fast-paced, collaborative environments',
]

export const skills = {
  languages: {
    icon: '💻',
    label: 'Languages',
    items: ['C', 'C++', 'Python', 'JavaScript (ES6+)', 'SQL', 'HTML5', 'CSS3'],
  },
  frontend: {
    icon: '⚛️',
    label: 'Frontend',
    items: ['React.js', 'Tailwind CSS', 'Framer Motion'],
  },
  backend: {
    icon: '🔧',
    label: 'Backend',
    items: ['Node.js', 'Express.js', 'REST APIs', 'JWT Auth'],
  },
  databases: {
    icon: '🗄️',
    label: 'Databases & Platforms',
    items: ['MySQL', 'MongoDB', 'PostgreSQL', 'Supabase'],
  },
  tools: {
    icon: '🛠️',
    label: 'Tools & Others',
    items: ['Git', 'GitHub', 'Postman', 'Vercel', 'Render', 'VS Code', 'Google Colab'],
  },
}

export const experience = [
  {
    role: 'Full Stack Developer Intern',
    company: 'Unisoft Agency',
    type: 'Remote',
    period: 'Jan 2025 – Mar 2025',
    highlights: [
      'Developed and deployed a real-time debate platform enabling multi-room discussions and live participant interaction using React.js, Node.js, Express.js, and Socket.io.',
      'Implemented scalable WebSocket-based communication architecture for instant messaging, room synchronization, and real-time event handling.',
      'Designed secure REST APIs and integrated JWT for user session management and protected routes.',
      'Optimized frontend responsiveness and collaborated using Git/GitHub workflows, modular coding practices, and Postman API testing.',
    ],
  },
]

export const projects = [
  {
    title: 'FedEx DCA Control Tower',
    tech: ['Next.js 14', 'TypeScript', 'Supabase PostgreSQL', 'FastAPI', 'Tailwind CSS'],
    description:
      'Enterprise-grade governance platform for managing outsourced debt collection operations across multiple agencies, regions, and organizational hierarchies with automated allocation and SLA tracking.',
    github: 'https://github.com/K007-K/fedex-dca-control-tower',
    live: 'https://fedex-dca-control-tower.vercel.app',
  },
  {
    title: 'SmartCart AI',
    tech: ['React.js', 'Tailwind CSS', 'LLM APIs'],
    description:
      'Conversational shopping assistant that helps users compare products, discover relevant options, and make purchase decisions from natural-language prompts.',
    github: 'https://github.com/K007-K/SmartCartAI',
    live: 'https://thesmartcartai.netlify.app/',
  },
  {
    title: 'Roameo',
    tech: ['React.js', 'Supabase', 'Gemini API', 'Groq API'],
    description:
      'AI travel planning application that creates destination-specific itineraries by combining user preferences, trip duration, and budget constraints.',
    github: 'https://github.com/K007-K/AI-Travel-Assistant',
    live: 'https://roameo-rz80.onrender.com/',
  },
]

export const education = {
  degree: 'Bachelor of Technology, Computer Science and Engineering',
  institution: 'Anil Neerukonda Institute of Technology and Sciences',
  shortName: 'ANITS',
  period: 'Sep 2023 – Present',
  cgpa: '8.83 / 10.0',
  location: 'Visakhapatnam, India',
}

export const certifications = [
  {
    name: 'Smart India Hackathon (SIH)',
    issuer: 'Semi-Finalist',
    description: 'Qualified to Semi-Finals in SIH at national level',
  },
  {
    name: 'FedEx SIH @ IIT Madras',
    issuer: 'Semi-Finalist',
    description: 'Qualified to Semi-Finals for FedEx problem statement',
  },
]

export const achievements = [
  {
    title: 'Smart India Hackathon Semi-Finalist',
    description: 'Qualified to Semi-Finals in SIH & FedEx SIH (IIT Madras)',
    icon: '🏆',
  },
  {
    title: 'Competitive Hackathons',
    description: 'Participated in Tata Elxsi Hackathon, 24-Hour Hackathon (GVP), and VoyageHack 3.0',
    icon: '💻',
  },
]
