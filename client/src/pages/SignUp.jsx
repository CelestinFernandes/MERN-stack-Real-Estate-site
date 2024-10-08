import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import ReCAPTCHA from "react-google-recaptcha";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null); // New state for CAPTCHA
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!captchaValue) {  // Check if CAPTCHA is completed
      alert('Please complete the CAPTCHA');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          captchaValue,  // Include CAPTCHA value in the request
        }),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7' style={{ color: '#ae9856', fontFamily: 'Arial, sans-serif' }}>REGISTER</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className="flex flex-col">
          <label htmlFor="username" className="text-black font-semibold">Username</label>
          <input
            type='text' placeholder='Enter username'
            className='border p-3 rounded-lg'
            id='username'
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="email" className="text-black font-semibold">Email</label>
          <input
            type='email' placeholder='Enter email'
            className='border p-3 rounded-lg'
            id='email'
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="text-black font-semibold">Password</label>
          <input
            type='password' placeholder='Enter password'
            className='border p-3 rounded-lg'
            id='password'
            onChange={handleChange}
          />
        </div>

        {/* Add the reCAPTCHA widget */}
        <ReCAPTCHA
          sitekey={import.meta.env.VITE_REACT_APP_RECAPTCHA_SITE_KEY}  // Replace with your actual reCAPTCHA site key
          onChange={(value) => setCaptchaValue(value)}  // Update captchaValue when CAPTCHA is completed
        />

        <button
          disabled={loading || !captchaValue}  // Disable button if loading or CAPTCHA not completed
          className='bg-slate-600 text-white p-3 rounded-lg uppercase font-semibold hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'REGISTER'}
        </button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={'/sign-in'}>
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
}
