// Name: Venkat Sai Eshwar Varma Sagi (VXS210103)

// src/app/components/TaskCalendar.tsx

// It was causing problems when running on serverside
// This tells Next.js that this component should run on the client side, not the server
"use client";

// Importing FullCalendar and plugins needed for different calendar views and interactions
import FullCalendar from '@fullcalendar/react';
// For month view
import dayGridPlugin from '@fullcalendar/daygrid';
// For week and day views
import timeGridPlugin from '@fullcalendar/timegrid';
// For drag-and-drop and selecting
import interactionPlugin from '@fullcalendar/interaction';
// For connecting with Google Calendar
import googleCalendarPlugin from '@fullcalendar/google-calendar';

// TaskCalendar component: this displays a calendar on the page
const TaskCalendar = () => {
  return (
    <FullCalendar
      // Adding plugins to give the calendar month, week, day views and interactions
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, googleCalendarPlugin]}
      
      // Set the default view to month view when the calendar loads
      initialView="dayGridMonth"
      
      // Allows the user to drag events around the calendar
      editable={true}
      
      // Allows the user to select dates or time ranges on the calendar
      selectable={true}
      
      // Sample events added to the calendar to display on specific dates
      events={[
        { title: 'Meeting', date: '2024-10-28' },
        { title: 'Coding TimeWise lol', date: '2024-10-29' }
      ]}
      
      // Header toolbar with navigation buttons and view options
      headerToolbar={{
        // To go to previous month, next month, or today
        left: 'prev,next today',
        // Shows the current month and year title in the center
        center: 'title',
        // Buttons to switch views (month, week, day)
        right: 'dayGridMonth,timeGridWeek,timeGridDay' 
      }}
      
      // Adjusts the height of the calendar to fit the screen automatically
      height="auto"
    />
  );
};

// Exporting TaskCalendar so it can be used in other files
export default TaskCalendar;
