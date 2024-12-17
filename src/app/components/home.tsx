import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, MessageSquare, HelpCircle, Settings, User, Bell } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

// Define the Event type to match your calendar
type Event = {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
};

// Function to fetch events from your API
export async function fetchEvents(): Promise<Event[]> {
  try {
    const response = await fetch('/api/events');
    const data = await response.json();
    return data.map((event: any) => ({
      id: event.id.toString(),
      title: event.title,
      start: event.all_day ? setAllDayTimes(event.start_time) : formatDateForInput(new Date(event.start_time)),
      end: event.all_day ? setAllDayTimes(event.end_time, true) : formatDateForInput(new Date(event.end_time)),
      allDay: event.all_day,
    }));
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

// Helper functions from your calendar component
const formatDateForInput = (date: Date): string => {
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const setAllDayTimes = (date: string | Date, isEnd: boolean = false): string => {
  const d = new Date(date);
  d.setHours(isEnd ? 23 : 0, isEnd ? 59 : 0, 0, 0);
  return formatDateForInput(d);
};

// Function to get upcoming events within the next week
function getUpcomingEvents(events: Event[]): Event[] {
  const now = new Date();
  const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  return events
    .filter(event => {
      const eventStart = new Date(event.start);
      return eventStart >= now && eventStart <= oneWeekFromNow;
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}

export default function Home() {
  const menuItems = [
    { title: "Calendar Dashboard", icon: CalendarDays, description: "View and manage your schedule", link: "/Home/TaskCalendar" },
    { title: "AI Chatbot", icon: MessageSquare, description: "Get intelligent assistance", link: "/Home/Chatbot" },
    { title: "Help & Support", icon: HelpCircle, description: "Find answers and get help", link: "/Home/HelpSupport" },
    /*{ title: "Settings", icon: Settings, description: "Customize your app experience", link: "/Home/Settings" },*/
    { title: "Profile", icon: User, description: "Manage your account details", link: "/Home/Profile" },
    /*{ title: "Notifications", icon: Bell, description: "Stay updated with alerts", link: "/Notifications" },*/
  ]
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        setIsLoading(true);
        const allEvents = await fetchEvents();
        const upcoming = getUpcomingEvents(allEvents);
        setUpcomingEvents(upcoming);
        setError(null);
      } catch (err) {
        setError('Failed to load events');
        console.error('Error loading events:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadEvents();
  }, []);

  // Format date for display
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <CalendarDays className="h-8 w-8 text-gray-700 mr-2" />
            <h1 className="text-2xl font-semibold text-gray-800">TimeWise</h1>
          </div>
          <Link href="/">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-800">
              Sign Out
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Welcome to TimeWise</h2>
        <div className="flex">
          <div className="w-[900px]">
            <div className="grid grid-cols-2 gap-6 max-w-4xl ml-8">
              {menuItems.map((item, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow p-6">
                  <CardHeader className="flex flex-row items-center space-x-4 pb-4">
                    <item.icon className="h-8 w-8 text-gray-700" />
                    <CardTitle className="text-2xl font-semibold">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 mb-6 text-lg">{item.description}</CardDescription>
                    <Link href={item.link}>
                      <Button className="w-full bg-gray-700 hover:bg-gray-800 text-white text-lg py-6">
                        Go to {item.title}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="w-[400px] ml-24">
            <Card className="bg-white h-full p-6 shadow-sm rounded-lg">
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-y-auto h-[calc(100vh-200px)]">
                  {isLoading ? (
                    <p className="text-gray-500">Loading events...</p>
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : upcomingEvents.length === 0 ? (
                    <p className="text-gray-500">No upcoming events in the next week.</p>
                  ) : (
                    upcomingEvents.map((event) => (
                      <div key={event.id} className="mb-4 p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                        <h3 className="font-semibold text-gray-800">{event.title}</h3>
                        <p className="text-sm text-gray-600">
                          {event.allDay ? (
                            `${formatEventDate(event.start)} (All Day)`
                          ) : (
                            formatEventDate(event.start)
                          )}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          © 2024 TimeWise. All rights reserved.
        </div>
      </footer>
    </div>
  )
}