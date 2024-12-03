'use client'

import Link from 'next/link';
import { Button } from "@/components/ui/button"
import { CalendarDays, MessageSquare, HelpCircle, Settings, User, Bell } from "lucide-react"

const Navbar = () => {
  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <CalendarDays className="h-8 w-8 text-gray-700 mr-2" />
            <Link href="/Home" className="flex items-center text-gray-600 hover:text-gray-800">
              <MessageSquare className="h-5 w-5 mr-1" />
              <h1 className="text-2xl font-semibold text-gray-800">TimeWise</h1>
            </Link>
            
          </div>
          
          <nav className="flex items-center space-x-6">
            <Link href="Chatbot" className="flex items-center text-gray-600 hover:text-gray-800">
              <MessageSquare className="h-5 w-5 mr-1" />
              <span>Chatbot</span>
            </Link>
            
            <Link href="HelpSupport" className="flex items-center text-gray-600 hover:text-gray-800">
              <HelpCircle className="h-5 w-5 mr-1" />
              <span>Help Support</span>
            </Link>
            
            <Link href="Notifications" className="flex items-center text-gray-600 hover:text-gray-800">
              <Bell className="h-5 w-5 mr-1" />
              <span>Notifications</span>
            </Link>
            
            <Link href="Profile" className="flex items-center text-gray-600 hover:text-gray-800">
              <User className="h-5 w-5 mr-1" />
              <span>Profile</span>
            </Link>
            
            <Link href="Settings" className="flex items-center text-gray-600 hover:text-gray-800">
              <Settings className="h-5 w-5 mr-1" />
              <span>Settings</span>
            </Link>
            
            <Link href="TaskCalendar" className="flex items-center text-gray-600 hover:text-gray-800">
              <CalendarDays className="h-5 w-5 mr-1" />
              <span>Task Calendar</span>
            </Link>
            
            <Link href="/">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-800">
                Sign Out
              </Button>
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Navbar;