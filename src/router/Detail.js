import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Modal from 'react-modal';
import DetailItem from '../components/DetailItem';
import Header from '../components/Header';
import toast from 'react-hot-toast';
import { useCookies } from 'react-cookie';
import PopupInsert from '../components/PopupInsert';

const Detail = () => {
  const { year, month, day } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [cookies] = useCookies(['login_token']);
  const userToken = cookies.login_token;

  useEffect(() => {
    console.log('URL Parameters:', { year, month, day });

    const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}Users`);

        if (response.ok) {
          const users = await response.json();
          const user = users.find((user) => user.userid === userToken);

          if (user) {
            const userTasks = user.tasks || {};
            const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(
              day
            ).padStart(2, '0')}`;
            console.log('Fetched Tasks:', userTasks[dateKey]);
            setTasks(userTasks[dateKey] || []);
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
  }, [userToken, year, month, day]);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleAddTask = async (newTask) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}Users`);
      const users = await response.json();
      const user = users.find((user) => user.userid === userToken);

      if (user) {
        const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(
          day
        ).padStart(2, '0')}`;
        const taskWithStatus = { task: newTask, completed: false };

        const updatedTasks = {
          ...user.tasks,
          [dateKey]: [...(user.tasks[dateKey] || []), taskWithStatus],
        };
        user.tasks = updatedTasks;

        const updateUserResponse = await fetch(
          `${process.env.REACT_APP_API_URL}Users/${user.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
          }
        );

        if (updateUserResponse.ok) {
          setTasks(updatedTasks[dateKey]);
          toast.success('새로운 일정이 추가되었습니다.');
        } else {
          toast.error('할 일을 추가하는 데 실패했습니다.');
        }
      } else {
        toast.error('일치하는 사용자를 찾을 수 없습니다.');
      }
    } catch (error) {
      toast.error('서버와의 통신 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteTask = async (taskToDelete) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}Users`);
      const users = await response.json();
      const user = users.find((user) => user.userid === userToken);

      if (user) {
        const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(
          day
        ).padStart(2, '0')}`;
        const updatedTasks = user.tasks[dateKey].filter(
          (task) => task.task !== taskToDelete.task
        );
        user.tasks[dateKey] = updatedTasks;

        const updateUserResponse = await fetch(
          `${process.env.REACT_APP_API_URL}Users/${user.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
          }
        );

        if (updateUserResponse.ok) {
          setTasks(updatedTasks);
          toast.success('일정이 삭제되었습니다.');
        } else {
          toast.error('일정을 삭제하는 데 실패했습니다.');
        }
      } else {
        toast.error('일치하는 사용자를 찾을 수 없습니다.');
      }
    } catch (error) {
      toast.error('서버와의 통신 중 오류가 발생했습니다.');
    }
  };

  const handleCheckTask = async (taskToCheck, isChecked) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}Users`);
      const users = await response.json();
      const user = users.find((user) => user.userid === userToken);

      if (user) {
        const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(
          day
        ).padStart(2, '0')}`;
        const updatedTasks = user.tasks[dateKey].map((task) =>
          task.task === taskToCheck.task
            ? { ...task, completed: isChecked }
            : task
        );
        user.tasks[dateKey] = updatedTasks;

        const updateUserResponse = await fetch(
          `${process.env.REACT_APP_API_URL}Users/${user.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
          }
        );

        if (updateUserResponse.ok) {
          setTasks(updatedTasks);
          toast.success('일정 상태가 업데이트되었습니다.');
        } else {
          toast.error('일정 상태를 업데이트하는 데 실패했습니다.');
        }
      } else {
        toast.error('일치하는 사용자를 찾을 수 없습니다.');
      }
    } catch (error) {
      toast.error('서버와의 통신 중 오류가 발생했습니다.');
    }
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

  return (
    <div className="w-full h-screen bg-[#fafafa]">
      <Header pageName="상세보기" />
      <div className="w-full h-full flex justify-center">
        <div className="w-2/3 h-full bg-white pt-24">
          <div className="w-full h-40 flex justify-center items-center">
            <div className="text-5xl font-bold">
              {year}-{month}-{day}
            </div>
          </div>
          <div className="pb-6">
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <DetailItem
                  key={index}
                  task={task}
                  onDeleteTask={handleDeleteTask}
                  onCheckTask={handleCheckTask}
                />
              ))
            ) : (
              <div className="w-full h-20 flex justify-center">
                <div className="w-2/3 h-full flex items-center justify-center">
                  <div className="text-2xl font-normal">일정 없음</div>
                </div>
              </div>
            )}
          </div>
          <div className="w-full flex justify-center">
            <div
              className="w-2/3 h-16 bg-[#4B89DC] rounded-2xl flex items-center justify-center cursor-pointer"
              onClick={openModal}
            >
              <div className="text-2xl font-bold text-center items-center">
                추가
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
      >
        <PopupInsert onAddTask={handleAddTask} />
      </Modal>
    </div>
  );
};

export default Detail;
