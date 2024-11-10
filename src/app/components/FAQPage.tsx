import React, { useState } from 'react';

const FAQs = [
  { question: "How do I create an account?", answer: "To create an account, click on 'Sign Up' at the top right corner..." },
  { question: "How do I reset my password?", answer: "Click on 'Forgot Password' on the login page and follow the steps..." },
  // Add more FAQs as needed
];

const FAQPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredFAQs = FAQs.filter(faq =>
    faq.question.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="faq-page p-4">
      <h1>FAQs</h1>
      <input 
        type="text" 
        placeholder="Search FAQs..." 
        value={search} 
        onChange={(e) => setSearch(e.target.value)} 
        className="search-input mb-4 p-2 border rounded"
      />
      {filteredFAQs.map((faq, index) => (
        <div key={index} className="faq-item mb-3">
          <h3>{faq.question}</h3>
          <p>{faq.answer}</p>
        </div>
      ))}
    </div>
  );
};

export default FAQPage;
