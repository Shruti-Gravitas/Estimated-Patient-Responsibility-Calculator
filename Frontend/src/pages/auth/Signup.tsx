import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { registerPatient } from "@/services/auth"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Signup() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault()

    setMessage("")

    // Check password confirmation
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.")
      return
    }

    try {
      setLoading(true)

      const response = await registerPatient({
        email,
        password,
      })

      console.log("Signup successful:", response)

      setMessage(
        "Account created successfully! Redirecting to login..."
      )

      setTimeout(() => {
        navigate("/login")
      }, 1500)

    } catch (error: any) {
      console.error("Signup failed:", error)

      setMessage(
        error.response?.data?.detail ||
        "Registration failed."
      )

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">

      <Card className="w-full max-w-md shadow-lg">

        <CardHeader className="space-y-2">

          <CardTitle className="text-2xl font-bold">
            Create Account
          </CardTitle>

          <CardDescription>
            Create your EPR Calculator account
          </CardDescription>

        </CardHeader>

        <CardContent>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}
            <div className="space-y-2">

              <Label htmlFor="email">
                Email
              </Label>

              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
              />

            </div>

            {/* Password */}
            <div className="space-y-2">

              <Label htmlFor="password">
                Password
              </Label>

              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
              />

            </div>

            {/* Confirm Password */}
            <div className="space-y-2">

              <Label htmlFor="confirmPassword">
                Confirm Password
              </Label>

              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                required
              />

            </div>

            {/* Message */}
            {message && (
              <p className="text-center text-sm">
                {message}
              </p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </Button>

          </form>

        </CardContent>

      </Card>

    </div>
  )
}