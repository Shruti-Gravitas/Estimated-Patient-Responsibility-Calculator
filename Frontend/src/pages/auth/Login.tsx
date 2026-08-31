import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { loginUser } from "@/services/auth"
import { getMyPatient } from "@/services/patient"

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

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault()

    setError("")
    setLoading(true)

    try {
      // ==========================================
      // 1. LOGIN
      // ==========================================

      const response = await loginUser({
        email,
        password,
      })

      console.log("Login successful:", response)

      // ==========================================
      // 2. SAVE AUTHENTICATION DETAILS
      // ==========================================

      localStorage.setItem(
        "access_token",
        response.access_token
      )

      localStorage.setItem(
        "role",
        response.role
      )

      // ==========================================
      // 3. ADMIN
      // ==========================================

      if (response.role === "admin") {
        navigate("/admin/dashboard")
        return
      }

      // ==========================================
      // 4. PATIENT
      // ==========================================

      if (response.role === "patient") {
        try {
          // Check whether patient details already exist
          const patient = await getMyPatient()

          console.log(
            "Existing patient details:",
            patient
          )

          // Patient details exist
          navigate("/patient/dashboard")
          return

        } catch (patientError: any) {
          console.log(
            "Patient details check:",
            patientError.response?.status
          )

          // 404 means patient details don't exist yet
          if (patientError.response?.status === 404) {
            navigate("/patient")
            return
          }

          throw patientError
        }
      }

      // ==========================================
      // 5. INVALID ROLE
      // ==========================================

      localStorage.removeItem("access_token")
      localStorage.removeItem("role")

      setError("Invalid user role")

    } catch (error: any) {
      console.error("Login failed:", error)

      console.log(
        "Status:",
        error.response?.status
      )

      console.log(
        "Response:",
        error.response?.data
      )

      setError(
        error.response?.data?.detail ||
        "Login failed. Please try again."
      )

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">

        {/* Background decoration */}
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

          {/* Main message */}
          <div className="max-w-lg">

            <p className="mb-4 text-sm font-medium text-teal-400">
              SMARTER HEALTHCARE ESTIMATES
            </p>

            <h2 className="text-5xl font-bold leading-tight text-white">
              Know your healthcare
              <span className="text-teal-400">
                {" "}cost before care.
              </span>
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-slate-400">
              Get a clear estimate of your expected
              patient responsibility based on your
              insurance benefits.
            </p>

            {/* Feature cards */}
            <div className="mt-10 grid grid-cols-2 gap-4">

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">

                <div className="text-2xl mb-2">
                  ✓
                </div>

                <p className="font-medium text-white">
                  Insurance Aware
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Estimate costs using benefit information.
                </p>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">

                <div className="text-2xl mb-2">
                  ▣
                </div>

                <p className="font-medium text-white">
                  Transparent
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Understand your estimated responsibility.
                </p>

              </div>

            </div>

          </div>

          <p className="text-sm text-slate-500">
            © 2026 EPR Calculator
          </p>

        </div>
      </div>


      {/* RIGHT SIDE */}
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
              Welcome back
            </CardTitle>

            <CardDescription>
              Sign in to access your healthcare estimate.
            </CardDescription>

          </CardHeader>


          <CardContent>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* EMAIL */}
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


              {/* PASSWORD */}
              <div className="space-y-2">

                <div className="flex justify-between">

                  <Label htmlFor="password">
                    Password
                  </Label>

                  <button
                    type="button"
                    className="text-sm text-teal-600 hover:text-teal-700"
                  >
                    Forgot password?
                  </button>

                </div>

                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  className="h-11"
                  required
                />

              </div>


              {/* ERROR */}
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">

                  <p className="text-sm text-red-600">
                    {error}
                  </p>

                </div>
              )}


              {/* LOGIN */}
              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full bg-slate-950 hover:bg-slate-800"
              >
                {loading
                  ? "Signing in..."
                  : "Sign in"}
              </Button>


              {/* SIGNUP */}
              <div className="text-center text-sm text-muted-foreground">

                Don't have an account?{" "}

                <Link
                  to="/signup"
                  className="font-medium text-teal-600 hover:text-teal-700"
                >
                  Create account
                </Link>

              </div>

            </form>

          </CardContent>

        </Card>

      </div>

    </div>
  )
}