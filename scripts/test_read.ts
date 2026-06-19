import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import config from '../firebase-applet-config.json';

const app = initializeApp({
  projectId: config.projectId
});
const db = getFirestore(app, config.firestoreDatabaseId);

async function testRead() {
  try {
    const collections = await db.listCollections();
    console.log('List of collections:', collections.map(c => c.id));
  } catch (error) {
    console.error('Error reading:', error);
  }
}
testRead();
