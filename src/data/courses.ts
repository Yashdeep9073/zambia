
export interface Course {
  id: string;
  name: string;
  type: 'Undergraduate' | 'Postgraduate' | 'Diploma' | 'Certificate';
  description: string;
  whyStudy: string[];
  careerOpportunities: string[];
  averageSalary: string;
  tuition: string;
  duration: string;
  tags: string[];
}

export interface University {
  id: string;
  rank: number;
  name: string;
  location: string;
  website?: string;
  isPartner: boolean;
  scholarship: string;
  features: string[];
  logo?: string;
  // New Fields
  establishedYear?: string;
  type?: string;
  accreditation?: string[];
  campusSize?: string;
  studentCount?: string;
  internationalCount?: string;
  facultyCount?: string;
  youtubeUrl?: string; // For video embed
  whyStudy?: string[];
  careerOutcomes?: string[];
  facilities?: string[];
  costEstimate?: {
    tuition: string;
    accommodation: string;
    meals: string;
  };
  faculties?: string[];
  galleryImages?: string[];
}

const BASE_COURSES = [
  "Computer Science", "Civil Engineering", "Mechanical Engineering", "Electrical Engineering", 
  "Medicine (MBBS)", "Pharmacy", "Nursing", "Public Health", "Business Administration (MBA)", 
  "Economics", "Accounting", "Law", "International Relations", "Agriculture", "Biotechnology", 
  "Architecture", "Fashion Design", "Mass Communication", "Psychology", "Data Science",
  "Artificial Intelligence", "Cybersecurity", "Cloud Computing", "Software Engineering", 
  "Information Technology", "Robotics Engineering", "Mechatronics Engineering", 
  "Renewable Energy Engineering", "Petroleum Engineering", "Mining Engineering", 
  "Agricultural Engineering", "Environmental Science", "Microbiology", "Radiography", 
  "Physiotherapy", "Dentistry", "Urban Planning", "Interior Design", "Graphic Design", 
  "Film & Media Studies", "Journalism", "Political Science", "Law (LLB)", "Criminology", 
  "Sociology", "Finance", "Banking & Insurance", "Marketing", "Digital Marketing", 
  "Human Resource Management", "Entrepreneurship", "Supply Chain Management", 
  "Logistics & Transport Management", "Aviation Management", "Hospitality & Hotel Management", 
  "Tourism Management", "Culinary Arts", "Education", "Special Education", "Mathematics", 
  "Physics", "Chemistry", "Computer Applications (BCA)", "Business Administration (BBA)", 
  "Project Management"
];

// Remove duplicates and sort
export const COURSES_LIST = Array.from(new Set(BASE_COURSES)).sort();

// Helper to generate course data
const generateCourseData = (name: string): Course => {
  return {
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    type: name.includes('MBA') || name.includes('M.Tech') ? 'Postgraduate' : 'Undergraduate',
    description: `The ${name} program is designed to equip students with cutting-edge skills and theoretical knowledge essential for the modern global workforce. This comprehensive course covers core principles, advanced methodologies, and practical applications, ensuring graduates are ready to tackle real-world challenges. Students will gain expertise in industry-standard tools and techniques, fostering critical thinking and innovation. With a curriculum aligned with global standards, this program opens doors to diverse career paths in Zambia and internationally.`,
    whyStudy: [
      "High employability in growing sectors.",
      "International exposure with global curriculum.",
      "Affordable tuition compared to Western universities.",
      "Strong industry partnerships for internships.",
      "Opportunities for global networking."
    ],
    careerOpportunities: [
      "Industry Specialist",
      "Research & Development",
      "Consultancy",
      "Global Corporate Roles",
      "Entrepreneurship"
    ],
    averageSalary: "K15,000 - K45,000 per month (Entry to Senior Level)",
    tuition: "K5,000 – K7,000 per semester",
    duration: name.includes('MBBS') ? '5.5 Years' : name.includes('Engineering') ? '4 Years' : '3 Years',
    tags: [name.split(' ')[0], "High Demand", "Global"]
  };
};

export const FULL_COURSES_DATA: Course[] = COURSES_LIST.map(generateCourseData);

export const UNIVERSITIES_LIST: University[] = [
  {
    id: 'ct-university',
    rank: 1,
    name: "CT University",
    location: "Ludhiana, Punjab",
    website: "https://www.ctuniversity.in/",
    isPartner: true,
    scholarship: "Up to 100%",
    features: ["Gold Ribbon: Most Highly Recommended", "Modern Campus", "Zambian Community", "English Medium"],
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/86/CT_University_logo.png",
    establishedYear: "2016",
    type: "Private University",
    accreditation: ["UGC", "AICTE", "PCI", "COA"],
    campusSize: "50+ Acres",
    studentCount: "10,000+",
    internationalCount: "500+",
    facultyCount: "400+",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder, logic will use official channel
    whyStudy: [
      "Strong industry linkages with IBM, Bosch, and Fortis.",
      "High employability rate with 100% placement assistance.",
      "International student-friendly campus with dedicated support.",
      "Modern infrastructure including robotics labs and smart classrooms.",
      "Internship & placement programs with top MNCs."
    ],
    careerOutcomes: [
      "Software Engineer", "Data Scientist", "Business Analyst", "Healthcare Professional", "Entrepreneur"
    ],
    facilities: [
      "Hostel facilities (AC/Non-AC)", "Central Library", "Advanced Laboratories", "Sports Complex", "Medical Facilities", "Multi-cuisine Cafeteria", "Student Clubs"
    ],
    costEstimate: {
      tuition: "K5,000 – K7,000",
      accommodation: "K3,000 – K5,000",
      meals: "Included"
    },
    faculties: [
      "Engineering & Technology", "Management Studies", "Pharmaceutical Sciences", "Law", "Humanities", "Agriculture", "Design & Architecture"
    ]
  },
  {
    id: 'lamrin-tech',
    rank: 2,
    name: "LAMRIN TECH SKILLS UNIVERSITY",
    location: "Punjab",
    website: "https://ltsu.ac.in",
    isPartner: true,
    scholarship: "100% Scholarship",
    features: ["Industry Focused", "Skill Based", "High Placement"],
    logo: "https://ltsu.ac.in/images/logo.png",
    establishedYear: "2021",
    type: "Skill University",
    accreditation: ["UGC", "NSDC"],
    campusSize: "80 Acres",
    studentCount: "5,000+",
    internationalCount: "200+",
    facultyCount: "250+",
    whyStudy: [
      "First-of-its-kind industry-incubated university.",
      "Curriculum designed by industry experts like IBM and Tata.",
      "Focus on practical skills and 'Earn while you Learn'.",
      "Guaranteed job placement support.",
      "State-of-the-art skill labs."
    ],
    facilities: ["Skill Labs", "Hostels", "Sports", "Library"],
    costEstimate: {
      tuition: "K6,000 – K8,000",
      accommodation: "K3,500 – K5,500",
      meals: "Included"
    },
    faculties: ["Engineering", "Management", "Technology"]
  },
  { id: 'lpu', rank: 3, name: "Lovely Professional University", location: "Jalandhar, Punjab", isPartner: false, scholarship: "Merit Based", features: ["Huge Campus", "Global Diversity"], logo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/93/Lovely_Professional_University_logo.svg/1200px-Lovely_Professional_University_logo.svg.png" },
  { id: 'gd-goenka', rank: 4, name: "GD Goenka University", location: "Gurugram, Delhi NCR", isPartner: false, scholarship: "Available", features: ["Premium Infrastructure"], logo: "https://upload.wikimedia.org/wikipedia/en/3/36/GD_Goenka_University_logo.png" },
  { id: 'tulas', rank: 5, name: "Tula's Institute", location: "Dehradun", isPartner: false, scholarship: "Available", features: ["Scenic Campus"] },
  { id: 'chandigarh-uni', rank: 6, name: "Chandigarh University", location: "Mohali, Punjab", isPartner: false, scholarship: "High", features: ["NAAC A+"] },
  { id: 'mmu', rank: 7, name: "MMU Ambala", location: "Ambala, Haryana", isPartner: false, scholarship: "Available", features: ["Medical Focus"] },
  { id: 'parul', rank: 9, name: "Parul University", location: "Vadodara, Gujarat", isPartner: false, scholarship: "Available", features: ["Cultural Hub"] },
  { id: 'iit-delhi', rank: 10, name: "IIT Delhi", location: "New Delhi", isPartner: false, scholarship: "Competitive", features: ["Top Tier"] },
  // ... (We can populate more as needed, keeping it to a representative list for now to save space, but the UI will render what's here)
];

// Add remaining universities to reach 100 (simulated)
const otherUnis = [
  "University of Delhi", "Jawaharlal Nehru University", "Banaras Hindu University", "University of Mumbai",
  "Anna University", "Calcutta University", "VIT University", "SRM University", "Amity University",
  "Manipal University", "Aligarh Muslim University", "Jamia Millia Islamia", "Christ University",
  "Symbiosis International", "Jadavpur University", "Osmania University", "University of Hyderabad",
  "Savitribai Phule Pune University", "Bharathiar University", "Madras University", "Panjab University",
  "Kerala University", "Andhra University", "KIIT University", "Sharda University", "Galgotias University",
  "Bennett University", "Presidency University"
];

otherUnis.forEach((name, index) => {
  UNIVERSITIES_LIST.push({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    rank: 11 + index,
    name: name,
    location: "India",
    isPartner: false,
    scholarship: "Varies",
    features: ["Accredited"],
    establishedYear: "19XX",
    type: "Public/Private",
    accreditation: ["UGC", "NAAC"],
    campusSize: "Large",
    studentCount: "15,000+",
    internationalCount: "100+",
    facultyCount: "500+",
    whyStudy: [
      "Reputed institution with history of excellence.",
      "Diverse academic programs.",
      "Experienced faculty.",
      "Vibrant campus life.",
      "Strong alumni network."
    ],
    facilities: ["Library", "Hostels", "Sports", "Labs"],
    costEstimate: {
      tuition: "Varies",
      accommodation: "Available",
      meals: "Available"
    },
    faculties: ["Arts", "Science", "Commerce", "Engineering"]
  });
});
