import BrandLogo from 'components/brandLogo';
import TextInput from 'components/ui/textInput';
import React from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import './ContactUs.css';

const ContactUs = () => {
  const { control, handleSubmit, reset, formState } = useForm({
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
    mode: 'onChange',
  });

  const onSubmit = handleSubmit((data) => {
    if (data) {
      toast.success('Message sent successfully! We will respond within 24 hours.');
      reset();
    }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <Container fluid className="contact-page">
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* Header Section */}
        <motion.div variants={itemVariants} className="contact-header">
          <div data-cy="contact-title" className="contact-intro">
            <h1 className="contact-main-title">Get In Touch</h1>
            <p className="contact-subtitle">Our support team can help you with every question you have.</p>
            <p className="contact-description">You can contact us and our team will respond within 24 hours.</p>
          </div>
        </motion.div>

        <Row className="contact-content">
          {/* Contact Info Card */}
          <Col lg={4} className="mb-4">
            <motion.div variants={itemVariants} data-cy="contact-info" className="contact-info-card">
              <div className="contact-info-header">
                <div className="contact-icon-wrapper">
                  <span className="contact-emoji">💬</span>
                </div>
                <h1 className="contact-info-title">Contact Us</h1>
              </div>

              <div className="contact-info-items">
                <motion.div
                  className="contact-info-item"
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="contact-info-icon">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </div>
                  <div className="contact-info-details">
                    <p className="contact-info-value">Email: Mycash@outlook.com</p>
                  </div>
                </motion.div>

                <motion.div
                  className="contact-info-item"
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="contact-info-icon">
                    <FontAwesomeIcon icon={faPhone} />
                  </div>
                  <div className="contact-info-details">
                    <p className="contact-info-value">Phone: +972 052-6731280</p>
                  </div>
                </motion.div>
              </div>

              <div className="contact-info-footer">
                <p>We're here to help you manage your finances better</p>
              </div>
            </motion.div>
          </Col>

          {/* Contact Form */}
          <Col lg={8}>
            <motion.div variants={itemVariants}>
              <Form data-cy="contact-form" onSubmit={onSubmit} className="contact-form">
                <div className="contact-form-header">
                  <h3 className="contact-form-title">Send Us a Message</h3>
                  <p className="contact-form-subtitle">Fill out the form below and we'll get back to you soon</p>
                </div>

                <Row>
                  <Col lg={6}>
                    <div className="form-group-wrapper">
                      <TextInput
                        data-cy="contact-name"
                        label="Name"
                        name="name"
                        placeholder="Enter your name"
                        control={control}
                        rules={{ required: 'Name is required' }}
                        className="contact-input"
                      />
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="form-group-wrapper">
                      <TextInput
                        data-cy="contact-email"
                        label="Email"
                        name="email"
                        placeholder="Enter your email address"
                        control={control}
                        rules={{
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address',
                          },
                        }}
                        className="contact-input"
                      />
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className="form-group-wrapper">
                      <TextInput
                        data-cy="contact-message"
                        label="Message"
                        name="message"
                        placeholder="Write your message..."
                        as="textarea"
                        rows={5}
                        control={control}
                        rules={{ required: 'Message is required' }}
                        className="contact-input contact-textarea"
                      />
                    </div>
                  </Col>
                </Row>

                <motion.button
                  data-cy="contact-submit-button"
                  type="submit"
                  className="contact-submit-btn"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={formState.isSubmitting}
                >
                  <FontAwesomeIcon icon={faPaperPlane} style={{ marginRight: '0.5rem' }} />
                  {formState.isSubmitting ? 'Sending...' : 'Send'}
                </motion.button>
              </Form>
            </motion.div>
          </Col>
        </Row>
      </motion.div>
    </Container>
  );
};

export default ContactUs;
