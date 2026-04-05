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

