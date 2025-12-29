import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { Database } from '../lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  };

  const createProfileIfNotExists = async (user: User) => {
    if (!user.email_confirmed_at) {
      console.log('User email not confirmed yet, skipping profile creation');
      return null;
    }

    let profileData = await fetchProfile(user.id);

    if (!profileData) {
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          role: 'student',
        });

      if (error) {
        console.error('Error creating profile:', error);
      } else {
        profileData = await fetchProfile(user.id);
      }
    }

    return profileData;
  };

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      (async () => {
        if (session?.user) {
          if (!session.user.email_confirmed_at) {
            console.log('Initial session: Email not confirmed, signing out user');
            await supabase.auth.signOut();
            setUser(null);
            setProfile(null);
            setLoading(false);
            return;
          }

          const profileData = await fetchProfile(session.user.id);

          if (!profileData) {
            console.log('Initial session: No profile found, signing out user');
            await supabase.auth.signOut();
            setUser(null);
            setProfile(null);
            setLoading(false);
            return;
          }

          setUser(session.user);
          setProfile(profileData);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      })();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        if (session?.user) {
          if (!session.user.email_confirmed_at) {
            console.log('Email not confirmed, signing out user');
            await supabase.auth.signOut();
            setUser(null);
            setProfile(null);
            return;
          }

          const profileData = await createProfileIfNotExists(session.user);

          if (!profileData) {
            console.log('No profile found for verified user, signing out');
            await supabase.auth.signOut();
            setUser(null);
            setProfile(null);
            return;
          }

          setUser(session.user);
          setProfile(profileData);
        } else {
          setUser(null);
          setProfile(null);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
        },
      });

      if (error) {
        console.error('Google sign-in error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to sign in with Google:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
