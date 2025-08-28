# Expense Tracker

A simple, map-based expense tracker application built with React and TypeScript. All data is stored locally in your browser.

## Features

  - **Add Expenses**: Record expenses with amount, category, note, and location.
  - **Geolocation**: Automatically detects and saves the location where an expense is added.
  - **Interactive Map**: View all your expenses as interactive markers on a map.
  - **Daily View**: Browse expenses grouped by day.
  - **Edit & Delete**: Easily manage and update your expense records.
  - **Local Storage**: All data persists in the browser's local storage.

## Tech Stack

  - **Framework**: React
  - **Language**: TypeScript
  - **Build Tool**: Vite
  - **Mapping**: React Leaflet & OpenStreetMap
  - **Styling**: CSS

## Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (version 18 or higher) and npm installed.

### Installation

1.  **Clone the repository:**

    ```sh
    git clone <your-repository-url>
    cd expense-tracker
    ```

2.  **Install dependencies:**

    ```sh
    npm install
    ```

3.  **Run the development server:**

    ```sh
    npm run dev
    ```

    The application will now be running at `https://localhost:5173`.

## Usage

When you first run the application, your browser will ask for **location permissions**. You must **allow** this for the automatic location detection to work.

  - Navigate to the **Add Expense** page to create a new entry.
  - Go to the **View Expenses** page to see your expenses on the map and in the list.