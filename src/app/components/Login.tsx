"use client";
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays } from "lucide-react"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSignUpPrompt, setShowSignUpPrompt] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setShowSignUpPrompt(false)
    setIsLoading(true)

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        console.log('Login successful:', data)
        router.push('/Home')
      } else {
        if (response.status === 401 && data.message.includes('No user found')) {
          setShowSignUpPrompt(true)
          setError('Email not found.')
        } else {
          setError(data.message || 'Login failed. Please try again.')
        }
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An error occurred during login. Please try again.')
    } finally {
      setIsLoading(false)
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
            <CardTitle className="text-2xl font-semibold text-gray-800">Welcome back</CardTitle>
            <CardDescription>Sign in to access your calendar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                </div>
                {error && (
                  <div className="text-red-500 text-sm mt-2">
                    {error}
                  </div>
                )}
                {showSignUpPrompt && (
                  <Alert className="mt-4">
                    <AlertDescription>
                      This email is not registered. Would you like to{' '}
                      <Link href={`/Signup?email=${encodeURIComponent(email)}`} className="font-medium text-blue-600 hover:text-blue-800">
                        create an account
                      </Link>
                      ?
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <Button 
                className="w-full mt-6 bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded transition duration-150 ease-in-out" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-800">Forgot password?</a>
          </CardFooter>
        </Card>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/Signup" className="font-medium text-gray-700 hover:text-gray-800">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}