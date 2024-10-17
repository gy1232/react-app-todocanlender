import React from 'react';
import './DateTodo.css';
import { useCookies } from 'react-cookie';

const DateTodo = ({ data, result, onClick }) => {
  const [cookies] = useCookies(['login_token']);
  let displayResult = result;
  let resultClass = '';

  if (!cookies.login_token || result === '없음') {
    displayResult = '없음';
    resultClass = 'not-logged-in';
  } else {
    resultClass = result === '완료' ? 'completed' : 'not-completed';
  }

  return (
    <div className="day-todo" onClick={onClick}>
      <div className="day-todo-data">{data}</div>
      <div className={`day-todo-result ${resultClass}`}>
        <div className="day-todo-result-text">{displayResult}</div>
      </div>
    </div>
  );
};

export default DateTodo;
