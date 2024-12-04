// Name: Sushant Ganji (SXG220252)
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays } from "lucide-react"
import LoginPage from './Login'
import Link from 'next/link';

export default function SignupPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
  
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        window.location.href = "/";
      } else {
        alert(data.error || 'Failed to create account');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while creating your account');
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center items-center mb-6">
          <CalendarDays className="h-12 w-12 text-gray-700 mr-2" />
          <h1 className="text-4xl font-semibold text-gray-800">TimeWise</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800">Create an account</CardTitle>
            <CardDescription>Sign up to start organizing your schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button id="sign-up" className="w-full mt-6 bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded transition duration-150 ease-in-out" type="submit">
                Sign Up
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              By signing up, you agree to our{' '}
              <a href="#" className="font-medium text-gray-700 hover:text-gray-800">Terms</a>
              {' '}and{' '}
              <a href="#" className="font-medium text-gray-700 hover:text-gray-800">Privacy Policy</a>
            </p>
          </CardFooter>
        </Card>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/" className="font-medium text-gray-700 hover:text-gray-800 cursor-pointer">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}