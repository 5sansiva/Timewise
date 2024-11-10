// Name: Venkat Sai Eshwar Varma Sagi (VXS210103)

// src/app/page.tsx

// Same this for use client as TaskCalendar
"use client";

// Importing TaskCalendar component to display the calendar on this page

import Home from './components/home';


// HomePage component: this is the main page where the calendar will be displayed
export default function HomePage() {
  return (
    <div>
      {/* Page title */}
      <h2>Time Wise Calendar View</h2>
      
      {/* Display the TaskCalendar component here */}
     
      <Home />
    </div>
  );
}
