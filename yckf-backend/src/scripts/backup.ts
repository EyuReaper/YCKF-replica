// src/scripts/backup.ts

import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { sanity } from '../lib/sanity.js'; // From lib for Sanity client
import { auditLog } from '../lib/audit.js'; // From lib for logging (optional audit on backup)

// Types for backup data
interface BackupData {
  at: string;
  data: Record<string, any[]>;
}

interface BackupType {
  type: string;
  query?: string; // Optional custom query
}

// Config: List of types to backup (modular – can extend)
const BACKUP_TYPES: BackupType[] = [
  { type: 'user' },
  { type: 'premiumTraining' },
  { type: 'studentEnrollment' },
  { type: 'courseProgress' },
  { type: 'auditLog' },
  { type: 'paymentLog' },
  { type: 'freeTraining' },
  { type: 'about' },
  { type: 'testimonial' },
  { type: 'careers' },
  { type: 'events' },
  { type: 'interns' },
  { type: 'team' },
  { type: 'top-performers' },
  { type: 'volunteers' },
  { type: 'blogs' },
];

const BACKUP_DIR = process.env.BACKUP_DIR || './backups';

async function run(): Promise<void> {
  try {
    // Ensure backup dir exists
    await fs.mkdir(BACKUP_DIR, { recursive: true });

    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outFile = path.join(BACKUP_DIR, `backup-${stamp}.json`);

    const data: Record<string, any[]> = {};
    let successCount = 0;
    let errorCount = 0;

    console.log('🚀 Starting Sanity backup...'); // Structured logging

    for (const { type, query } of BACKUP_TYPES) {
      try {
        const docs = await sanity.fetch(query || `*[_type == "${type}"]`); // Use custom query if provided
        data[type] = docs || [];
        successCount++;
        console.log(`✅ Backed up ${type}: ${data[type].length} documents`);
      } catch (e) {
        data[type] = [];
        errorCount++;
        console.warn(`⚠️ Backup failed for ${type}:`, e); // Per-type error handling
      }
    }

    const backup: BackupData = {
      at: new Date().toISOString(),
      data,
    };

    await fs.writeFile(outFile, JSON.stringify(backup, null, 2));
    console.log(`📁 Backup complete: ${outFile} (${successCount} types succeeded, ${errorCount} failed)`);

    // Optional: Audit log (if running as user action)
    await auditLog({
      action: 'backup_created',
      entityType: 'system',
      details: { file: outFile, successCount, errorCount },
      status: errorCount === 0 ? 'success' : 'partial',
    });
  } catch (error) {
    console.error('💥 Backup script failed:', error);
    process.exit(1);
  }
}

// Run script
if (require.main === module) {
  run().catch((e) => {
    console.error('💥 Unhandled error:', e);
    process.exit(1);
  });
}

export { run, BACKUP_TYPES }; // Export for potential import in other scripts