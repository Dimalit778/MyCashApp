import React from "react";
import { Form } from "react-bootstrap";
import { Controller } from "react-hook-form";

function TextInput({
  name,
  control,
  label,
  type = "text",
  placeholder,
  rules,
  className = "bg-secondary text-black border-dark",
  endAdornment,
  "data-cy": dataCy,
  ...rest
}) {
  return (
    <Form.Group data-cy={dataCy}>
      {label && (
        <Form.Label className="text-white mb-1  fw-bold ">{label}</Form.Label>
      )}
      <div className="position-relative mb-3">
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field, fieldState: { error } }) => (
            <>
              <Form.Control
                {...field}
                type={type}
                placeholder={placeholder}
                className={`${className} ${error ? "is-invalid" : ""}`}
                {...rest}
              />
              {endAdornment && (
                <div
                  className="position-absolute"
                  style={{
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  {endAdornment}
                </div>
              )}
              {error && (
                <div
                  data-cy="error-message"
                  className="invalid-feedback d-block mt-1"
                >
                  {error.message}
                </div>
              )}
            </>
          )}
        />
      </div>
    </Form.Group>
  );
}

export default TextInput;
