import { useState } from 'react';
import CheckIcon from '../assets/checkIcon.png';
import CloseIcon from '../assets/closeIcon.png';

const DetailItem = ({ task, onDeleteTask, onCheckTask }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isChecked, setIsChecked] = useState(task.completed);

  const handleCheck = () => {
    setIsChecked(!isChecked);
    onCheckTask(task, !isChecked);
  };

  const handleDelete = () => {
    onDeleteTask(task);
  };

  return (
    <div
      className="w-full h-20 flex justify-center pb-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-2/3 h-full flex items-center justify-between shadow-[0_10px_10px_-3px_rgba(0,0,0,0.1)] px-4">
        <div
          className={`text-2xl font-normal p-1 ${
            isChecked ? 'line-through' : ''
          }`}
        >
          {task.task}
        </div>
        <div className="w-20 flex justify-around">
          <div
            className={`w-8 h-8 rounded-lg ${
              isHovered ? 'bg-black/10' : 'bg-white'
            }`}
            onClick={handleDelete}
          >
            {isHovered && <img src={CloseIcon} alt="close" />}
          </div>
          <div
            className={`w-8 h-8 rounded-lg ${
              isHovered ? 'bg-black/10' : 'bg-white'
            }`}
            onClick={handleCheck}
          >
            {isHovered && <img src={CheckIcon} alt="check" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailItem;
