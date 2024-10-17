import React, { useState } from 'react';
import toast from 'react-hot-toast';
const PopupInsert = ({ onAddTask }) => {
  const [task, setTask] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.trim()) {
      onAddTask(task);
      setTask('');
    } else {
      toast.error('일정을 입력해주세요.');
    }
  };

  return (
    <div className="w-full h-full">
      <div className="w-full h-full">
        <form className="w-full h-full" onSubmit={handleSubmit}>
          <div className="w-full h-1/2 flex justify-center items-center">
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="일정입력"
              className="w-80 h-10 outline-none shadow-md rounded-md p-4"
            />
          </div>
          <div className="w-full h-1/2 flex justify-center items-center">
            <input
              type="submit"
              value="확인"
              className="w-60 h-10 bg-[#4B89DC] rounded-xl font-semibold text-xl"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopupInsert;
