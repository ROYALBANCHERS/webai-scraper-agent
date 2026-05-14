import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';

interface LoginPageProps {
  onLogin?: (email: string, password: string) => void;
  onSignup?: (email: string, password: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSignup }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call backend login/signup test endpoint
      const response = await fetch('http://localhost:8787/api/test-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: 'https://example.com/login', // This would be the user's target website
          email,
          password
        })
      });

      const data = await response.json();

      if (data.success) {
        if (isLogin && onLogin) {
          onLogin(email, password);
        } else if (!isLogin && onSignup) {
          onSignup(email, password);
        }
      } else {
        setError(data.message || 'Login/Signup test failed');
      }
    } catch (err: any) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">🔐 WebAI Auditor</h1>
            <p className="text-gray-500 mt-2">
              {isLogin ? 'Login to save your audits' : 'Create your account'}
            </p>
          </div>

          {/* Toggle Login/Signup */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                !isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Target URL for testing */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL to Test Login/Signup
              </label>
              <input
                type="url"
                placeholder="https://example.com/login"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                required
              />
              <p className="mt-2 text-xs text-gray-500">
                Enter the website URL where you want to test the login/signup functionality
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-4 rounded-xl text-white font-medium text-lg transition-all ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-black hover:bg-gray-800'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0114 14v2a2 2 0 01-2 2h6a2 2 0 01-2-2V7a2 2 0 012-2z"></path>
                  </svg>
                  Testing...
                </span>
              ) : isLogin ? (
                'Test Login'
              ) : (
                'Test Signup'
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl text-blue-800 text-sm">
            <p className="font-medium mb-2">🔐 How This Works:</p>
            <ul className="space-y-2 text-blue-700">
              <li>• We will navigate to the login/signup page</li>
              <li>• Fill in the credentials you provided</li>
              <li>• Check if login/signup actually works</li>
              <li>• Test for common errors and UX issues</li>
            </ul>
          </div>

          {/* Back to Home */}
          <button
            type="button"
            onClick={() => window.location.href = '/'}
            className="w-full py-3 text-center text-gray-600 hover:text-gray-900 font-medium"
          >
            ← Back to Home
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};
