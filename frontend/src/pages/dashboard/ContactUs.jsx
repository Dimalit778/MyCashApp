import BrandLogo from "components/brandLogo";
import TextInput from "components/ui/textInput";

import { THEME } from "constants/Theme";

import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const ContactUs = () => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
    mode: "onChange",
  });
  const onSubmit = handleSubmit((data) => {
    if (data) {
      toast.success("Message sent successfully");
      reset();
    }
  });

  return (
    <Container
      fluid
      className="d-flex flex-column justify-content-around"
      style={{ minHeight: "80vh" }}
    >
      <Row>
        <div className="text-center p-5 ">
          <BrandLogo size="lg" />
          <div data-cy="contact-title" className="mt-4">
            <h2 className="fs-4 text-white-50 mb-3">
              Our support team can help you with every question you have.
            </h2>
            <p className="fs-5 text-white-50 mb-0">
              You can contact us and our team will respond within 24 hours.
            </p>
          </div>
        </div>
      </Row>
      <Row className="mt-4 d-flex">
        <Col lg={4} className=" text-center mb-4 ">
          <div
            data-cy="contact-info"
            className="d-flex flex-column align-items-center"
          >
            <h1 className="display-4 mb-4" style={{ color: THEME.orange }}>
              Contact Us
            </h1>
            <div className="d-inline-block text-start">
              <p className="mb-2">Email: Mycash@outlook.com</p>
              <p className="mb-2">Phone: +972 052-6731280</p>
            </div>
          </div>
        </Col>
        <Col lg={8}>
          <Form
            data-cy="contact-form"
            onSubmit={onSubmit}
            className="p-4 bg border border-1 border-secondary rounded   "
          >
            <Row className="d-flex">
              <Col lg={6}>
                <TextInput
                  data-cy="contact-name"
                  label="Name"
                  name="name"
                  placeholder="Enter your name"
                  control={control}
                  rules={{ required: "Name is required" }}
                  className="form-control"
                />
              </Col>
              <Col lg={6}>
                <TextInput
                  data-cy="contact-email"
                  label="Email"
                  name="email"
                  placeholder="Enter your email address"
                  control={control}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  }}
                  className="form-control"
                />
              </Col>
              <Col lg={12}>
                <TextInput
                  data-cy="contact-message"
                  label="Message"
                  name="message"
                  placeholder="Write your message..."
                  as="textarea"
                  rows={3}
                  control={control}
                  rules={{ required: "Message is required" }}
                  className="form-control"
                />
              </Col>
            </Row>

            <Button
              data-cy="contact-submit-button"
              variant="dark"
              type="submit"
              style={{
                border: "1px solid #444",
                borderRadius: "4px",
                padding: "10px 20px",
              }}
            >
              Send
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactUs;
