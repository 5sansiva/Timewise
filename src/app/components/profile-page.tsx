'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://github.com/shadcn.png',
  })

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [linkedAccounts, setLinkedAccounts] = useState({
    google: false,
    github: true,
  })

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement profile update logic here
    console.log('Profile updated')
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement password change logic here
    console.log('Password changed')
  }

  const handleTwoFactorToggle = () => {
    setTwoFactorEnabled(!twoFactorEnabled)
    // Implement two-factor authentication toggle logic here
  }

  const handleLinkedAccountToggle = (account: 'google' | 'github') => {
    setLinkedAccounts(prev => ({
      ...prev,
      [account]: !prev[account]
    }))
    // Implement linked account toggle logic here
  }

  return (
    <div className="container mx-auto p-6 font-sans">
      <style jsx global>{`
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        h1, h2, h3, h4, h5, h6 {
          color: #2d3748 !important;
          font-weight: 600;
        }
        .custom-button {
          background-color: #4a5568 !important;
          border-color: #4a5568 !important;
          color: white !important;
          font-weight: 500 !important;
          font-size: 0.9rem !important;
          padding: 6px 12px !important;
          text-transform: capitalize !important;
        }
        .custom-button:hover {
          background-color: #2d3748 !important;
          border-color: #2d3748 !important;
        }
      `}</style>
      <h1 className="text-3xl font-semibold mb-6">Profile Settings</h1>
      <div className="flex items-center space-x-4 mb-6">
        <Avatar className="w-20 h-20">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-semibold">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>
      <Tabs defaultValue="account" className="space-y-4">
        <TabsList className="border-b border-gray-300">
          <TabsTrigger value="account" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">Account</TabsTrigger>
          <TabsTrigger value="security" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">Security</TabsTrigger>
          <TabsTrigger value="linked-accounts" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">Linked Accounts</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card className="border border-gray-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Account Information</CardTitle>
              <CardDescription className="text-gray-600">Update your account details here.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name</Label>
                    <Input id="name" defaultValue={user.name} className="border-gray-300" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                    <Input id="email" type="email" defaultValue={user.email} className="border-gray-300" />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="custom-button">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="security">
          <Card className="border border-gray-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Security Settings</CardTitle>
              <CardDescription className="text-gray-600">Manage your account security here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handlePasswordChange}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="current-password" className="text-sm font-medium text-gray-700">Current Password</Label>
                    <Input id="current-password" type="password" className="border-gray-300" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-password" className="text-sm font-medium text-gray-700">New Password</Label>
                    <Input id="new-password" type="password" className="border-gray-300" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" className="border-gray-300" />
                  </div>
                </div>
                <Button type="submit" className="custom-button mt-4">Change Password</Button>
              </form>
              <div className="flex items-center space-x-2">
                <Switch
                  id="two-factor"
                  checked={twoFactorEnabled}
                  onCheckedChange={handleTwoFactorToggle}
                />
                <Label htmlFor="two-factor" className="text-sm font-medium text-gray-700">Enable Two-Factor Authentication</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="linked-accounts">
          <Card className="border border-gray-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Linked Accounts</CardTitle>
              <CardDescription className="text-gray-600">Manage your linked accounts here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  <Label htmlFor="google" className="text-sm font-medium text-gray-700">Google</Label>
                </div>
                <Switch
                  id="google"
                  checked={linkedAccounts.google}
                  onCheckedChange={() => handleLinkedAccountToggle('google')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                  <Label htmlFor="github" className="text-sm font-medium text-gray-700">GitHub</Label>
                </div>
                <Switch
                  id="github"
                  checked={linkedAccounts.github}
                  onCheckedChange={() => handleLinkedAccountToggle('github')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}