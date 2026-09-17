# SupportDesk

SupportDesk is a simple customer support ticket management system for creating, tracking, and managing support requests.

It lets you create tickets, search and filter them, update their status and priority, and add notes to tickets.

## Live Demo

[SupportDesk](https://support-desk-mauve.vercel.app/)

## Features

- Create support tickets with customer name, email, subject, and description
- Auto-generated ticket IDs and timestamps
- View all tickets
- Search tickets by ticket ID, customer name, email, subject, or description
- Filter tickets by status
- Filter tickets by priority
- View detailed ticket information
- Update ticket status
- Update ticket priority
- Add notes to tickets
- Delete notes
- Server-side pagination
- Server-side sorting
- Responsive UI
- Loading, error, and empty states

## Bonus Feature

### Ticket Priority

I added a priority system with four levels:

- Low
- Medium
- High
- Urgent

Priority can be selected when creating a ticket, updated later, displayed in the ticket list and details, and used as a filter.

I kept priority manual instead of adding automatic priority scoring. This keeps the workflow simple while giving support teams a quick way to identify tickets that need more attention.

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS

### Backend

- Node.js
- Express
- Mongoose

### Database

- MongoDB

### Deployment

- Vercel

## Architecture

The application is split into a React frontend and an Express backend.

```text
React + Vite
     |
     | REST API
     v
Node.js + Express
     |
     | Mongoose
     v
MongoDB Atlas
```

The frontend communicates with the backend through REST API endpoints. The backend handles ticket operations and database access, while MongoDB stores the ticket data.

## Project Structure

```text
support-desk/
├── .gitignore
├── vercel.json
│
├── client/
│   ├── .env.example
│   ├── README.md
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── vite.config.js
│   │
│   ├── public/
│   │   ├── apple-touch-icon.png
│   │   ├── favicon-96x96.png
│   │   ├── favicon.ico
│   │   ├── favicon.svg
│   │   ├── site.webmanifest
│   │   ├── web-app-manifest-192x192.png
│   │   └── web-app-manifest-512x512.png
│   │
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       │
│       ├── components/
│       │   └── Layout.jsx
│       │
│       ├── pages/
│       │   ├── CreateTicket.jsx
│       │   ├── Dashboard.jsx
│       │   └── TicketDetails.jsx
│       │
│       └── services/
│           └── api.js
│
└── server/
    ├── .env.example
    ├── package-lock.json
    ├── package.json
    ├── server.js
    │
    ├── config/
    │   └── db.js
    │
    ├── controllers/
    │   └── ticketController.js
    │
    ├── models/
    │   └── ticket.js
    │
    └── routes/
        └── ticketRoutes.js
```

## API Endpoints

### Create Ticket

`POST /api/tickets`

Creates a new ticket and generates its ticket ID and timestamp.

Example body:

```json
{
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "subject": "Unable to access my account",
  "description": "I am unable to log in to my account.",
  "priority": "High"
}
```

### Get Tickets

`GET /api/tickets`

Returns the ticket list.

Supported query parameters:

- `status`
- `priority`
- `search`
- `page`
- `limit`
- `sort`

Example:

`GET /api/tickets?status=Open&priority=High&search=account&page=1&limit=10&sort=newest`

Search checks the ticket ID, customer name, customer email, subject, and description.

### Get Ticket

`GET /api/tickets/:ticket_id`

Returns the complete ticket details along with its notes.

### Update Ticket

`PUT /api/tickets/:ticket_id`

Used to update the ticket status or priority and add a note.

Example body:

```json
{
  "status": "In Progress",
  "priority": "High",
  "note": "The issue has been assigned to the support team."
}
```

### Delete Note

`DELETE /api/tickets/:ticket_id/notes/:note_id`

Removes a note from a ticket.

### Health Check

`GET /api/health`

## Database

MongoDB Atlas is used to store the ticket data.

Each ticket contains:

- `ticket_id`
- `customer_name`
- `customer_email`
- `subject`
- `description`
- `status`
- `priority`
- `notes`
- `createdAt`
- `updatedAt`

Ticket status can be:

- Open
- In Progress
- Closed

Notes are stored with their related ticket instead of using a separate collection. This keeps the data model simple because notes only belong to one ticket.

## Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/vinit0749/support-desk.git
cd support-desk
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

Create a `.env` file inside `client`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Install backend dependencies

Open another terminal:

```bash
cd server
npm install
```

Create a `.env` file inside `server`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

### 4. Start the backend

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### 5. Start the frontend

In another terminal:

```bash
cd client
npm run dev
```

Open the local URL shown by Vite.

## Challenges

One of the main things I had to work through was keeping the database structure simple while still supporting ticket notes. Instead of creating unnecessary collections and relationships, I kept notes embedded inside their related ticket. This made reading and updating a ticket and its notes straightforward with Mongoose.

Search and filtering also needed some thought because the search had to work across multiple fields while still working together with status, priority, sorting, and pagination. I handled these operations on the backend so the frontend does not need to load the entire ticket collection just to filter or search it.

Another part was adding priority without making it feel separate from the rest of the application. I integrated it into ticket creation, the ticket list, ticket details, updates, and filtering so it works as part of the normal ticket workflow.

## What I Learned

This project helped me work through the complete flow of a full stack application:

Database → API → Frontend

I also got more comfortable with Express and MongoDB, REST API design, server-side search and filtering, pagination, and keeping the frontend state in sync with API changes.

## Future Improvements

- Authentication and user roles
- Assign tickets to support agents
- Customer and order information
