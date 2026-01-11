import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { motion } from 'framer-motion';

import EditProfile from 'components/settings/EditProfile';
import UploadImage from 'components/settings/UploadImage';
import DeleteUser from 'components/settings/DeleteUser';
import './Settings.css';

const Settings = () => {
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
    <Container fluid className="settings-page">
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* Page Header */}
        <motion.div variants={itemVariants} className="settings-header">
          <div className="settings-header-content">
            <h1 className="settings-title">Account Settings</h1>
            <p className="settings-subtitle">Manage your profile information and account preferences</p>
          </div>
        </motion.div>

        {/* Main Content */}
        <Row className="g-4 settings-content">
          <Col xs={12} lg={5}>
            <motion.div variants={itemVariants} className="h-100">
              <UploadImage />
            </motion.div>
          </Col>
          <Col xs={12} lg={7}>
            <motion.div variants={itemVariants} className="h-100">
              <EditProfile />
            </motion.div>
          </Col>
        </Row>

        {/* Delete Account Section */}
        <motion.div variants={itemVariants} className="settings-danger-zone">
          <DeleteUser />
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default Settings;
