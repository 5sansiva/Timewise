// Name: Sushant Ganji (SXG220252)
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle password reset logic here
    console.log('Password reset requested for:', email)
    setIsSubmitted(true)
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
            <CardTitle className="text-2xl font-semibold text-gray-800">Forgot Password</CardTitle>
            <CardDescription>Enter your email to reset your password</CardDescription>
          </CardHeader>
          <CardContent>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
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
                </div>
                <Button className="w-full mt-6 bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded transition duration-150 ease-in-out" type="submit">
                  Reset Password
                </Button>
              </form>
            ) : (
              <Alert>
                <AlertTitle>Check your email</AlertTitle>
                <AlertDescription>
                  We've sent a password reset link to {email}. Please check your inbox and follow the instructions to reset your password.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-800 flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sign In
            </a>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}