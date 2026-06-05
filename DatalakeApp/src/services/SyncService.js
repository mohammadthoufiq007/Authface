import NetInfo from '@react-native-community/netinfo';
import DatabaseHelper from '../db/DatabaseHelper';

/**
 * Background Service to manage syncing offline biometric logs to the remote AWS Server.
 */
class SyncService {
  
  static AWS_SYNC_ENDPOINT = 'https://api.yourdatalake-aws.com/v1/sync/auth'; // Replace with real AWS API Gateway URL
  
  /**
   * Starts monitoring the network to trigger sync when online.
   */
  static startMonitoring() {
    NetInfo.addEventListener(state => {
      if (state.isConnected && state.isInternetReachable) {
        console.log('Network restored. Attempting sync...');
        this.syncData();
      }
    });
  }

  /**
   * Syncs data and then safely purges the local database records.
   */
  static async syncData() {
    try {
      const unsyncedLogs = await DatabaseHelper.getUnsyncedLogs();
      if (unsyncedLogs.length === 0) {
        console.log('No pending logs to sync.');
        return;
      }

      console.log(`Syncing ${unsyncedLogs.length} records to AWS...`);
      
      const payload = {
        logs: unsyncedLogs.map(log => ({
          userId: log.userId,
          embedding: JSON.parse(log.embedding),
          timestamp: log.timestamp
        }))
      };

      // Mock API call to AWS
      const response = await fetch(this.AWS_SYNC_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_SECURE_TOKEN' // Inject auth token
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const logIds = unsyncedLogs.map(log => log.id);
        
        // 1. Mark as synced
        await DatabaseHelper.markLogsAsSynced(logIds);
        
        // 2. Purge local data permanently
        await DatabaseHelper.purgeSyncedLogs();
        
        console.log('Sync complete and local offline cache purged securely.');
      } else {
        console.warn('Sync failed. Server responded with:', response.status);
      }
    } catch (error) {
      console.error('Network sync error:', error);
    }
  }
}

export default SyncService;
