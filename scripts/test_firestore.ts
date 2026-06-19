import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin (Default)
const app = admin.initializeApp({
  projectId: 'gen-lang-client-0411603755'
});
const db = getFirestore(app);

async function test() {
  try {
    const snap = await db.collection('metrics').get();
    if (!snap.empty) {
      snap.forEach(doc => {
        console.log('Org ID:', doc.id);
        const data = doc.data();
        if (data.hierarchy) {
            data.hierarchy.forEach((metric: any, index: number) => {
                console.log(`  Layer 1 Metric ${index + 1}: ${metric.title}`);
            });
        }
      });
    } else {
      console.log('No documents found in metrics');
    }
  } catch (err) {
    console.error('Error testing:', err);
  }
}
test();
