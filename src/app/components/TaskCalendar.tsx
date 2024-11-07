// Name: Venkat Sai Eshwar Varma Sagi (VXS210103)


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
        start: formatDateForInput(new Date(event.start_time)),
        end: formatDateForInput(new Date(event.end_time)),
      })));
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const formatDateForInput = (date: Date): string => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
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
        setEvents((prev) => [...prev, { 
          ...newEvent, 
          id: newEvent.id.toString(),
          start: formatDateForInput(new Date(newEvent.start_time)),
          end: formatDateForInput(new Date(newEvent.end_time)),
        }]);
      } else {
        setEvents((prev) =>
          prev.map((event) => (
            event.id === newEvent.id 
              ? {
                  ...newEvent,
                  start: formatDateForInput(new Date(newEvent.start_time)),
                  end: formatDateForInput(new Date(newEvent.end_time)),
                }
              : event
          ))
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

  const handleDateSelect = (selectInfo: any) => {
    const view = selectInfo.view.type;
    const startDate = new Date(selectInfo.start);
    let endDate = new Date(selectInfo.end);

    // For month view, set default times
    if (view === 'dayGridMonth') {
      startDate.setHours(9, 0, 0); // Set to 9:00 AM
      endDate = new Date(startDate);
      endDate.setHours(10, 0, 0); // Set to 10:00 AM
    } else {
      // For week/day view, set end time to 1 hour after start
      endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + 1);
    }

    openModal({
      id: '',
      title: '',
      start: formatDateForInput(startDate),
      end: formatDateForInput(endDate),
    });
  };

  const handleEventClick = (eventInfo: any) => {
    const startDate = new Date(eventInfo.event.start);
    const endDate = new Date(eventInfo.event.end);

    openModal({
      id: eventInfo.event.id,
      title: eventInfo.event.title,
      start: formatDateForInput(startDate),
      end: formatDateForInput(endDate),
    });
  };

  if (!modalRoot) return null;

  return (
    <div className="calendar-container bg-light-gray p-4 rounded-lg shadow">
      {/* Your existing styles here */}

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