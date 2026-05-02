import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAikK6acmy_O4icxluBo41qrwevLR8hncs",
  authDomain: "janvote-ai-2d1dc.firebaseapp.com",
  databaseURL: "https://janvote-ai-2d1dc-default-rtdb.firebaseio.com",
  projectId: "janvote-ai-2d1dc",
  storageBucket: "janvote-ai-2d1dc.firebasestorage.app",
  messagingSenderId: "553351440034",
  appId: "1:553351440034:web:48fcb5bd20798fb2d759fb",
  measurementId: "G-P5BHLG8YE6"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
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
