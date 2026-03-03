# Firestore Database Schema Report for Educational System

This report outlines the recommended Firestore database schema for a comprehensive educational platform managing the full student lifecycle. The schema is designed for scalability, efficient querying, and data integrity, following NoSQL best practices.

## 1. User Management

### Collection: `users`
**Purpose:** Stores core identity and profile information for all system users (students, faculty, staff, admins).

| Field Name | Data Type | Description | Required | Example Value |
| :--- | :--- | :--- | :--- | :--- |
| `uid` | string | Unique Firebase Auth ID | Yes | `user_12345` |
| `email` | string | User's email address | Yes | `student@example.com` |
| `role` | string | User's system role | Yes | `student`, `faculty`, `admin` |
| `firstName` | string | First name | Yes | `Jane` |
| `lastName` | string | Last name | Yes | `Doe` |
| `profileImage` | string | URL to profile picture | No | `https://storage.../pic.jpg` |
| `phone` | string | Contact number | No | `+15550102` |
| `createdAt` | timestamp | Account creation date | Yes | `2024-01-01T12:00:00Z` |
| `lastLogin` | timestamp | Last active timestamp | Yes | `2024-03-15T09:30:00Z` |
| `isActive` | boolean | Account status | Yes | `true` |
| `metadata` | map | Role-specific data (e.g., department for faculty) | No | `{ "department": "Science" }` |

**Relationships:**
- Referenced by `applications`, `enrollments`, `payments`, `grades`.

**Potential Subcollections:**
- `notifications`: User-specific alerts.
- `activity_log`: Audit trail of user actions.

**Indexing Considerations:**
- Index `email` for lookups.
- Index `role` and `isActive` for filtering user lists.
- Composite index on `lastName`, `firstName` for sorting.

---

## 2. Admissions & Applications

### Collection: `applications`
**Purpose:** Manages student admission applications, tracking their status from draft to decision.

| Field Name | Data Type | Description | Required | Example Value |
| :--- | :--- | :--- | :--- | :--- |
| `applicationId` | string | Unique application ID | Yes | `app_98765` |
| `applicantId` | string | Reference to `users` (uid) | Yes | `user_12345` |
| `programId` | string | Reference to `programs` | Yes | `prog_cs_2024` |
| `term` | string | Admission term | Yes | `Fall 2024` |
| `status` | string | Current application state | Yes | `draft`, `submitted`, `review`, `accepted` |
| `submissionDate` | timestamp | Date submitted | No | `2024-02-01T14:00:00Z` |
| `personalStatement` | string | Applicant's essay | No | `I have always loved coding...` |
| `gpa` | number | Self-reported GPA | Yes | `3.8` |
| `reviewers` | array | List of reviewer IDs | No | `['fac_001', 'fac_002']` |
| `decision` | map | Final decision details | No | `{ "status": "admitted", "date": "..." }` |

**Relationships:**
- References `users` (applicant).
- References `programs`.

**Potential Subcollections:**
- `documents`: Uploaded transcripts, letters of recommendation.
- `comments`: Internal reviewer notes.

**Indexing Considerations:**
- Index `applicantId` to show user their apps.
- Index `status` and `programId` for admin dashboards.
- Composite index on `term` and `status`.

---

## 3. Academic Structure

### Collection: `programs`
**Purpose:** Defines the educational programs or degrees offered.

| Field Name | Data Type | Description | Required | Example Value |
| :--- | :--- | :--- | :--- | :--- |
| `programId` | string | Unique program ID | Yes | `prog_cs_bs` |
| `name` | string | Program name | Yes | `B.S. Computer Science` |
| `department` | string | Owning department | Yes | `Engineering` |
| `creditsRequired` | number | Total credits for graduation | Yes | `120` |
| `description` | string | Program overview | No | `A comprehensive study of...` |
| `isActive` | boolean | If currently offered | Yes | `true` |

**Relationships:**
- Referenced by `applications`, `courses`.

---

### Collection: `courses`
**Purpose:** The catalog of all courses available in the system.

| Field Name | Data Type | Description | Required | Example Value |
| :--- | :--- | :--- | :--- | :--- |
| `courseId` | string | Unique course code | Yes | `CS101` |
| `title` | string | Course title | Yes | `Intro to Programming` |
| `credits` | number | Credit value | Yes | `3` |
| `department` | string | Department code | Yes | `CS` |
| `prerequisites` | array | List of required `courseId`s | No | `['MATH100']` |
| `description` | string | Course syllabus summary | No | `Learn Python basics...` |

**Relationships:**
- Referenced by `course_sections`, `transcripts`.

**Indexing Considerations:**
- Index `department` for catalog filtering.
- Text search index on `title` and `description` (requires external service like Algolia or specialized Firestore setup).

---

### Collection: `course_sections`
**Purpose:** Specific instances of a course offered in a given term.

| Field Name | Data Type | Description | Required | Example Value |
| :--- | :--- | :--- | :--- | :--- |
| `sectionId` | string | Unique section ID | Yes | `sec_cs101_fa24_a` |
| `courseId` | string | Reference to `courses` | Yes | `CS101` |
| `term` | string | Academic term | Yes | `Fall 2024` |
| `instructorId` | string | Reference to `users` (faculty) | Yes | `fac_001` |
| `schedule` | map | Days and times | Yes | `{ "days": ["Mon", "Wed"], "time": "10:00" }` |
| `location` | string | Room or URL | Yes | `Room 304` |
| `capacity` | number | Max students | Yes | `30` |
| `enrolledCount` | number | Current enrollment | Yes | `25` |

**Relationships:**
- References `courses`, `users` (instructor).
- Referenced by `enrollments`.

**Potential Subcollections:**
- `assignments`: Homework/exams for this section.
- `attendance`: Daily attendance records.

**Indexing Considerations:**
- Composite index on `term` and `courseId`.
- Index `instructorId` for faculty schedules.

---

## 4. Enrollment & Academic Records

### Collection: `enrollments`
**Purpose:** Tracks which students are in which course sections.

| Field Name | Data Type | Description | Required | Example Value |
| :--- | :--- | :--- | :--- | :--- |
| `enrollmentId` | string | Unique record ID | Yes | `enr_888` |
| `studentId` | string | Reference to `users` | Yes | `user_12345` |
| `sectionId` | string | Reference to `course_sections` | Yes | `sec_cs101_fa24_a` |
| `status` | string | Enrollment state | Yes | `enrolled`, `dropped`, `waitlisted` |
| `grade` | string | Final grade (if complete) | No | `A-` |
| `enrolledAt` | timestamp | Date of registration | Yes | `2024-08-15T10:00:00Z` |

**Relationships:**
- Junction table between `users` and `course_sections`.

**Indexing Considerations:**
- Index `studentId` to fetch student schedules.
- Index `sectionId` to fetch class rosters.
- Composite index on `studentId` and `status`.

---

## 5. Financial Aid & Payments

### Collection: `financial_aid_applications`
**Purpose:** Manages requests for scholarships, grants, and loans.

| Field Name | Data Type | Description | Required | Example Value |
| :--- | :--- | :--- | :--- | :--- |
| `aidAppId` | string | Unique ID | Yes | `fa_2024_user123` |
| `studentId` | string | Reference to `users` | Yes | `user_12345` |
| `year` | string | Financial aid year | Yes | `2024-2025` |
| `status` | string | Application status | Yes | `submitted`, `approved` |
| `incomeData` | map | Financial details | Yes | `{ "householdIncome": 50000, ... }` |
| `documents` | array | Links to tax forms, etc. | No | `['url1', 'url2']` |
| `awardedAmount` | number | Total aid granted | No | `5000` |

**Relationships:**
- References `users`.

---

### Collection: `payments`
**Purpose:** Logs all financial transactions (tuition, fees, donations).

| Field Name | Data Type | Description | Required | Example Value |
| :--- | :--- | :--- | :--- | :--- |
| `paymentId` | string | Unique transaction ID | Yes | `pay_999` |
| `userId` | string | Payer ID | Yes | `user_12345` |
| `amount` | number | Transaction amount | Yes | `1500.00` |
| `currency` | string | Currency code | Yes | `USD` |
| `type` | string | Payment category | Yes | `tuition`, `fee`, `donation` |
| `status` | string | Transaction status | Yes | `succeeded`, `failed` |
| `method` | string | Payment method | Yes | `credit_card`, `bank_transfer` |
| `timestamp` | timestamp | Time of payment | Yes | `2024-09-01T12:00:00Z` |

**Indexing Considerations:**
- Index `userId` for payment history.
- Index `timestamp` for financial reporting.
- Composite index on `type` and `timestamp`.

---

## 6. Forms & Surveys

### Collection: `forms`
**Purpose:** Definitions of dynamic forms (surveys, waivers, feedback).

| Field Name | Data Type | Description | Required | Example Value |
| :--- | :--- | :--- | :--- | :--- |
| `formId` | string | Unique form ID | Yes | `form_feedback_2024` |
| `title` | string | Form title | Yes | `Course Feedback` |
| `schema` | array | Field definitions (JSON) | Yes | `[{ "type": "text", "label": "Name" }]` |
| `isActive` | boolean | If accepting responses | Yes | `true` |
| `targetAudience` | string | Who can view | No | `students`, `public` |

---

### Collection: `form_responses`
**Purpose:** Stores user submissions for the defined forms.

| Field Name | Data Type | Description | Required | Example Value |
| :--- | :--- | :--- | :--- | :--- |
| `responseId` | string | Unique response ID | Yes | `resp_001` |
| `formId` | string | Reference to `forms` | Yes | `form_feedback_2024` |
| `userId` | string | Submitter ID (if known) | No | `user_12345` |
| `data` | map | The submitted answers | Yes | `{ "q1": "Great course", "rating": 5 }` |
| `submittedAt` | timestamp | Submission time | Yes | `2024-12-10T15:00:00Z` |

**Indexing Considerations:**
- Index `formId` to aggregate results.
- Index `userId` to check if a user already submitted.

---

## 7. Alumni Relations

### Collection: `alumni_profiles`
**Purpose:** Extended profile data for graduated students.

| Field Name | Data Type | Description | Required | Example Value |
| :--- | :--- | :--- | :--- | :--- |
| `alumniId` | string | Reference to `users` | Yes | `user_12345` |
| `graduationYear` | number | Year graduated | Yes | `2024` |
| `degree` | string | Degree obtained | Yes | `B.S. Computer Science` |
| `currentEmployer` | string | Current job | No | `Tech Corp` |
| `linkedIn` | string | Profile URL | No | `https://linkedin.com/in/...` |
| `donationTotal` | number | Lifetime giving | No | `100.00` |

**Relationships:**
- Extends `users`.

**Indexing Considerations:**
- Index `graduationYear` for class reunions.
- Index `currentEmployer` for networking analysis.

---

## 8. Communication

### Collection: `announcements`
**Purpose:** System-wide or targeted news and alerts.

| Field Name | Data Type | Description | Required | Example Value |
| :--- | :--- | :--- | :--- | :--- |
| `announcementId` | string | Unique ID | Yes | `ann_001` |
| `title` | string | Headline | Yes | `Campus Closure` |
| `body` | string | Content | Yes | `Due to snow...` |
| `targetRoles` | array | Who sees this | Yes | `['student', 'faculty']` |
| `publishDate` | timestamp | When to show | Yes | `2024-01-15T08:00:00Z` |
| `expiryDate` | timestamp | When to hide | No | `2024-01-16T08:00:00Z` |

**Indexing Considerations:**
- Index `targetRoles` for filtering user feeds.
- Index `publishDate` and `expiryDate` for active query.

---

## Summary of Best Practices Used
1.  **Denormalization:** Some data (like `studentName` in `applications` or `courseTitle` in `enrollments`) might be duplicated to reduce reads, though references are primarily used here for clarity.
2.  **Subcollections:** Used for data strictly owned by a parent document (e.g., `assignments` inside `course_sections`) to organize data logically and allow parent-scoped queries.
3.  **Timestamps:** All temporal data uses Firestore `Timestamp` for consistent sorting and querying.
4.  **Security:** This schema assumes Firestore Security Rules will be implemented to restrict access based on `role` (e.g., only `admin` can write to `courses`, `students` can only read their own `grades`).
