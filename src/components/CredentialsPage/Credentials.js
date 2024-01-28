import React from "react";
import "./Credentials.css";

const CredPage = ({ title, isSignIn }) => (
  <div className="auth-container">
    <div className="auth-content">
      <h1>{title}</h1>
      <form>
        <input type="text" placeholder="Enter your SapId" />
        <div className="password-container">
          <input type="password" placeholder="Enter your Password" />
        </div>
        {isSignIn && (
          <a href="/forgot-password" className="forgot-password">
            Forgot Password?
          </a>
        )}
        {title === "Sign Up" && (
          <>
            <input type="text" placeholder="Enter your Name" />
            <input type="email" placeholder="Re-enter your Password" />
          </>
        )}
        <button type="submit">{isSignIn ? "Sign In" : "Register"}</button>
      </form>
      <div className="auth-box">
        {isSignIn ? (
          <p>
            Don't have an account?{" "}
            <a href="/flow/SignUp" className="auth-button">
              Sign Up
            </a>
          </p>
        ) : (
          <p>
            Already a User?{" "}
            <a href="/flow/SignIn" className="auth-button">
              Sign In
            </a>
          </p>
        )}
      </div>
    </div>
  </div>
);

export default CredPage;
