import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const UserSettings = () => {
  const { user, updateProfile, changePassword, loading } = useAuth()
  const { pathname } = useLocation()
  const profileMode = pathname.endsWith('/profile')
  const [profile, setProfile] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '' })
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    const names = String(user?.name || '').trim().split(/\s+/)
    setProfile({
      firstName: user?.firstName || names[0] || '',
      lastName: user?.lastName || names.slice(1).join(' ') || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
    })
  }, [user])

  const updateField = (event) => setProfile((current) => ({ ...current, [event.target.name]: event.target.value }))

  const saveProfile = async (event) => {
    event.preventDefault()
    await updateProfile(profile)
  }

  const savePassword = async (event) => {
    event.preventDefault()
    setPasswordError('')
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }
    await changePassword(passwords.currentPassword, passwords.newPassword)
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{profileMode ? 'Profile' : 'Settings'}</h1>
        <p className="mt-2 text-gray-600">Manage your personal information and account security.</p>
      </div>

      <form onSubmit={saveProfile} className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold text-gray-900">Personal information</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            ['firstName', 'First name', 'text'],
            ['lastName', 'Last name', 'text'],
            ['email', 'Email address', 'email'],
            ['phone', 'Phone number', 'tel'],
          ].map(([name, label, type]) => (
            <label key={name} className="block text-sm font-medium text-gray-700">
              {label}
              <input name={name} type={type} value={profile[name]} onChange={updateField} required className="input-field mt-2" />
            </label>
          ))}
          <label className="block text-sm font-medium text-gray-700 sm:col-span-2">
            Address
            <input name="address" value={profile.address} onChange={updateField} required className="input-field mt-2" />
          </label>
        </div>
        <button type="submit" disabled={loading} className="btn-primary mt-6">
          {loading ? 'Saving...' : 'Save profile'}
        </button>
      </form>

      {!profileMode && (
        <form onSubmit={savePassword} className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-gray-900">Change password</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium text-gray-700 sm:col-span-2">
              Current password
              <input type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} required className="input-field mt-2" />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              New password
              <input type="password" minLength="8" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} required className="input-field mt-2" />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Confirm new password
              <input type="password" minLength="8" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} required className="input-field mt-2" />
            </label>
          </div>
          {passwordError && <p className="mt-3 text-sm text-red-600">{passwordError}</p>}
          <button type="submit" disabled={loading} className="btn-primary mt-6">
            {loading ? 'Updating...' : 'Update password'}
          </button>
        </form>
      )}
    </div>
  )
}

export default UserSettings
