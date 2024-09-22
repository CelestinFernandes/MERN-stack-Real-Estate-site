import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';
import ReCAPTCHA from "react-google-recaptcha";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [captchaValue, setCaptchaValue] = useState(null); // New state to hold CAPTCHA response
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          captchaValue,  // Send CAPTCHA value to the backend
        }),
      });
      const data = await res.json();
      console.log(data);

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }

      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7' style={{ color: '#ae9856', fontFamily: 'Arial, sans-serif' }}>
        Sign In
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className='flex flex-col gap-1'>
          <label htmlFor='email' className='font-semibold'>Email</label>
          <input
            type='email'
            placeholder='Email'
            className='border p-3 rounded-lg'
            id='email'
            onChange={handleChange}
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor='password' className='font-semibold'>Password</label>
          <input
            type='password'
            placeholder='Password'
            className='border p-3 rounded-lg'
            id='password'
            onChange={handleChange}
          />
        </div>

        {/* Add the reCAPTCHA widget */}
        <ReCAPTCHA
          sitekey="6LeL6EsqAAAAABxxwQBjm1rZDUtD4-qrcXfGlOp-"  // Replace with your actual reCAPTCHA site key
          onChange={(value) => setCaptchaValue(value)}  // Update captchaValue when CAPTCHA is completed
        />

        <button
          disabled={loading || !captchaValue}  // Disable button if loading or CAPTCHA not completed
          className='bg-slate-700 text-white p-3 rounded-lg uppercase font-semibold hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
        <OAuth />
      </form>

      <div className='flex gap-2 mt-5'>
        <p>Dont have an account?</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
}
