/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';

// Retrieve environment variables
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';


export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Real client instance (will use placeholder values if not configured, to prevent initialization crash)
const realClient = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// --- SIMULATED CLIENT STATE (LocalStorage fallback for seamless previewing) ---
const getStorageItem = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const setStorageItem = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Types for simulation
interface SimUser {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  createdAt: string;
}

// Initial default simulated profiles (empty - no hardcoded seed data)
const DEFAULT_PROFILES: SimUser[] = [];

// Helper to get active session
let activeSessionUser: SimUser | null = getStorageItem<SimUser | null>('sim_supabase_session', null);
let authCallbacks: Array<(event: string, session: any) => void> = [];

const triggerAuthChange = (event: string, user: SimUser | null) => {
  activeSessionUser = user;
  setStorageItem('sim_supabase_session', user);
  const session = user ? { user: { id: user.id, email: user.email, user_metadata: { name: user.name, role: user.role } } } : null;
  authCallbacks.forEach(cb => cb(event, session));
};

// Simulated Client definition
const simulatedClient = {
  auth: {
    signUp: async ({ email, password, options }: any) => {
      await new Promise(resolve => setTimeout(resolve, 800));
      const profiles = getStorageItem<SimUser[]>('mw_registered_users', DEFAULT_PROFILES);
      if (profiles.some(p => p.email.toLowerCase() === email.toLowerCase())) {
        return { data: { user: null }, error: { message: 'User already exists.' } };
      }
      const name = options?.data?.name || email.split('@')[0];
      const role = options?.data?.role || 'student';
      const newUser: SimUser = {
        id: `usr-${Math.random().toString(36).substring(2, 9)}`,
        email,
        name,
        role,
        createdAt: new Date().toISOString()
      };
      profiles.push(newUser);
      setStorageItem('mw_registered_users', profiles);
      triggerAuthChange('SIGNED_IN', newUser);
      return { 
        data: { 
          user: { id: newUser.id, email: newUser.email, user_metadata: { name: newUser.name, role: newUser.role } } 
        }, 
        error: null 
      };
    },

    signInWithPassword: async ({ email, password }: any) => {
      await new Promise(resolve => setTimeout(resolve, 600));
      const profiles = getStorageItem<SimUser[]>('mw_registered_users', DEFAULT_PROFILES);
      const user = profiles.find(p => p.email.toLowerCase() === email.toLowerCase());
      
      // Simulate successful login with correct test password or any password for testing convenience
      if (user) {
        triggerAuthChange('SIGNED_IN', user);
        return { 
          data: { 
            user: { id: user.id, email: user.email, user_metadata: { name: user.name, role: user.role } } 
          }, 
          error: null 
        };
      }
      return { data: { user: null }, error: { message: 'Invalid credentials or user not found.' } };
    },

    signInWithOAuth: async ({ provider }: any) => {
      await new Promise(resolve => setTimeout(resolve, 600));
      const name = provider === 'google' ? 'Google User' : 'OAuth User';
      const email = `${provider}_${Math.random().toString(36).substring(2, 6)}@${provider}.com`;
      const profiles = getStorageItem<SimUser[]>('mw_registered_users', []);
      const newUser: SimUser = {
        id: `usr-${Math.random().toString(36).substring(2, 9)}`,
        email,
        name,
        role: 'student',
        createdAt: new Date().toISOString()
      };
      profiles.push(newUser);
      setStorageItem('mw_registered_users', profiles);
      triggerAuthChange('SIGNED_IN', newUser);
      return {
        data: {
          user: { id: newUser.id, email: newUser.email, user_metadata: { name: newUser.name, role: newUser.role } },
          provider
        },
        error: null
      };
    },

    signOut: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      triggerAuthChange('SIGNED_OUT', null);
      return { error: null };
    },

    getUser: async () => {
      if (activeSessionUser) {
        return { 
          data: { 
            user: { 
              id: activeSessionUser.id, 
              email: activeSessionUser.email, 
              user_metadata: { name: activeSessionUser.name, role: activeSessionUser.role } 
            } 
          }, 
          error: null 
        };
      }
      return { data: { user: null }, error: null };
    },

    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      authCallbacks.push(callback);
      // Run initial callback
      const session = activeSessionUser ? { user: { id: activeSessionUser.id, email: activeSessionUser.email, user_metadata: { name: activeSessionUser.name, role: activeSessionUser.role } } } : null;
      callback('INITIAL_SESSION', session);
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              authCallbacks = authCallbacks.filter(cb => cb !== callback);
            }
          }
        }
      };
    },

    getSession: async () => {
      if (activeSessionUser) {
        return {
          data: {
            session: {
              user: { id: activeSessionUser.id, email: activeSessionUser.email, user_metadata: { name: activeSessionUser.name, role: activeSessionUser.role } }
            }
          },
          error: null
        };
      }
      return { data: { session: null }, error: null };
    }
  },

  from: (table: string) => {
    return {
      select: (columns?: string) => {
        return {
          eq: (column: string, value: any) => {
            return {
              single: async () => {
                const data = getStorageItem<any[]>(`mw_${table}`, []);
                const match = data.find(item => item[column] === value);
                return { data: match || null, error: null };
              },
              order: async (orderCol: string, { ascending = true } = {}) => {
                let data = getStorageItem<any[]>(`mw_${table}`, []);
                let filtered = data.filter(item => item[column] === value);
                filtered.sort((a, b) => {
                  if (a[orderCol] < b[orderCol]) return ascending ? -1 : 1;
                  if (a[orderCol] > b[orderCol]) return ascending ? 1 : -1;
                  return 0;
                });
                return { data: filtered, error: null };
              },
              then: async (resolve: any) => {
                const data = getStorageItem<any[]>(`mw_${table}`, []);
                const filtered = data.filter(item => item[column] === value);
                resolve({ data: filtered, error: null });
              }
            };
          },
          order: async (orderCol: string, { ascending = true } = {}) => {
            let data = getStorageItem<any[]>(`mw_${table}`, []);
            data.sort((a, b) => {
              if (a[orderCol] < b[orderCol]) return ascending ? -1 : 1;
              if (a[orderCol] > b[orderCol]) return ascending ? 1 : -1;
              return 0;
            });
            return { data, error: null };
          },
          then: async (resolve: any) => {
            const data = getStorageItem<any[]>(`mw_${table}`, []);
            resolve({ data, error: null });
          }
        };
      },

      insert: (rows: any) => {
        return {
          then: async (resolve: any) => {
            const data = getStorageItem<any[]>(`mw_${table}`, []);
            const rowsToInsert = Array.isArray(rows) ? rows : [rows];
            const inserted = rowsToInsert.map(row => ({
              id: row.id || `row-${Math.random().toString(36).substring(2, 9)}`,
              createdAt: new Date().toISOString(),
              ...row
            }));
            const updated = [...data, ...inserted];
            setStorageItem(`mw_${table}`, updated);
            resolve({ data: inserted, error: null });
          }
        };
      },

      update: (updates: any) => {
        return {
          eq: (column: string, value: any) => {
            return {
              then: async (resolve: any) => {
                const data = getStorageItem<any[]>(`mw_${table}`, []);
                let updatedCount = 0;
                const updated = data.map(item => {
                  if (item[column] === value) {
                    updatedCount++;
                    return { ...item, ...updates, updatedAt: new Date().toISOString() };
                  }
                  return item;
                });
                setStorageItem(`mw_${table}`, updated);
                resolve({ data: updated.filter(item => item[column] === value), error: null, count: updatedCount });
              }
            };
          }
        };
      },

      delete: () => {
        return {
          eq: (column: string, value: any) => {
            return {
              then: async (resolve: any) => {
                const data = getStorageItem<any[]>(`mw_${table}`, []);
                const filtered = data.filter(item => item[column] !== value);
                setStorageItem(`mw_${table}`, filtered);
                resolve({ error: null });
              }
            };
          }
        };
      },

      upsert: (rows: any, options?: any) => {
        return {
          then: async (resolve: any) => {
            const data = getStorageItem<any[]>(`mw_${table}`, []);
            const rowsArr = Array.isArray(rows) ? rows : [rows];
            const idField = options?.onConflict || 'id';
            rowsArr.forEach(row => {
              const idx = data.findIndex((d: any) => d[idField] === row[idField]);
              if (idx >= 0) data[idx] = { ...data[idx], ...row, updatedAt: new Date().toISOString() };
              else data.push({ ...row, createdAt: row.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() });
            });
            setStorageItem(`mw_${table}`, data);
            resolve({ data: rowsArr, error: null });
          }
        };
      }
    };
  }
};

// Export clients:
// - dbClient: real Supabase for database ops (tables you created)
// - authClient: simulated client for auth (avoids rate limits on free tier)
export const dbClient = isSupabaseConfigured ? realClient : (simulatedClient as any);
export const authClient = (simulatedClient as any);
export const supabaseClient = dbClient;
export default supabaseClient;
