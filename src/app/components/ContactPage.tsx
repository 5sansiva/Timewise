import React, { useState } from 'react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement form submission logic here
    alert('Thank you for contacting us!');
  };

  return (
    <div className="contact-page p-4">
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          onChange={handleChange}
          required
          className="form-input mb-3 p-2 border rounded w-full"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          onChange={handleChange}
          required
          className="form-input mb-3 p-2 border rounded w-full"
        />
        <textarea
          name="message"
          placeholder="Your Message"
          onChange={handleChange}
          required
          className="form-textarea mb-3 p-2 border rounded w-full"
        ></textarea>
        <button type="submit" className="button button-primary p-2 bg-blue-500 text-white rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ContactPage;
