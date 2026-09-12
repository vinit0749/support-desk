const express = require("express");

const {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  deleteNote,
} = require("../controllers/ticketController");

const router = express.Router();

router.post("/", createTicket);
router.get("/", getTickets);
router.get("/:ticket_id", getTicket);
router.put("/:ticket_id", updateTicket);
router.delete("/:ticket_id/notes/:note_id", deleteNote);

module.exports = router;
