import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import toast from 'react-hot-toast';
import { useCookies } from 'react-cookie';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [cookies, setCookie] = useCookies(['login_token']);
  const [userId, setUserId] = useState(cookies.login_token || null);

  const navigate = useNavigate();
  const passwordRef = useRef(null);
  const submitButtonRef = useRef(null);

  useEffect(() => {
    if (username.trim() && password.trim()) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [username, password]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}Users`);

      if (response.ok) {
        const users = await response.json();
        const user = users.find(
          (u) => u.userid === username && u.password === password
        );

        if (user) {
          setUserId(user.userid);
          setCookie('login_token', user.userid, { path: '/', maxAge: 604800 });
          toast.success('로그인 성공했습니다.');
          toHome();
        } else {
          toast.error('아이디 또는 비밀번호가 잘못되었습니다.');
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || '로그인 실패');
      }
    } catch (error) {
      toast.error('서버와의 통신 중 오류가 발생했습니다.');
    }
  };

  const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      } else {
        submitButtonRef.current.click();
      }
    }
  };

  const toSignup = () => {
    navigate('/signup');
  };

  const toHome = () => {
    navigate('/');
  };

  return (
    <div className="w-full min-h-screen bg-[#fafafa]">
      <Header pageName="로그인" headerShow={userId !== null} userId={userId} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center pt-24">
        <div className="w-[350px] h-[500px] bg-white rounded-3xl shadow-lg">
          <form
            className="w-full h-full flex flex-col items-center"
            onSubmit={handleLogin}
          >
            <div className="w-[300px] flex-1 flex flex-col justify-center pt-20">
              <input
                type="text"
                placeholder="아이디"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, passwordRef)}
                className="rounded-xl border-2 w-full h-[50px] shadow-lg mb-11 pl-4"
              />
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, null)}
                ref={passwordRef}
                className="rounded-xl border-2 w-full h-[50px] shadow-lg pl-4"
              />
            </div>
            <div className="w-[150px] flex-1 flex flex-col justify-center pb-8">
              <input
                type="submit"
                value="로그인"
                ref={submitButtonRef}
                disabled={isButtonDisabled}
                className={`w-full h-[35px] rounded-xl font-semibold text-xl mb-3 ${
                  isButtonDisabled ? 'bg-gray-300' : 'bg-[#4B89DC]'
                }`}
              />
              <div
                className="text-center font-normal text-[#CCCCCC] text-sm underline cursor-pointer"
                onClick={toSignup}
              >
                회원가입
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
