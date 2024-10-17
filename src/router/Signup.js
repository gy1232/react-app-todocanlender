import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import toast from 'react-hot-toast';

const Signup = () => {
  const [formData, setFormData] = useState({
    userid: '',
    password: '',
    confirmPassword: '',
    email: '',
    tasks: '',
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const useridRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const emailRef = useRef();

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextRef.current) {
        nextRef.current.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.');
      confirmPasswordRef.current.focus();
      return;
    }

    if (formData.userid.length < 4) {
      toast.error('아이디는 4자리 이상이어야 합니다.');
      useridRef.current.focus();
      return;
    }

    if (formData.password.length < 4) {
      toast.error('비밀번호는 4자리 이상이어야 합니다.');
      passwordRef.current.focus();
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}Users`);
      const users = await response.json();

      const isUseridDuplicate = users.some(
        (user) => user.userid === formData.userid
      );
      const isEmailDuplicate = users.some(
        (user) => user.email === formData.email
      );

      if (isUseridDuplicate) {
        toast.error('이미 존재하는 아이디입니다.');
        useridRef.current.focus();
        return;
      }

      if (isEmailDuplicate) {
        toast.error('이미 존재하는 이메일입니다.');
        emailRef.current.focus();
        return;
      }

      const createResponse = await fetch(
        `${process.env.REACT_APP_API_URL}Users`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: formData.userid,
            userid: formData.userid,
            password: formData.password,
            email: formData.email,
            tasks: [],
          }),
        }
      );

      if (!createResponse.ok) {
        throw new Error('회원가입에 실패했습니다.');
      }

      toast.success('회원가입에 성공했습니다.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const { userid, password, confirmPassword, email } = formData;
    if (userid && password && confirmPassword && email) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [formData]);

  return (
    <div className="w-full min-h-screen bg-[#fafafa]">
      <Header pageName="회원가입" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center pt-24">
        <div className="w-[350px] h-[500px] bg-white rounded-3xl shadow-lg">
          <form
            className="w-full h-full flex flex-col items-center"
            onSubmit={handleSubmit}
          >
            <div className="w-[300px] flex-1 flex flex-col justify-center pt-16">
              <input
                type="text"
                name="userid"
                placeholder="아이디"
                className="rounded-xl border-2 w-full h-[50px] shadow-lg mb-8 pl-4"
                value={formData.userid}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, passwordRef)}
                ref={useridRef}
              />
              <input
                type="password"
                name="password"
                placeholder="비밀번호"
                className="rounded-xl border-2 w-full h-[50px] shadow-lg mb-8 pl-4"
                value={formData.password}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, confirmPasswordRef)}
                ref={passwordRef}
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="비밀번호 확인"
                className="rounded-xl border-2 w-full h-[50px] shadow-lg mb-8 pl-4"
                value={formData.confirmPassword}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, emailRef)}
                ref={confirmPasswordRef}
              />
              <input
                type="email"
                name="email"
                placeholder="이메일"
                className="rounded-xl border-2 w-full h-[50px] shadow-lg pl-4"
                value={formData.email}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, useridRef)}
                ref={emailRef}
              />
            </div>
            <div className="w-[150px] flex-1 flex flex-col justify-center pb-8">
              <input
                type="submit"
                value="SUBMIT"
                className={`w-full h-[35px] rounded-xl font-semibold text-xl mb-3 ${
                  isFormValid
                    ? 'bg-[#4B89DC]'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
                disabled={!isFormValid}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
