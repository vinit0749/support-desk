const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const request = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const getTickets = ({
  status = "",
  priority = "",
  search = "",
  page = 1,
  limit = 10,
  sort = "newest",
} = {}) => {
  const params = new URLSearchParams();

  if (status) {
    params.set("status", status);
  }

  if (priority) {
    params.set("priority", priority);
  }

  if (search) {
    params.set("search", search);
  }

  params.set("page", page);
  params.set("limit", limit);
  params.set("sort", sort);

  return request(`/tickets?${params.toString()}`);
};

export const getTicket = (ticketId) => {
  return request(`/tickets/${ticketId}`);
};

export const createTicket = (ticketData) => {
  return request("/tickets", {
    method: "POST",
    body: JSON.stringify(ticketData),
  });
};

export const updateTicket = (ticketId, data) => {
  return request(`/tickets/${ticketId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteNote = (ticketId, noteId) => {
  return request(`/tickets/${ticketId}/notes/${noteId}`, {
    method: "DELETE",
  });
};
