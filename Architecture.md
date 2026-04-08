# Aware — Software Architecture Document

**Version:** 1.0  
**Date:** April 2026  
**Course:** SWE332 — Software Architecture

---

## Change History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | April 2026 | Team Aware | Initial release |

---

## Table of Contents

1. [Scope](#1-scope)
2. [References](#2-references)
3. [Software Architecture](#3-software-architecture)
4. [Architectural Goals & Constraints](#4-architectural-goals--constraints)
5. [Logical Architecture](#5-logical-architecture)
6. [Process Architecture](#6-process-architecture)
7. [Development Architecture](#7-development-architecture)
8. [Physical Architecture](#8-physical-architecture)
9. [Scenarios](#9-scenarios)
10. [Size and Performance](#10-size-and-performance)
11. [Quality](#11-quality)

---

## List of Figures

- Figure 1 — Logical Architecture: Three-Tier Layer Diagram
- Figure 2 — Process Architecture: Live Reading Flow
- Figure 3 — Development Architecture: Repository Structure
- Figure 4 — Physical Architecture: Deployment Diagram
- Figure 5 — Scenario: User Monitors Live Consumption

---

## 1. Scope

This document describes the software architecture of **Aware**, a full-stack utility monitoring web application.

Aware is designed for two types of users:

- **Households** — individuals who want to track their home electricity, gas, and water consumption in real time and understand their usage trends over time.
- **Companies** — businesses that need centralized monitoring and control of utility usage across one or more locations, with the goal of identifying waste and reducing operational costs.

The application collects data from smart meters, displays live consumption readings, and provides historical charts and summaries to help users optimize their utility usage.

> **Demo Note:** This submission is a university project prototype focused on the household user experience. Real smart meter integration is simulated — historical data is pre-loaded into the database via a seed script, and live readings are generated on the client side to demonstrate real-time tracking. Company monitoring features are part of the full product vision and are not included in this demo.

---

## 2. References

- Kruchten, P. B. (1995). *The 4+1 View Model of Architecture.* IEEE Software, 12(6), 42–50.
- [4+1 Architectural View Model — Wikipedia](https://en.wikipedia.org/wiki/4%2B1_architectural_view_model)
- [GitHub Markdown Guide](https://docs.github.com/en/get-started/writing-on-github)
- [GitHub Flow Guide](https://docs.github.com/en/get-started/quickstart/github-flow)
- SWE332 Course Slides — Week 2

---

## 3. Software Architecture

Aware follows a standard **three-tier web architecture**:

- **Presentation Tier** — Built with HTML, CSS, and JavaScript. Displays live readings, charts, and consumption summaries in the browser. Designed to be usable by both regular users and company managers.
- **Application Tier** — A **Node.js** (Express) server that serves the front end and provides an API to retrieve consumption data and serve simulated meter readings.
- **Data Tier** — A **MySQL** database that stores consumption records. In this demo, it is pre-populated with realistic fake data to represent a user's meter history.

---

## 4. Architectural Goals & Constraints

### Goals

- **Real-Time Awareness** — Users and companies can see their current consumption as it happens, enabling faster and more informed decisions.
- **Historical Insight** — Charts and summaries over days, weeks, and months help users identify usage patterns and spot abnormal spikes.
- **Clarity** — A clean separation between layers keeps the codebase easy to understand, extend, and demonstrate.

### Constraints

- The project uses HTML, CSS, JavaScript, Node.js, and MySQL only.
- In this demo, all data is simulated — meter integration uses pre-seeded database records for history and JavaScript-generated values for live readings.
- The application is intended to run locally for the demo and is not deployed to a production environment.

---
## 5. Logical Architecture

### Presentation Layer (Client)

- *Dashboard* — The main screen. Displays summary cards (current usage, daily totals) and charts for electricity, gas, and water.
- *Live Monitor* — Displays real-time consumption readings that update every few seconds, simulating a live meter feed.
- *History & Reports* — Shows detailed historical data in chart and table form, filterable by utility type and time period.

### Application Layer (Node.js / Express)

- *Static File Server* — Serves all HTML, CSS, and JS files to the browser.
- *Readings API* — Exposes endpoints for the front end to fetch historical consumption records from the database.
- *Live Feed Endpoint* (optional) — Can serve a simulated current reading on request, or this can be handled entirely client-side.

### Data Layer (MySQL)

- *Readings Table* — Stores consumption records with fields for date, utility type (electricity / gas / water), value, and unit.
- *seed.sql* — Populates the database with realistic fake records to give the demo a convincing usage history.

---

## 6. Process Architecture

### Fetching Historical Data

1. The browser loads a page and JavaScript calls GET /api/readings.
2. The Node.js server queries the MySQL *Readings Table* and returns JSON.
3. The front end renders the data as charts and summary statistics.

### Simulated Live Monitoring

1. When the user opens the Live Monitor, a JavaScript setInterval starts in the browser.
2. Every few seconds, it generates a consumption value within a realistic range for each utility type.
3. The value updates on screen, simulating a meter feed in real time.
4. In a production version of Aware, this step would instead poll an API endpoint connected to real smart meter hardware.

---

## 7. Development Architecture

### Repository Structure


aware/
├── README.md
├── ARCHITECTURE.md
├── package.json
├── server/
│   ├── index.js            # Express server entry point
│   └── routes/
│       └── readings.js     # API routes for consumption data
├── client/
│   ├── index.html          # Dashboard page
│   ├── live.html           # Live monitor page
│   ├── history.html        # History & reports page
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── dashboard.js    # Fetches data and renders charts
│       ├── live.js         # Simulates and displays live readings
│       └── history.js      # Fetches and renders historical table
└── database/
    ├── schema.sql          # Table definitions
    └── seed.sql            # Pre-loaded fake data for the demo


### Collaboration Workflow

The team follows the *GitHub Flow* branching model. Each feature is developed on its own branch and merged into main via a pull request, ensuring all team members have visible, meaningful commits in the Git history.

---

## 8. Physical Architecture

For this demo, the entire application runs on a single local machine:

- The *Node.js server* runs locally and listens on a configured port (e.g. port 3000).
- The *MySQL database* runs as a local service on the same machine.
- The *browser* accesses the application at http://localhost:3000.

In a real-world deployment of Aware, the server would be hosted in the cloud, the database would be managed separately, and smart meters would push readings to the API over a secure connection.
## 9. Scenarios

### Scenario 1 — Household User Checks Their Monthly Usage

1. The user opens the Aware dashboard in their browser.
2. The page loads and fetches consumption data from GET /api/readings.
3. The server returns records from the pre-seeded MySQL database.
4. The front end renders a line chart showing electricity, gas, and water usage over the past month.
5. Summary cards show the total for each utility and highlight any significant increases compared to the previous month.

### Scenario 2 — User Monitors Live Consumption

1. The user opens the Live Monitor page.
2. A JavaScript interval begins generating simulated readings for electricity, gas, and water every few seconds.
3. The current consumption values update on screen in real time.
4. The user can see at a glance whether their usage is within a normal range.
5. In a full production system, these readings would come from actual smart meters installed at the user's property.

---

## 10. Size and Performance

| Metric | Target |
|--------|--------|
| Page Load Time | < 2 seconds on localhost |
| API Response Time | < 200ms for local database queries |
| Demo Data Volume | ~100–200 pre-seeded consumption records |
| Live Update Interval | Every 3–5 seconds (client-side simulation) |
| Codebase Size | Estimated ~500–1,000 lines across all files |

---

## 11. Quality

| Quality Attribute | Approach |
|---|---|
| *Usability* | Clean, clearly labeled interface accessible to non-technical home users |
| *Maintainability* | Each file has a single responsibility; the layered structure is straightforward to navigate and extend |
| *Reliability* | Static seed data ensures the demo always presents consistent, predictable content regardless of environment |
| *Simplicity* | Complexity is kept to the minimum needed for a convincing and functional demo |

---

## Appendices

### Acronyms and Abbreviations

| Acronym | Definition |
|---------|------------|
| API | Application Programming Interface |
| CSS | Cascading Style Sheets |
| HTML | HyperText Markup Language |
| JS | JavaScript |
| JSON | JavaScript Object Notation |
| MySQL | My Structured Query Language |
| SQL | Structured Query Language |
| UI | User Interface |

---

### Definitions

- *Smart Meter* — A digital utility meter capable of transmitting consumption data electronically. In this demo, smart meter behavior is simulated in software.
- *Static / Seed Data* — Pre-written fake records inserted into the database via seed.sql to give the demo a realistic-looking consumption history.
- *Simulated Live Reading* — A randomly generated consumption value produced by a JavaScript interval on the client, used to mimic a real-time meter feed during the demo.
- *Dashboard* — The main page of the application, displaying charts and summaries of utility consumption.

---

### Design Principles

1. *Keep it Simple* — Only the complexity needed for a convincing, functional demo is introduced.
2. *Separation of Concerns* — The client, server, and database each handle their own responsibilities cleanly and independently.
3. *Demo-First, Production-Aware* — Decisions prioritize a realistic and presentable demo, while the architecture is documented to reflect how the system would work with real meter data in a production environment.

