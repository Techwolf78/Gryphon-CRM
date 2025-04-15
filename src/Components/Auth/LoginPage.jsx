import React, { useState } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const userEmail = res.user.email;

      // Redirect based on email
      if (userEmail === 'crm@gmail.com' || userEmail === 'ummi@gryphonacademy.co.in' || userEmail === 'shashi@gryphonacademy.co.in') navigate('/');
      else if (userEmail === 'sales@gmail.com') navigate('/sales');
      else if (userEmail === 'placement@gmail.com') navigate('/placement');
      else if (userEmail === 'landd@gmail.com') navigate('/learning-and-development');
      else navigate('/login'); // Unknown user
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#F5F5F5]"> {/* Background Color */}
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4 text-[#006B5D]">Login</h2> {/* Title Color */}
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border mb-3 rounded text-[#006B5D] border-[#006B5D] focus:outline-none focus:ring-2 focus:ring-[#00A388]" // Input Color
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border mb-3 rounded text-[#006B5D] border-[#006B5D] focus:outline-none focus:ring-2 focus:ring-[#00A388]" // Input Color
        />
        <button type="submit" className="w-full bg-[#006B5D] text-white py-2 rounded hover:bg-[#00A388] transition-all">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
