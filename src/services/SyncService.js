/**
 * SyncService.js
 * Background sync service using NetInfo to upload encrypted logs to AWS when online.
 */

import NetInfo from '@react-native-community/netinfo';
import DatabaseHelper from '../db/DatabaseHelper';

const AWS_SYNC_ENDPOINT = 'https://api.yourdatalake-aws.com/v1/sync/auth';
const SYNC_INTERVAL = 30000;

class SyncService {
  constructor() {
    this.unsubscribe = null;
    this.syncTimer = null;
  }

  /**
   * Initialize the sync service with NetInfo listener.
   */
  start() {
    this.unsubscribe = NetInfo.addEventListener((state) => {
      console.log('Network state:', state);
      if (state.isConnected) {
        console.log('Network connected – triggering sync');
        this.syncData();
      }
    });

    this.syncTimer = setInterval(() => {
      this.checkAndSync();
    }, SYNC_INTERVAL);

    console.log('SyncService started');
  }

  /**
   * Check network status and sync if online.
   */
  async checkAndSync() {
    try {
      const state = await NetInfo.fetch();
      if (state.isConnected) {
        await this.syncData();
      }
    } catch (error) {
      console.error('Error checking network status:', error);
    }
  }

  /**
   * Sync unsynced logs to AWS.
   */
  async syncData() {
    try {
      const logs = await DatabaseHelper.getUnsyncedLogs();

      if (logs.length === 0) {
        console.log('No unsynced logs to sync');
        return;
      }

      console.log(`Syncing ${logs.length} authentication logs...`);

      const payload = {
        logs: logs,
        timestamp: new Date().toISOString(),
        device_id: 'YOUR_DEVICE_ID',
      };

      const response = await fetch(AWS_SYNC_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_AUTH_TOKEN',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Sync successful:', responseData);

        const logIds = logs.map((log) => log.id);
        await DatabaseHelper.markLogsAsSynced(logIds);
        await DatabaseHelper.purgeSyncedLogs();

        console.log('Sync complete and local offline cache purged securely.');
      } else {
        console.error('Sync failed with status:', response.status);
      }
    } catch (error) {
      console.error('Error syncing data:', error);
    }
  }

  /**
   * Stop the sync service.
   */
  stop() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }
    console.log('SyncService stopped');
  }
}

export default new SyncService();
