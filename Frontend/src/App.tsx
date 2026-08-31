import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom"

import Login from "@/pages/auth/Login"
import Signup from "@/pages/auth/Signup"

import PatientDashboard from "@/pages/patient/PatientDashboard"
import PatientForm from "@/pages/patient/PatientForm"

import AdminDashboard from "@/pages/admin/AdminDashboard"
import PatientList from "@/pages/admin/PatientList"
import AdminLayout from "./pages/admin/AdminLayout"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* Patient */}
        <Route
          path="/patient/dashboard"
          element={<PatientDashboard />}
        />

        <Route
          path="/patient"
          element={<PatientForm />}
        />

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>

          <Route
            path="dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="patients"
            element={<PatientList />}
          />

          <Route
            path="eligibility"
            element={
              <div>
                Eligibility Check
              </div>
            }
          />

          <Route
            path="benefits"
            element={
              <div>
                Insurance Benefits
              </div>
            }
          />

          <Route
            path="epr"
            element={
              <div>
                EPR Calculator
              </div>
            }
          />

          <Route
            path="estimates"
            element={
              <div>
                Estimates
              </div>
            }
          />

          <Route
            path="settings"
            element={
              <div>
                Settings
              </div>
            }
          />

        </Route>

        <Route
          path="/admin/patients"
          element={<PatientList />}
        />

        {/* Unknown route */}
        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App