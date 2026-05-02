import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBUZyZGm96C4UunsYb7k8XhFm7iZRtSxCE",
  authDomain: "janvote-ai-3c8fa.firebaseapp.com",
  databaseURL: "https://janvote-ai-3c8fa-default-rtdb.firebaseio.com",
  projectId: "janvote-ai-3c8fa",
  storageBucket: "janvote-ai-3c8fa.firebasestorage.app",
  messagingSenderId: "837599832235",
  appId: "1:837599832235:web:ee5eff2e54b42e58d02fee",
  measurementId: "G-XKS5RJR60B"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Connection test
async function testConnection() {
  try {
    await getDocFromServer(doc(db, '_health', 'check'));
  } catch (error: any) {
    if (error.message?.includes('offline')) {
      console.warn("Firestore might be offline or config is incorrect.");
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
