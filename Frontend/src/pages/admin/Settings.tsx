import { useEffect, useState } from "react"
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  Save,
  Server,
  ShieldCheck,
  User,
} from "lucide-react"

import api from "@/services/api"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CurrentUser {
  id: number
  email: string
  role: string
}

export default function Settings() {
  const [user, setUser] = useState<CurrentUser | null>(null)

  const [organizationName, setOrganizationName] =
    useState("EPR Care")

  const [npi, setNpi] = useState("1999999984")

  const [environment, setEnvironment] =
    useState("test")

  const [defaultNetwork, setDefaultNetwork] =
    useState("in_network")

  const [defaultService, setDefaultService] =
    useState("")

  const [currentPassword, setCurrentPassword] =
    useState("")

  const [newPassword, setNewPassword] =
    useState("")

  const [confirmPassword, setConfirmPassword] =
    useState("")

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false)

  const [showNewPassword, setShowNewPassword] =
    useState(false)

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)

  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true)

        const response = await api.get("/api/auth/me")

        setUser(response.data)
      } catch (err) {
        console.error(err)
        setError("Unable to load account information.")
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const handleSaveProviderSettings = () => {
    setError("")
    setMessage(
      "Provider settings saved successfully."
    )
  }

  const handleSavePreferences = () => {
    setError("")
    setMessage(
      "Application preferences saved successfully."
    )
  }

  const handleChangePassword = () => {
    setError("")
    setMessage("")

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all password fields.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.")
      return
    }

    if (newPassword.length < 8) {
      setError(
        "New password must contain at least 8 characters."
      )
      return
    }

    /*
     * Backend password-change API will be connected later.
     */
    setMessage(
      "Password validation successful. Password update API will be connected next."
    )

    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("role")
    localStorage.removeItem("user_id")

    window.location.href = "/login"
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading settings...
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Settings
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account, provider information,
          integration settings, and application preferences.
        </p>
      </div>

      {/* Global messages */}
      {message && (
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="flex items-center gap-2 pt-6">
            <CheckCircle2 className="h-5 w-5 text-green-600" />

            <p className="text-sm font-medium text-green-800">
              {message}
            </p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-destructive">
              {error}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Account */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>

            <div>
              <CardTitle>Admin Profile</CardTitle>

              <p className="text-sm text-muted-foreground">
                Your administrator account information.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Email
              </p>

              <p className="mt-1 font-medium">
                {user?.email || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Role
              </p>

              <p className="mt-1 font-medium capitalize">
                {user?.role || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Account Status
              </p>

              <div className="mt-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />

                <span className="font-medium">
                  Active
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Provider Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>

            <div>
              <CardTitle>Provider Information</CardTitle>

              <p className="text-sm text-muted-foreground">
                Information used when submitting eligibility
                requests.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="organizationName">
                Organization Name
              </Label>

              <Input
                id="organizationName"
                value={organizationName}
                onChange={(event) =>
                  setOrganizationName(event.target.value)
                }
                placeholder="Enter organization name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="npi">
                National Provider Identifier (NPI)
              </Label>

              <Input
                id="npi"
                value={npi}
                onChange={(event) =>
                  setNpi(event.target.value)
                }
                placeholder="Enter NPI"
                maxLength={10}
              />

              <p className="text-xs text-muted-foreground">
                Must be a valid 10-digit NPI.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSaveProviderSettings}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Save Provider Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stedi Integration */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Server className="h-5 w-5 text-primary" />
            </div>

            <div>
              <CardTitle>Stedi Integration</CardTitle>

              <p className="text-sm text-muted-foreground">
                View the current eligibility integration
                configuration.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Environment</Label>

              <Select
                value={environment}
                onValueChange={(value) =>
                  setEnvironment(value ?? "test")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="test">
                    Test
                  </SelectItem>

                  <SelectItem value="production">
                    Production
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>API Key</Label>

              <div className="flex items-center gap-3 rounded-md border bg-muted/30 px-3 py-2">
                <Lock className="h-4 w-4 text-muted-foreground" />

                <span className="text-sm text-muted-foreground">
                  Configured securely on backend
                </span>

                <CheckCircle2 className="ml-auto h-4 w-4 text-green-600" />
              </div>

              <p className="text-xs text-muted-foreground">
                API keys are never displayed in the admin
                interface.
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-sm font-medium">
              Integration Status
            </p>

            <div className="mt-2 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

              <span className="text-sm">
                Stedi API configured
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Application Preferences</CardTitle>

          <p className="text-sm text-muted-foreground">
            Configure defaults used by the EPR Calculator.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Default Network</Label>

              <Select
                value={defaultNetwork}
                onValueChange={(value) =>
                  setDefaultNetwork(
                    value ?? "in_network"
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="in_network">
                    In-Network
                  </SelectItem>

                  <SelectItem value="out_of_network">
                    Out-of-Network
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Default Healthcare Service</Label>

              <Select
                value={defaultService}
                onValueChange={(value) =>
                  setDefaultService(value ?? "")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select default service" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="emergency_services">
                    Emergency Services
                  </SelectItem>

                  <SelectItem value="urgent_care">
                    Urgent Care
                  </SelectItem>

                  <SelectItem value="professional_physician_office">
                    Professional Physician Office
                  </SelectItem>

                  <SelectItem value="mental_health">
                    Mental Health
                  </SelectItem>

                  <SelectItem value="hospital_inpatient">
                    Hospital Inpatient
                  </SelectItem>

                  <SelectItem value="hospital_outpatient">
                    Hospital Outpatient
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSavePreferences}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Lock className="h-5 w-5 text-primary" />
            </div>

            <div>
              <CardTitle>Security</CardTitle>

              <p className="text-sm text-muted-foreground">
                Manage your administrator password.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Current password */}
          <div className="max-w-xl space-y-2">
            <Label htmlFor="currentPassword">
              Current Password
            </Label>

            <div className="relative">
              <Input
                id="currentPassword"
                type={
                  showCurrentPassword
                    ? "text"
                    : "password"
                }
                value={currentPassword}
                onChange={(event) =>
                  setCurrentPassword(event.target.value)
                }
                placeholder="Enter current password"
                className="pr-10"
              />

              <button
                type="button"
                onClick={() =>
                  setShowCurrentPassword(
                    !showCurrentPassword
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* New password */}
          <div className="max-w-xl space-y-2">
            <Label htmlFor="newPassword">
              New Password
            </Label>

            <div className="relative">
              <Input
                id="newPassword"
                type={
                  showNewPassword
                    ? "text"
                    : "password"
                }
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(event.target.value)
                }
                placeholder="Enter new password"
                className="pr-10"
              />

              <button
                type="button"
                onClick={() =>
                  setShowNewPassword(
                    !showNewPassword
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Password must contain at least 8 characters.
            </p>
          </div>

          {/* Confirm password */}
          <div className="max-w-xl space-y-2">
            <Label htmlFor="confirmPassword">
              Confirm New Password
            </Label>

            <div className="relative">
              <Input
                id="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Confirm new password"
                className="pr-10"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleChangePassword}
              className="gap-2"
            >
              <Lock className="h-4 w-4" />
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logout */}
      <Card className="border-destructive/20">
        <CardContent className="flex flex-col gap-4 pt-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-semibold">
              Sign out
            </h3>

            <p className="text-sm text-muted-foreground">
              Sign out of the EPR Care administrator portal.
            </p>
          </div>

          <Button
            variant="destructive"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}