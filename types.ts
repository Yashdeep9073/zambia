
export enum UserRole {
  PROSPECTIVE_STUDENT = 'PROSPECTIVE_STUDENT',
  CURRENT_STUDENT = 'CURRENT_STUDENT',
  ALUMNI = 'ALUMNI',
  PARENT = 'PARENT',
  ADMIN_CONSULTANT = 'ADMIN_CONSULTANT',
  PARTNER_UNIVERSITY = 'PARTNER_UNIVERSITY'
}

export enum AppPhase {
  MARKETING_LEAD = 1,
  APPLICATION_ENTRY = 2,
  OFFER_MANAGEMENT = 3, // Waiting Room
  OFFER_LETTER = 4,     // New Offer Letter Page
  PRE_DEPARTURE = 5,    // Moved to match flow
  VISA_PROCESS = 6,
  TRAVEL_ARRIVAL = 7,
  SETTLEMENT = 8,
  COMMUNITY = 9,
  GRADUATION = 10,
  EMPLOYMENT = 11,
  
  // Legacy / Unused phases kept for compatibility if needed
  AUTO_ASSESSMENT = 90,
  SELECTION_OUTPUT = 91,
  AFFORDABILITY = 92,
  PAYMENTS = 93,
  VISA_TRACKING = 94,
  BENEFITS = 95,
  QUALIFICATION_REG = 96,
  SCHOLARSHIP_ALTERNATIVES = 97
}

export enum PublicView {
  HOME = 'HOME',
  ABOUT = 'ABOUT',
  COURSES = 'COURSES',
  STUDENT_CENTRE = 'STUDENT_CENTRE',
  PORTAL_LOGIN = 'PORTAL_LOGIN',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  SEARCH = 'SEARCH',
  SEARCH_RESULTS = 'SEARCH_RESULTS',
  CONTACT = 'CONTACT',
  APPLY_ONLINE = 'APPLY_ONLINE',
  FOR_UNIVERSITIES = 'FOR_UNIVERSITIES', 
  JOURNEY_APPLY = 'JOURNEY_APPLY',
  JOURNEY_INTERVIEW = 'JOURNEY_INTERVIEW',
  JOURNEY_OFFER = 'JOURNEY_OFFER',
  JOURNEY_ACCEPTANCE = 'JOURNEY_ACCEPTANCE',
  JOURNEY_VISA = 'JOURNEY_VISA',
  JOURNEY_FLY = 'JOURNEY_FLY',
  // New Service Hubs
  MEDICAL_HUB = 'MEDICAL_HUB',
  TOURISM_HUB = 'TOURISM_HUB',
  WORK_HUB = 'WORK_HUB',
  INVEST_HUB = 'INVEST_HUB',
  IMPORT_HUB = 'IMPORT_HUB',
  MONEY_HUB = 'MONEY_HUB',
  RECRUITMENT_HUB = 'RECRUITMENT_HUB',
  // New Legal & Trust Pages
  LEGAL_STATUS = 'LEGAL_STATUS',
  PARTNER_UNIVERSITIES = 'PARTNER_UNIVERSITIES',
  VISA_DISCLAIMER = 'VISA_DISCLAIMER',
  PRIVACY_POLICY = 'PRIVACY_POLICY',
  TERMS_CONDITIONS = 'TERMS_CONDITIONS',
  CORPORATE_PROFILE = 'CORPORATE_PROFILE',
  SCHOLARSHIP_EXAM = 'SCHOLARSHIP_EXAM',
  FULL_DASHBOARD = 'FULL_DASHBOARD'
}

export interface PaymentTransaction {
  id: string;
  studentId?: string;
  service: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  method?: string;
}

export interface University {
  id: string;
  name: string;
  website: string;
  scholarship: number;
  isRecommended: boolean;
  location: string;
}

export interface StudentProfile {
  applicantType?: 'Student' | 'Representative';
  name: string;
  countryCode?: string;
  phone: string;
  email: string;
  password?: string; // Added for Start Here
  programInterest: string;
  studyLevel?: 'Certificate' | 'Diploma' | 'Degree' | 'Masters' | 'PhD';
  studyMode?: 'OnCampus' | 'Online';
  dob: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  parentRelationship?: string;
  intake: 'January' | 'June' | 'June 2026' | 'January 2027' | '';
  applyToAll: boolean;
  grades: { subject: string; score: string }[];
  currentGrade: string; // Legacy field
  budget: string; // Legacy field
  preferredCity?: string;
  
  // New fields for Step 2
  studentNumber?: string;
  nrcNumber?: string;
  nationality?: string;
  gender?: string;
  maritalStatus?: string;
  currentCity?: string;
  applicationPath?: 'ScholarshipOnly' | 'AllUniversities';
  uploadedDocuments?: string[]; 
  
  // Admin fields
  status?: 'New' | 'Review' | 'Offer Issued' | 'Visa' | 'Enrolled' | 'Rejected';
  submissionDate?: string;
  assignedConsultant?: string;

  // Additional fields
  prevIntlExposure?: string;
  englishProficiency?: string;
  emergencyContact?: string; // Deprecated, use nextOfKin
  discoverySource?: string;
  commitmentConfirmed?: boolean;
  
  // New Next of Kin Structure (Section 1.7)
  nextOfKin?: {
    fullName: string;
    relationship: string;
    phone: string;
    email: string;
    address: string;
  };

  // Parent / Guardian Structure (Enhanced)
  parents?: Array<{
    fullName: string;
    relationship: string;
    phone: string;
    email?: string;
    occupation?: string;
  }>;

  // Location & Travel
  country?: string;
  province?: string;
  town?: string;
  travelledAbroad?: 'Yes' | 'No';
  travelledCountries?: string;

  // New Highest Qualification Structure (Section 1.2)
  highestQualification?: {
    level: 'Grade 12' | 'Diploma' | 'Degree' | 'Other';
    title: string;
    institution: string;
    year: string;
    country: string;
    grade: string;
  };

  // Share Engine (Section 1.8)
  shareCount?: number;
  isShareVerified?: boolean;

  academicHistory?: {
      institutions: Array<{
        name: string;
        year: string;
        examBoard: string;
        country: string;
      }>;
  };
  recommenderName?: string;
  recommenderPhone?: string;

  // Gamification & Dashboard State
  points?: number;
  badges?: string[];
  lastActiveSection?: string;
  lifecycleProgress?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

// --- DATABASE SCHEMA DEFINITIONS ---

export interface SupportTicket {
  id: string;
  student_id?: string;
  department: 'Student Applications' | 'University Onboarding' | 'Technical Support' | 'Student Affairs';
  category: string;
  description: string;
  attachment_url?: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  created_at: string;
}

export interface AiTrainingData {
  id: string;
  category: string;
  question_pattern: string;
  approved_response: string;
  escalation_trigger: boolean;
  updated_at: string;
}

// --- MASTER API INTEGRATION SCHEMAS ---

export type IntegrationEnvironment = 'sandbox' | 'production';

export interface BaseApiPayload {
  schema_version: '1.0.0';
  environment: IntegrationEnvironment;
  request_id: string;
  timestamp_utc: string;
  source_system: 'ZII_WEB' | 'ZII_ADMIN' | 'ZII_UNI' | 'ZII_AGENT';
  event_type: string;
  payload: any;
}

export interface SmsPayload {
  provider: 'twilio' | 'africastalking' | 'termii' | 'nexmo';
  to_phone_e164: string;
  message_template_id?: string;
  message_body: string;
  language: 'en';
  student_id?: string;
  application_id?: string;
  metadata?: {
    trigger: 'registration' | 'submission' | 'offer' | 'visa';
    retry_count: number;
  };
}

export interface WhatsAppPayload {
  provider: 'meta' | 'twilio' | '360dialog';
  to_whatsapp: string;
  template_name?: string;
  template_variables?: Record<string, string>;
  media_urls?: string[];
  conversation_type: 'notification' | 'support';
  student_id: string;
}

export interface EmailPayload {
  provider: 'sendgrid' | 'ses' | 'mailgun';
  to_email: string;
  subject: string;
  template_id?: string;
  variables?: Record<string, string>;
  attachments?: {
    file_name: string;
    file_url: string;
  }[];
}

export interface VoiceCallPayload {
  provider: 'elevenlabs' | 'twilio';
  agent_name: string;
  agent_role: string;
  voice_profile?: {
    gender: 'female' | 'male';
    accent: string;
    age_range: string;
  };
  to_phone: string;
  call_purpose: 'application_guidance' | 'follow_up';
  student_context?: {
    student_id: string;
    application_stage: string;
  };
}

export interface AnalyticsEventPayload {
  event_name: string;
  page: string;
  user_role: string;
  student_id?: string;
  metadata?: Record<string, any>;
}

export interface IntegrationConfig {
  id: string;
  type: 'sms' | 'whatsapp' | 'email' | 'voice' | 'maps' | 'analytics' | 'auth' | 'storage' | 'payments' | 'ai';
  provider: string;
  apiKey: string;
  apiSecret?: string;
  webhookUrl?: string;
  enabled: boolean;
  environment: IntegrationEnvironment;
  options?: Record<string, any>;
}
