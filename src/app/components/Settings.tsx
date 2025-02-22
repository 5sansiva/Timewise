import React, { useState } from 'react';

const SettingsPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newsletter, setNewsletter] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement save logic here (e.g., API call to update user settings)
    alert('Settings saved successfully!');
  };

  return (
    <div className="settings-page p-4">
      <h1>Settings</h1>
      <form onSubmit={handleSave}>
        <div className="mb-3">
          <label htmlFor="username" className="block mb-1">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="form-input p-2 border rounded w-full"
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="email" className="block mb-1">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input p-2 border rounded w-full"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="block mb-1">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input p-2 border rounded w-full"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="newsletter" className="flex items-center">
            <input
              type="checkbox"
              id="newsletter"
              checked={newsletter}
              onChange={(e) => setNewsletter(e.target.checked)}
              className="mr-2"
            />
            Subscribe to newsletter
          </label>
        </div>

        <button type="submit" className="button button-primary p-2 bg-blue-500 text-white rounded">
          Save Settings
        </button>
      </form>
    </div>
  );
};
//
export default SettingsPage;
