import { useNavigate } from 'react-router-dom';

const PopupAlert = () => {
  const navigate = useNavigate();

  const toLogin = () => {
    navigate('/login');
  };

  return (
    <div className=" w-full h-full bg-white">
      <div className=" w-full py-8 text-4xl text-center">
        로그인후 이용가능합니다.
      </div>
      <div
        className=" w-full flex justify-center items-center cursor-pointer"
        onClick={toLogin}
      >
        <div className=" w-20 h-8 font-medium flex justify-center items-center rounded-md bg-[#4B89DC]">
          로그인
        </div>
      </div>
    </div>
  );
};

export default PopupAlert;
