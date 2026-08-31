import { NavLink, Outlet, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"

export default function AdminLayout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("role")

    navigate("/login")
  }

  const navItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: "📊",
    },
    {
      label: "Patients",
      path: "/admin/patients",
      icon: "👥",
    },
    {
      label: "Eligibility Check",
      path: "/admin/eligibility",
      icon: "🔍",
    },
    {
      label: "Insurance Benefits",
      path: "/admin/benefits",
      icon: "💳",
    },
    {
      label: "EPR Calculator",
      path: "/admin/epr",
      icon: "🧮",
    },
    {
      label: "Estimates",
      path: "/admin/estimates",
      icon: "📋",
    },
    {
      label: "Settings",
      path: "/admin/settings",
      icon: "⚙️",
    },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <aside className="hidden w-64 flex-col border-r bg-slate-950 text-white md:flex">

        {/* Logo */}
        <div className="border-b border-white/10 px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-400 text-lg font-bold text-slate-950">
              E
            </div>

            <div>

              <h1 className="font-semibold">
                EPR Care
              </h1>

              <p className="text-xs text-slate-400">
                Admin Portal
              </p>

            </div>

          </div>

        </div>


        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-6">

          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Main
          </p>

          {navItems.slice(0, 2).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  isActive
                    ? "bg-teal-400 text-slate-950 font-medium"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <span>
                {item.icon}
              </span>

              {item.label}
            </NavLink>
          ))}


          <p className="mb-3 mt-7 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Insurance
          </p>

          {navItems.slice(2, 4).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  isActive
                    ? "bg-teal-400 text-slate-950 font-medium"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <span>
                {item.icon}
              </span>

              {item.label}
            </NavLink>
          ))}


          <p className="mb-3 mt-7 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            EPR
          </p>

          {navItems.slice(4, 6).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  isActive
                    ? "bg-teal-400 text-slate-950 font-medium"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <span>
                {item.icon}
              </span>

              {item.label}
            </NavLink>
          ))}


          <p className="mb-3 mt-7 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            System
          </p>

          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                isActive
                  ? "bg-teal-400 text-slate-950 font-medium"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <span>⚙️</span>
            Settings
          </NavLink>

        </nav>


        {/* Logout */}
        <div className="border-t border-white/10 p-4">

          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-3 text-slate-300 hover:bg-red-500/10 hover:text-red-400"
          >
            🚪
            Logout
          </Button>

        </div>

      </aside>


      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <div className="flex min-w-0 flex-1 flex-col">

        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">

          <div>

            <p className="text-xs text-slate-500">
              Admin Portal
            </p>

            <h2 className="font-semibold text-slate-900">
              EPR Care
            </h2>

          </div>


          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-medium text-white">
              A
            </div>

            <div className="hidden sm:block">

              <p className="text-sm font-medium">
                Administrator
              </p>

              <p className="text-xs text-slate-500">
                Admin
              </p>

            </div>

          </div>

        </header>


        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8">

          <Outlet />

        </main>

      </div>

    </div>
  )
}