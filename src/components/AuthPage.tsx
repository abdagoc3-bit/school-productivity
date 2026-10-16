import React, { useState } from 'react';
import { User } from '../types';
import { authenticateUser, registerUser, resetUserPin } from '../utils/storage';
import { AvoraLogo } from './AvoraLogo';
import { Eye, EyeOff, Lock, User as UserIcon, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

interface AuthPageProps {
  onAuthSuccess: (user: User) => void;
}

type AuthMode = 'login' | 'signup' | 'forgot';

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [name, setName] = useState('');
  const [newPin, setNewPin] = useState('');

  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validateName = (val: string): string | null => {
    const trimmed = val.trim();
    if (!trimmed) return 'Please enter your full name.';
    const letterAndSpaceRegex = /^[a-zA-Z\s]+$/;
    if (!letterAndSpaceRegex.test(trimmed)) {
      return 'Name can only contain letters and spaces (no numbers or special characters).';
    }
    return null;
  };

  const validatePin = (val: string): string | null => {
    const trimmed = val.trim();
    if (!trimmed) return 'Please enter your 6-digit PIN.';
    if (!/^\d+$/.test(trimmed)) {
      return 'PIN must contain only numbers (digits 0-9).';
    }
    if (trimmed.length !== 6) {
      return 'PIN must be exactly 6 numbers.';
    }
    return null;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!username.trim()) {
      setErrorMessage('Please enter your username.');
      return;
    }
    const pinErr = validatePin(pin);
    if (pinErr) {
      setErrorMessage(pinErr);
      return;
    }
    const result = authenticateUser(username, pin);
    if (result.success && result.user) {
      onAuthSuccess(result.user);
    } else {
      setErrorMessage(result.error || 'Authentication failed.');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const nameErr = validateName(name);
    if (nameErr) {
      setErrorMessage(nameErr);
      return;
    }
    if (!username.trim()) {
      setErrorMessage('Please choose a username.');
      return;
    }
    const pinErr = validatePin(pin);
    if (pinErr) {
      setErrorMessage(pinErr);
      return;
    }
    if (pin !== confirmPin) {
      setErrorMessage('Confirm PIN does not match your 6-digit PIN.');
      return;
    }

    const newUser: User = {
      id: 'usr_' + Date.now().toString(36),
      username: username.trim().toLowerCase(),
      pin: pin.trim(),
      name: name.trim(),
      createdAt: new Date().toISOString()
    };
    const res = registerUser(newUser);
    if (res.success) {
      onAuthSuccess(newUser);
    } else {
      setErrorMessage(res.error || 'Signup failed.');
    }
  };

  const handleForgotPin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    if (!username.trim()) {
      setErrorMessage('Please enter your username.');
      return;
    }
    const pinErr = validatePin(newPin);
    if (pinErr) {
      setErrorMessage(pinErr);
      return;
    }
    const res = resetUserPin(username, newPin);
    if (res.success) {
      setSuccessMessage('PIN reset successfully! You can now log in.');
      setTimeout(() => {
        setMode('login');
        setPin(newPin);
        setSuccessMessage('');
      }, 1500);
    } else {
      setErrorMessage(res.error || 'Could not reset PIN.');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md bg-white dark:bg-[#1e1f29] rounded-3xl border border-black/8 dark:border-white/10 shadow-xl p-6 sm:p-8 relative overflow-hidden transition-all">
        {/* Logo and Tagline */}
        <div className="text-center mb-6">
          <AvoraLogo size="lg" showTagline={true} className="mb-2" />
        </div>

        {/* Tab switcher: Sign In vs Create Account */}
        {mode !== 'forgot' ? (
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMessage(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'login' 
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setErrorMessage(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'signup' 
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        ) : (
          <button
            onClick={() => { setMode('login'); setErrorMessage(''); }}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </button>
        )}

        {/* Alert banners */}
        {errorMessage && (
          <div className="flex items-center gap-2 p-3 mb-4 text-xs text-rose-800 dark:text-rose-200 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="flex items-center gap-2 p-3 mb-4 text-xs text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Mode: LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  PIN (6 numbers)
                </label>
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setErrorMessage(''); }}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Forgot PIN?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPin ? 'text' : 'password'}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setPin(onlyNums);
                  }}
                  placeholder="Enter 6-digit PIN"
                  className="w-full pl-9 pr-10 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono tracking-widest"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                  title={showPin ? "Hide PIN" : "Show PIN"}
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              Sign In to Dashboard
            </button>
          </form>
        )}

        {/* Mode: SIGNUP */}
        {mode === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Your Full Name (Letters only)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || /^[a-zA-Z\s]+$/.test(val)) {
                    setName(val);
                    setErrorMessage('');
                  } else {
                    setErrorMessage('Name can only contain letters and spaces (no numbers or special characters).');
                  }
                }}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Choose Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Create PIN (6 digits)
                </label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={pin}
                    onChange={(e) => {
                      const onlyNums = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setPin(onlyNums);
                    }}
                    placeholder="6 digits"
                    className="w-full pl-3 pr-8 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-mono tracking-widest focus:outline-hidden"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
                  >
                    {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Confirm PIN
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPin ? 'text' : 'password'}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={confirmPin}
                    onChange={(e) => {
                      const onlyNums = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setConfirmPin(onlyNums);
                    }}
                    placeholder="6 digits"
                    className="w-full pl-3 pr-8 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-mono tracking-widest focus:outline-hidden"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPin(!showConfirmPin)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
                  >
                    {showConfirmPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs mt-2 cursor-pointer"
            >
              Complete Registration & Enter
            </button>
          </form>
        )}

        {mode === 'forgot' && (
          <form onSubmit={handleForgotPin} className="space-y-4">
            <div className="p-3 bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 rounded-xl text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
              Enter your username and choose your new 6-digit PIN to update your account.
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                New PIN Code (6 digits)
              </label>
              <div className="relative">
                <input
                  type={showNewPin ? 'text' : 'password'}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={newPin}
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setNewPin(onlyNums);
                  }}
                  placeholder="6 numbers only"
                  className="w-full pl-3 pr-10 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-mono tracking-widest focus:outline-hidden"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPin(!showNewPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
                >
                  {showNewPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              Reset & Update PIN
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
