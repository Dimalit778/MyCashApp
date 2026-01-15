import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import './ContactUs.css';

const ContactUs = () => {
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

        <Row className="contact-content justify-content-center">
          {/* Contact Info Card */}
          <Col lg={6} md={8}>
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
        </Row>
      </motion.div>
    </Container>
  );
};

export default ContactUs;
