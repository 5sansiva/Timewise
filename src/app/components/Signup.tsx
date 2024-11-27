// Name: Sushant Ganji (SXG220252)
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays } from "lucide-react"

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert("Passwords don't match!")
      return
    }
    
    try {
      const response = await fetch("/api/signup", {
        method: "POST", // POST method to submit data
        headers: {
          "Content-Type": "application/json", // Tell the server it's JSON
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }), // Send email and password in the request body
      });

      const result = await response.json(); // Parse the JSON response

      if (response.ok) {
        alert("Signup successful!");
      } else {
        alert(`Signup failed: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error signing up:", error);
      alert("An error occurred. Please try again.");
    }
  



    // Handle signup logic here
    console.log('Signup attempted with:', { name, email, password })
  }

  
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center items-center mb-6">
          <CalendarDays className="h-12 w-12 text-gray-700 mr-2" />
          <h1 className="text-4xl font-semibold text-gray-800">AppWise</h1>
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
                  <Label htmlFor="name">First Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Last Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
              <Button id = "sign-up" className="w-full mt-6 bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded transition duration-150 ease-in-out" type="submit">
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
          Already have an account? <a href="#" className="font-medium text-gray-700 hover:text-gray-800">Sign in</a>
        </p>
      </div>
    </div>
  )
}