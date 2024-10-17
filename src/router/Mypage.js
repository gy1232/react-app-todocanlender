import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import toast from 'react-hot-toast';
import { useCookies } from 'react-cookie';
import MypageItem from '../components/MypageItem';

const Mypage = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [incompleteTasks, setIncompleteTasks] = useState([]);
  const [showCompleted, setShowCompleted] = useState(true);
  const [cookies] = useCookies(['login_token']);
  const userToken = cookies.login_token;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}Users`);

        if (response.ok) {
          const users = await response.json();
          const user = users.find((user) => user.userid === userToken);

          if (user) {
            const userTasks = user.tasks || {};

            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');

            const tasksForMonth = Object.keys(userTasks)
              .filter((date) => date.startsWith(`${year}-${month}`))
              .reduce(
                (acc, date) =>
                  acc.concat(
                    userTasks[date].map((task) => ({ ...task, date }))
                  ),
                []
              );

            setTasks(tasksForMonth);
            setCompletedTasks(tasksForMonth.filter((task) => task.completed));
            setIncompleteTasks(tasksForMonth.filter((task) => !task.completed));
          } else {
            toast.error('일치하는 사용자를 찾을 수 없습니다.');
          }
        } else {
          const errorData = await response.json();
          toast.error(
            errorData.message || '데이터를 가져오는 데 실패했습니다.'
          );
        }
      } catch (error) {
        toast.error('서버와의 통신 중 오류가 발생했습니다.');
      }
    };

    fetchUsers();
  }, [userToken]);

  return (
    <div className="w-full min-h-screen bg-[#fafafa]">
      <Header pageName="마이페이지" />
      <div className="w-full min-h-screen flex justify-center">
        <div className="w-2/3 min-h-screen bg-white pt-24">
          <div className="w-full h-40 flex justify-center items-center">
            <div className="flex">
              <div
                onClick={() => setShowCompleted(true)}
                className={`w-28 h-10 rounded-l-2xl cursor-pointer flex justify-center items-center ${
                  showCompleted ? 'bg-[#4B89DC] text-white' : 'bg-black/5'
                }`}
              >
                <div>완료</div>
              </div>
              <div
                onClick={() => setShowCompleted(false)}
                className={`w-28 h-10 rounded-r-2xl cursor-pointer flex justify-center items-center ${
                  !showCompleted ? 'bg-[#4B89DC] text-white' : 'bg-black/5'
                }`}
              >
                <div>미완료</div>
              </div>
            </div>
          </div>
          <div className="pb-6">
            {showCompleted ? (
              completedTasks.length > 0 ? (
                completedTasks.map((task, index) => (
                  <MypageItem key={index} task={task} />
                ))
              ) : (
                <div className="text-center">완료된 일정이 없음</div>
              )
            ) : incompleteTasks.length > 0 ? (
              incompleteTasks.map((task, index) => (
                <MypageItem key={index} task={task} />
              ))
            ) : (
              <div className="text-center">미완료 일정 없음</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mypage;
