
import { db } from '../../firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  onSnapshot, 
  orderBy, 
  limit, 
  Timestamp,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  QueryConstraint,
  getDoc
} from 'firebase/firestore';
import { StudentProfile, SupportTicket, PaymentTransaction } from '../../../types';

// --- STUDENT CRUD ---

export const subscribeToStudents = (callback: (students: any[]) => void, onError: (err: any) => void) => {
  const q = query(collection(db, 'users'), where('role', '==', 'student'), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const students = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(students);
  }, async (error) => {
    console.warn('Real-time listener failed, falling back to getDocs:', error);
    try {
      const snapshot = await getDocs(q);
      const students = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(students);
    } catch (fallbackError) {
      onError(fallbackError);
    }
  });
};

export const createStudent = async (studentData: Partial<StudentProfile>) => {
  const docRef = await addDoc(collection(db, 'users'), {
    ...studentData,
    role: 'student',
    createdAt: serverTimestamp(),
    status: 'New',
    points: 0,
    badges: []
  });
  return docRef.id;
};

export const updateStudent = async (id: string, data: Partial<StudentProfile>) => {
  const docRef = doc(db, 'users', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

export const deleteStudent = async (id: string) => {
  // Safe delete: Archive or soft delete is usually better, but prompt asked for DELETE safely.
  // We'll do a hard delete for now as requested, but could be changed to status='Archived'
  const docRef = doc(db, 'users', id);
  await deleteDoc(docRef);
};

// --- ANALYTICS QUERIES ---

export const getMetricData = async (collectionName: string, constraints: QueryConstraint[] = []) => {
  const q = query(collection(db, collectionName), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.size;
};

export const subscribeToMetric = (
  collectionName: string, 
  constraints: QueryConstraint[], 
  callback: (count: number) => void
) => {
  const q = query(collection(db, collectionName), ...constraints);
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.size);
  }, async () => {
    const snapshot = await getDocs(q);
    callback(snapshot.size);
  });
};

// --- STUDENT SPECIFIC DATA ---

export const getStudentApplications = async (studentId: string) => {
  const q = query(collection(db, 'applications'), where('userId', '==', studentId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getStudentPayments = async (studentId: string) => {
  const q = query(collection(db, 'payments'), where('userId', '==', studentId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getStudentTickets = async (studentId: string) => {
  const q = query(collection(db, 'support_tickets'), where('student_id', '==', studentId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
