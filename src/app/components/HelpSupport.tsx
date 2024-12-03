import React, { useState } from 'react';

const HelpSupport: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const faqs = [
    {
      question: 'How do I create an account?',
      answer: 'To create an account, go to the Sign-Up page and fill in your details.',
    },
    {
      question: 'How do I link my calendar?',
      answer:
        'Navigate to the account settings, select "Link Calendar," and follow the prompts to connect your calendar.',
    },
    {
      question: 'What should I do if my events don’t sync?',
      answer: 'Check your internet connection or refresh the calendar.',
    },
  ];

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="help-support-container p-4">
      <h1>Help & Support</h1>
      <p>If you need assistance, please refer to the resources below:</p>
      <ul>
        <li><a href="/Home/HelpSupport/FAQ">FAQs</a></li>
        <li><a href="/Home/HelpSupport/Tutorial">Tutorials</a></li>
        <li><a href="/Home/HelpSupport/Contact">Contact Support</a></li>
      </ul>
    </div>
  );
};

export default HelpSupport;
