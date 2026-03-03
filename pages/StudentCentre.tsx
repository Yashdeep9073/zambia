import React, { useState, useEffect } from 'react';
import { PublicView, UserRole } from '../types';
import { 
  BookOpen, GraduationCap, Users, Plane, FileText, 
  Search, Calendar, MapPin, DollarSign, Heart, 
  Shield, ExternalLink, Download, ChevronRight,
  Coffee, Wifi, Home, AlertCircle, CheckCircle, 
  Briefcase, User, Lock, ArrowRight, Upload, 
  CreditCard, Activity, HelpCircle, Award, Star,
  Settings, LogOut, Menu, X, ChevronDown, ChevronUp,
  Play, Pause, RotateCcw, Save, Loader
} from 'lucide-react';
import Footer from '../components/Footer';

// --- TYPES ---

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'file' | 'date' | 'number' | 'textarea' | 'checkbox' | 'password';
  options?: string[];
  required?: boolean;
  placeholder?: string;
}

interface WizardStep {
  title: string;
  description?: string;
  fields: FormField[];
}

interface SectionData {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  steps: WizardStep[];
  requiresAuth?: boolean;
}

interface CategoryData {
  id: 'prospective' | 'current' | 'alumni';
  title: string;
  icon: React.ElementType;
  sections: SectionData[];
}

// --- MOCK DATA GENERATORS ---

const generateWizard = (id: string, title: string): WizardStep[] => {
  // Helper to generate generic steps if specific ones aren't defined
  // In a real app, each of the 45 sections would have unique field definitions.
  // I will define unique ones for the key sections mentioned in the prompt.
  return [
    {
      title: "Personal Details",
      fields: [
        { id: `${id}_name`, label: "Full Name", type: "text", required: true, placeholder: "Enter your full name" },
        { id: `${id}_email`, label: "Email Address", type: "email", required: true, placeholder: "john@example.com" }
      ]
    },
    {
      title: "Additional Info",
      fields: [
        { id: `${id}_notes`, label: "Additional Notes", type: "textarea", placeholder: "Any specific details..." }
      ]
    },
    {
      title: "Review & Submit",
      fields: [
        { id: `${id}_confirm`, label: "I confirm the details are correct", type: "checkbox", required: true }
      ]
    }
  ];
};

// --- DATA: PROSPECTIVE STUDENTS ---

const PROSPECTIVE_SECTIONS: SectionData[] = [
  {
    id: 'scholarship_exam',
    title: 'National Scholarship Merit Exam',
    description: 'Register for the 100% Sponsorship Exam. Prove your potential.',
    icon: Award,
    steps: [
      {
        title: "Exam Registration",
        fields: [] 
      }
    ]
  },
  {
    id: 'career_assessment',
    title: 'Career Assessment Wizard',
    description: 'Discover your ideal career path based on your strengths.',
    icon: Search,
    steps: [
      {
        title: "Academic Background",
        fields: [
          { id: "grade_12_score", label: "Grade 12 Aggregate", type: "number", required: true },
          { id: "fav_subjects", label: "Favorite Subjects", type: "text", placeholder: "Math, Physics, English..." }
        ]
      },
      {
        title: "Interests",
        fields: [
          { id: "career_interest", label: "Career Interest", type: "select", options: ["Engineering", "Medicine", "Business", "Arts", "Technology"] },
          { id: "work_style", label: "Preferred Work Style", type: "select", options: ["Office", "Field", "Remote", "Lab"] }
        ]
      },
      {
        title: "Results",
        fields: [] // Result displayed after submission
      }
    ]
  },
  {
    id: 'eligibility_verification',
    title: 'Eligibility Verification',
    description: 'Check if you meet the requirements for Indian universities.',
    icon: Shield,
    steps: [
      {
        title: "Upload Documents",
        fields: [
          { id: "nrc_upload", label: "Upload NRC", type: "file", required: true },
          { id: "results_upload", label: "Grade 12 Results", type: "file", required: true }
        ]
      },
      {
        title: "Passport Status",
        fields: [
          { id: "has_passport", label: "Do you have a valid passport?", type: "select", options: ["Yes", "No", "In Progress"] }
        ]
      }
    ]
  },
  {
    id: 'university_match',
    title: 'University Match Tool',
    description: 'Find the perfect university based on your budget and preferences.',
    icon: Building,
    steps: [
      {
        title: "Preferences",
        fields: [
          { id: "course_select", label: "Preferred Course", type: "text" },
          { id: "budget_range", label: "Annual Budget (USD)", type: "select", options: ["< $2000", "$2000 - $4000", "$4000+"] },
          { id: "location_pref", label: "Preferred Region", type: "select", options: ["North India", "South India", "West India", "Any"] }
        ]
      }
    ]
  },
  {
    id: 'scholarship_assess',
    title: 'Scholarship Pre-Assessment',
    description: 'Estimate your scholarship eligibility percentage.',
    icon: Award,
    steps: [
      {
        title: "Academic Score",
        fields: [{ id: "gpa", label: "GPA / Percentage", type: "number" }]
      },
      {
        title: "Extracurriculars",
        fields: [{ id: "extra_activities", label: "Sports/Arts Achievements", type: "textarea" }]
      },
      {
        title: "Financial Background",
        fields: [{ id: "household_income", label: "Annual Household Income", type: "select", options: ["Low", "Medium", "High"] }]
      }
    ]
  },
  {
    id: 'app_readiness',
    title: 'Application Readiness Checklist',
    description: 'Track your missing items before applying.',
    icon: CheckCircle,
    steps: [
      {
        title: "Document Checklist",
        fields: [
          { id: "chk_transcripts", label: "Transcripts Ready?", type: "checkbox" },
          { id: "chk_passport", label: "Passport Ready?", type: "checkbox" },
          { id: "chk_photos", label: "Passport Photos Ready?", type: "checkbox" }
        ]
      }
    ]
  },
  {
    id: 'start_here_reg',
    title: 'Start Here Registration',
    description: 'Create your ZII account to begin the journey.',
    icon: User,
    steps: [
      {
        title: "Account Details",
        fields: [
          { id: "reg_name", label: "Full Name", type: "text", required: true },
          { id: "reg_email", label: "Email", type: "email", required: true },
          { id: "reg_phone", label: "Phone", type: "tel", required: true },
          { id: "reg_pass", label: "Create Password", type: "password", required: true }
        ]
      }
    ]
  },
  {
    id: 'app_submission',
    title: 'Application Submission',
    description: 'Submit your formal application to universities.',
    icon: FileText,
    requiresAuth: true,
    steps: [
      {
        title: "Personal Info",
        fields: [
          { id: "app_dob", label: "Date of Birth", type: "date", required: true },
          { id: "app_gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"] }
        ]
      },
      {
        title: "Academic History",
        fields: [{ id: "app_school", label: "Previous School", type: "text", required: true }]
      },
      {
        title: "Documents",
        fields: [{ id: "app_docs", label: "Upload All Docs (PDF)", type: "file", required: true }]
      },
      {
        title: "Declaration",
        fields: [{ id: "app_decl", label: "I declare all info is true", type: "checkbox", required: true }]
      }
    ]
  },
  {
    id: 'parent_reg',
    title: 'Parent / Sponsor Registration',
    description: 'Register a guardian for updates and support letters.',
    icon: Users,
    steps: [
      {
        title: "Parent Details",
        fields: [
          { id: "parent_name", label: "Parent Name", type: "text", required: true },
          { id: "parent_contact", label: "Contact Number", type: "tel", required: true }
        ]
      },
      {
        title: "Financial Support",
        fields: [
          { id: "income_bracket", label: "Income Bracket", type: "select", options: ["Self-Sponsored", "Government", "Private Sponsor"] }
        ]
      }
    ]
  },
  {
    id: 'financial_planning',
    title: 'Financial Planning Tool',
    description: 'Project your total costs for the first year.',
    icon: DollarSign,
    steps: [
      {
        title: "Cost Inputs",
        fields: [
          { id: "est_tuition", label: "Estimated Tuition", type: "number" },
          { id: "est_visa", label: "Visa Cost", type: "number", placeholder: "1350" },
          { id: "est_flight", label: "Flight Cost", type: "number", placeholder: "15000" }
        ]
      }
    ]
  },
  {
    id: 'about_india',
    title: 'About India Preparation',
    description: 'Learn about culture, education system, and lifestyle.',
    icon: Globe,
    steps: [
      {
        title: "Overview",
        fields: [] // Informational step
      }
    ]
  },
  {
    id: 'waiting_room',
    title: 'Waiting Room Dashboard',
    description: 'Track your status while waiting for offers.',
    icon: Coffee,
    requiresAuth: true,
    steps: [
      {
        title: "Status",
        fields: [] // Dashboard view
      }
    ]
  },
  {
    id: 'offer_letter',
    title: 'Offer Letter Access',
    description: 'View and download your admission letters.',
    icon: Lock,
    requiresAuth: true,
    steps: [
      {
        title: "Security Check",
        fields: [{ id: "offer_passkey", label: "Enter Passkey", type: "password" }]
      }
    ]
  },
  {
    id: 'visa_prep',
    title: 'Visa Preparation Overview',
    description: 'Guide to securing your student visa.',
    icon: FileText,
    steps: [
      {
        title: "Checklist",
        fields: [
          { id: "visa_admission", label: "Admission Letter Received?", type: "checkbox" },
          { id: "visa_bank", label: "Bank Statement Ready?", type: "checkbox" }
        ]
      }
    ]
  },
  {
    id: 'pre_departure',
    title: 'Pre-Departure Checklist',
    description: 'Medical, packing, and travel essentials.',
    icon: Plane,
    steps: [
      {
        title: "Health",
        fields: [
          { id: "med_yellow", label: "Yellow Fever Card?", type: "checkbox" },
          { id: "med_check", label: "Medical Fitness Cert?", type: "checkbox" }
        ]
      }
    ]
  },
  {
    id: 'travel_confirm',
    title: 'Travel Confirmation',
    description: 'Upload flight details for airport pickup.',
    icon: MapPin,
    requiresAuth: true,
    steps: [
      {
        title: "Flight Details",
        fields: [
          { id: "flight_num", label: "Flight Number", type: "text" },
          { id: "arrival_date", label: "Arrival Date", type: "date" },
          { id: "ticket_upload", label: "Upload Ticket", type: "file" }
        ]
      }
    ]
  }
];

// --- DATA: CURRENT STUDENTS ---

const CURRENT_SECTIONS: SectionData[] = [
  { id: 'student_profile', title: 'Student Profile Dashboard', description: 'Manage your personal and academic details.', icon: User, steps: generateWizard('profile', 'Profile Update') },
  { id: 'academic_progress', title: 'Academic Progress Tracker', description: 'Log your semester grades and CGPA.', icon: Activity, steps: generateWizard('grades', 'Grade Entry') },
  { id: 'attendance_log', title: 'Attendance Log', description: 'Track your class attendance record.', icon: Calendar, steps: generateWizard('attendance', 'Attendance') },
  { id: 'tuition_record', title: 'Tuition Payment Record', description: 'Upload receipts and track balances.', icon: CreditCard, steps: generateWizard('tuition', 'Payment Log') },
  { id: 'hostel_info', title: 'Hostel Information', description: 'Room details and warden contact.', icon: Home, steps: generateWizard('hostel', 'Hostel Details') },
  { id: 'visa_renewal', title: 'Visa Renewal Reminder', description: 'Set alerts for FRRO and Visa expiry.', icon: AlertCircle, steps: generateWizard('visa_renew', 'Renewal Dates') },
  { id: 'emergency_contact', title: 'Emergency Contact Update', description: 'Keep your safety contacts current.', icon: Phone, steps: generateWizard('emergency', 'Contacts') },
  { id: 'internship_support', title: 'Internship Placement', description: 'Apply for internships via ZII partners.', icon: Briefcase, steps: generateWizard('internship', 'Application') },
  { id: 'academic_support', title: 'Academic Support Request', description: 'Request tutoring or counseling.', icon: HelpCircle, steps: generateWizard('support', 'Request Form') },
  { id: 'health_insurance', title: 'Health & Insurance', description: 'Policy details and hospital network.', icon: Heart, steps: generateWizard('insurance', 'Policy Info') },
  { id: 'scholarship_renew', title: 'Scholarship Renewal', description: 'Apply for continuing student grants.', icon: Award, steps: generateWizard('schol_renew', 'Renewal App') },
  { id: 'uni_transfer', title: 'University Transfer', description: 'Request a transfer to another institution.', icon: RotateCcw, steps: generateWizard('transfer', 'Transfer Request') },
  { id: 'complaint_form', title: 'Complaint & Feedback', description: 'Report issues confidentially.', icon: MessageSquare, steps: generateWizard('complaint', 'Report Issue') },
  { id: 'career_dev', title: 'Career Development', description: 'Resume building and interview prep.', icon: TrendingUp, steps: generateWizard('career', 'Dev Tools') },
  { id: 'grad_prep', title: 'Graduation Prep', description: 'Final year checklist and clearance.', icon: GraduationCap, steps: generateWizard('grad', 'Clearance') }
].map(s => ({ ...s, requiresAuth: true }));

// --- DATA: ALUMNI ---

const ALUMNI_SECTIONS: SectionData[] = [
  { id: 'alumni_profile', title: 'Alumni Profile Creation', description: 'Join the official alumni directory.', icon: User, steps: generateWizard('alum_prof', 'Profile') },
  { id: 'employ_status', title: 'Employment Status Update', description: 'Share your current job role.', icon: Briefcase, steps: generateWizard('employ', 'Job Details') },
  { id: 'business_reg', title: 'Business / Startup Reg', description: 'Register your business for networking.', icon: Building, steps: generateWizard('biz', 'Business Info') },
  { id: 'success_story', title: 'Success Story Submission', description: 'Share your journey to inspire others.', icon: Star, steps: generateWizard('story', 'Your Story') },
  { id: 'mentorship_reg', title: 'Mentorship Registration', description: 'Sign up to mentor new students.', icon: Users, steps: generateWizard('mentor', 'Mentorship') },
  { id: 'networking_hub', title: 'Alumni Networking Hub', description: 'Connect with peers in your industry.', icon: Share2, steps: generateWizard('network', 'Preferences') },
  { id: 'job_board', title: 'Job Opportunity Board', description: 'Post or find job openings.', icon: Search, steps: generateWizard('jobs', 'Job Post') },
  { id: 'grad_visa', title: 'Graduate Visa Info', description: 'Information on post-study work visas.', icon: FileText, steps: generateWizard('visa_info', 'Visa Check') },
  { id: 'rec_letter', title: 'Recommendation Request', description: 'Request letters from ZII or University.', icon: FileText, steps: generateWizard('rec', 'Request') },
  { id: 'transcript_req', title: 'Transcript Request', description: 'Order official transcripts.', icon: FileText, steps: generateWizard('transcript', 'Order') },
  { id: 'cert_verify', title: 'Certificate Verification', description: 'Verify your degree for employers.', icon: Shield, steps: generateWizard('verify', 'Verification') },
  { id: 'alumni_events', title: 'Alumni Events', description: 'Register for reunions and meetups.', icon: Calendar, steps: generateWizard('events', 'Registration') },
  { id: 'ambassador_signup', title: 'Community Ambassador', description: 'Represent ZII in your region.', icon: Globe, steps: generateWizard('ambassador', 'Signup') },
  { id: 'referral_reward', title: 'Referral Reward Program', description: 'Earn rewards for referring students.', icon: Gift, steps: generateWizard('referral', 'Referral') },
  { id: 'alumni_survey', title: 'Alumni Survey', description: 'Help us improve by sharing feedback.', icon: CheckCircle, steps: generateWizard('survey', 'Feedback') }
].map(s => ({ ...s, requiresAuth: true }));

// --- ICONS IMPORT FIX ---
import { 
  MessageSquare, TrendingUp, Globe, Gift, Share2, Building, Phone
} from 'lucide-react';

// --- MAIN COMPONENT ---

interface StudentCentreProps {
  onNavigate: (view: PublicView) => void;
  onLogin: (role: UserRole) => void;
}

const StudentCentre: React.FC<StudentCentreProps> = ({ onNavigate, onLogin }) => {
  const [activeCategory, setActiveCategory] = useState<'prospective' | 'current' | 'alumni'>('prospective');
  const [activeSection, setActiveSection] = useState<SectionData | null>(null);
  const [wizardStep, setWizardStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  
  // Auth simulation
  const [isAuthenticated, setIsAuthenticated] = useState(false); // In real app, check localStorage or context

  useEffect(() => {
    // Check auth status
    const role = localStorage.getItem('zii_user_role');
    setIsAuthenticated(!!role);
  }, []);

  const categories: CategoryData[] = [
    { id: 'prospective', title: 'Prospective Students', icon: User, sections: PROSPECTIVE_SECTIONS },
    { id: 'current', title: 'Currently Enrolled', icon: GraduationCap, sections: CURRENT_SECTIONS },
    { id: 'alumni', title: 'Alumni / Graduates', icon: Briefcase, sections: ALUMNI_SECTIONS }
  ];

  const handleSectionClick = (section: SectionData) => {
    if (section.id === 'scholarship_exam') {
      onNavigate(PublicView.SCHOLARSHIP_EXAM);
      return;
    }
    if (section.requiresAuth && !isAuthenticated) {
      // Trigger login
      onLogin(UserRole.PROSPECTIVE_STUDENT); // Default to generic login prompt
      return;
    }
    setActiveSection(section);
    setWizardStep(0);
    setFormData({});
  };

  const handleInputChange = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    if (activeSection && wizardStep < activeSection.steps.length - 1) {
      setWizardStep(prev => prev + 1);
    } else {
      // Submit
      setIsSaving(true);

      // TODO: API CALL TO SYNC WITH BACKEND
      // await api.post('/student/wizard/submit', { sectionId: activeSection.id, data: formData });

      setTimeout(() => {
        setIsSaving(false);
        if (activeSection) {
          setCompletedSections(prev => [...prev, activeSection.id]);
          setActiveSection(null); // Close wizard
        }
      }, 1500);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Progress saved! You can resume later.");
    }, 1000);
  };

  // --- RENDER WIZARD ---
  const renderWizard = () => {
    if (!activeSection) return null;
    const step = activeSection.steps[wizardStep];
    const isLastStep = wizardStep === activeSection.steps.length - 1;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-sm p-4 animate-fade-in">
        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-lg text-emerald-700">
                <activeSection.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{activeSection.title}</h3>
                <p className="text-xs text-slate-500">Step {wizardStep + 1} of {activeSection.steps.length}</p>
              </div>
            </div>
            <button onClick={() => setActiveSection(null)} className="p-2 hover:bg-slate-100 rounded-full transition">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-1.5">
            <div 
              className="bg-emerald-500 h-1.5 transition-all duration-300" 
              style={{ width: `${((wizardStep + 1) / activeSection.steps.length) * 100}%` }}
            ></div>
          </div>

          {/* Content */}
          <div className="p-8 flex-1">
            <h4 className="text-lg font-bold text-slate-800 mb-2">{step.title}</h4>
            {step.description && <p className="text-sm text-slate-500 mb-6">{step.description}</p>}

            <div className="space-y-6">
              {step.fields.map(field => (
                <div key={field.id}>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  
                  {field.type === 'textarea' ? (
                    <textarea 
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
                      rows={4}
                      placeholder={field.placeholder}
                      value={formData[field.id] || ''}
                      onChange={e => handleInputChange(field.id, e.target.value)}
                    />
                  ) : field.type === 'select' ? (
                    <select 
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition bg-white"
                      value={formData[field.id] || ''}
                      onChange={e => handleInputChange(field.id, e.target.value)}
                    >
                      <option value="">Select an option</option>
                      {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : field.type === 'checkbox' ? (
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                        checked={formData[field.id] || false}
                        onChange={e => handleInputChange(field.id, e.target.checked)}
                      />
                      <span className="text-sm text-slate-600">{field.label}</span>
                    </div>
                  ) : field.type === 'file' ? (
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition cursor-pointer">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">Click to upload or drag and drop</p>
                      <input type="file" className="hidden" onChange={e => handleInputChange(field.id, e.target.files?.[0]?.name)} />
                      {formData[field.id] && <p className="text-xs text-emerald-600 font-bold mt-2">Selected: {formData[field.id]}</p>}
                    </div>
                  ) : (
                    <input 
                      type={field.type} 
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
                      placeholder={field.placeholder}
                      value={formData[field.id] || ''}
                      onChange={e => handleInputChange(field.id, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center sticky bottom-0">
            <button 
              onClick={handleSave}
              className="flex items-center text-slate-500 hover:text-emerald-600 font-bold text-sm transition"
            >
              <Save className="w-4 h-4 mr-2" /> Save Progress
            </button>

            <div className="flex gap-3">
              {wizardStep > 0 && (
                <button 
                  onClick={() => setWizardStep(prev => prev - 1)}
                  className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition"
                >
                  Back
                </button>
              )}
              <button 
                onClick={handleNext}
                disabled={isSaving}
                className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg flex items-center"
              >
                {isSaving ? <Loader className="w-5 h-5 animate-spin" /> : isLastStep ? 'Complete' : 'Next Step'}
                {!isSaving && !isLastStep && <ChevronRight className="w-5 h-5 ml-2" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* HEADER */}
      <div className="bg-slate-900 text-white pt-24 pb-16 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl opacity-10 transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-white/10">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            Student Centre
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
            Your Complete <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Academic Journey Hub</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Manage every step of your education in India. From application to graduation and beyond.
          </p>
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto no-scrollbar gap-8">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 py-4 border-b-2 transition whitespace-nowrap ${
                  activeCategory === cat.id 
                    ? 'border-emerald-500 text-emerald-700 font-bold' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <cat.icon className={`w-5 h-5 ${activeCategory === cat.id ? 'text-emerald-500' : 'text-slate-400'}`} />
                {cat.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.find(c => c.id === activeCategory)?.sections.map((section, idx) => (
            <div 
              key={section.id}
              onClick={() => handleSectionClick(section)}
              className={`group bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-500 hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden ${
                completedSections.includes(section.id) ? 'ring-2 ring-emerald-500/20' : ''
              }`}
            >
              {/* Status Indicator */}
              <div className="absolute top-4 right-4">
                {completedSections.includes(section.id) ? (
                  <div className="bg-emerald-100 text-emerald-700 p-1.5 rounded-full">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="bg-slate-100 text-slate-400 p-1.5 rounded-full group-hover:bg-emerald-50 group-hover:text-emerald-500 transition">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                completedSections.includes(section.id) ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-600 group-hover:text-white'
              }`}>
                <section.icon className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition">{section.title}</h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2">{section.description}</p>
              
              {/* Progress Bar (Mock) */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${completedSections.includes(section.id) ? 'bg-emerald-500 w-full' : 'bg-slate-300 w-0 group-hover:w-1/3 transition-all duration-500'}`}
                ></div>
              </div>
              
              {section.requiresAuth && !isAuthenticated && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                  <div className="bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center shadow-lg">
                    <Lock className="w-3 h-3 mr-2" /> Login Required
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* WIZARD MODAL */}
      {activeSection && renderWizard()}

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default StudentCentre;
