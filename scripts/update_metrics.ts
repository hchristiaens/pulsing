import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import config from '../firebase-applet-config.json';

// Firebase Admin initialization for administrative tasks
const app = initializeApp({
  projectId: config.projectId
});
const db = getFirestore(app, config.firestoreDatabaseId);

async function updateMetrics() {
  try {
    const orgsSnap = await db.collection('organizations').get();
    const targetTitles = ['Tactical KPI','Strategic KPI','Financial Health KPI','People KPI','Compliance & Risk KPI','Operational KPI'];

    for (const doc of orgsSnap.docs) {
      const data = doc.data();
      if (data.hierarchy && Array.isArray(data.hierarchy)) {
        let updated = false;
        data.hierarchy = data.hierarchy.map((metric: any, index: number) => {
          if (index < targetTitles.length && metric.title !== targetTitles[index]) {
            console.log(`Updating ${doc.id}: ${metric.title} -> ${targetTitles[index]}`);
            updated = true;
            return { ...metric, title: targetTitles[index] };
          }
          return metric;
        });
        if (updated) {
          await doc.ref.update({ hierarchy: data.hierarchy });
          console.log(`Updated document ${doc.id}`);
        }
      }
    }
    console.log('Update complete.');
  } catch (error) {
    console.error('Error updating metrics:', error);
  }
}
updateMetrics();
