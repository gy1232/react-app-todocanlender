import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import DateTodo from '../components/DateTodo';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Modal from 'react-modal';
import PopupAlert from '../components/PopupAlert';
import toast from 'react-hot-toast';

const Home = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(['login_token']);
  const loginToken = cookies.login_token;
  const [isOpen, setIsOpen] = useState(false);
  const [dayList, setDayList] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const customModalStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      width: '100%',
      height: '100vh',
      zIndex: '10',
      position: 'fixed',
      top: '0',
      left: '0',
    },
    content: {
      width: '500px',
      height: '200px',
      zIndex: '150',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: '10px',
      boxShadow: '2px 2px 2px rgba(0, 0, 0, 0.25)',
      backgroundColor: 'white',
      justifyContent: 'center',
      overflow: 'auto',
    },
  };

  const fetchTasks = async (year, month) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}Users`);
      if (response.ok) {
        const users = await response.json();
        const user = users.find((user) => user.userid === loginToken);

        if (user) {
          const userTasks = user.tasks || {};
          const daysInMonth = new Date(year, month, 0).getDate();
          const dayList = Array.from({ length: daysInMonth }, (_, index) => {
            const day = index + 1;
            const tasks =
              userTasks[
                `${year}-${String(month).padStart(2, '0')}-${String(
                  day
                ).padStart(2, '0')}`
              ] || [];
            const isCompleted =
              tasks.length > 0 && tasks.every((task) => task.completed);
            return {
              id: day,
              day: day,
              result:
                tasks.length === 0 ? '없음' : isCompleted ? '완료' : '미완료',
            };
          });
          setDayList(dayList);
        } else {
          toast.error('일치하는 사용자를 찾을 수 없습니다.');
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || '데이터를 가져오는 데 실패했습니다.');
      }
    } catch (error) {
      toast.error('서버와의 통신 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    if (loginToken) {
      fetchTasks(selectedYear, selectedMonth);
    } else {
      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
      const dayList = Array.from({ length: daysInMonth }, (_, index) => ({
        id: index + 1,
        day: index + 1,
        result: '없음',
      }));
      setDayList(dayList);
    }
  }, [loginToken, selectedYear, selectedMonth]);

  const toDetail = (year, month, day) => {
    navigate(`/detail/${year}/${month}/${day}`);
  };

  return (
    <div className="w-full min-h-screen bg-[#fafafa]">
      <Header
        isHome={true}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        setSelectedYear={setSelectedYear}
        setSelectedMonth={setSelectedMonth}
      />
      <div className="w-full flex justify-center px-12">
        <div className="w-full grid gap-14 grid-cols-7 pt-36 pb-8">
          {dayList.map((item) => (
            <DateTodo
              key={item.id}
              data={item.day}
              result={item.result}
              onClick={
                loginToken
                  ? () => toDetail(selectedYear, selectedMonth, item.day)
                  : openModal
              }
            />
          ))}
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
      >
        <PopupAlert />
      </Modal>
    </div>
  );
};

export default Home;
