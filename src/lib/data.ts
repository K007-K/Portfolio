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
    role: 'Web Developer Intern',
    company: 'ApexPlanet',
    type: 'Remote',
    period: 'May 2025 – June 2025',
    highlights: [
      'Built 5+ responsive web pages from Figma designs using HTML5, CSS3, JavaScript.',
      'Improved page load speed by 30% via lazy loading, semantic HTML, and CSS media queries.',
      'Resolved 15+ UI/UX bugs improving cross-browser compatibility and accessibility.',
    ],
  },
]

export const projects = [
  {
    title: 'FedEx DCA Control Tower',
    tech: ['React.js', 'Node.js', 'Chart.js', 'Express.js', 'JWT'],
    description:
      'Real-time logistics monitoring dashboard with role-based JWT authentication, RESTful APIs, and interactive Chart.js visualizations for operational intelligence.',
    github: 'https://github.com/K007-K',
    live: '',
  },
  {
    title: 'SmartCart AI',
    tech: ['React.js', 'LLM APIs', 'Tailwind CSS'],
    description:
      'AI-powered shopping assistant integrating LLM API for intelligent product recommendations, with optimized React state management and responsive UI.',
    github: 'https://github.com/K007-K',
    live: '',
  },
  {
    title: 'Roameo',
    tech: ['React.js', 'Supabase', 'LLM APIs', 'Groq', 'Gemini'],
    description:
      'Full-stack AI travel planner generating personalized itineraries with budget optimization, powered by Groq and Gemini LLM APIs with Supabase backend.',
    github: 'https://github.com/K007-K',
    live: '',
  },
  {
    title: 'Deb8',
    tech: ['React.js', 'Socket.io', 'Node.js', 'Express.js'],
    description:
      'Live debate platform with WebSocket architecture for real-time messaging, topic management, and audience voting with persistent room state.',
    github: 'https://github.com/K007-K',
    live: '',
  },
]

export const education = {
  degree: 'B.Tech in Computer Science and Engineering',
  institution: 'Anil Neerukonda Institute of Technology and Sciences',
  shortName: 'ANITS',
  period: 'Sep 2023 – Present',
  cgpa: '8.83 / 10.00',
  location: 'Visakhapatnam, India',
}

export const certifications = [
  {
    name: 'Smart India Hackathon (SIH)',
    issuer: 'Government of India',
    description: 'Competed and showcased at national level',
  },
  {
    name: 'FedEx SIH @ IIT Madras',
    issuer: 'FedEx & IIT Madras',
    description: 'Selected for FedEx problem statement',
  },
]

export const achievements = [
  {
    title: 'Stand Supervisor — IND vs NZ T20I',
    description: 'Led operations at ACA Stadium, Visakhapatnam',
    icon: '🏏',
  },
  {
    title: 'Smart India Hackathon',
    description: 'Competed at national level SIH & FedEx SIH (IIT Madras)',
    icon: '🏆',
  },
  {
    title: 'Multiple Hackathons',
    description: 'Tata Elxsi, 24-Hour GVP, VoyageHack 3.0',
    icon: '💡',
  },
]
