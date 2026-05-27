// Company Information
export const companyInfo = {
  name: "BE Construction & Welding Works",
  shortName: "BE Construction",
  tagline: "Building Dreams, Forging Excellence",
  description: "Leading construction and welding company specializing in industrial, residential, and commercial projects with over 15 years of experience.",
  established: 2008,
  email: "keshwarpandit80029@gmail.com",
  phone: "+91 80029 44742",
  whatsapp: "+918002944742",
  address: {
    street: "123 Industrial Area, Phase II",
    city: "New Delhi",
    state: "Delhi",
    zipCode: "110020",
    country: "India"
  },
  social: {
    facebook: "https://facebook.com/beconstruction",
    instagram: "https://instagram.com/beconstruction",
    twitter: "https://twitter.com/beconstruction",
    linkedin: "https://linkedin.com/company/beconstruction",
    youtube: "https://youtube.com/beconstruction"
  },
  workingHours: {
    weekdays: "Mon - Fri: 8:00 AM - 6:00 PM",
    saturday: "Saturday: 8:00 AM - 2:00 PM",
    sunday: "Sunday: Closed"
  },
  location: {
    lat: 28.6139,
    lng: 77.2090
  }
};

// Services
export const services = [
  {
    id: 1,
    title: "Welding Work",
    slug: "welding-work",
    description: "Professional welding services for all types of metals including steel, aluminum, and stainless steel.",
    icon: "FaWelding",
    features: [
      "MIG/TIG Welding",
      "Arc Welding",
      "Spot Welding",
      "Pipe Welding",
      "Structural Welding"
    ],
    benefits: [
      "Certified welders",
      "High-quality materials",
      "Precision work",
      "On-time delivery"
    ]
  },
  {
    id: 2,
    title: "Steel Fabrication",
    slug: "steel-fabrication",
    description: "Custom steel fabrication for industrial, commercial, and residential applications.",
    icon: "FaHammer",
    features: [
      "Custom metal structures",
      "Beams and columns",
      "Staircases and railings",
      "Industrial frameworks"
    ],
    benefits: [
      "Precision engineering",
      "Durable constructions",
      "Custom designs",
      "Quality assurance"
    ]
  },
  {
    id: 3,
    title: "Industrial Construction",
    slug: "industrial-construction",
    description: "Complete industrial construction solutions including factories, warehouses, and manufacturing facilities.",
    icon: "FaIndustry",
    features: [
      "Factory buildings",
      "Warehouses",
      "Manufacturing units",
      "Industrial sheds"
    ],
    benefits: [
      "Turnkey solutions",
      "Project management",
      "Quality materials",
      "Safety compliance"
    ]
  },
  {
    id: 4,
    title: "Residential Construction",
    slug: "residential-construction",
    description: "Building dream homes with modern designs and premium quality construction.",
    icon: "FaHome",
    features: [
      "New home construction",
      "Renovations",
      "Extensions",
      "Interior finishing"
    ],
    benefits: [
      "Experienced architects",
      "Quality materials",
      "Timely completion",
      "Budget-friendly"
    ]
  },
  {
    id: 5,
    title: "Metal Works",
    slug: "metal-works",
    description: "Custom metal work solutions for decorative and functional applications.",
    icon: "FaTools",
    features: [
      "Decorative metal art",
      "Custom grilles",
      "Metal furniture",
      "Architectural metalwork"
    ],
    benefits: [
      "Artistic designs",
      "Skilled craftsmen",
      "Custom finishes",
      "Long-lasting"
    ]
  },
  {
    id: 6,
    title: "Roofing Structure",
    slug: "roofing-structure",
    description: "Professional roofing solutions for all types of buildings.",
    icon: "FaWarehouse",
    features: [
      "Metal roofing",
      "Truss fabrication",
      "Waterproofing",
      "Roof repairs"
    ],
    benefits: [
      "Weather resistant",
      "Long-lasting",
      "Energy efficient",
      "Professional installation"
    ]
  },
  {
    id: 7,
    title: "Gate & Grill Fabrication",
    slug: "gate-grill-fabrication",
    description: "Custom gates and grills for homes, offices, and industrial facilities.",
    icon: "FaDoorClosed",
    features: [
      "Security gates",
      "Decorative grills",
      "Automatic gates",
      "Custom designs"
    ],
    benefits: [
      "Enhanced security",
      "Aesthetic appeal",
      "Durable materials",
      "Custom finishes"
    ]
  },
  {
    id: 8,
    title: "Machine Welding",
    slug: "machine-welding",
    description: "Precision machine welding for industrial equipment and machinery.",
    icon: "FaCog",
    features: [
      "CNC welding",
      "Robotic welding",
      "Equipment repair",
      "Custom fabrication"
    ],
    benefits: [
      "High precision",
      "Consistent quality",
      "Fast turnaround",
      "Expert technicians"
    ]
  },
  {
    id: 9,
    title: "Civil Construction",
    slug: "civil-construction",
    description: "Complete civil construction services for all types of projects.",
    icon: "FaBuilding",
    features: [
      "Foundation work",
      "Structural construction",
      "Finishing work",
      "Infrastructure development"
    ],
    benefits: [
      "Licensed contractors",
      "Quality materials",
      "Project management",
      "Code compliance"
    ]
  }
];

// Testimonials (sample data)
export const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    company: "Kumar Industries",
    rating: 5,
    comment: "Excellent work on our factory construction. The team was professional and delivered on time.",
    project: "Industrial Warehouse",
    date: "2024-03-15"
  },
  {
    id: 2,
    name: "Priya Sharma",
    company: "Homeowner",
    rating: 5,
    comment: "BE Construction built our dream home with amazing attention to detail. Highly recommended!",
    project: "Residential Villa",
    date: "2024-02-20"
  },
  {
    id: 3,
    name: "Amit Patel",
    company: "Patel Enterprises",
    rating: 4,
    comment: "Great welding work for our industrial equipment. Quality workmanship and fair pricing.",
    project: "Machine Fabrication",
    date: "2024-01-10"
  }
];

// Statistics
export const statistics = [
  { id: 1, label: "Years of Experience", value: 15, suffix: "+", icon: "FaCalendar" },
  { id: 2, label: "Projects Completed", value: 500, suffix: "+", icon: "FaProjectDiagram" },
  { id: 3, label: "Satisfied Clients", value: 350, suffix: "+", icon: "FaUsers" },
  { id: 4, label: "Expert Workers", value: 75, suffix: "+", icon: "FaHardHat" }
];

// FAQ
export const faqs = [
  {
    question: "What types of welding services do you offer?",
    answer: "We offer a comprehensive range of welding services including MIG, TIG, arc welding, spot welding, and structural welding for various metals including steel, aluminum, and stainless steel."
  },
  {
    question: "Do you provide free estimates?",
    answer: "Yes, we provide free estimates for all projects. Our team will visit your site, understand your requirements, and provide a detailed quote."
  },
  {
    question: "Are you licensed and insured?",
    answer: "Yes, BE Construction & Welding Works is fully licensed, bonded, and insured. All our workers are certified professionals."
  },
  {
    question: "What is your typical project timeline?",
    answer: "Project timelines vary based on scope and complexity. A small residential project may take 2-4 weeks, while large industrial projects can take several months. We always provide a detailed timeline before starting."
  },
  {
    question: "Do you offer warranties on your work?",
    answer: "Yes, we provide warranties on all our workmanship. The warranty period varies by project type and is clearly outlined in our contract."
  }
];

// Navigation Links
export const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Projects", path: "/projects" },
  { name: "Gallery", path: "/gallery" },
  { name: "Testimonials", path: "/testimonials" },
  { name: "Contact", path: "/contact" },
  { name: "Get Quote", path: "/quote", isButton: true }
];

// Admin Navigation - Full Menu
export const adminNavLinks = [
  { name: "Dashboard", path: "/admin", icon: "FaChartBar", group: "main" },
  { name: "Hero Slider", path: "/admin/hero-slider", icon: "FaImages", group: "content" },
  { name: "Projects", path: "/admin/projects", icon: "FaProjectDiagram", group: "content" },
  { name: "Services", path: "/admin/services", icon: "FaTools", group: "content" },
  { name: "Gallery", path: "/admin/gallery", icon: "FaImages", group: "content" },
  { name: "Testimonials", path: "/admin/testimonials", icon: "FaStar", group: "content" },
  { name: "Team Members", path: "/admin/team", icon: "FaUsers", group: "content" },
  { name: "Blog Posts", path: "/admin/blog", icon: "FaNewspaper", group: "content" },
  { name: "Quote Requests", path: "/admin/quotes", icon: "FaFileAlt", group: "management" },
  { name: "Inquiries", path: "/admin/inquiries", icon: "FaEnvelope", group: "management" },
  { name: "Users", path: "/admin/users", icon: "FaUserShield", group: "management" },
  { name: "Activity Logs", path: "/admin/activity-logs", icon: "FaHistory", group: "analytics" },
  { name: "Analytics", path: "/admin/analytics", icon: "FaChartLine", group: "analytics" },
  { name: "Notifications", path: "/admin/notifications", icon: "FaBell", group: "analytics" },
  { name: "Website Settings", path: "/admin/settings", icon: "FaCog", group: "settings" },
  { name: "SEO Settings", path: "/admin/seo", icon: "FaSearch", group: "settings" }
];

// Admin Groups
export const adminGroups = [
  {
    name: "Main",
    key: "main",
    items: ["FaChartBar"]
  },
  {
    name: "Content Management",
    key: "content",
    items: ["FaImages", "FaProjectDiagram", "FaTools", "FaImages", "FaStar", "FaUsers", "FaNewspaper"]
  },
  {
    name: "Management",
    key: "management",
    items: ["FaFileAlt", "FaEnvelope", "FaUserShield"]
  },
  {
    name: "Analytics",
    key: "analytics",
    items: ["FaHistory", "FaChartLine", "FaBell"]
  },
  {
    name: "Settings",
    key: "settings",
    items: ["FaCog", "FaSearch"]
  }
];

export default {
  companyInfo,
  services,
  testimonials,
  statistics,
  faqs,
  navLinks,
  adminNavLinks,
  adminGroups
};