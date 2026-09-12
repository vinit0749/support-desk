import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { createTicket } from "../services/api";

const priorityStyles = {
  Low: "border-slate-200 bg-slate-50 text-slate-700",
  Medium: "border-blue-200 bg-blue-50 text-blue-700",
  High: "border-amber-200 bg-amber-50 text-amber-700",
  Urgent: "border-red-200 bg-red-50 text-red-700",
};

function CreateTicket() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    subject: "",
    description: "",
    priority: "Medium",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = await createTicket(formData);

      navigate(`/tickets/${data.ticket_id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-2xl">
      <div className="mb-7">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Create Ticket
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Create a new customer support request.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-7">
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />

            <div>
              <p className="text-sm font-medium text-red-700">
                Unable to create ticket
              </p>

              <p className="mt-0.5 text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="customer_name"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Customer name
              </label>

              <input
                id="customer_name"
                name="customer_name"
                type="text"
                value={formData.customer_name}
                onChange={handleChange}
                placeholder="Rahul Sharma"
                required
                disabled={loading}
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              />
            </div>

            <div>
              <label
                htmlFor="customer_email"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Customer email
              </label>

              <input
                id="customer_email"
                name="customer_email"
                type="email"
                value={formData.customer_email}
                onChange={handleChange}
                placeholder="rahul@example.com"
                required
                disabled={loading}
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_180px]">
            <div>
              <label
                htmlFor="subject"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Subject
              </label>

              <input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Order has not arrived"
                required
                disabled={loading}
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              />
            </div>

            <div>
              <label
                htmlFor="priority"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Priority
              </label>

              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
                disabled={loading}
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm font-medium outline-none transition focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-60 ${
                  priorityStyles[formData.priority]
                }`}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows="6"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the customer's issue..."
              required
              disabled={loading}
              className="w-full resize-y rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            />
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-5">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                "Creating..."
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Create Ticket
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default CreateTicket;
