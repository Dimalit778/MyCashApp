import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import './authStyle.css';
import IconButton from 'components/ui/icon';
import TextInput from 'components/ui/textInput';
import MyButton from 'components/ui/button';
import { THEME } from 'constants/Theme';
import { emailValidation } from 'utils/emailValidation';

const SignUpForm = ({ onSubmit, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  const password = watch('password');

  return (
    <div className="auth-container ">
      <div className="auth-form-wrapper">
        <h1 data-cy="signup-title" className="auth-title">
          SIGN UP
        </h1>
        <form className="auth-form " onSubmit={handleSubmit(onSubmit)}>
          <div className="d-flex flex-column gap-3 mb-3 ">
            <div className="d-flex gap-3">
              <TextInput
                data-cy="signup-firstName"
                name="firstName"
                control={control}
                placeholder="First Name"
                className="form-control"
                rules={{
                  required: 'First name is required',
                  minLength: {
                    value: 2,
                    message: 'First name must be at least 2 characters',
                  },
                }}
              />
              <TextInput
                data-cy="signup-lastName"
                name="lastName"
                control={control}
                placeholder="Last Name"
                className="form-control"
                rules={{
                  required: 'Last name is required',
                  minLength: {
                    value: 2,
                    message: 'Last name must be at least 2 characters',
                  },
                }}
              />
            </div>

            <TextInput
              data-cy="signup-email"
              name="email"
              control={control}
              placeholder="Email"
              className="form-control"
              rules={emailValidation}
            />

            <TextInput
              data-cy="signup-password"
              name="password"
              control={control}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="form-control"
              autoComplete="none"
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              }}
              endAdornment={
                <IconButton
                  data-cy="toggle-password"
                  icon={<FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />}
                  onClick={() => setShowPassword(!showPassword)}
                  color="white"
                  border="none"
                />
              }
            />

            <TextInput
              data-cy="signup-confirm-password"
              name="confirmPassword"
              control={control}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              className="form-control"
              autoComplete="none"
              rules={{
                required: 'Confirm password is required',
                validate: (value) => value === password || 'Passwords do not match',
              }}
              endAdornment={
                <IconButton
                  ariaLabel="Toggle Confirm Password"
                  icon={<FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  color="white"
                  border="none"
                />
              }
            />
          </div>

          <div className="d-grid gap-2">
            <MyButton
              data-cy="signup-submit"
              ariaLabel="Sign Up"
              type="submit"
              bgColor={THEME.orange}
              isLoading={isLoading}
            >
              Sign Up
            </MyButton>
          </div>

          <div className="auth-prompt">
            <p>Already have an account?</p>
            <Link data-cy="goto-login" to="/login" className="btn btn-outline-light btn-sm">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
