'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    avatar: 'https://github.com/shadcn.png',
  })

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [linkedAccounts, setLinkedAccounts] = useState({
    google: false,
    github: true,
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/update');
        const data = await response.json();
        
        console.log('Received user data:', data);
        
        if (response.ok) {
          setUser({
            id: data.id,
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            avatar: 'https://github.com/shadcn.png',
          });
        } else {
          console.error('Failed to fetch user:', data.error);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted!");
    
    const firstNameInput = document.getElementById('firstName') as HTMLInputElement;
    const lastNameInput = document.getElementById('lastName') as HTMLInputElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;
    
    const userData = {
      id: user.id,
      firstName: firstNameInput.value,
      lastName: lastNameInput.value,
      email: emailInput.value,
    };
    
    console.log("Sending update request with data:", userData);
  
    try {
      const response = await fetch('/api/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      const data = await response.json();
      console.log("Response received:", data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setUser(prev => ({
        ...prev,
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        email: emailInput.value,
      }));

      alert('Profile updated successfully!');

    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    
    if (!confirmed) {
      return;
    }
  
    try {
      const response = await fetch('/api/update', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: user.id }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete account');
      }
  
      // Redirect to login page using Next.js router
      router.push('/');
      
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete account. Please try again.');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentPasswordInput = document.getElementById('current-password') as HTMLInputElement;
    const newPasswordInput = document.getElementById('new-password') as HTMLInputElement;
    const confirmPasswordInput = document.getElementById('confirm-password') as HTMLInputElement;
  
    if (newPasswordInput.value !== confirmPasswordInput.value) {
      alert('New passwords do not match');
      return;
    }
  
    const passwordData = {
      id: user.id,
      currentPassword: currentPasswordInput.value,
      newPassword: newPasswordInput.value,
      type: 'password' // Add this to differentiate from profile updates
    };
  
    try {
      const response = await fetch('/api/update', {
        method: 'PUT', // Changed from POST to PUT
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update password');
      }
  
      alert('Password updated successfully!');
      // Clear the form
      currentPasswordInput.value = '';
      newPasswordInput.value = '';
      confirmPasswordInput.value = '';
  
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update password. Please try again.');
    }
  };

  const handleTwoFactorToggle = () => {
    setTwoFactorEnabled(!twoFactorEnabled)
  }

  const handleLinkedAccountToggle = (account: 'google' | 'github') => {
    setLinkedAccounts(prev => ({
      ...prev,
      [account]: !prev[account]
    }))
  }

  return (
    <div className="container mx-auto p-6 font-sans">
      <h1 className="text-3xl font-semibold mb-6">Profile Settings</h1>
      <div className="flex items-center space-x-4 mb-6">
        <Avatar className="w-20 h-20">
          <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
          <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-semibold">{user.firstName} {user.lastName}</h2>
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
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</Label>
                      <Input 
                        id="firstName" 
                        defaultValue={user.firstName} 
                        className="border-gray-300" 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</Label>
                      <Input 
                        id="lastName" 
                        defaultValue={user.lastName} 
                        className="border-gray-300" 
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      defaultValue={user.email} 
                      className="border-gray-300" 
                    />
                  </div>
                  <div className="mt-4">
                    <Button type="submit" className="custom-button">Save Changes</Button>
                  </div>
                </div>
              </form>
            </CardContent>
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
            <Label htmlFor="current-password" className="text-sm font-medium text-gray-700">
              Current Password
            </Label>
            <Input 
              id="current-password" 
              type="password" 
              required
              className="border-gray-300" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new-password" className="text-sm font-medium text-gray-700">
              New Password
            </Label>
            <Input 
              id="new-password" 
              type="password" 
              required
              className="border-gray-300" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
              Confirm New Password
            </Label>
            <Input 
              id="confirm-password" 
              type="password" 
              required
              className="border-gray-300" 
            />
          </div>
          <div className="mt-4">
            <Button type="submit" className="custom-button">
              Change Password
            </Button>
          </div>
        </div>
      </form>
      <div className="flex items-center space-x-2 mt-6">
        <Switch
          id="two-factor"
          checked={twoFactorEnabled}
          onCheckedChange={handleTwoFactorToggle}
        />
        <Label htmlFor="two-factor" className="text-sm font-medium text-gray-700">
          Enable Two-Factor Authentication
        </Label>
      </div>
      <div className="mt-6 pt-6 border-t border-gray-200">
  <div className="flex flex-col space-y-2">
    <h3 className="text-lg font-medium text-red-600">Danger Zone</h3>
    <p className="text-sm text-gray-600">
      Once you delete your account, there is no going back. Please be certain.
    </p>
    <Button 
      onClick={handleDeleteAccount}
      variant="destructive" 
      className="w-fit"
    >
      Delete Account
    </Button>
  </div>
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