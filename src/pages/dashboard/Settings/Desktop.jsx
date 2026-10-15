import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Sun, Moon, Server, User, Lock, Eye, EyeOff, Check, AlertCircle, Edit2, X } from 'react-feather';
import { useTheme } from '../../../context/ThemeContext';
import { useChangePasswordMutation, useUpdateProfileMutation } from '../../../api/authApiSlice';

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function SettingRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
      <span className="text-sm text-neutral-500">{label}</span>
      <span className="text-sm text-neutral-900 dark:text-neutral-200 font-medium text-right max-w-xs truncate">
        {value ?? <span className="text-neutral-300 dark:text-neutral-700 font-normal">—</span>}
      </span>
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon size={13} className="text-neutral-400 dark:text-neutral-600" />
        <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{title}</h2>
      </div>
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-5">
        {children}
      </div>
    </div>
  );
}

function PasswordField({ label, value, onChange, show, onToggle }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-4 py-2.5 pr-10 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-500 transition-colors"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
}

export default function DashboardSettings() {
  const { theme, toggleTheme } = useTheme();
  const [changePassword, { isLoading: changingPassword }] = useChangePasswordMutation();
  const [updateProfile, { isLoading: savingProfile }] = useUpdateProfileMutation();

  const currentUser = Cookies.get('currentUser')
    ? JSON.parse(Cookies.get('currentUser'))
    : null;

  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue]     = useState(currentUser?.name ?? '');
  const [nameError, setNameError]     = useState('');

  const handleSaveName = async () => {
    if (!nameValue.trim()) { setNameError('Name cannot be empty'); return; }
    try {
      const res = await updateProfile({ name: nameValue.trim() }).unwrap();
      const updated = JSON.stringify(res.userInfo);
      Cookies.set('currentUser', updated, { sameSite: 'Lax' });
      setEditingName(false);
      setNameError('');
    } catch (err) {
      setNameError(err?.data?.msg || 'Failed to update name');
    }
  };

  const handleCancelName = () => {
    setNameValue(currentUser?.name ?? '');
    setNameError('');
    setEditingName(false);
  };

  const [oldPassword, setOldPassword]     = useState('');
  const [newPassword, setNewPassword]     = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld]             = useState(false);
  const [showNew, setShowNew]             = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [pwError, setPwError]             = useState('');
  const [pwSuccess, setPwSuccess]         = useState(false);

  useEffect(() => {
    setPwError('');
    setPwSuccess(false);
  }, [oldPassword, newPassword, confirmPassword]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPwError('All fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setPwError('New password must be at least 8 characters');
      return;
    }
    try {
      await changePassword({ oldPassword, newPassword }).unwrap();
      setPwSuccess(true);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwError(err?.data?.msg || 'Failed to change password');
    }
  };


  const initials = getInitials(currentUser?.name);

  return (
    <main className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">Settings</h1>
      <p className="text-neutral-500 text-sm mb-8">Manage your account and preferences.</p>

      <div className="flex flex-col gap-6">

        {/* Profile */}
        <Section title="Profile" icon={User}>
          {/* Avatar + name header */}
          <div className="flex items-center gap-4 py-4 border-b border-neutral-100 dark:border-neutral-800">
            <div className="w-11 h-11 rounded-full bg-neutral-900 dark:bg-white flex items-center justify-center shrink-0">
              <span className="text-sm font-semibold text-white dark:text-black">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                {currentUser?.name ?? <span className="text-neutral-400 dark:text-neutral-600 font-normal">Unknown</span>}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">{currentUser?.role ?? 'Member'}</p>
            </div>
          </div>

          {/* Name row */}
          <div className="flex items-center justify-between py-3.5 border-b border-neutral-100 dark:border-neutral-800">
            <span className="text-sm text-neutral-500 shrink-0 mr-4">Name</span>
            {editingName ? (
              <div className="flex items-center gap-2 flex-1 justify-end">
                <div className="flex flex-col items-end gap-1 flex-1 max-w-xs">
                  <input
                    type="text"
                    value={nameValue}
                    onChange={(e) => { setNameValue(e.target.value); setNameError(''); }}
                    autoFocus
                    className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-1.5 text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-500 transition-colors"
                  />
                  {nameError && <span className="text-xs text-red-500">{nameError}</span>}
                </div>
                <button
                  onClick={handleCancelName}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <X size={14} />
                </button>
                <button
                  onClick={handleSaveName}
                  disabled={savingProfile}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
                >
                  <Check size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm text-neutral-900 dark:text-neutral-200 font-medium">
                  {currentUser?.name ?? <span className="text-neutral-300 dark:text-neutral-700 font-normal">—</span>}
                </span>
                <button
                  onClick={() => setEditingName(true)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <Edit2 size={13} />
                </button>
              </div>
            )}
          </div>

          <SettingRow label="Email" value={currentUser?.email} />
          <SettingRow label="Role" value={currentUser?.role} />
        </Section>
        <p className="text-xs text-neutral-400 dark:text-neutral-600 -mt-4 px-1">
          Email and role managed by admin.
        </p>

        {/* Appearance */}
        <Section title="Appearance" icon={theme === 'dark' ? Moon : Sun}>
          <div className="flex items-center justify-between py-3.5">
            <span className="text-sm text-neutral-500">Theme</span>
            <div className="flex items-center gap-3">
              <span className="text-sm text-neutral-900 dark:text-neutral-200 font-medium">
                {theme === 'dark' ? 'Dark' : 'Light'}
              </span>
              <button
                onClick={toggleTheme}
                role="switch"
                aria-checked={theme === 'dark'}
                aria-label="Toggle dark mode"
                className={`relative inline-flex w-9 h-5 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 ${
                  theme === 'dark' ? 'bg-neutral-500' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    theme === 'dark' ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </Section>

        {/* System */}
        <Section title="System" icon={Server}>
          <SettingRow label="Status" value={
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
              Online
            </span>
          } />
          <SettingRow label="Version" value="1.0" />
        </Section>

        {/* Security */}
        <Section title="Security" icon={Lock}>
          <form onSubmit={handleChangePassword} className="py-4 flex flex-col gap-4">
            {pwError && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle size={14} className="shrink-0" />
                {pwError}
              </div>
            )}
            {pwSuccess && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800/50 text-green-600 dark:text-green-400 text-sm">
                <Check size={14} className="shrink-0" />
                Password changed successfully
              </div>
            )}
            <PasswordField
              label="Current Password"
              value={oldPassword}
              onChange={setOldPassword}
              show={showOld}
              onToggle={() => setShowOld((v) => !v)}
            />
            <PasswordField
              label="New Password"
              value={newPassword}
              onChange={setNewPassword}
              show={showNew}
              onToggle={() => setShowNew((v) => !v)}
            />
            <PasswordField
              label="Confirm New Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              show={showConfirm}
              onToggle={() => setShowConfirm((v) => !v)}
            />
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={changingPassword}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {changingPassword ? 'Saving…' : 'Change Password'}
              </button>
            </div>
          </form>
        </Section>

        {/* Coming soon */}
        <div className="bg-white dark:bg-neutral-900 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl px-5 py-10 flex items-center justify-center">
          <span className="text-sm text-neutral-400 dark:text-neutral-600">More on the way!</span>
        </div>

      </div>
    </main>
  );
}
