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
      <h1 className="text-2xl font-bold mb-4">Help & Support</h1>
      <input
        type="text"
        placeholder="How can we help you?"
        value={searchQuery}
        onChange={handleSearch}
        className="search-input mb-4 p-2 border rounded w-full"
      />

      <h2 className="text-xl font-semibold mb-3">FAQs</h2>
      <div className="faq-section">
        {filteredFaqs.map((faq, index) => (
          <div key={index} className="faq-item mb-3">
            <h3 className="font-bold">{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-3">Contact Support</h2>
      <form className="contact-form">
        <input
          type="text"
          placeholder="Your Name"
          className="form-input mb-3 p-2 border rounded w-full"
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          className="form-input mb-3 p-2 border rounded w-full"
          required
        />
        <select className="form-select mb-3 p-2 border rounded w-full" required>
          <option value="">Select Issue Type</option>
          <option value="Account">Account Issues</option>
          <option value="Calendar">Calendar Issues</option>
          <option value="Other">Other</option>
        </select>
        <textarea
          placeholder="Describe your issue"
          className="form-textarea mb-3 p-2 border rounded w-full"
          required
        ></textarea>
        <button type="submit" className="submit-button bg-blue-500 text-white py-2 px-4 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default HelpSupport;
