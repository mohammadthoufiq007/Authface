import SQLite from 'react-native-sqlcipher-storage';

SQLite.DEBUG(false);
SQLite.enablePromise(true);

const DB_NAME = 'authface_secure.db';
const ENCRYPTION_KEY = 'your_secure_256_bit_encryption_key_here'; // In production, store in Keystore/Keychain

let db;

class DatabaseHelper {
  static async initDB() {
    try {
      db = await SQLite.openDatabase({
        name: DB_NAME,
        key: ENCRYPTION_KEY,
        location: 'default',
      });
      
      await db.executeSql(`
        CREATE TABLE IF NOT EXISTS OfflineLogs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId TEXT NOT NULL,
          embedding TEXT NOT NULL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          synced INTEGER DEFAULT 0
        );
      `);
      console.log('Secure Database initialized');
      return true;
    } catch (error) {
      console.error('Database init error:', error);
      return false;
    }
  }

  static async logAuthentication(userId, embeddingArray) {
    if (!db) return false;
    try {
      const embeddingStr = JSON.stringify(embeddingArray);
      await db.executeSql(
        'INSERT INTO OfflineLogs (userId, embedding) VALUES (?, ?)',
        [userId, embeddingStr]
      );
      return true;
    } catch (error) {
      console.error('Error logging auth:', error);
      return false;
    }
  }

  static async getUnsyncedLogs() {
    if (!db) return [];
    try {
      const [results] = await db.executeSql('SELECT * FROM OfflineLogs WHERE synced = 0');
      const logs = [];
      for (let i = 0; i < results.rows.length; i++) {
        logs.push(results.rows.item(i));
      }
      return logs;
    } catch (error) {
      console.error('Error fetching unsynced logs:', error);
      return [];
    }
  }

  static async markLogsAsSynced(logIds) {
    if (!db || logIds.length === 0) return;
    try {
      const idString = logIds.join(',');
      await db.executeSql(`UPDATE OfflineLogs SET synced = 1 WHERE id IN (${idString})`);
    } catch (error) {
      console.error('Error marking logs as synced:', error);
    }
  }

  static async purgeSyncedLogs() {
    if (!db) return;
    try {
      await db.executeSql('DELETE FROM OfflineLogs WHERE synced = 1');
      console.log('Purged synced logs securely from local storage.');
    } catch (error) {
      console.error('Error purging logs:', error);
    }
  }
}

export default DatabaseHelper;
