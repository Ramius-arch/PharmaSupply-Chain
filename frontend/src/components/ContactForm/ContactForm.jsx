import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ContactForm.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'PharmaSupply Integrity Audit',
    message: '',
  });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');

    // Simulate form submission as per Quixora's deterministic PoC style
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: 'PharmaSupply Integrity Audit', message: '' });
    }, 1500);
  };

  return (
    <section className="contact-section">
      <div className="container">
        <div className="contact-grid">
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2>Initiate Audit Dialogue</h2>
            <p>Ready to secure your pharmaceutical supply chain? Our team provides comprehensive infrastructure audits and blockchain integration strategies.</p>
            
            <div className="contact-methods">
              <div className="method">
                <strong>Direct Line</strong>
                <p>+254 799 390 564 (WhatsApp Available)</p>
              </div>
              <div className="method">
                <strong>Secure Email</strong>
                <p>quixora2@gmail.com</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="form-container"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form className="supply-chain-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Identify Yourself (Name)</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Secure Communication (Email)</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Objective</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Audit Requirements / System Challenges</label>
                <textarea name="message" value={formData.message} onChange={handleChange} required placeholder="Describe your supply chain bottlenecks..." />
              </div>

              <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
                {status === 'sending' ? 'Transmitting...' : 'Send Audit Request'}
              </button>

              <AnimatePresence>
                {status === 'success' && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="success-msg">
                    ✅ Audit request transmitted successfully.
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
