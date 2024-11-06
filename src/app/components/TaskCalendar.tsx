// Name: Venkat Sai Eshwar Varma Sagi (VXS210103)

// src/app/components/TaskCalendar.tsx

// It was causing problems when running on serverside
// This tells Next.js that this component should run on the client side, not the server
"use client";

import React, { useState, useEffect } from 'react';

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

// Define the structure of a calendar event to match FullCalendar's requirements
interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
}

// TaskCalendar component: this displays a calendar on the page
const TaskCalendar = () => {
  // State to store events fetched from the API
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Fetch events from the API on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch events from the backend API
  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      // Transform API data to FullCalendar's event format
      setEvents(data.map((event: any) => ({
        id: event.id.toString(),
        title: event.title,
        start: event.start_time,
        end: event.end_time,
      })));
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // Handle event creation (selecting a date or range)
  const handleDateSelect = async (selectInfo: any) => {
    // Prompt the user for a title when they select a date range
    const title = prompt('Enter a title for the new event:');
    if (title) {
      // Prepare the new event data to be sent to the API
      const newEvent = {
        title,
        start_time: selectInfo.startStr,
        end_time: selectInfo.endStr,
        is_recurring: false,
        recurrence_pattern: '',
        priority: 1,
      };
      try {
        // Send a POST request to create the new event in the database
        const response = await fetch('/api/events/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEvent),
        });
        const createdEvent = await response.json();
        // Add the new event to the calendar by updating state
        setEvents((prevEvents) => [
          ...prevEvents,
          { id: createdEvent.id.toString(), title: createdEvent.title, start: createdEvent.start_time, end: createdEvent.end_time },
        ]);
      } catch (error) {
        console.error('Error creating event:', error);
      }
    }
    // Clear the selected date range after adding the event
    selectInfo.view.calendar.unselect();
  };

  // Handle event update (dragging or resizing an event)
  const handleEventChange = async (changeInfo: any) => {
    // Prepare the updated event data to be sent to the API
    const updatedEvent = {
      title: changeInfo.event.title,
      start_time: changeInfo.event.start?.toISOString() || '',
      end_time: changeInfo.event.end?.toISOString() || '',
      is_recurring: false,
      recurrence_pattern: '',
      priority: 1,
    };
    try {
      // Send a PUT request to update the event in the database
      await fetch(`/api/events/${changeInfo.event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEvent),
      });
      // Update the event in the state to reflect changes in the UI
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === changeInfo.event.id
            ? { ...event, start: updatedEvent.start_time, end: updatedEvent.end_time }
            : event
        )
      );
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  // Handle event deletion
  const handleEventDelete = async (eventInfo: any) => {
    // Confirm with the user before deleting the event
    if (window.confirm(`Are you sure you want to delete the event '${eventInfo.event.title}'?`)) {
      try {
        // Send a DELETE request to remove the event from the database
        await fetch(`/api/events/${eventInfo.event.id}`, {
          method: 'DELETE',
        });
        // Remove the event from the state to reflect the deletion in the UI
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== eventInfo.event.id)
        );
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

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
      
      // Events fetched from the API are displayed on the calendar
      events={events}

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

      // Handlers for adding, updating, and deleting events
      select={handleDateSelect}  // Triggered when a date or date range is selected
      eventChange={handleEventChange}  // Triggered when an event is dragged or resized
      eventClick={(eventInfo) => handleEventDelete(eventInfo)}  // Triggered when an event is clicked for deletion
    />
  );
};

// Exporting TaskCalendar so it can be used in other files
export default TaskCalendar;
