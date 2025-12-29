import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Mail, CheckCircle, Eye, EyeOff } from 'lucide-react';

interface RegisterProps {
  onSwitchToLogin: () => void;
}

export function Register({ onSwitchToLogin }: RegisterProps) {
  const { signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}`,
        },
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        if (data.user.identities && data.user.identities.length === 0) {
          setError('This email is already registered. Please login instead.');
        } else {
          setRegisteredEmail(email);
          setVerificationSent(true);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: registeredEmail,
      });

      if (error) throw error;
      setError('');
      alert('Verification email resent! Please check your inbox.');
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email');
    } finally {
      setLoading(false);
    }
  };

  if (verificationSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-black flex items-center justify-center p-0 sm:p-4">
        <div className="bg-light-card/70 dark:bg-dark-card/30 backdrop-blur-xl rounded-card shadow-card-light dark:shadow-card-dark w-full max-w-md p-8 text-center border border-light-border/50 dark:border-dark-border/50">
          <div className="bg-primary/20 dark:bg-primary/30 p-4 rounded-full inline-block mb-6 border-4 border-primary">
            <Mail className="w-12 h-12 text-primary" />
          </div>

          <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-3">
            Verify Your Email
          </h2>

          <div className="bg-light-section dark:bg-dark-section rounded-xl p-5 mb-6 border border-light-border dark:border-dark-border">
            <p className="text-light-text dark:text-dark-text mb-4 leading-relaxed">
              We've sent a verification link to:
            </p>
            <p className="text-primary font-semibold text-lg mb-4 break-all">
              {registeredEmail}
            </p>
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm leading-relaxed">
              Click the link in the email to activate your account and complete registration.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-light-section dark:bg-dark-section rounded-xl border border-light-border dark:border-dark-border text-left">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-light-text dark:text-dark-text mb-1">
                  Check your spam folder
                </p>
                <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                  Sometimes verification emails end up in spam or promotions
                </p>
              </div>
            </div>

            <button
              onClick={handleResendVerification}
              disabled={loading}
              className="w-full px-4 py-3 bg-light-section dark:bg-dark-section hover:bg-light-hover dark:hover:bg-dark-hover text-light-text dark:text-dark-text font-medium rounded-xl transition-all border border-light-border dark:border-dark-border disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Resend Verification Email'}
            </button>

            <button
              onClick={onSwitchToLogin}
              className="w-full text-primary hover:text-primary-hover hover:underline text-sm font-semibold"
            >
              Back to Login
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-500 text-red-600 dark:text-red-400 rounded-xl text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-black flex items-center justify-center p-0 sm:p-4">
      <div className="bg-light-card/70 dark:bg-dark-card/30 backdrop-blur-xl rounded-card shadow-card-light dark:shadow-card-dark w-full max-w-md p-8 border border-light-border/50 dark:border-dark-border/50">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-primary/20 dark:bg-primary/30 p-4 rounded-full border-4 border-primary">
            <BookOpen className="w-10 h-10 text-primary" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-3 text-light-text dark:text-dark-text">
          Create Account
        </h1>
        <p className="text-center text-light-text-secondary dark:text-dark-text-secondary mb-8">
          Join NEET-UG MCQ Platform
        </p>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 text-red-600 dark:text-red-400 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-light-border dark:border-dark-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text transition-all"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-light-border dark:border-dark-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text transition-all"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 pr-12 border-2 border-light-border dark:border-dark-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text transition-all"
                placeholder="Create a password (min 6 characters)"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 text-dark-bg font-semibold py-3 rounded-xl transition-all shadow-sm hover:shadow-md"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-light-border dark:border-dark-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-light-card dark:bg-dark-card text-light-text-secondary dark:text-dark-text-secondary font-medium">
                OR
              </span>
            </div>
          </div>

          <button
            onClick={async () => {
              setError('');
              setGoogleLoading(true);
              try {
                await signInWithGoogle();
              } catch (err: any) {
                setError(err.message || 'Failed to sign in with Google');
              } finally {
                setGoogleLoading(false);
              }
            }}
            disabled={googleLoading}
            type="button"
            className="mt-4 w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-light-border dark:border-dark-border rounded-xl hover:bg-light-hover dark:hover:bg-dark-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-light-text dark:text-dark-text font-medium">
              {googleLoading ? 'Signing in...' : 'Continue with Google'}
            </span>
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-primary hover:text-primary-hover hover:underline font-semibold"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
