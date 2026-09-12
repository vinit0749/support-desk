import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { getTickets, updateTicket } from "../services/api";

const statusStyles = {
  Open: "bg-blue-50 text-blue-700 ring-blue-600/10",
  "In Progress": "bg-amber-50 text-amber-700 ring-amber-600/10",
  Closed: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
};

const statusDotStyles = {
  Open: "bg-blue-500",
  "In Progress": "bg-amber-500",
  Closed: "bg-emerald-500",
};

const priorityStyles = {
  Low: "bg-slate-50 text-slate-600 ring-slate-500/10",
  Medium: "bg-blue-50 text-blue-700 ring-blue-600/10",
  High: "bg-amber-50 text-amber-700 ring-amber-600/10",
  Urgent: "bg-red-50 text-red-700 ring-red-600/10",
};

const priorityDotStyles = {
  Low: "bg-slate-400",
  Medium: "bg-blue-500",
  High: "bg-amber-500",
  Urgent: "bg-red-500",
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

function StatusSelect({ ticket, updating, onChange }) {
  return (
    <div className="relative inline-flex">
      <span
        className={`pointer-events-none absolute left-2.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full ${
          statusDotStyles[ticket.status]
        }`}
      />

      <select
        value={ticket.status}
        onChange={(event) => onChange(ticket.ticket_id, event.target.value)}
        disabled={updating}
        onClick={(event) => event.stopPropagation()}
        className={`appearance-none rounded-full py-1.5 pl-5 pr-7 text-xs font-medium ring-1 ring-inset outline-none transition focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-60 ${
          statusStyles[ticket.status]
        }`}
        aria-label={`Change status for ${ticket.ticket_id}`}
      >
        <option value="Open">Open</option>
        <option value="In Progress">In Progress</option>
        <option value="Closed">Closed</option>
      </select>

      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] opacity-50">
        ▼
      </span>
    </div>
  );
}

function PrioritySelect({ ticket, updating, onChange }) {
  const currentPriority = ticket.priority || "Medium";

  return (
    <div className="relative inline-flex">
      <span
        className={`pointer-events-none absolute left-2.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full ${
          priorityDotStyles[currentPriority]
        }`}
      />

      <select
        value={currentPriority}
        onChange={(event) => onChange(ticket.ticket_id, event.target.value)}
        disabled={updating}
        onClick={(event) => event.stopPropagation()}
        className={`appearance-none rounded-full py-1.5 pl-5 pr-7 text-xs font-medium ring-1 ring-inset outline-none transition focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-60 ${
          priorityStyles[currentPriority]
        }`}
        aria-label={`Change priority for ${ticket.ticket_id}`}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Urgent">Urgent</option>
      </select>

      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] opacity-50">
        ▼
      </span>
    </div>
  );
}

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = [];

  const startPage = Math.max(1, page - 2);
  const endPage = Math.min(totalPages, page + 2);

  for (let pageNumber = startPage; pageNumber <= endPage; pageNumber += 1) {
    pages.push(pageNumber);
  }

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ArrowLeft size={15} />
        Previous
      </button>

      <div className="flex items-center justify-center gap-1">
        {startPage > 1 && (
          <>
            <button
              type="button"
              onClick={() => onPageChange(1)}
              className="h-8 min-w-8 rounded-lg px-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              1
            </button>

            {startPage > 2 && (
              <span className="px-1 text-sm text-slate-400">...</span>
            )}
          </>
        )}

        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            className={`h-8 min-w-8 rounded-lg px-2 text-sm font-medium transition ${
              pageNumber === page
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {pageNumber}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-1 text-sm text-slate-400">...</span>
            )}

            <button
              type="button"
              onClick={() => onPageChange(totalPages)}
              className="h-8 min-w-8 rounded-lg px-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
        <ArrowRight size={15} />
      </button>
    </div>
  );
}

function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [updatingTicketId, setUpdatingTicketId] = useState(null);
  const [error, setError] = useState("");

  const limit = 10;

  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getTickets({
          status,
          priority,
          search,
          page,
          limit,
          sort,
        });

        setTickets(data.tickets);
        setPagination(data.pagination);

        if (data.pagination.page !== page) {
          setPage(data.pagination.page);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, [status, priority, search, page, sort]);

  const handleStatusChange = async (ticketId, newStatus) => {
    const previousStatus = tickets.find(
      (ticket) => ticket.ticket_id === ticketId,
    )?.status;

    try {
      setUpdatingTicketId(ticketId);
      setError("");

      setTickets((current) =>
        current.map((ticket) =>
          ticket.ticket_id === ticketId
            ? { ...ticket, status: newStatus }
            : ticket,
        ),
      );

      await updateTicket(ticketId, {
        status: newStatus,
      });

      if (status && newStatus !== status) {
        if (tickets.length === 1 && page > 1) {
          setPage((current) => current - 1);
        } else {
          const data = await getTickets({
            status,
            priority,
            search,
            page,
            limit,
            sort,
          });

          setTickets(data.tickets);
          setPagination(data.pagination);
        }
      }
    } catch (err) {
      setTickets((current) =>
        current.map((ticket) =>
          ticket.ticket_id === ticketId
            ? { ...ticket, status: previousStatus }
            : ticket,
        ),
      );

      setError(err.message);
    } finally {
      setUpdatingTicketId(null);
    }
  };

  const handlePriorityChange = async (ticketId, newPriority) => {
    const previousPriority = tickets.find(
      (ticket) => ticket.ticket_id === ticketId,
    )?.priority;

    try {
      setUpdatingTicketId(ticketId);
      setError("");

      setTickets((current) =>
        current.map((ticket) =>
          ticket.ticket_id === ticketId
            ? { ...ticket, priority: newPriority }
            : ticket,
        ),
      );

      await updateTicket(ticketId, {
        priority: newPriority,
      });

      if (priority && newPriority !== priority) {
        if (tickets.length === 1 && page > 1) {
          setPage((current) => current - 1);
        } else {
          const data = await getTickets({
            status,
            priority,
            search,
            page,
            limit,
            sort,
          });

          setTickets(data.tickets);
          setPagination(data.pagination);
        }
      }
    } catch (err) {
      setTickets((current) =>
        current.map((ticket) =>
          ticket.ticket_id === ticketId
            ? { ...ticket, priority: previousPriority }
            : ticket,
        ),
      );

      setError(err.message);
    } finally {
      setUpdatingTicketId(null);
    }
  };

  const handleReset = () => {
    setSearch("");
    setStatus("");
    setPriority("");
    setSort("newest");
    setPage(1);
  };

  const handleStatusFilterChange = (value) => {
    setStatus(value);
    setPage(1);
  };

  const handlePriorityFilterChange = (value) => {
    setPriority(value);
    setPage(1);
  };

  const handleSortChange = (value) => {
    setSort(value);
    setPage(1);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const firstTicket =
    pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;

  const lastTicket = Math.min(
    pagination.page * pagination.limit,
    pagination.total,
  );

  return (
    <section>
      <div className="mb-6 sm:mb-7">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Tickets
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Manage and resolve customer support requests.
        </p>
      </div>

      <div className="mb-5 flex flex-col gap-2 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search tickets..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>

        <div className="relative sm:w-40">
          <SlidersHorizontal
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <select
            value={status}
            onChange={(event) => handleStatusFilterChange(event.target.value)}
            className={`w-full cursor-pointer appearance-none rounded-lg border bg-white py-2.5 pl-10 pr-9 text-sm font-medium outline-none transition hover:border-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 ${
              status
                ? "border-slate-300 text-slate-900"
                : "border-slate-200 text-slate-600"
            }`}
          >
            <option value="">All statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>

          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
            ▼
          </span>
        </div>

        <div className="relative sm:w-40">
          <select
            value={priority}
            onChange={(event) => handlePriorityFilterChange(event.target.value)}
            className={`w-full cursor-pointer appearance-none rounded-lg border bg-white px-3.5 py-2.5 pr-9 text-sm font-medium outline-none transition hover:border-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 ${
              priority
                ? "border-slate-300 text-slate-900"
                : "border-slate-200 text-slate-600"
            }`}
          >
            <option value="">All priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>

          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
            ▼
          </span>
        </div>

        <div className="relative sm:w-36">
          <select
            value={sort}
            onChange={(event) => handleSortChange(event.target.value)}
            className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 pr-9 text-sm font-medium text-slate-600 outline-none transition hover:border-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>

          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
            ▼
          </span>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-100"
        >
          <RotateCcw size={15} />
          <span>Reset</span>
        </button>
      </div>

      {error && (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <span className="text-sm text-red-600">{error}</span>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3.5 sm:px-5 sm:py-4">
          <p className="text-sm font-medium text-slate-700">
            {pagination.total} {pagination.total === 1 ? "ticket" : "tickets"}
          </p>

          {pagination.total > 0 && (
            <p className="text-xs text-slate-400">
              Showing {firstTicket}–{lastTicket}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center px-6">
            <p className="text-sm text-slate-500">Loading tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="flex min-h-64 items-center justify-center px-6">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
                <Search size={20} className="text-slate-400" />
              </div>

              <h3 className="text-sm font-semibold text-slate-800">
                No tickets found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filter.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="divide-y divide-slate-100 md:hidden">
              {tickets.map((ticket) => (
                <div
                  key={ticket.ticket_id}
                  className="px-4 py-4 transition active:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      to={`/tickets/${ticket.ticket_id}`}
                      className="min-w-0 flex-1"
                    >
                      <p className="font-mono text-xs font-medium text-slate-500">
                        {ticket.ticket_id}
                      </p>

                      <h3 className="mt-1 truncate text-sm font-semibold text-slate-900">
                        {ticket.subject}
                      </h3>

                      <p className="mt-1 truncate text-sm text-slate-500">
                        {ticket.customer_name}
                      </p>
                    </Link>

                    <StatusSelect
                      ticket={ticket}
                      updating={updatingTicketId === ticket.ticket_id}
                      onChange={handleStatusChange}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <PrioritySelect
                        ticket={ticket}
                        updating={updatingTicketId === ticket.ticket_id}
                        onChange={handlePriorityChange}
                      />

                      <span className="text-xs text-slate-400">
                        {formatDate(ticket.created_at)}
                      </span>
                    </div>

                    <Link
                      to={`/tickets/${ticket.ticket_id}`}
                      className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-slate-500"
                    >
                      View ticket
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[900px] text-left">
                <thead className="border-b border-slate-100 bg-slate-50/70">
                  <tr>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      ID
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Customer
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Subject
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Priority
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {tickets.map((ticket) => (
                    <tr
                      key={ticket.ticket_id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <Link
                          to={`/tickets/${ticket.ticket_id}`}
                          className="block font-mono text-sm font-medium text-slate-700 hover:text-slate-950 hover:underline"
                        >
                          {ticket.ticket_id}
                        </Link>
                      </td>

                      <td className="px-5 py-4">
                        <Link
                          to={`/tickets/${ticket.ticket_id}`}
                          className="block text-sm font-medium text-slate-800 hover:text-slate-950"
                        >
                          {ticket.customer_name}
                        </Link>
                      </td>

                      <td className="max-w-sm px-5 py-4">
                        <Link
                          to={`/tickets/${ticket.ticket_id}`}
                          className="block truncate text-sm text-slate-600 hover:text-slate-900"
                        >
                          {ticket.subject}
                        </Link>
                      </td>

                      <td className="px-5 py-4">
                        <PrioritySelect
                          ticket={ticket}
                          updating={updatingTicketId === ticket.ticket_id}
                          onChange={handlePriorityChange}
                        />
                      </td>

                      <td className="px-5 py-4">
                        <StatusSelect
                          ticket={ticket}
                          updating={updatingTicketId === ticket.ticket_id}
                          onChange={handleStatusChange}
                        />
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <Link
                          to={`/tickets/${ticket.ticket_id}`}
                          className="block text-sm text-slate-500"
                        >
                          {formatDate(ticket.created_at)}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              page={pagination.page}
              totalPages={pagination.total_pages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </section>
  );
}

export default Dashboard;
