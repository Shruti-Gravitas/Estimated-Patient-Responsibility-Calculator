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
import PatientDetails from "@/pages/admin/PatientDetails"
import AdminLayout from "@/pages/admin/AdminLayout"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==================================================
            Authentication
        ================================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />


        {/* ==================================================
            Patient
        ================================================== */}

        <Route
          path="/patient/dashboard"
          element={<PatientDashboard />}
        />

        <Route
          path="/patient"
          element={<PatientForm />}
        />


        {/* ==================================================
            Admin
        ================================================== */}

        <Route
          path="/admin"
          element={<AdminLayout />}
        >

          {/* Admin Dashboard */}
          <Route
            path="dashboard"
            element={<AdminDashboard />}
          />


          {/* Patient List */}
          <Route
            path="patients"
            element={<PatientList />}
          />


          {/* Patient Details */}
          <Route
            path="patients/:patientId"
            element={<PatientDetails />}
          />


          {/* Eligibility */}
          <Route
            path="eligibility"
            element={
              <div>
                Eligibility Check
              </div>
            }
          />


          {/* Insurance Benefits */}
          <Route
            path="benefits"
            element={
              <div>
                Insurance Benefits
              </div>
            }
          />


          {/* EPR Calculator */}
          <Route
            path="epr"
            element={
              <div>
                EPR Calculator
              </div>
            }
          />


          {/* Estimates */}
          <Route
            path="estimates"
            element={
              <div>
                Estimates
              </div>
            }
          />


          {/* Settings */}
          <Route
            path="settings"
            element={
              <div>
                Settings
              </div>
            }
          />

        </Route>


        {/* ==================================================
            Unknown Route
        ================================================== */}

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