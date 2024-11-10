// Name: Sushant Ganji (SXG220252)
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, MessageSquare, HelpCircle, Settings, User, Bell } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const menuItems = [
    { title: "Calendar Dashboard", icon: CalendarDays, description: "View and manage your schedule", link: "/components/TaskCalender" },
    { title: "AI Chatbot", icon: MessageSquare, description: "Get intelligent assistance", link: "/components/Chatbot" },
    { title: "Help & Support", icon: HelpCircle, description: "Find answers and get help", link: "/components/HelpSupport" },
    { title: "Settings", icon: Settings, description: "Customize your app experience", link: "/settings" },
    { title: "Profile", icon: User, description: "Manage your account details", link: "/components/Profile" },
    { title: "Notifications", icon: Bell, description: "Stay updated with alerts", link: "/components/Notifications" },
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <CalendarDays className="h-8 w-8 text-gray-700 mr-2" />
            <h1 className="text-2xl font-semibold text-gray-800">AppWise</h1>
          </div>
          <Button variant="ghost" className="text-gray-600 hover:text-gray-800">
            Sign Out
          </Button>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Welcome to AppWise</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <item.icon className="h-8 w-8 text-gray-700" />
                <CardTitle className="text-xl font-semibold">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 mb-4">{item.description}</CardDescription>
                <Link href={item.link} passHref>
                  <Button className="w-full bg-gray-700 hover:bg-gray-800 text-white">
                    Go to {item.title}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          © 2024 AppWise. All rights reserved.
        </div>
      </footer>
    </div>
  )
}