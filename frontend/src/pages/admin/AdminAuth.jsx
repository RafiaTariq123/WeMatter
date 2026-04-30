import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function AdminAuth() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  useEffect(() => {
    const sign_in_btn = document.querySelector("#sign-in-btn");
    const sign_up_btn = document.querySelector("#sign-up-btn");
    const container = document.querySelector(".div-container");

    if (sign_up_btn) {
      sign_up_btn.addEventListener("click", () => {
        container.classList.add("sign-up-mode");
      });
    }

    if (sign_in_btn) {
      sign_in_btn.addEventListener("click", () => {
        container.classList.remove("sign-up-mode");
      });
    }

    return () => {
      if (sign_up_btn) {
        sign_up_btn.removeEventListener("click", () => {
          container.classList.add("sign-up-mode");
        });
      }
      if (sign_in_btn) {
        sign_in_btn.removeEventListener("click", () => {
          container.classList.remove("sign-up-mode");
        });
      }
    };
  }, []);

  const handleSignUpClick = () => {
    setIsSignUpMode(true);
  };

  const handleSignInClick = () => {
    setIsSignUpMode(false);
  };

  const navigate = useNavigate();

  // Sign In Formik
  const {
    handleChange: onSignInChange,
    handleBlur: onSignInBlur,
    handleSubmit: onSignInSubmit,
    errors: signInErrors,
    touched: signInTouched,
    values: signInValues,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .matches(
          /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
          "Please enter a valid email"
        )
        .required("Email is required")
        .trim(),
      password: Yup.string().required("Password is required").trim(),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axios.post('http://localhost:8000/admin/login', values);
        
        if (response.data.success) {
          localStorage.setItem('adminToken', response.data.token);
          localStorage.setItem('adminInfo', JSON.stringify(response.data.admin));
          
          toast.success('Admin login successful!', {
            progressClassName: "toast-progress-success",
          });
          
          setTimeout(() => {
            navigate('/admin/dashboard');
          }, 1000);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Login failed. Please try again.', {
          progressClassName: "toast-progress-error",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Sign Up Formik
  const {
    handleChange: onSignUpChange,
    handleBlur: onSignUpBlur,
    handleSubmit: onSignUpSubmit,
    errors: signUpErrors,
    touched: signUpTouched,
    values: signUpValues,
  } = useFormik({
    initialValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
      cPassword: "",
      role: "superadmin",
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .matches(/^[A-Za-z ]*$/, "Please enter valid full name")
        .min(3, "Minimum 3 letters")
        .max(50, "Maximum 50 letters")
        .required("Full Name is required")
        .trim(),
      username: Yup.string()
        .matches(/^[A-Za-z0-9_]*$/, "Please enter valid username")
        .min(3, "Minimum 3 characters")
        .max(25, "Maximum 25 characters")
        .required("Username is required")
        .trim(),
      email: Yup.string()
        .matches(
          /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
          "Please enter a valid email"
        )
        .required("Email is required")
        .trim(),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required")
        .trim(),
      cPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required")
        .trim(),
      role: Yup.string().required("Role is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { cPassword, ...submitData } = values;
        const response = await axios.post('http://localhost:8000/admin/register', submitData);
        
        if (response.data.success) {
          localStorage.setItem('adminToken', response.data.token);
          localStorage.setItem('adminInfo', JSON.stringify(response.data.admin));
          
          toast.success('Admin registration successful!', {
            progressClassName: "toast-progress-success",
          });
          
          setTimeout(() => {
            navigate('/admin/dashboard');
          }, 1000);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Registration failed. Please try again.', {
          progressClassName: "toast-progress-error",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="div-container">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <div className="forms-container">
        <div className={`signin-signup ${isSignUpMode ? 'sign-up-mode' : ''}`}>
          {/* Sign In Form */}
          <form className="sign-in-form" onSubmit={onSignInSubmit}>
            <h2 className="title font-primaryFont">Admin Sign in</h2>

            {/* Email Input */}
            <div className="input-field">
              <i className="fas fa-envelope" />
              <input
                className="mb-3 mt-3"
                type="email"
                placeholder="Email"
                name="email"
                value={signInValues.email}
                onChange={onSignInChange}
                onBlur={onSignInBlur}
              />
              <strong className="text-red-700 mx-2 text-[10px] w-[300%]">
                {signInErrors.email && signInTouched.email
                  ? signInErrors.email
                  : null}
              </strong>
            </div>

            {/* Password Input */}
            <div className="input-field">
              <i className="fas fa-lock" />
              <input
                className="mb-3 mt-3"
                type="password"
                placeholder="Password"
                name="password"
                value={signInValues.password}
                onChange={onSignInChange}
                onBlur={onSignInBlur}
              />
              <strong className="text-red-700 mx-2 text-[10px] w-[300%]">
                {signInErrors.password && signInTouched.password
                  ? signInErrors.password
                  : null}
              </strong>
            </div>

            <button type="submit" className="btn solid">
              Login
            </button>
            
            <div className="divider-container">
              <div className="divider-line"></div>
              <span className="divider-text">OR</span>
              <div className="divider-line"></div>
            </div>
            
            <div className="social-media mb-4">
              <Link to="/" className="social-icon home-link">
                <i className="fas fa-home" />
                <span>Back to Home</span>
              </Link>
            </div>
          </form>

          {/* Sign Up Form */}
          <form className="sign-up-form" onSubmit={onSignUpSubmit}>
            <h2 className="title font-primaryFont mt-4 mb-4">Admin Sign up</h2>

            {/* Full Name Input */}
            <div className="input-field">
              <i className="fas fa-user" />
              <input
                className="mb-3 mt-3"
                type="text"
                placeholder="Full Name"
                name="fullName"
                value={signUpValues.fullName}
                onChange={onSignUpChange}
                onBlur={onSignUpBlur}
              />
              <strong className="text-red-700 mx-2 text-[10px] w-[300%]">
                {signUpErrors.fullName && signUpTouched.fullName
                  ? signUpErrors.fullName
                  : null}
              </strong>
            </div>

            {/* Username Input */}
            <div className="input-field">
              <i className="fas fa-user-tag" />
              <input
                className="mb-3 mt-3"
                type="text"
                placeholder="Username"
                name="username"
                value={signUpValues.username}
                onChange={onSignUpChange}
                onBlur={onSignUpBlur}
              />
              <strong className="text-red-700 mx-2 text-[10px] w-[300%]">
                {signUpErrors.username && signUpTouched.username
                  ? signUpErrors.username
                  : null}
              </strong>
            </div>

            {/* Email Input */}
            <div className="input-field">
              <i className="fas fa-envelope" />
              <input
                className="mb-3 mt-3"
                type="email"
                placeholder="Email"
                name="email"
                value={signUpValues.email}
                onChange={onSignUpChange}
                onBlur={onSignUpBlur}
              />
              <strong className="text-red-700 mx-2 text-[10px] w-[300%]">
                {signUpErrors.email && signUpTouched.email
                  ? signUpErrors.email
                  : null}
              </strong>
            </div>

            {/* Password Input */}
            <div className="input-field">
              <i className="fas fa-lock" />
              <input
                className="mb-3 mt-3"
                type="password"
                placeholder="Password"
                name="password"
                value={signUpValues.password}
                onChange={onSignUpChange}
                onBlur={onSignUpBlur}
              />
              <strong className="text-red-700 mx-2 text-[10px] w-[300%]">
                {signUpErrors.password && signUpTouched.password
                  ? signInErrors.password
                  : null}
              </strong>
            </div>

            {/* Confirm Password Input */}
            <div className="input-field">
              <i className="fas fa-lock" />
              <input
                className="mb-3 mt-3"
                type="password"
                placeholder="Confirm Password"
                name="cPassword"
                value={signUpValues.cPassword}
                onChange={onSignUpChange}
                onBlur={onSignUpBlur}
              />
              <strong className="text-red-700 mx-2 text-[10px] w-[300%]">
                {signUpErrors.cPassword && signUpTouched.cPassword
                  ? signUpErrors.cPassword
                  : null}
              </strong>
            </div>

            
            <button type="submit" className="btn solid">
              Register
            </button>
            
            <div className="divider-container">
              <div className="divider-line"></div>
              <span className="divider-text">OR</span>
              <div className="divider-line"></div>
            </div>
            
            <div className="social-media mb-4">
              <Link to="/" className="social-icon home-link">
                <i className="fas fa-home" />
                <span>Back to Home</span>
              </Link>
            </div>
          </form>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>Don't have an admin account?</h3>
            <p>
              Sign up to get access to the comprehensive dashboard for managing the WeMatter platform
            </p>
            <button
              className="btn transparent"
              id="sign-up-btn"
              onClick={handleSignUpClick}
            >
              Sign Up
            </button>
          </div>
          <img src="img/log.svg" className="image" alt="" />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>Already have an admin account?</h3>
            <p>
              Sign in to access the admin dashboard and manage users and psychologists
            </p>
            <button
              className="btn transparent"
              id="sign-in-btn"
              onClick={handleSignInClick}
            >
              Sign In
            </button>
          </div>
          <img src="img/register.svg" className="image" alt="" />
        </div>
      </div>
    </div>
  );
}

export default AdminAuth;
