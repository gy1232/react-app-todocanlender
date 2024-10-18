const MypageItem = ({ task }) => {
  return (
    <div className="w-full h-20 flex justify-center pb-2">
      <div className="w-2/3 h-full flex items-center shadow-[0_10px_10px_-3px_rgba(0,0,0,0.1)] px-4">
        <div className=" w-full flex">
          <div className=" w-1/2 flex items-center justify-start">
            <div className="text-2xl font-normal p-1">{task.task}</div>
          </div>
          <div className=" w-1/2 flex items-center justify-end">
            <div className=" max-sm:text-[0.7rem] text-sm font-light text-gray-500">
              {task.date}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MypageItem;
