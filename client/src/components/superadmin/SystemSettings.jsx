import React, { useState } from "react";
import { FaCog, FaLock, FaBell, FaPalette, FaGlobe, FaDatabase, FaShieldAlt, FaKey, FaServer, FaCloudUploadAlt, FaSave } from "react-icons/fa";
import { toast } from "react-hot-toast";

const SystemSettings = ({ settings, onUpdate }) => {
  const [localSettings, setLocalSettings] = useState(settings || {
    system: {
      maintenanceMode: false,
      debugMode: false,
      apiRateLimit: 1000,
      sessionTimeout: 60,
      maxLoginAttempts: 5,
    },
    security: {
      encryptionLevel: "AES-256",
      passwordPolicy: "strong",
      mfaRequired: true,
      auditRetention: 365,
    },
    features: {
      cryptoEnabled: true,
      loanModule: true,
      fraudDetection: true,
      mobileBanking: true,
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: true,
      pushEnabled: true,
      alertThreshold: "high",
    },
  });

  const handleSave = () => {
    toast.success("System settings saved successfully");
    if (onUpdate) onUpdate(localSettings);
  };

  return (
    <div className="space-y-6">
      {/* System Configuration */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center"><FaServer className="mr-2 text-purple-600" /> System Configuration</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Maintenance Mode</span>
              <button
                onClick={() => setLocalSettings({...localSettings, system: {...localSettings.system, maintenanceMode: !localSettings.system.maintenanceMode}})}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${localSettings.system.maintenanceMode ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}
              >
                {localSettings.system.maintenanceMode ? 'Disable' : 'Enable'}
              </button>
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Debug Mode</span>
              <input
                type="checkbox"
                checked={localSettings.system.debugMode}
                onChange={(e) => setLocalSettings({...localSettings, system: {...localSettings.system, debugMode: e.target.checked}})}
                className="w-4 h-4 text-purple-600"
              />
            </label>
            <div className="p-3 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium mb-2">API Rate Limit (requests/min)</label>
              <input
                type="number"
                value={localSettings.system.apiRateLimit}
                onChange={(e) => setLocalSettings({...localSettings, system: {...localSettings.system, apiRateLimit: parseInt(e.target.value)}})}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium mb-2">Session Timeout (minutes)</label>
              <input
                type="number"
                value={localSettings.system.sessionTimeout}
                onChange={(e) => setLocalSettings({...localSettings, system: {...localSettings.system, sessionTimeout: parseInt(e.target.value)}})}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium mb-2">Max Login Attempts</label>
              <input
                type="number"
                value={localSettings.system.maxLoginAttempts}
                onChange={(e) => setLocalSettings({...localSettings, system: {...localSettings.system, maxLoginAttempts: parseInt(e.target.value)}})}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center"><FaLock className="mr-2 text-purple-600" /> Security Settings</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium mb-2">Encryption Level</label>
              <select
                value={localSettings.security.encryptionLevel}
                onChange={(e) => setLocalSettings({...localSettings, security: {...localSettings.security, encryptionLevel: e.target.value}})}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option>AES-256</option>
                <option>AES-128</option>
                <option>RSA-2048</option>
              </select>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium mb-2">Password Policy</label>
              <select
                value={localSettings.security.passwordPolicy}
                onChange={(e) => setLocalSettings({...localSettings, security: {...localSettings.security, passwordPolicy: e.target.value}})}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option>weak</option>
                <option>medium</option>
                <option>strong</option>
                <option>very_strong</option>
              </select>
            </div>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">MFA Required for All Users</span>
              <input
                type="checkbox"
                checked={localSettings.security.mfaRequired}
                onChange={(e) => setLocalSettings({...localSettings, security: {...localSettings.security, mfaRequired: e.target.checked}})}
                className="w-4 h-4 text-purple-600"
              />
            </label>
            <div className="p-3 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium mb-2">Audit Log Retention (days)</label>
              <input
                type="number"
                value={localSettings.security.auditRetention}
                onChange={(e) => setLocalSettings({...localSettings, security: {...localSettings.security, auditRetention: parseInt(e.target.value)}})}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center"><FaCog className="mr-2 text-purple-600" /> Feature Toggles</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">Cryptocurrency Integration</span>
            <input
              type="checkbox"
              checked={localSettings.features.cryptoEnabled}
              onChange={(e) => setLocalSettings({...localSettings, features: {...localSettings.features, cryptoEnabled: e.target.checked}})}
              className="w-4 h-4 text-purple-600"
            />
          </label>
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">Loan Management Module</span>
            <input
              type="checkbox"
              checked={localSettings.features.loanModule}
              onChange={(e) => setLocalSettings({...localSettings, features: {...localSettings.features, loanModule: e.target.checked}})}
              className="w-4 h-4 text-purple-600"
            />
          </label>
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">Fraud Detection System</span>
            <input
              type="checkbox"
              checked={localSettings.features.fraudDetection}
              onChange={(e) => setLocalSettings({...localSettings, features: {...localSettings.features, fraudDetection: e.target.checked}})}
              className="w-4 h-4 text-purple-600"
            />
          </label>
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">Mobile Banking</span>
            <input
              type="checkbox"
              checked={localSettings.features.mobileBanking}
              onChange={(e) => setLocalSettings({...localSettings, features: {...localSettings.features, mobileBanking: e.target.checked}})}
              className="w-4 h-4 text-purple-600"
            />
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button onClick={handleSave} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center">
          <FaSave className="mr-2" /> Save All Settings
        </button>
      </div>
    </div>
  );
};

export default SystemSettings;