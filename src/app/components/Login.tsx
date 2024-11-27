// Name: Sushant Ganji (SXG220252)
"use client";
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays } from "lucide-react"
import Link from 'next/link'
import { useRouter } from 'next/navigation'


export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isValidLogin, setIsValidLogin] = useState(false);
  const router = useRouter();


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const exampleEmail = "swe@gmail.com";
    const validPassword = "swe3354";

    if (email === exampleEmail && password === validPassword) {
      setIsValidLogin(true);
      router.push("/Home");
    } 
    
    else {
      alert("Invalid email or password. Please try again.");
    }

    console.log('Login attempted with:', email, password);
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
              </div>
              <Button className="w-full mt-6 bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded transition duration-150 ease-in-out" type="submit">
                Sign In
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
