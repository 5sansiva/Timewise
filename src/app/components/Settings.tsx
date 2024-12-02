'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function SettingsPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newsletter, setNewsletter] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement save logic here (e.g., API call to update user settings)
    alert('Settings saved successfully!');
  };

  return (
    <div className="container mx-auto p-6 font-sans">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800">Settings</h1>
      
      <form onSubmit={handleSave}>
        <div className="space-y-6">
          {/* Profile Section */}
          <Card className="border border-gray-300 shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Account Information</CardTitle>
              <CardDescription>Update your account details below.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {/* Avatar Section */}
                <div className="flex justify-start items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="https://placekitten.com/200/200" alt="User Avatar" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-lg font-medium text-gray-700">John Doe</h2>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="text-sm text-blue-500 hover:underline">
                          Change picture
                        </TooltipTrigger>
                        <TooltipContent>
                          Change your profile picture
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {/* Username Input */}
                <div className="grid gap-2">
                  <Label htmlFor="username" className="text-sm font-medium text-gray-700">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="border-gray-300 focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your username"
                  />
                </div>

                {/* Email Input */}
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-gray-300 focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Password Input */}
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-gray-300 focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password (Leave blank to keep current)"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Newsletter Section */}
          <Card className="border border-gray-300 shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Newsletter</CardTitle>
              <CardDescription>Choose whether to receive our newsletter.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Switch
                  id="newsletter"
                  checked={newsletter}
                  onCheckedChange={(checked) => setNewsletter(checked)}
                />
                <Label htmlFor="newsletter" className="text-sm font-medium text-gray-700">Subscribe to newsletter</Label>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <CardFooter>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-lg transition duration-150 ease-in-out">
              Save Settings
            </Button>
          </CardFooter>
        </div>
      </form>
    </div>
  );
}

