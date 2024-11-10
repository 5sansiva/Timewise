import React from 'react';

const HelpSupport: React.FC = () => {
  return (
    <div className="help-support-container p-4">
      <h1>Help & Support</h1>
      <p>If you need assistance, please refer to the resources below:</p>
      <ul>
        <li><a href="/faq">FAQs</a></li>
        <li><a href="/tutorial">Tutorials</a></li>
        <li><a href="/contact">Contact Support</a></li>
      </ul>
    </div>
  );
};

export default HelpSupport;
