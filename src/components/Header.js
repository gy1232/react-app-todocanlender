import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import AllowImg from '../assets/chevron_left.png';

const Header = ({
  pageName,
  isHome = false,
  selectedYear,
  selectedMonth,
  setSelectedYear,
  setSelectedMonth,
}) => {
  const leftChevron = AllowImg;
  const navigate = useNavigate();
  const [cookies] = useCookies(['login_token']);
  const userId = cookies.login_token;

  // 지난 5년부터 이후 5년까지 조회하도록 수정
  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - 5 + i
  );
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const toMypage = () => {
    navigate('/mypage');
  };

  const toLogin = () => {
    navigate('/login');
  };

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (isHome) {
      setSelectedYear(selectedYear);
      setSelectedMonth(selectedMonth);
    }
  }, [isHome, selectedYear, selectedMonth, setSelectedYear, setSelectedMonth]);

  return (
    <div className="w-full flex h-24 bg-white fixed z-10">
      {isHome ? (
        <>
          <div className="w-2/5 flex justify-start items-center pl-11">
            <select
              className=" max-sm:text-3xl pr-0 text-5xl font-medium pr-5"
              value={selectedYear}
              onChange={handleYearChange}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}년
                </option>
              ))}
            </select>
            <select
              className=" max-sm:text-3xl text-5xl font-medium"
              value={selectedMonth}
              onChange={handleMonthChange}
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}월
                </option>
              ))}
            </select>
          </div>
          <div className="w-3/5 flex justify-end items-center pr-11">
            {userId ? (
              <div
                className=" max-sm:text-3xl text-4xl font-medium cursor-pointer"
                onClick={toMypage}
              >
                {userId}
              </div>
            ) : (
              <div
                className=" max-sm:text-2xl text-4xl font-medium cursor-pointer"
                onClick={toLogin}
              >
                로그인
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="w-full flex justify-between items-center">
          <div
            className="flex items-center cursor-pointer fixed pl-5"
            onClick={goBack}
          >
            <img src={leftChevron} alt="Allow" className="w-[50px] h-[50px]" />
            <div>back</div>
          </div>
          <div className=" max-sm:text-2xl text-5xl font-medium flex-1 text-center">
            {pageName}
          </div>
          <div className="flex justify-end items-center">
            <div
              className=" max-sm:text-2xl text-4xl font-medium cursor-pointer fixed pr-11"
              onClick={toMypage}
            >
              {userId}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
