// TaskCalendar.tsx

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
}

const TaskCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

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

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
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

  const openModal = (event: CalendarEvent | null) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  const handleEventSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const method = selectedEvent?.id ? 'PUT' : 'POST';
    const url = selectedEvent?.id ? `/api/events/${selectedEvent.id}` : '/api/events/create';
    const body = JSON.stringify({
      title: selectedEvent?.title,
      start_time: selectedEvent?.start,
      end_time: selectedEvent?.end,
    });

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      const newEvent = await response.json();
      if (method === 'POST') {
        setEvents((prev) => [...prev, { ...newEvent, id: newEvent.id.toString() }]);
      } else {
        setEvents((prev) =>
          prev.map((event) => (event.id === newEvent.id ? newEvent : event))
        );
      }
      closeModal();
    } catch (error) {
      console.error('Error saving event:', error);
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
      }
    }
  };

  if (!modalRoot) return null;

  return (
    <div className="calendar-container bg-light-gray p-4 rounded-lg shadow">
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

          .modal-content {
            width: 100%;
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
        select={(selectInfo) => {
          openModal({
            id: '',
            title: '',
            start: selectInfo.startStr,
            end: selectInfo.endStr,
          });
        }}
        eventClick={(eventInfo) => {
          openModal({
            id: eventInfo.event.id,
            title: eventInfo.event.title,
            start: eventInfo.event.startStr,
            end: eventInfo.event.endStr,
          });
        }}
      />

      <Modal 
        isOpen={isModalOpen} 
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-content">
          <h2>{selectedEvent?.id ? 'Edit Event' : 'Create Event'}</h2>
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
    </div>
  );
};

export default TaskCalendar;
