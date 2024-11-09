import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from 'react-modal';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
}

interface DropInfo {
  event: CalendarEvent;
  oldStart: string;
  oldEnd: string;
  newStart: string;
  newEnd: string;
  oldAllDay: boolean;
  newAllDay: boolean;
}


const TaskCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [dropInfo, setDropInfo] = useState<DropInfo | null>(null);
  const [isDropConfirmOpen, setIsDropConfirmOpen] = useState(false);

  // ... (keep existing useEffect hooks and helper functions)
  useEffect(() => {
    let root = document.getElementById('modal-root');
    
    if (!root) {
      root = document.createElement('div');
      root.id = 'modal-root';
      document.body.appendChild(root);
    }
    
    Modal.setAppElement('#modal-root');
    setModalRoot(root);

    return () => {
      if (root && !root.childNodes.length) {
        document.body.removeChild(root);
      }
    };
  }, []);

  useEffect(() => {
    fetchEvents();
  }, []);

  const formatDateForInput = (date: Date): string => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const setAllDayTimes = (date: string | Date, isEnd: boolean = false): string => {
    const d = new Date(date);
    d.setHours(isEnd ? 23 : 0, isEnd ? 59 : 0, 0, 0); // Set to 23:59 for end time, 00:00 for start time
    return formatDateForInput(d);
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data.map((event: any) => ({
        id: event.id.toString(),
        title: event.title,
        start: event.all_day ? setAllDayTimes(event.start_time) : formatDateForInput(new Date(event.start_time)),
        end: event.all_day ? setAllDayTimes(event.end_time, true) : formatDateForInput(new Date(event.end_time)),
        allDay: event.all_day,
      })));
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const openModal = (event: CalendarEvent | null) => {
    if (event) {
      const updatedEvent = {
        ...event,
        start: event.allDay ? setAllDayTimes(event.start) : event.start,
        end: event.allDay ? setAllDayTimes(event.end, true) : event.end,
      };
      setSelectedEvent(updatedEvent);
    } else {
      setSelectedEvent(event);
    }
    setIsModalOpen(true);
    setErrorMessage('');
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
    setErrorMessage('');
  };

  const validateEventTimes = (start: string, end: string): boolean => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return startDate < endDate;
  };

  const handleEventSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!selectedEvent?.start || !selectedEvent?.end) {
      setErrorMessage('Start and end times are required');
      return;
    }

    if (!selectedEvent.allDay && !validateEventTimes(selectedEvent.start, selectedEvent.end)) {
      setErrorMessage('End time must be after start time');
      return;
    }

    const method = selectedEvent?.id ? 'PUT' : 'POST';
    const url = selectedEvent?.id ? `/api/events/${selectedEvent.id}` : '/api/events/create';

    const eventToSave = {
      ...selectedEvent,
      start: selectedEvent.allDay ? setAllDayTimes(selectedEvent.start) : selectedEvent.start,
      end: selectedEvent.allDay ? setAllDayTimes(selectedEvent.end, true) : selectedEvent.end,
    };

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: eventToSave.title,
          start_time: eventToSave.start,
          end_time: eventToSave.end,
          all_day: eventToSave.allDay, // Make sure to send all_day to the backend
          // ... (other fields remain the same)
        }),
      });
      
      const newEvent = await response.json();
      const formattedEvent = {
        id: newEvent.id.toString(),
        title: newEvent.title,
        start: newEvent.all_day ? setAllDayTimes(newEvent.start_time) : formatDateForInput(new Date(newEvent.start_time)),
        end: newEvent.all_day ? setAllDayTimes(newEvent.end_time, true) : formatDateForInput(new Date(newEvent.end_time)),
        allDay: newEvent.all_day,
      };

      if (method === 'POST') {
        setEvents(prev => [...prev, formattedEvent]);
      } else {
        setEvents(prev => 
          prev.map(event => 
            event.id === formattedEvent.id ? formattedEvent : event
          )
        );
      }
      
      closeModal();
    } catch (error) {
      console.error('Error saving event:', error);
      setErrorMessage('Failed to save event. Please try again.');
    }
  };


  const handleEventDelete = async () => {
    if (selectedEvent?.id) {
      try {
        await fetch(`/api/events/${selectedEvent.id}`, { method: 'DELETE' });
        setEvents((prevEvents) => prevEvents.filter((event) => event.id !== selectedEvent.id));
        closeModal();
      } catch (error) {
        console.error('Error deleting event:', error);
        setErrorMessage('Failed to delete event. Please try again.');
      }
    }
  };

  const handleDateSelect = (selectInfo: any) => {
    const startDate = new Date(selectInfo.start);
    const endDate = new Date(selectInfo.end);
    const allDay = selectInfo.allDay || selectInfo.view.type === 'dayGridMonth';

    const newEvent = {
      id: '',
      title: '',
      start: allDay ? setAllDayTimes(startDate.toISOString()) : formatDateForInput(startDate),
      end: allDay ? setAllDayTimes(startDate.toISOString(), true) : formatDateForInput(endDate),
      allDay,
    };

    openModal(newEvent);
  };

  const handleEventClick = (eventInfo: any) => {
    const event = {
      id: eventInfo.event.id,
      title: eventInfo.event.title,
      start: eventInfo.event.allDay ? setAllDayTimes(eventInfo.event.start.toISOString()) : formatDateForInput(eventInfo.event.start),
      end: eventInfo.event.allDay ? setAllDayTimes(eventInfo.event.end?.toISOString() || eventInfo.event.start.toISOString(), true) : formatDateForInput(eventInfo.event.end || eventInfo.event.start),
      allDay: eventInfo.event.allDay,
    };

    openModal(event);
  };

  const handleAllDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedEvent) return;

    const isAllDay = e.target.checked;
    const startDate = new Date(selectedEvent.start);
    const endDate = new Date(selectedEvent.end);

    setSelectedEvent({
      ...selectedEvent,
      allDay: isAllDay,
      start: isAllDay ? setAllDayTimes(startDate.toISOString()) : selectedEvent.start,
      end: isAllDay ? setAllDayTimes(startDate.toISOString(), true) : selectedEvent.end,
    });
  };

  const handleEventDrop = async (dropEventInfo: any) => {
    const event = dropEventInfo.event;
    const oldEvent = dropEventInfo.oldEvent;
    
    // Calculate proper end time when converting from all-day to timed event
    let newEnd;
    if (oldEvent.allDay && !event.allDay) {
      // If converting from all-day to timed event, set end time to 1 hour after start
      const startDate = new Date(event.start);
      const endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + 1);
      newEnd = endDate;
    } else {
      newEnd = event.end || event.start;
    }

    const dropInfoData = {
      event: {
        id: event.id,
        title: event.title,
        start: event.allDay ? setAllDayTimes(event.start.toISOString()) : formatDateForInput(event.start),
        end: event.allDay ? setAllDayTimes(event.start.toISOString(), true) : formatDateForInput(newEnd),
        allDay: event.allDay,
      },
      oldStart: oldEvent.allDay ? setAllDayTimes(oldEvent.start.toISOString()) : formatDateForInput(oldEvent.start),
      oldEnd: oldEvent.allDay ? setAllDayTimes(oldEvent.end?.toISOString() || oldEvent.start.toISOString(), true) : formatDateForInput(oldEvent.end || oldEvent.start),
      newStart: event.allDay ? setAllDayTimes(event.start.toISOString()) : formatDateForInput(event.start),
      newEnd: event.allDay ? setAllDayTimes(event.start.toISOString(), true) : formatDateForInput(newEnd),
      oldAllDay: oldEvent.allDay,
      newAllDay: event.allDay
    };

    setDropInfo(dropInfoData);
    setIsDropConfirmOpen(true);

    // Return false to prevent the default drop behavior
    dropEventInfo.revert();
  };

  const formatEventDateTime = (dateString: string, isAllDay: boolean) => {
    const date = new Date(dateString);
    if (isAllDay) {
      return `${date.toLocaleDateString()} All Day`;
    }
    return date.toLocaleString();
  };

  const handleConfirmDrop = async () => {
    if (!dropInfo) return;

    try {
      const response = await fetch(`/api/events/${dropInfo.event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: dropInfo.event.title,
          start_time: dropInfo.newStart,
          end_time: dropInfo.newEnd,
          all_day: dropInfo.event.allDay,
        }),
      });

      const updatedEvent = await response.json();
      const formattedEvent = {
        id: updatedEvent.id.toString(),
        title: updatedEvent.title,
        start: updatedEvent.all_day ? setAllDayTimes(updatedEvent.start_time) : formatDateForInput(new Date(updatedEvent.start_time)),
        end: updatedEvent.all_day ? setAllDayTimes(updatedEvent.end_time, true) : formatDateForInput(new Date(updatedEvent.end_time)),
        allDay: updatedEvent.all_day,
      };

      setEvents(prev => prev.map(event => 
        event.id === formattedEvent.id ? formattedEvent : event
      ));

      setIsDropConfirmOpen(false);
      setDropInfo(null);
    } catch (error) {
      console.error('Error updating event:', error);
      setErrorMessage('Failed to update event. Please try again.');
    }
  };

  const handleCancelDrop = () => {
    setIsDropConfirmOpen(false);
    setDropInfo(null);
  };

  if (!modalRoot) return null;

  return (
    <div className="calendar-container bg-light-gray p-4 rounded-lg shadow">
      {/* ... (keep existing styles) ... */}
      <style>
        {`
          /* Calendar Styles */
          .calendar-container {
            background-color: #f7f7f7;
          }
          .fc-theme-standard td, 
          .fc-theme-standard th {
            border-color: #dcdcdc;
          }
          .fc-daygrid-day {
            background-color: white;
          }
          .fc-day-today {
            background-color: #e2e6e9 !important;
          }
          .fc-button-primary {
            background-color: #357edd !important;
            border-color: #357edd !important;
          }
          .fc-event {
            background-color: #ffcc00;
            border-color: #ff9900;
          }
          
          /* Ensure all-day events stay at the top */
          .fc-timegrid-event.fc-event-all-day {
            background-color: #4a90e2;
            border-color: #357abd;
          }
          
          .fc-timegrid-axis-cushion {
            background-color: #f8f9fa;
          }

          /* Modal Styles */
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.65);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }

          .modal {
            position: relative;
            background: #1e1e1e;
            padding: 2rem;
            border-radius: 0.5rem;
            max-width: 500px;
            width: 90%;
            color: white;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.05);
          }

          .error-message {
            color: #ef4444;
            margin-bottom: 1rem;
            font-size: 0.875rem;
          }

          /* Form Styles */
          .form-input {
            width: 100%;
            padding: 0.6rem;
            margin-bottom: 1rem;
            border: 1px solid #bdbdbd;
            border-radius: 0.375rem;
            background-color: #333;
            color: white;
          }

          .form-label {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-weight: 600;
            font-size: 1rem;
            color: white;
            margin-bottom: 0.5rem;
          }

          .checkbox-label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1rem;
          }

          h2 {
            font-size: 1.75rem;
            font-weight: 600;
            color: white;
            margin-bottom: 1.5rem;
          }

          .button-group {
            display: flex;
            gap: 0.5rem;
            margin-top: 1.5rem;
          }

          .button {
            padding: 0.5rem 1rem;
            border-radius: 0.375rem;
            font-weight: 500;
            cursor: pointer;
          }

          .button-primary {
            background-color: #3b82f6;
            color: white;
          }

          .button-danger {
            background-color: #ef4444;
            color: white;
          }

          .button-secondary {
            background-color: #6b7280;
            color: white;
          }
        `}
      </style>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        editable={true}
        eventDurationEditable={true}
        selectable={true}
        events={events}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        height="auto"
        select={handleDateSelect}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        allDaySlot={true}
        allDayText="All Day"
        slotMinTime="00:00:00"
        slotMaxTime="24:00:00"
      />

      {/* Existing Modal ... */}
      <Modal 
        isOpen={isModalOpen} 
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-content">
          <h2>{selectedEvent?.id ? 'Edit Event' : 'Create Event'}</h2>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <form onSubmit={handleEventSubmit}>
            <div>
              <label className="form-label">Title:</label>
              <input
                type="text"
                value={selectedEvent?.title || ''}
                onChange={(e) =>
                  setSelectedEvent((prev) => (prev ? { ...prev, title: e.target.value } : null))
                }
                className="form-input"
                required
              />
            </div>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedEvent?.allDay || false}
                onChange={handleAllDayChange}
              />
              All Day Event
            </label>
            <div>
              <label className="form-label">Start Date:</label>
              <input
                type="datetime-local"
                value={selectedEvent?.start || ''}
                onChange={(e) =>
                  setSelectedEvent((prev) => (prev ? { ...prev, start: e.target.value } : null))
                }
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="form-label">End Date:</label>
              <input
                type="datetime-local"
                value={selectedEvent?.end || ''}
                onChange={(e) =>
                  setSelectedEvent((prev) => (prev ? { ...prev, end: e.target.value } : null))
                }
                className="form-input"
                required
              />
            </div>
            <div className="button-group">
              <button type="submit" className="button button-primary">
              {selectedEvent?.id ? 'Update Event' : 'Create Event'}
            </button>
            {selectedEvent?.id && (
              <button type="button" onClick={handleEventDelete} className="button button-danger">
                Delete Event
              </button>
            )}
            <button type="button" onClick={closeModal} className="button button-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>

    <Modal 
    isOpen={isDropConfirmOpen}
    onRequestClose={handleCancelDrop}
    className="modal"
    overlayClassName="modal-overlay"
  >
    <div className="modal-content">
      <h2>Update Event Time?</h2>
      {dropInfo && (
        <div className="mb-4">
          <p className="mb-2">Do you want to move "{dropInfo.event.title}" to the new time?</p>
          <div className="text-sm">
            <p className="mb-1">From: {formatEventDateTime(dropInfo.oldStart, dropInfo.oldAllDay)}</p>
            <p>To: {formatEventDateTime(dropInfo.newStart, dropInfo.newAllDay)}</p>
          </div>
        </div>
      )}
      <div className="button-group">
        <button
          type="button"
          onClick={handleConfirmDrop}
          className="button button-primary"
        >
          Confirm
        </button>
        <button
          type="button"
          onClick={handleCancelDrop}
          className="button button-secondary"
        >
          Cancel
        </button>
      </div>
    </div>
  </Modal>
    </div>
  );
};

export default TaskCalendar;


