import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Thermometer } from 'react-feather';
import Cookies from 'js-cookie';
import { useLoginMutation } from '../api/authApiSlice';
import { redirectIfAuthenticated } from '../utils/redirectAuth';

export default function Login() {
  const navigate = useNavigate();
  redirectIfAuthenticated();

  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }

    try {
      const result = await login({ email, pass: password }).unwrap();

      if (result?.msg === 'Success') {
        Cookies.set('currentUser', JSON.stringify(result.userInfo), { sameSite: 'Lax' });
        Cookies.set('aToken', result.accessToken, { sameSite: 'Lax' });
        Cookies.set('rToken', result.refreshToken, { sameSite: 'Lax' });
        navigate('/dashboard');
      }
    } catch (err) {
      if (!err?.status) {
        setError('Server not responding');
      } else if (err.status === 400) {
        setError(err?.data?.msg || 'Invalid credentials');
      } else {
        setError('Login failed');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 flex flex-col">
      {/* Top bar */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-neutral-900 dark:bg-white rounded flex items-center justify-center">
            <Thermometer size={14} className="text-white dark:text-black" />
          </div>
          <span className="text-neutral-900 dark:text-white font-semibold tracking-tight">Edge Automation</span>
        </Link>
        <Link to="/" className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white text-sm transition-colors">
          ← Back to home
        </Link>
      </div>

      {/* Form area */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8">
            <div className="mb-8">
              <h1 className="text-xl font-bold text-neutral-900 dark:text-white mb-1">Sign In</h1>
              <p className="text-neutral-500 text-sm">Enter your credentials to access the database.</p>
            </div>

            {error && (
              <div className="mb-4 px-3 py-2.5 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5 uppercase tracking-wider">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold rounded-lg text-sm hover:bg-neutral-700 dark:hover:bg-neutral-200 active:bg-neutral-800 dark:active:bg-neutral-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-neutral-400 dark:text-neutral-600 mt-6">
            Need access?{' '}
            <span className="text-neutral-500 dark:text-neutral-400">Contact your administrator.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
