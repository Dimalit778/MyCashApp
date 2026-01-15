import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import TextInput from 'components/ui/textInput';
import IconButton from 'components/ui/icon';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import MyButton from 'components/ui/button';
import { THEME } from 'constants/Theme';
import './authStyle.css';
import { emailValidation } from 'utils/emailValidation';
const LoginForm = ({ onSubmit, isLoading }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper ">
        <h1 data-cy="login-title" className="auth-title">
          LOGIN
        </h1>
        <form className="auth-form " onSubmit={handleSubmit(onSubmit)}>
          <div className="d-flex flex-column   ">
            <TextInput
              data-cy="login-email"
              name="email"
              control={control}
              placeholder="Email"
              className="form-control"
              rules={emailValidation}
            />

            <TextInput
              data-cy="login-password"
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
                  ariaLabel="Toggle Password"
                  icon={<FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />}
                  onClick={() => setShowPassword(!showPassword)}
                  color="white"
                  border="none"
                />
              }
            />
          </div>

          <div className="d-grid gap-2">
            <MyButton
              data-cy="login-submit"
              ariaLabel="Login"
              type="submit"
              bgColor={THEME.orange}
              isLoading={isLoading}
            >
              Login
            </MyButton>
          </div>

          <div className="text-center mt-2">
            <button
              data-cy="forgot-password"
              type="button"
              className="btn btn-link text-light"
              onClick={(e) => e.preventDefault()}
            >
              Forgot Password?
            </button>
          </div>

          <div className="auth-prompt">
            <p>Don't have an account?</p>
            <button
              data-cy="goto-signup"
              type="button"
              className="btn btn-outline-light btn-sm"
              onClick={() => navigate('/signup')}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
