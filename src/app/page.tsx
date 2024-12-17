// Ensure "use client" is the first line in the file
"use client";

import React, { useEffect, useState } from 'react';


import Home from './components/home';
import ProfilePage from './components/profile-page';
import TaskCalendar from './components/TaskCalendar';
import LoginPage from './components/Login';
//import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

// HomePage component
export default function HomePage() {
  //const [isAuthenticated, setIsAuthenticated] = useState(false); // Track if user is authenticated
 // const navigate = useNavigate(); // Use navigate for programmatic navigation

  //const handleLogin = (validLogin: boolean) => {
   // if (validLogin) {
    //  setIsAuthenticated(true);
     // navigate("/home"); // Redirect to home page if login is successful
    //}
  //};

  return (
    <div>
      <LoginPage />
    </div>
  );
}

