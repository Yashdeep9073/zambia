export interface DbUser {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  ziiNumber?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: any; // Timestamp
  lastLogin: any; // Timestamp
  lastActive: any; // Timestamp
  ipAddress?: string;
  deviceId?: string;
  deviceFingerprint?: string;
  browser?: string;
  operatingSystem?: string;
  geoCountry?: string;
  geoProvince?: string;
  geoTown?: string;
  profileCompletionPercentage: number;
  referralCode?: string;
  referredBy?: string;
  lifecycleStage: string;
  currentStage: string;
  lastCompletedStep: string;
  totalLoginCount: number;
  riskScore: number;
}

export interface DbApplication {
  userId: string;
  stage: string;
  progressPercentage: number;
  status: string;
  personalSection: any;
  guardianSection: any;
  academicSection: any;
  documentsSection: any;
  additionalInfo: any;
  formErrorsCount: number;
  firstSubmissionTimestamp: any;
  lastUpdateTimestamp: any;
  submissionAttempts: number;
  isLocked: boolean;
  lockedReason?: string;
  ipAddressAtSubmission?: string;
  deviceAtSubmission?: string;
  geoLocationAtSubmission?: any;
}

export interface DbApplicationDraft {
  userId: string;
  draftData: any;
  lastSavedField: string;
  lastSavedTimestamp: any;
  saveCount: number;
  incompleteFields: string[];
  timeSpentOnForm: number;
  abandonmentDetected: boolean;
}

export interface DbScholarshipExam {
  userId: string;
  totalAttempts: number;
  bestScore: number;
  eligibilityUnlocked: boolean;
  passed: boolean;
  finalDecision: string;
  ipAddress?: string;
  deviceId?: string;
}

export interface DbExamAttempt {
  userId: string;
  examId: string;
  attemptNumber: number;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeTaken: number;
  startedAt: any;
  completedAt: any;
  ipAddress?: string;
  deviceFingerprint?: string;
  suspiciousActivityFlag: boolean;
}

export interface DbPayment {
  userId: string;
  serviceType: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  paymentMethod: string;
  transactionId: string;
  receiptUrl?: string;
  initiatedAt: any;
  completedAt?: any;
  ipAddress?: string;
  deviceId?: string;
  failureReason?: string;
  retryCount: number;
}

export interface DbWaitingRoom {
  tasksCompleted: string[];
  examStatus: string;
  videoChallengeStatus: string;
  photoChallengeStatus: string;
  offerLetterLocked: boolean;
  unlockReason?: string;
  timerStarted?: any;
  timerEnd?: any;
  progressScore: number;
  motivationScore: number;
  engagementLevel: string;
}

export interface DbAnalyticsSession {
  userId?: string;
  sessionStart: any;
  sessionEnd?: any;
  duration?: number;
  entryPage: string;
  exitPage?: string;
  ipAddress?: string;
  deviceFingerprint?: string;
  geoCountry?: string;
  geoProvince?: string;
  geoTown?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface DbAnalyticsEvent {
  userId?: string;
  eventType: string;
  eventCategory: string;
  eventLabel?: string;
  timestamp: any;
  page: string;
  stage?: string;
  metadata?: any;
}

export interface DbProgressTracking {
  userId: string;
  currentStage: string;
  percentComplete: number;
  milestonesUnlocked: string[];
  bottleneckDetected?: string;
  predictedDropOffRisk: number;
}

export interface DbDeviceTracking {
  userId?: string;
  firstSeen: any;
  lastSeen: any;
  deviceType: string;
  browser: string;
  os: string;
  fingerprintHash: string;
  flagged: boolean;
}

export interface DbIpLog {
  userId?: string;
  ipAddress: string;
  country?: string;
  province?: string;
  town?: string;
  timestamp: any;
  riskScore: number;
  suspiciousFlag: boolean;
}

export interface DbComplaint {
  userId: string;
  category: string;
  department: string;
  description: string;
  status: string;
  assignedTo?: string;
  createdAt: any;
  resolvedAt?: any;
  satisfactionRating?: number;
}

export interface DbSupportTicket {
  userId: string;
  department: string;
  category: string;
  description: string;
  attachment_url?: string;
  status: string;
  priority: string;
  created_at: any;
}

export interface DbAdminLog {
  adminId: string;
  actionType: string;
  affectedCollection: string;
  documentId: string;
  timestamp: any;
  ipAddress?: string;
}
