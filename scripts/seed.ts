
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import fs from 'fs';
import yaml from 'js-yaml';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function seed() {
    const file = fs.readFileSync('./public/config/metrics.yaml', 'utf8');
    const data = yaml.load(file) as any[];

    const ids: string[] = [];
    // recursive function to find IDs
    function findIds(items: any[]) {
        for (const item of items) {
            if (item.id) ids.push(item.id);
            if (item.subMetrics) findIds(item.subMetrics);
        }
    }
    findIds(data);

    const colRef = collection(db, 'metrics_data');
    console.log('Seeding', ids.length, 'metrics with 12 datapoints each...');
    for (const id of ids) {
        for (let i = 0; i < 12; i++) {
            await addDoc(colRef, {
                metricId: id,
                date: new Date(Date.now() - i * 86400000).toISOString(),
                value: Math.random() * 100
            });
        }
    }
    console.log('Seeded', ids.length * 12, 'datapoints total.');
}
seed().catch(console.error);
