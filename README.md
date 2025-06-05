# Lost and Found (LAF)

A React application for managing lost and found items, allowing users to report lost items, register found items, and manage item claims through a role-based access system.

## Table of Contents

* [About The Project](#about-the-project)
* [Built With](#built-with)
* [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Installation](#installation)
* [Usage](#usage)
    * [Running the Development Server](#running-the-development-server)
    * [Building for Production](#building-for-production)
    * [Running Tests](#running-tests)
* [Project Structure](#project-structure)
* [API Configuration](#api-configuration)

## About The Project

Lost and Found (LAF) is a web application designed to help manage lost and found items. The system allows users to:

- Report lost and found items
- Search for items by various criteria
- Make claims on items
- Track item status (lost, found, claimed)

The application implements role-based access control with three user roles:
- **User**: Can report lost items, view items, and make claims
- **Staff**: Can manage items and handle requests
- **Admin**: Has full access including user management

## Built With

* [React](https://reactjs.org/) - Frontend library
* [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
* [React Router](https://reactrouter.com/) - Navigation and routing
* [Axios](https://axios-http.com/) - HTTP client for API requests
* [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
* [Headless UI](https://headlessui.com/) - Unstyled, accessible UI components (Predefined component package for Tailwind CSS)
* [Heroicons](https://heroicons.com/) - SVG icons (Predefined icon package for Tailwind CSS)

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

* Node.js (v16.x or higher): [Download Node.js](https://nodejs.org/)
* npm (comes with Node.js) or yarn
  ```sh
  npm install --global yarn # If you prefer yarn
  ```

### Installation

1. Clone the repository
   ```sh
   git clone https://github.com/winodshalinda/lost-and-found-frontend.git
   cd lost-and-found-frontend
   ```

2. Install dependencies
   ```sh
   npm install
   # or
   yarn install
   ```

## Usage

### Running the Development Server

```sh
npm start
# or
yarn start
```

This will start the development server at [http://localhost:3000](http://localhost:3000).

### Building for Production

```sh
npm run build
# or
yarn build
```

This will create an optimized production build in the `build` folder.

### Running Tests

```sh
npm test
# or
yarn test
```

## Project Structure

```
laf/
├── public/             # Static files
├── src/
│   ├── assets/         # Images, styles, and other static assets
│   ├── components/     # Reusable UI components
│   │   ├── common/     # Common UI elements (buttons, inputs, etc.)
│   │   ├── item/       # Item-related components
│   │   ├── layout/     # Layout components (navbar, header, etc.)
│   │   ├── request/    # Request-related components
│   │   └── user/       # User-related components
│   ├── features/       # Feature-specific code
│   │   ├── auth/       # Authentication logic
│   │   └── routes/     # Route-related components
│   ├── pages/          # Page components
│   ├── services/       # API service functions
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main application component
│   └── index.tsx       # Application entry point
└── package.json        # Project dependencies and scripts
```

## API Configuration

The application is configured to connect to a backend API at:

```
http://localhost:4444/laf/api/v1
```

If you need to change the API URL, you can modify it in the `src/services/api.ts` file.
