import React, { useState } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import dashboardBg from "../../assets/bghome.jpeg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const userEmail = res.user.email;

      // Redirect based on email
      if (
        userEmail === "crm@gmail.com" ||
        userEmail === "ummi@gryphonacademy.co.in" ||
        userEmail === "shashi@gryphonacademy.co.in"
      )
        navigate("/");
      else if (userEmail === "sales@gmail.com") navigate("/sales");
      else if (userEmail === "placement@gmail.com") navigate("/placement");
      else if (userEmail === "landd@gmail.com")
        navigate("/learning-and-development");
      else navigate("/login"); // Unknown user
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${dashboardBg})` }}
    >
      {/* Logo at Top-Left */}
      <img
        src="https://res.cloudinary.com/dcjmaapvi/image/upload/v1740489025/ga-hori_ylcnm3.png"
        alt="Company Logo"
        className="absolute top-2 left-6 w-40 md:w-52"
      />

      {/* Heading */}
      <h1 className="text-3xl md:text-6xl font-bold text-white mb-8 text-center px-4">
  “From <span className="text-[#A8E6A3]">Chaos</span> to <span className="text-[#A8E6A3]">Clarity</span> — Instantly.”
</h1>


      {/* Login Form */}
      <form
        onSubmit={handleLogin}
        className="backdrop-blur-lg bg-white/10 border border-white/30 shadow-xl p-6 rounded-xl w-full max-w-sm transition-all duration-300 ease-in-out"
      >
        <h2 className="text-xl font-semibold mb-4 text-[#A8E6A3]">Login</h2>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border mb-3 rounded text-white border-[#A8E6A3] focus:outline-none focus:ring-2 focus:ring-[#A8E6A3]"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border mb-3 rounded text-white border-[#A8E6A3] focus:outline-none focus:ring-2 focus:ring-[#A8E6A3]"
        />
        <button
          type="submit"
          className="w-full bg-[#A8E6A3] text-gray-700 py-2 rounded hover:bg-[#88D495] transition-all"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
