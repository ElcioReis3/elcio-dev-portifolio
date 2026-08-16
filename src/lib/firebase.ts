import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let app: App;

if (!getApps().length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Configure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY no .env",
    );
  }

  app = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
} else {
  app = getApps()[0];
}

export const db: Firestore = getFirestore(app);
export const projectsCollection = db.collection("projects");
