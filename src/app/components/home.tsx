import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, MessageSquare, HelpCircle, Settings, User, Bell } from "lucide-react"
import Link from "next/link"

export default function home() {
  const menuItems = [
    { title: "Calendar Dashboard", icon: CalendarDays, description: "View and manage your schedule", link: "/Home/TaskCalendar" },
    { title: "AI Chatbot", icon: MessageSquare, description: "Get intelligent assistance", link: "/Home/Chatbot" },
    { title: "Help & Support", icon: HelpCircle, description: "Find answers and get help", link: "/Home/HelpSupport" },
    { title: "Settings", icon: Settings, description: "Customize your app experience", link: "/Home/Settings" },
    { title: "Profile", icon: User, description: "Manage your account details", link: "/Home/Profile" },
    { title: "Notifications", icon: Bell, description: "Stay updated with alerts", link: "/Notifications" },
  ]

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
            <div className="grid grid-cols-2 gap-4 max-w-4xl ml-8">
              {menuItems.map((item, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center space-x-3 pb-2">
                    <item.icon className="h-5 w-5 text-gray-700" />
                    <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 mb-3 text-sm">{item.description}</CardDescription>
                    <Link href={item.link}>
                      <Button className="w-full bg-gray-700 hover:bg-gray-800 text-white text-sm text-left">
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
              {/* Content will go here later */}
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