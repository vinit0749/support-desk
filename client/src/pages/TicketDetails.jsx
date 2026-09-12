import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AlertCircle,
  Check,
  Mail,
  MessageSquare,
  Trash2,
  User,
} from "lucide-react";
import { deleteNote, getTicket, updateTicket } from "../services/api";

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

const formatDateTime = (date) => {
  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

function TicketDetails() {
  const { ticketId } = useParams();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingPriority, setSavingPriority] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTicket = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getTicket(ticketId);
        setTicket(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTicket();
  }, [ticketId]);

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;

    try {
      setSavingStatus(true);
      setError("");

      await updateTicket(ticketId, {
        status: newStatus,
      });

      setTicket((current) => ({
        ...current,
        status: newStatus,
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingStatus(false);
    }
  };

  const handlePriorityChange = async (event) => {
    const newPriority = event.target.value;

    try {
      setSavingPriority(true);
      setError("");

      await updateTicket(ticketId, {
        priority: newPriority,
      });

      setTicket((current) => ({
        ...current,
        priority: newPriority,
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingPriority(false);
    }
  };

  const handleAddNote = async (event) => {
    event.preventDefault();

    if (!note.trim()) {
      return;
    }

    try {
      setSavingNote(true);
      setError("");

      await updateTicket(ticketId, {
        notes: note,
      });

      const updatedTicket = await getTicket(ticketId);

      setTicket(updatedTicket);
      setNote("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingNote(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingNoteId(noteId);
      setError("");

      await deleteNote(ticketId, noteId);

      setTicket((current) => ({
        ...current,
        notes: current.notes.filter((item) => item.id !== noteId),
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingNoteId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-pulse rounded-full bg-slate-200" />
          <p className="text-sm text-slate-500">Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (error && !ticket) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-red-200 bg-red-50 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <AlertCircle size={19} className="mt-0.5 shrink-0 text-red-500" />

          <div>
            <h2 className="text-sm font-semibold text-red-700">
              Failed to load ticket
            </h2>

            <p className="mt-1 text-sm text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return null;
  }

  const currentPriority = ticket.priority || "Medium";

  return (
    <section>
      <div className="mb-6 border-b border-slate-200 pb-6 sm:mb-8 sm:pb-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-xs font-semibold text-slate-500 sm:text-sm">
                {ticket.ticket_id}
              </span>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                  statusStyles[ticket.status]
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    statusDotStyles[ticket.status]
                  }`}
                />
                {ticket.status}
              </span>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                  priorityStyles[currentPriority]
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    priorityDotStyles[currentPriority]
                  }`}
                />
                {currentPriority}
              </span>
            </div>

            <h2 className="max-w-3xl break-words text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              {ticket.subject}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Created {formatDate(ticket.created_at)}
            </p>
          </div>

          <div className="grid w-full shrink-0 gap-3 sm:grid-cols-2 lg:w-96">
            <div>
              <label
                htmlFor="status"
                className="mb-1.5 block text-xs font-medium text-slate-500"
              >
                Ticket status
              </label>

              <div className="relative">
                <span
                  className={`pointer-events-none absolute left-3.5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full ${
                    statusDotStyles[ticket.status]
                  }`}
                />

                <select
                  id="status"
                  value={ticket.status}
                  onChange={handleStatusChange}
                  disabled={savingStatus}
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 pl-8 pr-9 text-sm font-medium text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>

                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  ▼
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="priority"
                className="mb-1.5 block text-xs font-medium text-slate-500"
              >
                Ticket priority
              </label>

              <div className="relative">
                <span
                  className={`pointer-events-none absolute left-3.5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full ${
                    priorityDotStyles[currentPriority]
                  }`}
                />

                <select
                  id="priority"
                  value={currentPriority}
                  onChange={handlePriorityChange}
                  disabled={savingPriority}
                  className={`w-full appearance-none rounded-lg border px-3.5 py-2.5 pl-8 pr-9 text-sm font-medium outline-none transition focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-60 ${
                    priorityStyles[currentPriority]
                  }`}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>

                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs opacity-50">
                  ▼
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />

          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="order-2 min-w-0 space-y-5 lg:order-1">
          <article className="rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                  <MessageSquare size={16} className="text-slate-600" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Issue description
                  </h3>

                  <p className="text-xs text-slate-400">
                    Customer's reported issue
                  </p>
                </div>
              </div>
            </div>

            <div className="px-5 py-5 sm:px-6 sm:py-6">
              <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                {ticket.description}
              </p>
            </div>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                  <MessageSquare size={16} className="text-slate-600" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Internal notes
                  </h3>

                  <p className="text-xs text-slate-400">
                    {ticket.notes.length}{" "}
                    {ticket.notes.length === 1 ? "note" : "notes"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              {ticket.notes.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 px-4 py-6 text-center">
                  <p className="text-sm font-medium text-slate-600">
                    No internal notes yet
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Add a note below to keep track of support activity.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {ticket.notes.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-slate-100 bg-slate-50/70 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="min-w-0 flex-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                          {item.text}
                        </p>

                        <button
                          type="button"
                          onClick={() => handleDeleteNote(item.id)}
                          disabled={deletingNoteId === item.id}
                          aria-label="Delete note"
                          title="Delete note"
                          className="shrink-0 rounded-md p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <p className="mt-3 text-xs text-slate-400">
                        {formatDateTime(item.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <form
                onSubmit={handleAddNote}
                className="mt-5 border-t border-slate-100 pt-5"
              >
                <label
                  htmlFor="note"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Add note
                </label>

                <textarea
                  id="note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  rows="3"
                  placeholder="Add an internal note about this ticket..."
                  disabled={savingNote}
                  className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                />

                <div className="mt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingNote || !note.trim()}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {savingNote ? (
                      "Saving..."
                    ) : (
                      <>
                        <Check size={16} />
                        Add Note
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </article>
        </div>

        <aside className="order-1 h-fit rounded-xl border border-slate-200 bg-white lg:order-2">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Customer</h3>
          </div>

          <div className="space-y-5 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                <User size={17} className="text-slate-500" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-400">Name</p>

                <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                  {ticket.customer_name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                <Mail size={17} className="text-slate-500" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-400">Email</p>

                <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                  {ticket.customer_email}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default TicketDetails;
