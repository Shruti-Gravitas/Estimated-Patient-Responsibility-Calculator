import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
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
    <div className="min-h-screen bg-slate-950 flex">

      {/* ==================================================
          LEFT SIDE
      ================================================== */}

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 via-slate-950 to-blue-500/20" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">

          {/* Logo */}
          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-400 text-slate-950 font-bold text-xl">
                E
              </div>

              <div>

                <h1 className="text-xl font-semibold text-white">
                  EPR Calculator
                </h1>

                <p className="text-xs text-slate-400">
                  Healthcare Cost Estimation
                </p>

              </div>

            </div>

          </div>


          {/* Main Content */}
          <div className="max-w-lg">

            <p className="mb-4 text-sm font-medium text-teal-400">
              GET STARTED WITH EPR CARE
            </p>

            <h2 className="text-5xl font-bold leading-tight text-white">

              Understand your healthcare
              <span className="text-teal-400">
                {" "}costs with confidence.
              </span>

            </h2>

            <p className="mt-6 text-lg leading-relaxed text-slate-400">
              Create your account and get access to a
              secure patient portal designed to help you
              understand your estimated healthcare
              responsibility.
            </p>


            {/* Feature Cards */}
            <div className="mt-10 grid grid-cols-2 gap-4">

              {/* Feature 1 */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">

                <div className="mb-3 text-2xl">
                  ✓
                </div>

                <p className="font-medium text-white">
                  Secure Account
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Your account is protected with secure
                  authentication.
                </p>

              </div>


              {/* Feature 2 */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">

                <div className="mb-3 text-2xl">
                  $
                </div>

                <p className="font-medium text-white">
                  Cost Transparency
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Understand your expected healthcare
                  responsibility.
                </p>

              </div>

            </div>

          </div>


          {/* Footer */}
          <p className="text-sm text-slate-500">
            © 2026 EPR Calculator
          </p>

        </div>

      </div>


      {/* ==================================================
          RIGHT SIDE
      ================================================== */}

      <div className="flex w-full lg:w-1/2 items-center justify-center bg-slate-50 p-6">

        <Card className="w-full max-w-md border-0 shadow-2xl">

          <CardHeader className="space-y-3">

            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-3 mb-6">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white font-bold">
                E
              </div>

              <div>

                <h1 className="font-semibold">
                  EPR Calculator
                </h1>

                <p className="text-xs text-muted-foreground">
                  Healthcare Cost Estimation
                </p>

              </div>

            </div>


            <CardTitle className="text-3xl font-bold">
              Create your account
            </CardTitle>

            <CardDescription>
              Join EPR Care to manage your healthcare
              information.
            </CardDescription>

          </CardHeader>


          <CardContent>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* ==================================================
                  EMAIL
              ================================================== */}

              <div className="space-y-2">

                <Label htmlFor="email">
                  Email address
                </Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  className="h-11"
                  required
                />

              </div>


              {/* ==================================================
                  PASSWORD
              ================================================== */}

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
                  className="h-11"
                  required
                />

              </div>


              {/* ==================================================
                  CONFIRM PASSWORD
              ================================================== */}

              <div className="space-y-2">

                <Label htmlFor="confirmPassword">
                  Confirm password
                </Label>

                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  className="h-11"
                  required
                />

              </div>


              {/* ==================================================
                  PASSWORD MATCH INDICATOR
              ================================================== */}

              {confirmPassword && (
                <div>

                  {password === confirmPassword ? (

                    <p className="text-sm text-teal-600">
                      ✓ Passwords match
                    </p>

                  ) : (

                    <p className="text-sm text-red-500">
                      Passwords do not match
                    </p>

                  )}

                </div>
              )}


              {/* ==================================================
                  MESSAGE
              ================================================== */}

              {message && (
                <div
                  className={`rounded-lg border p-3 ${
                    message.includes(
                      "successfully"
                    )
                      ? "border-teal-200 bg-teal-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >

                  <p
                    className={`text-sm ${
                      message.includes(
                        "successfully"
                      )
                        ? "text-teal-700"
                        : "text-red-600"
                    }`}
                  >
                    {message}
                  </p>

                </div>
              )}


              {/* ==================================================
                  CREATE ACCOUNT
              ================================================== */}

              <Button
                type="submit"
                disabled={
                  loading ||
                  password !== confirmPassword
                }
                className="h-11 w-full bg-slate-950 hover:bg-slate-800"
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </Button>


              {/* ==================================================
                  LOGIN LINK
              ================================================== */}

              <div className="text-center text-sm text-muted-foreground">

                Already have an account?{" "}

                <Link
                  to="/login"
                  className="font-medium text-teal-600 hover:text-teal-700"
                >
                  Sign in
                </Link>

              </div>

            </form>

          </CardContent>

        </Card>

      </div>

    </div>
  )
}