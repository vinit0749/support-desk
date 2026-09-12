const Ticket = require("../models/ticket");

const validStatuses = ["Open", "In Progress", "Closed"];
const validPriorities = ["Low", "Medium", "High", "Urgent"];

const generateTicketId = async () => {
  const lastTicket = await Ticket.findOne().sort({ createdAt: -1 });

  if (!lastTicket) {
    return "TKT-001";
  }

  const lastNumber = parseInt(lastTicket.ticket_id.split("-")[1], 10);
  const nextNumber = lastNumber + 1;

  return `TKT-${String(nextNumber).padStart(3, "0")}`;
};

const createTicket = async (req, res) => {
  try {
    const { customer_name, customer_email, subject, description, priority } =
      req.body;

    if (
      !customer_name ||
      !customer_email ||
      !subject ||
      !description ||
      !priority
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (!validPriorities.includes(priority)) {
      return res.status(400).json({
        message: "Invalid priority",
      });
    }

    const ticket = await Ticket.create({
      ticket_id: await generateTicketId(),
      customer_name,
      customer_email,
      subject,
      description,
      priority,
    });

    res.status(201).json({
      ticket_id: ticket.ticket_id,
      created_at: ticket.createdAt,
    });
  } catch (error) {
    console.error("Create ticket error:", error);
    res.status(500).json({
      message: "Failed to create ticket",
    });
  }
};

const getTickets = async (req, res) => {
  try {
    const {
      status,
      priority,
      search,
      page = 1,
      limit = 10,
      sort = "newest",
    } = req.query;

    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);

    const filter = {};

    if (status) {
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status",
        });
      }

      filter.status = status;
    }

    if (priority) {
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({
          message: "Invalid priority",
        });
      }

      filter.priority = priority;
    }

    if (search) {
      filter.$or = [
        { ticket_id: { $regex: search, $options: "i" } },
        { customer_name: { $regex: search, $options: "i" } },
        { customer_email: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const sortOrder = sort === "oldest" ? 1 : -1;

    const total = await Ticket.countDocuments(filter);

    const totalPages = Math.ceil(total / parsedLimit);

    const currentPage = Math.min(parsedPage, Math.max(totalPages, 1));

    const tickets = await Ticket.find(filter)
      .select("ticket_id customer_name subject status priority createdAt")
      .sort({ createdAt: sortOrder })
      .skip((currentPage - 1) * parsedLimit)
      .limit(parsedLimit);

    res.json({
      tickets: tickets.map((ticket) => ({
        ticket_id: ticket.ticket_id,
        customer_name: ticket.customer_name,
        subject: ticket.subject,
        status: ticket.status,
        priority: ticket.priority || "Medium",
        created_at: ticket.createdAt,
      })),
      pagination: {
        page: currentPage,
        limit: parsedLimit,
        total,
        total_pages: totalPages,
        sort,
      },
    });
  } catch (error) {
    console.error("Get tickets error:", error);
    res.status(500).json({
      message: "Failed to fetch tickets",
    });
  }
};

const getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({
      ticket_id: req.params.ticket_id,
    });

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    res.json({
      ticket_id: ticket.ticket_id,
      customer_name: ticket.customer_name,
      customer_email: ticket.customer_email,
      subject: ticket.subject,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority || "Medium",
      notes: ticket.notes.map((note) => ({
        id: note._id,
        text: note.text,
        created_at: note.createdAt,
      })),
      created_at: ticket.createdAt,
      updated_at: ticket.updatedAt,
    });
  } catch (error) {
    console.error("Get ticket error:", error);
    res.status(500).json({
      message: "Failed to fetch ticket",
    });
  }
};

const updateTicket = async (req, res) => {
  try {
    const { status, priority, notes } = req.body;

    const ticket = await Ticket.findOne({
      ticket_id: req.params.ticket_id,
    });

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    if (status !== undefined) {
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status",
        });
      }

      ticket.status = status;
    }

    if (priority !== undefined) {
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({
          message: "Invalid priority",
        });
      }

      ticket.priority = priority;
    }

    if (notes && notes.trim()) {
      ticket.notes.push({
        text: notes.trim(),
      });
    }

    await ticket.save();

    res.json({
      success: true,
      updated_at: ticket.updatedAt,
    });
  } catch (error) {
    console.error("Update ticket error:", error);
    res.status(500).json({
      message: "Failed to update ticket",
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({
      ticket_id: req.params.ticket_id,
    });

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    const note = ticket.notes.id(req.params.note_id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    note.deleteOne();

    await ticket.save();

    res.json({
      success: true,
      updated_at: ticket.updatedAt,
    });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({
      message: "Failed to delete note",
    });
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  deleteNote,
};
