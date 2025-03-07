import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import Navbar from './components/Navbar';
import Feed from './components/Feed';
import Profile from './components/Profile';
import Tweets from './components/Tweets';
import Login from './components/Login';
import Register from './components/Register';
import FollowersList from './components/FollowersList';
import FollowingList from './components/FollowingList';
import UsersList from './components/UsersList'; 
import UserProfile from "./components/UserProfile";
import Notifications from './components/Notifications';
import Home from './components/Home';
import AuthGuard from './HOCs/AuthGuard';
import store from '/store';

function App() {
  return (
    <Provider store={store}> {/* Fournir le store Redux */}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/feed" element={<AuthGuard><Feed /></AuthGuard>} />
          <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
          <Route path="/tweets" element={<AuthGuard><Tweets /></AuthGuard>} />
          <Route path="/followersList" element={<AuthGuard><FollowersList /></AuthGuard>} />
          <Route path="/followingList" element={<AuthGuard><FollowingList /></AuthGuard>} />
          <Route path="/profile/:userId" element={<AuthGuard><UserProfile /></AuthGuard>} />
          <Route path="/notifications" element={<AuthGuard><Notifications /></AuthGuard>} />
          <Route path="/users" element={<AuthGuard><UsersList /></AuthGuard>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
