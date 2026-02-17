
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
  VISA_PROCESS = 5,
  TRAVEL_ARRIVAL = 6,
  SETTLEMENT = 7,
  COMMUNITY = 8,
  GRADUATION = 9,
  EMPLOYMENT = 10,
  PRE_DEPARTURE = 11,
  
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
  CONTACT = 'CONTACT',
  APPLY_ONLINE = 'APPLY_ONLINE',
  JOURNEY_APPLY = 'JOURNEY_APPLY',
  JOURNEY_INTERVIEW = 'JOURNEY_INTERVIEW',
  JOURNEY_OFFER = 'JOURNEY_OFFER',
  JOURNEY_ACCEPTANCE = 'JOURNEY_ACCEPTANCE',
  JOURNEY_VISA = 'JOURNEY_VISA',
  JOURNEY_FLY = 'JOURNEY_FLY'
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
  emergencyContact?: string;
  discoverySource?: string;
  commitmentConfirmed?: boolean;
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
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
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
