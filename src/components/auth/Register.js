import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Register() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  
  async function onSubmit(data) {
    if (data.password !== data.passwordConfirm) {
      return setError('비밀번호가 일치하지 않습니다.');
    }
    
    try {
      setError('');
      setLoading(true);
      await signup(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setError('계정 생성에 실패했습니다.');
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
      <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">이메일</label>
          <input
            id="email"
            type="email"
            className="form-input"
            {...register('email', { 
              required: '이메일을 입력해주세요.',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: '유효한 이메일 주소를 입력해주세요.'
              }
            })}
          />
          {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            className="form-input"
            {...register('password', { 
              required: '비밀번호를 입력해주세요.',
              minLength: {
                value: 6,
                message: '비밀번호는 최소 6자 이상이어야 합니다.'
              }
            })}
          />
          {errors.password && <p className="mt-1 text-red-500 text-sm">{errors.password.message}</p>}
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="passwordConfirm">비밀번호 확인</label>
          <input
            id="passwordConfirm"
            type="password"
            className="form-input"
            {...register('passwordConfirm', { 
              required: '비밀번호를 다시 입력해주세요.',
              validate: value => value === watch('password') || '비밀번호가 일치하지 않습니다.'
            })}
          />
          {errors.passwordConfirm && <p className="mt-1 text-red-500 text-sm">{errors.passwordConfirm.message}</p>}
        </div>
        
        <button
          type="submit"
          className="w-full btn-primary mb-4"
          disabled={loading}
        >
          {loading ? '계정 생성 중...' : '회원가입'}
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
        구글 계정으로 가입
      </button>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          이미 계정이 있으신가요? <Link to="/login" className="text-primary hover:underline">로그인</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
