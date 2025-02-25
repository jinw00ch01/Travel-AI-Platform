import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  
  async function onSubmit(data) {
    try {
      setError('');
      setLoading(true);
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  
  async function handleGoogleLogin() {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError('Google 로그인에 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">이메일</label>
          <input
            id="email"
            type="email"
            className="form-input"
            {...register('email', { required: '이메일을 입력해주세요.' })}
          />
          {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>}
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            className="form-input"
            {...register('password', { required: '비밀번호를 입력해주세요.' })}
          />
          {errors.password && <p className="mt-1 text-red-500 text-sm">{errors.password.message}</p>}
        </div>
        
        <button
          type="submit"
          className="w-full btn-primary mb-4"
          disabled={loading}
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>
      
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">또는</span>
        </div>
      </div>
      
      <button
        type="button"
        className="w-full flex justify-center items-center bg-white border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-50"
        onClick={handleGoogleLogin}
        disabled={loading}
      >
        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
          <path
            d="M12.545 12.151c0 .818-.151 1.601-.429 2.338h-3.96v-4.453h2.304c-.013.428-.005.865-.005 1.318 0 .276.017.533.09.797z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.432l1.84 1.374c.508-.462 1.439-1.104 2.43-1.104 2.086 0 3.578 1.391 3.578 3.598 0 .262-.033.518-.08.776h-3.96a4.11 4.11 0 01-.429-2.338c-.073-.264-.09-.521-.09-.797 0-.453-.008-.89.005-1.318H12z"
            fill="#4285F4"
          />
          <path
            d="M12 17.729c-3.937 0-7.152-3.037-7.152-6.792 0-3.754 3.215-6.791 7.152-6.791v3.574c-1.82 0-3.293 1.444-3.293 3.217S10.18 14.155 12 14.155c1.82 0 3.293-1.445 3.293-3.218 0-.682-.224-1.312-.603-1.825l2.43-1.104c.929 1.191 1.482 2.661 1.482 4.252 0 3.782-3.156 6.813-7.023 6.813-.048 0-.095-.002-.143-.004z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.489a6.825 6.825 0 01-.992-3.553c0-1.27.35-2.46.95-3.486L8.238 9.1c-.38.65-.6 1.396-.6 2.192 0 .929.31 1.786.84 2.481z"
            fill="#EA4335"
          />
        </svg>
        구글 계정으로 로그인
      </button>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          계정이 없으신가요? <Link to="/register" className="text-primary hover:underline">회원가입</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;