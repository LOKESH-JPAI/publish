import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard"); // Redirect after successful signup
    } catch (err) {
      setError("Failed to create account. Try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ width: "400px", borderRadius: "12px" }}>
        <h3 className="text-center mb-4">Sign Up</h3>
        {error && <div className="alert alert-danger text-center">{error}</div>}
        <form onSubmit={handleSignUp}>
          {/* Email Field */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-primary text-white">
              <FaEnvelope />
            </span>
            <input
              type="email"
              className="form-control"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {/* Password Field */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-primary text-white">
              <FaLock />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {/* Confirm Password Field */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-primary text-white">
              <FaLock />
            </span>
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="form-control"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {/* Sign Up Button */}
          <button type="submit" className="btn btn-primary w-100 fw-bold">Sign Up</button>
        </form>
        <p className="mt-3 text-center">
          Already have an account? <Link to="/Login" className="text-primary fw-bold">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
