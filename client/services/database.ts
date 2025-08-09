// Database service for cross-platform user data storage
// This service abstracts data storage and can be extended for remote databases

interface UserData {
  user: any;
  transactions: any[];
  budgets: any[];
  goals: any[];
  subscriptions: any[];
}

class DatabaseService {
  private storageKey = 'turbocash_user_data';
  private syncKey = 'turbocash_last_sync';
  
  // Local storage methods
  async saveUserData(userId: string, data: UserData): Promise<void> {
    try {
      const timestamp = new Date().toISOString();
      const dataWithSync = {
        ...data,
        lastModified: timestamp,
        userId
      };
      
      // Save to localStorage
      localStorage.setItem(`${this.storageKey}_${userId}`, JSON.stringify(dataWithSync));
      localStorage.setItem(`${this.syncKey}_${userId}`, timestamp);
      
      // Future: Sync to remote database
      await this.syncToRemote(userId, dataWithSync);
    } catch (error) {
      console.error('Failed to save user data:', error);
      throw new Error('Failed to save user data');
    }
  }

  async getUserData(userId: string): Promise<UserData | null> {
    try {
      // Try to load from localStorage first
      const localData = localStorage.getItem(`${this.storageKey}_${userId}`);
      if (localData) {
        const parsed = JSON.parse(localData);
        
        // Future: Check if remote data is newer
        const remoteData = await this.loadFromRemote(userId);
        if (remoteData && this.isNewerData(remoteData, parsed)) {
          return remoteData;
        }
        
        return parsed;
      }
      
      // Try to load from remote if local data doesn't exist
      return await this.loadFromRemote(userId);
    } catch (error) {
      console.error('Failed to load user data:', error);
      return null;
    }
  }

  async deleteUserData(userId: string): Promise<void> {
    try {
      localStorage.removeItem(`${this.storageKey}_${userId}`);
      localStorage.removeItem(`${this.syncKey}_${userId}`);
      
      // Future: Delete from remote database
      await this.deleteFromRemote(userId);
    } catch (error) {
      console.error('Failed to delete user data:', error);
      throw new Error('Failed to delete user data');
    }
  }

  // Cross-platform sync methods
  private async syncToRemote(userId: string, data: any): Promise<void> {
    // Future implementation: Sync data to remote database
    // This could be implemented with:
    // - Firebase/Firestore
    // - Supabase
    // - Custom REST API
    // - IndexedDB for offline-first approach
    
    try {
      // Placeholder for remote sync
      console.log('Syncing to remote database...', { userId, dataSize: JSON.stringify(data).length });
      
      // Example implementation:
      // await fetch('/api/users/' + userId + '/data', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
    } catch (error) {
      console.warn('Failed to sync to remote:', error);
      // Don't throw error - local storage still works
    }
  }

  private async loadFromRemote(userId: string): Promise<UserData | null> {
    // Future implementation: Load data from remote database
    try {
      // Placeholder for remote loading
      console.log('Loading from remote database...', { userId });
      
      // Example implementation:
      // const response = await fetch('/api/users/' + userId + '/data');
      // if (response.ok) {
      //   return await response.json();
      // }
      
      return null;
    } catch (error) {
      console.warn('Failed to load from remote:', error);
      return null;
    }
  }

  private async deleteFromRemote(userId: string): Promise<void> {
    // Future implementation: Delete data from remote database
    try {
      // Placeholder for remote deletion
      console.log('Deleting from remote database...', { userId });
      
      // Example implementation:
      // await fetch('/api/users/' + userId + '/data', {
      //   method: 'DELETE'
      // });
    } catch (error) {
      console.warn('Failed to delete from remote:', error);
    }
  }

  private isNewerData(remote: any, local: any): boolean {
    try {
      const remoteTime = new Date(remote.lastModified || 0);
      const localTime = new Date(local.lastModified || 0);
      return remoteTime > localTime;
    } catch {
      return false;
    }
  }

  // Backup and restore methods
  async exportUserData(userId: string): Promise<string> {
    const data = await this.getUserData(userId);
    if (!data) {
      throw new Error('No data found for user');
    }
    return JSON.stringify(data, null, 2);
  }

  async importUserData(userId: string, dataString: string): Promise<void> {
    try {
      const data = JSON.parse(dataString);
      await this.saveUserData(userId, data);
    } catch (error) {
      console.error('Failed to import user data:', error);
      throw new Error('Invalid data format');
    }
  }

  // Get storage statistics
  getStorageInfo(userId: string): { size: number; lastSync: string | null } {
    try {
      const data = localStorage.getItem(`${this.storageKey}_${userId}`);
      const lastSync = localStorage.getItem(`${this.syncKey}_${userId}`);
      
      return {
        size: data ? new Blob([data]).size : 0,
        lastSync: lastSync
      };
    } catch {
      return { size: 0, lastSync: null };
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseService();
export default databaseService;
