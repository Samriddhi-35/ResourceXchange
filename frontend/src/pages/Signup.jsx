import { useState } from "react";
import coverImg from "/cover.png";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

function Signup({ onLoginSuccess }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    try {
      setLoading(true);

      const response = await fetch(`${backendUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onLoginSuccess(data.username, data.email);
        navigate("/mode-selection");
      } else {
        alert(data.error || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-cover bg-center bg-blue" style={{ backgroundImage: `url(${coverImg})`}}> 
     <div className="w-full max-w-md bg-white bg-opacity-80 p-12 rounded-lg shadow-lg">
        <h2 className="text-5xl font-bold mb-6 text-center text-black">Sign up</h2>
        <form className="w-full" onSubmit={handleSubmit}>
          <label htmlFor="username" className="block text-gray-700 text-lg mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            className="w-full p-4 border rounded-lg mb-6 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <label htmlFor="email" className="block text-gray-700 text-lg mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            className="w-full p-4 border rounded-lg mb-6 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <label htmlFor="password" className="block text-gray-700 text-lg mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            className="w-full p-4 border rounded-lg mb-6 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            className="w-full bg-black text-white p-4 rounded-lg hover:bg-gray-800 transition duration-200"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign up"}
          </button>
        </form>
        <p className="text-gray-600 text-md mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

Signup.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired,
};

export default Signup;