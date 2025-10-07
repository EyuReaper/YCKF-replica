import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { sanity } from '../lib/sanity.js';

async function run() {
  const backupDir = process.env.BACKUP_DIR || './backups';
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const out = path.join(backupDir, `backup-${stamp}.json`);

  const types = [
    'user','premiumTraining','studentEnrollment','courseProgress','auditLog','paymentLog','freeTraining','about','testimonial','careers','events','interns','team','top-performers','volunteers','blogs'
  ];

  const data: Record<string, any[]> = {};
  for (const t of types) {
    try {
      const docs = await sanity.fetch(`*[_type == "${t}"]`);
      data[t] = docs;
    } catch (e) {
      data[t] = [];
    }
  }

  fs.writeFileSync(out, JSON.stringify({ at: new Date().toISOString(), data }, null, 2));
  // eslint-disable-next-line no-console
  console.log('Backup written to', out);
}

run().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});


