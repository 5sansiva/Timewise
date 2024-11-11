// Ensure "use client" is the first line in the file
"use client";

import React from 'react';

// Importing TaskCalendar component to display the calendar on this page

import Home from './components/home';
import ProfilePage from './components/profile-page';
import TaskCalendar from './components/TaskCalendar';


// HomePage component: this is the main page where the calendar will be displayed
export default function HomePage() {
  return (
    <div>
      {/* Page title */}
      <h2>Time Wise Calendar View</h2>
      
      {/* Display the TaskCalendar component here */}
     
      <TaskCalendar />
    </div>
  );
}
