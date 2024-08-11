import React, { useState } from 'react';
import './Auth.css';
import { form } from '../../Assets/index.js';
import { useNavigate } from 'react-router-dom';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

// Added: Custom Tooltip component
const Tooltip = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="tooltip-container" onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
      {children}
      {isVisible && <div className="tooltip">{content}</div>}
    </div>
  );
};

const Signup = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [student, setStudent] = useState(true);

  const [rate, setRate] = useState('');
  const [avail, setAvail] = useState('');
  const [subjects, setSubjects] = useState('');

  const handleSignUp = async (e) => {
    const formData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      isStudent: student,
      rate: rate,
      availability: avail,
      subjects: subjects,
    };

    const validatePassword = (password) => {
      if (password.length < 8) {
        return 'Password must be at least 8 characters long.';
      }
      if (!/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter.';
      }
      if (!/[0-9]/.test(password)) {
        return 'Password must contain at least one number.';
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return 'Password must contain at least one special character.';
      }
      return 'Password is valid.';
    };

    const passwordValidationResult = validatePassword(formData.password);
    if (passwordValidationResult !== 'Password is valid.') {
      alert(passwordValidationResult);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/new_user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 'error') {
        console.error('There was an error!', response.error);
      }

      const data = await response.json();
      console.log(data);
      navigate('/login');
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <div className="signup-header">
          <h1 className="signup-title">Sign Up</h1>
        </div>

        <div className="account-type">
          <label className="radio-container">
            <input
              type="radio"
              name="account-type"
              value="student"
              onClick={() => {
                setStudent(true);
              }}
            />
            <span className="radio-label">Student</span>
          </label>
          <label className="radio-container">
            <input
              type="radio"
              name="account-type"
              value="mentor"
              onClick={() => {
                setStudent(false);
              }}
            />
            <span className="radio-label">Mentor</span>
          </label>
        </div>

        <div className="signup-fields">
          <div className="name-fields">
            <div className="login-field">
              <label htmlFor="first-name">First name</label>
              <input
                id="first-name"
                placeholder="Max"
                required
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
              />
            </div>
            <div className="login-field">
              <label htmlFor="last-name">Last name</label>
              <input
                id="last-name"
                placeholder="Robinson"
                required
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="mentor-modal">
            {student ? (
              <div></div>
            ) : (
              <div>
                <div className="name-fields">
                  <div className="login-field">
                    <label htmlFor="availablity">Availability</label>
                    <input
                      id="first-name"
                      placeholder="MWF 10-2"
                      required
                      onChange={(e) => {
                        setAvail(e.target.value);
                      }}
                    />
                  </div>
                  <div className="login-field">
                    <label htmlFor="rate">Hourly Rate</label>
                    <input
                      id="last-name"
                      placeholder="$20"
                      required
                      onChange={(e) => {
                        setRate(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <br></br>
                <div className="login-field">
                  <label htmlFor="email">Subjects</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Chemistry, Math, etc."
                    required
                    onChange={(e) => {
                      setSubjects(e.target.value);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="login-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="login-field">
            <label htmlFor="password">Password</label>
            {/* Modified: Wrapped password input with Tooltip component */}
            <Tooltip
              content="- Password must be at least 8 characters
- Contain at least one uppercase letter
- One number, and one special character (!@#$%^&*)."
            >
              <input
                id="password"
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </Tooltip>
          </div>

          <a href={form} target="_blank" rel="noopener noreferrer">
            <button className="terms-button">View Terms and Conditions</button>
          </a>
          <button type="submit" className="signup-button" onClick={handleSignUp}>
            Create an account
          </button>
          <p className="signup-subtitle" style={{ fontSize: '10px' }}>
            Enter your information to create an account, by creating an account you are hereby agreeing to the terms and
            conditions below.
          </p>
        </div>

        <div className="signin-link">
          Already have an account?{' '}
          <a href="/login" className="signin-link-text">
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
