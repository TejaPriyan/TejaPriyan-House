// ALL portfolio text, links, colors and discoveries live here.
// Empty URL strings automatically hide their buttons.
// ALL portfolio text, links, colors and discoveries live here.
// Empty URL strings automatically hide their buttons.
export const portfolio = {
  name: 'Teja Priyan',
  title: 'Full Stack Developer & AI Specialist',
  tagline: 'Building intelligent systems, scalable web apps & exploring 3D worlds.',
  about: 'Computer Science graduate (May 2025) and Full Stack Developer specialized in Java Spring Boot, modern frontend architectures, and Computer Vision / AI-driven solutions. Experienced in developing real-time object detection systems (CNN/YOLO), full-stack enterprise portals, interactive gaming hubs, and autonomous agent frameworks.',
  colors: { bg: '#070b1e', navy: '#0d1530', cream: '#f3e6c8', orange: '#ff9d4d', green: '#6aa84f', red: '#e8454a' },
  houseText: {
    pictureTitle: 'THIS IS WHERE THE JOURNEY STARTED.',
    construction: 'Under Construction — Next-generation agent systems & immersive 3D simulations.',
    future: 'THE FUTURE LAB\n\n• Next-Gen Computer Vision\n• Autonomous Agent Workflows\n• 3D Interactive Web Ecosystems',
    final: ["HEY, I'M TEJA PRIYAN.", 'WELCOME TO MY 3D WORLD.', 'THANKS FOR EXPLORING MY PORTFOLIO!'],
  },
  // [name, color, description]
  skills: [
    ['Java', '#e76f00', 'Enterprise backend systems, Spring Boot microservices & APIs.'],
    ['Python', '#3776ab', 'Computer Vision, PyTorch, YOLO, and AI/ML prototypes.'],
    ['Spring Boot', '#6db33f', 'RESTful services, Spring Security, and scalable backend architecture.'],
    ['JavaScript', '#d4b106', 'Modern ES6+, interactive web applications and 3D graphics.'],
    ['React', '#2bb5d8', 'Component-driven interactive web applications & Three.js canvas.'],
    ['OpenCV', '#27a844', 'Real-time computer vision, frame analysis and video processing.'],
    ['YOLO', '#ff6b9d', 'Real-time object detection, traffic monitoring & helmet detection.'],
    ['SQL', '#4b8bbe', 'Relational database schema design, querying, and optimization.'],
    ['HTML5', '#e34c26', 'Semantic structure and modern responsive web markup.'],
    ['CSS3', '#2965f1', 'Responsive styling, Tailwind design systems & animations.'],
    ['Git & GitHub', '#f05032', 'Version control, collaborative workflows & CI/CD.'],
    ['AI & ML', '#4aa3ff', 'Deep learning, CNN architectures, and autonomous agent systems.'],
  ].map(([name, color, desc]) => ({ name, color, desc })),
  projects: [
    {
      title: 'AI Helmet Detection',
      description: 'Advanced real-time computer vision system using CNN & YOLO to detect riders without helmets with 95%+ accuracy for safety compliance and traffic monitoring.',
      technologies: ['Python', 'YOLO', 'OpenCV', 'Deep Learning'],
      github: 'https://github.com/TejaPriyan',
      liveDemo: '',
      category: 'AI',
      featured: true,
    },
    {
      title: 'Hotel Booking System',
      description: 'Responsive full-stack hotel management platform with room listings, real-time booking, user auth, and admin dashboard.',
      technologies: ['Java', 'Spring Boot', 'SQL', 'React'],
      github: 'https://github.com/TejaPriyan',
      liveDemo: 'https://veltechhotel.onrender.com/',
      category: 'Web',
      featured: true,
    },
    {
      title: 'Teja Game Hub',
      description: 'Interactive gaming portal showcasing creative frontend development, responsive game logic, and engaging web arcade experiences.',
      technologies: ['JavaScript', 'HTML5 Canvas', 'CSS3', 'Audio API'],
      github: 'https://github.com/TejaPriyan',
      liveDemo: 'https://tejagamehub.netlify.app/',
      category: 'Web',
      featured: true,
    },
    {
      title: 'TejaX Autonomous Platform',
      description: 'Personal autonomous agent platform combining computer vision, NLP reasoning, and autonomous task workflows.',
      technologies: ['Python', 'Autonomous Agents', 'NLP', 'OpenCV'],
      github: 'https://github.com/TejaPriyan',
      liveDemo: 'https://myself-tejapriyan.onrender.com/',
      category: 'AI',
      featured: true,
    },
  ],
  tejax: {
    VISION: 'Computer vision pipelines with OpenCV & YOLOv8 for real-time safety and traffic analysis.',
    BACKEND: 'High-concurrency Java Spring Boot microservices, REST APIs, and database engineering.',
    AGENTS: 'Autonomous agent frameworks exploring multi-step planning, tool use, and reasoning.',
    STACK: 'Python, Java, Spring Boot, React, Three.js, PostgreSQL, OpenCV, Git.',
    ACTIVE_EXPERIMENTS: 'Building 3D interactive web spaces and intelligent vision agents.',
  },
  education: [
    'Bachelor of Computer Science — Graduated May 2025 (GPA: 8.5 / 10)',
    'Java Full Stack Developer Program — 6-Month Professional Certification (Sep 2025 – Mar 2026)',
  ],
  experience: [
    'Java Full Stack Developer Training (Sep 2025 – Mar 2026): Mastered enterprise Java, Spring Boot microservices, REST APIs, and database architecture.',
    'AI & Computer Vision Projects Developer (2023 – Present): Engineered CNN/YOLO helmet detection, smart traffic analysis, and autonomous platforms.',
  ],
  certifications: [
    'Java Full Stack Developer Professional Certification (2026)',
    'Computer Vision & Deep Learning Specialist (OpenCV / YOLO / CNNs)',
    'Enterprise Web Development with Spring Boot & Microservices',
  ],
  contact: { email: 'teja1616150@gmail.com' },
  socials: {
    github: 'https://github.com/TejaPriyan',
    linkedin: 'https://www.linkedin.com/in/tejapriyan',
    portfolio: 'https://portfoliotejapriyan.vercel.app/',
  },
  // One entry per findable place. `id` is referenced by src/world/layout.js
  discoveries: [
    { id: 'beginning', title: 'THE BEGINNING' },
    { id: 'about', title: 'ABOUT ME' },
    { id: 'desk', title: 'DEVELOPER DESK' },
    { id: 'lab', title: 'THE AI LAB' },
    { id: 'archive', title: 'PROJECT ARCHIVE' },
    { id: 'skills', title: 'SKILLS WALL' },
    { id: 'kitchen', title: 'DEVELOPER FUEL' },
    { id: 'contact', title: "LET'S CONNECT" },
    { id: 'future', title: 'THE FUTURE ROOM' },
    { id: 'final', title: 'FINAL ENCOUNTER' },
  ],
}
