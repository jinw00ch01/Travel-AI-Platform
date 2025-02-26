import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signIn, 
  signUp, 
  signOut, 
  getCurrentUser,
  fetchAuthSession,
  signInWithRedirect
} from 'aws-amplify/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password) {
    try {
      const result = await signUp({
        username: email,
        password: password,
        attributes: {
          email
        }
      });
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function login(email, password) {
    try {
      const user = await signIn(email, password);
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function logout() {
    try {
      await signOut();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function loginWithGoogle() {
    try {
      await signInWithRedirect('Google');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function checkUser() {
      try {
        const user = await getCurrentUser();
        if (!cancelled) {
          setCurrentUser(user);
          setLoading(false);
        }
      } catch (error) {
        setCurrentUser(null);
        setLoading(false);
      }
    }

    checkUser();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    loginWithGoogle
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}