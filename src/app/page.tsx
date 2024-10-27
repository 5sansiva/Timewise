// src/app/page.tsx

// Same this for use client as TaskCalendar
"use client";

// Importing TaskCalendar component to display the calendar on this page
import TaskCalendar from './components/TaskCalendar';

// HomePage component: this is the main page where the calendar will be displayed
export default function HomePage() {
  return (
    <div>
      {/* Page title */}
      <h1>My Task Calendar</h1>
      
      {/* Display the TaskCalendar component here */}
      <TaskCalendar />
    </div>
  );
}
