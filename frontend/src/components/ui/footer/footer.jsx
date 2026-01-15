import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer
      data-cy="footer"
      className="py-2 "
      style={{
        background: `linear-gradient(to top, #000000,rgb(35, 34, 34))`,
        position: 'relative',
        zIndex: 10,
      }}
    >
      <Container>
        <Row className="text-center text-light mb-1">
          <Col data-cy="footer-info" md={6} className="mb-3 mb-md-0">
            <h5 className="mb-3 ">Contact Information</h5>
            <p className="mb-1 ">Israel, Tel Aviv</p>
            <p className="mb-1">Email: Dimalit778@gmail.com</p>
            <p>Phone: +925 526731280</p>
          </Col>
          <Col data-cy="footer-social" md={6} className="d-flex flex-column  ">
            <h5 className="">Follow Us</h5>
            <div className="my-auto d-flex justify-content-center align-items-center gap-4">
              <a
                data-cy="facebook-link"
                href="https://www.facebook.com/dima.litvinov1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light"
              >
                <FontAwesomeIcon icon={faFacebook} size="2x" />
              </a>
              <a
                data-cy="instagram-link"
                href="https://www.instagram.com/dima1litvinov/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light"
              >
                <FontAwesomeIcon icon={faInstagram} size="2x" />
              </a>
              <a
                data-cy="youtube-link"
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light"
              >
                <FontAwesomeIcon icon={faYoutube} size="2x" />
              </a>
            </div>
          </Col>
        </Row>
        <hr data-cy="footer-divider" className="bg-secondary my-2" />
        <Row>
          <Col className="text-center text-light">
            <p data-cy="footer-copyright" className="mb-0">
              &copy; {new Date().getFullYear()} MyCash - All Rights Reserved
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
