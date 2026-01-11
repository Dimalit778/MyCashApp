import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import groupImg from 'assets/welcomeImages/group.jpg';
import { Nav, Button } from 'react-bootstrap';

import Footer from 'components/ui/footer/footer';
import styles from 'components/landing/landing.module.css';
import { motion, useInView } from 'framer-motion';
import LandingAnimation from 'components/landing/animation';
import { Link } from 'react-router-dom';

const Landing = () => {
  const featuresRef = React.useRef(null);
  const aboutRef = React.useRef(null);
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.3 });
  const aboutInView = useInView(aboutRef, { once: true, amount: 0.3 });

  const features = [
    {
      icon: '📊',
      title: 'Track Expenses',
      description: 'Monitor your spending patterns and stay on budget with detailed insights',
    },
    {
      icon: '💰',
      title: 'Smart Budgeting',
      description: 'Create personalized budgets and achieve your financial goals faster',
    },
    {
      icon: '📈',
      title: 'Financial Reports',
      description: 'Get comprehensive analytics and reports to make informed decisions',
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your financial data is encrypted and protected with top-tier security',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
    <div className={styles.welcomeWrapper}>
      {/* Background gradient overlay */}
      <div className={styles.bgOverlay}></div>

      <main className={styles.mainContent}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <Container>
            <Row className="text-center mb-5">
              <Col>
                <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h1 data-cy="landing-title" className={`${styles.mainTitle} mb-0`}>
                    MANAGE YOUR
                  </h1>
                  <h1 className={styles.strokeTitle} data-cy="stroke-title">
                    MONEY
                  </h1>
                </motion.div>

                <div className={styles.animationWrapper} data-cy="animation-wrapper">
                  <Nav.Link as={Link} to="/signup">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <LandingAnimation data-cy="welcome-animation" />
                    </motion.div>
                  </Nav.Link>
                </div>

                <motion.div
                  className={styles.heroButtons}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <Link to="/login" className={styles.secondaryButton}>
                    Already have an account? Sign In
                  </Link>
                </motion.div>
              </Col>
            </Row>
          </Container>

          {/* Floating elements */}
          <div className={styles.floatingElements}>
            <motion.div
              className={styles.floatingCircle}
              style={{ top: '20%', left: '10%' }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className={styles.floatingCircle}
              style={{ top: '60%', right: '15%' }}
              animate={{
                y: [0, 20, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.featuresSection} ref={featuresRef}>
          <Container>
            <motion.div variants={containerVariants} initial="hidden" animate={featuresInView ? 'visible' : 'hidden'}>
              <Row className="text-center mb-5">
                <Col>
                  <motion.h2 className={styles.sectionTitle} variants={itemVariants}>
                    Why Choose MyCash?
                  </motion.h2>
                  <motion.p className={styles.sectionSubtitle} variants={itemVariants}>
                    Everything you need to manage your finances in one place
                  </motion.p>
                </Col>
              </Row>
              <Row>
                {features.map((feature, index) => (
                  <Col key={index} lg={3} md={6} className="mb-4">
                    <motion.div
                      className={styles.featureCard}
                      variants={itemVariants}
                      whileHover={{
                        y: -10,
                        transition: { duration: 0.3 },
                      }}
                    >
                      <div className={styles.featureIcon}>{feature.icon}</div>
                      <h3 className={styles.featureTitle}>{feature.title}</h3>
                      <p className={styles.featureDescription}>{feature.description}</p>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </motion.div>
          </Container>
        </section>

        {/* About Section */}
        <section className={styles.aboutSection} ref={aboutRef}>
          <Container>
            <motion.div
              initial={{ opacity: 0 }}
              animate={aboutInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Row className="align-items-center">
                <Col lg={6} className="mb-4 mb-lg-0">
                  <motion.div
                    className={styles.imageContainer}
                    data-cy="about-image-container"
                    initial={{ opacity: 0, x: -50 }}
                    animate={aboutInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <img src={groupImg} alt="Team" className={styles.aboutImage} data-cy="team-image" />
                  </motion.div>
                </Col>
                <Col lg={6}>
                  <motion.div
                    className={styles.aboutContent}
                    data-cy="about-content"
                    initial={{ opacity: 0, x: 50 }}
                    animate={aboutInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <h2 className={styles.sectionTitle} data-cy="about-title">
                      About Us
                    </h2>
                    <p className={styles.aboutText} data-cy="about-text-2">
                      MyCash is a financial planning firm based in Jerusalem, providing comprehensive financial planning
                      services to individuals and businesses. Our team of experts is dedicated to helping our clients
                      achieve their financial goals by providing them with personalized and customized solutions.
                    </p>
                    <p className={styles.aboutText}>
                      We understand that every client has unique financial needs and goals, and we work closely with
                      them to develop a plan that is tailored to their specific needs. Our goal is to provide our
                      clients with the knowledge and tools they need to make informed financial decisions and achieve
                      financial success.
                    </p>
                    <div className={styles.aboutCta}>
                      <Link to="/signup">
                        <Button className={styles.ctaButton}>Get Started Now</Button>
                      </Link>
                    </div>
                  </motion.div>
                </Col>
              </Row>
            </motion.div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
