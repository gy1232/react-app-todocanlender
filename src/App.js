import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './router/Home';
import Detail from './router/Detail';
import Mypage from './router/Mypage';
import Login from './router/Login';
import Signup from './router/Signup';
import PopupAlert from './components/PopupAlert';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/detail/:year/:month/:day" element={<Detail />} />
      <Route path="/mypage" element={<Mypage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/popup" element={<PopupAlert />} />
    </Routes>
  );
}

export default App;
