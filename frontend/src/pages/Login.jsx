import coverImg from "/cover.png";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user data is cached in sessionStorage
    const cachedUser = JSON.parse(sessionStorage.getItem('user'));
    if (cachedUser) {
      onLoginSuccess(cachedUser.username, cachedUser.email);
      navigate('/mode-selection');
    }
  }, [navigate, onLoginSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const usernameOrEmail = e.target.usernameOrEmail.value;
    const password = e.target.password.value;

    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: usernameOrEmail,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Cache the user data in sessionStorage
        sessionStorage.setItem('user', JSON.stringify({ username: data.username, email: data.email }));
        
        onLoginSuccess(data.username, data.email);
        navigate('/mode-selection');
      } else {
        alert(data.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center bg-blue"
      style={{ backgroundImage: `url(${coverImg})` }}
    >
      <div className="w-full max-w-md bg-white bg-opacity-80 p-12 rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold mb-6 text-center">Log in</h2>
        <form className="w-full" onSubmit={handleSubmit}>
          <label htmlFor="usernameOrEmail" className="block text-gray-700 text-lg mb-2">
            Username or Email
          </label>
          <input
            type="text"
            id="usernameOrEmail"
            name="usernameOrEmail"
            placeholder="Username or Email"
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
            {loading ? (
              <div className="flex justify-center items-center">
                <div className="w-6 h-6 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
              </div>
            ) : (
              "Log in"
            )}
          </button>
        </form>
        <p className="text-gray-600 text-md mt-6 text-center">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-blue-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

Login.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired,
};

export default Login;