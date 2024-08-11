import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Home } from './Pages/index.js';
import Login from './Pages/Auth/Login.jsx';
import Signup from './Pages/Auth/Signup.jsx';
import Mentors from './Pages/Mentors/Mentors.jsx';
import Community from './Pages/Community/Community.jsx';
import Resources from './Pages/Resources/Card1.jsx';
import Scholarships from './Pages/Scholarships/Scholarships.jsx';
import CommunityMy from './Pages/Community/CommunityMy.jsx';

function App() {
  const [logged, setLogged] = useState(false);
  const [user, setUser] = useState("user"); 
  const [userID, setUserID] = useState("id"); 

  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home logged={logged}/>} />
          <Route exact path="/login" element={<Login setLogged={setLogged} setUser={setUser} setUserID={setUserID}/>} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/mentors" element={<Mentors />} />
          <Route exact path="/community" element={<Community user={user} userID={userID}/>} />
          <Route exact path="/resources" element={<Resources />} />
          <Route exact path="/scholarships" element={<Scholarships />} />
          <Route exact path="/community/popular" element={<Community user={user} userID={userID} />}/>
          <Route exact path="/community/me" element={<CommunityMy user={user} userID={userID} />}/>
          {/**addd */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
