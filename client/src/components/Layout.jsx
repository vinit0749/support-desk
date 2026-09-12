import { Link, Outlet, useLocation } from "react-router-dom";
import { Plus, Ticket } from "lucide-react";

function Layout() {
  const location = useLocation();

  const isDashboard = location.pathname === "/";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Ticket size={19} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">SupportDesk</h1>
              <p className="hidden text-xs text-slate-500 sm:block">
                Customer support management
              </p>
            </div>
          </Link>

          <Link
            to="/tickets/new"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <Plus size={17} />
            <span>New Ticket</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {!isDashboard && (
          <Link
            to="/"
            className="mb-6 inline-flex items-center text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            ← Back to tickets
          </Link>
        )}

        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
