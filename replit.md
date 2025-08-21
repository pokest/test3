# PokeCalc - Pokemon Damage Calculator Web Application

## Overview

PokeCalc is a comprehensive Pokemon damage calculator and team building application with real-time chat functionality. The application allows users to calculate battle damage between Pokemon, build and manage teams, and communicate with friends through an integrated chat system. Built with modern web technologies, it provides a seamless experience across desktop and mobile devices with a gaming-themed dark interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side is built using React with TypeScript, implementing a single-page application (SPA) architecture. The application uses Vite as the build tool and development server, providing fast hot module replacement and optimized builds. The UI is constructed with Radix UI components styled with Tailwind CSS, following a component-based architecture with reusable UI elements.

The state management follows a hooks-based pattern using React's built-in state management and custom hooks. Key architectural patterns include:
- Custom hooks for business logic (`use-pokemon`, `use-teams`, `use-friends`, `use-chat`)
- Component composition with prop drilling for data flow
- Responsive design with mobile-first approach
- Client-side routing using Wouter library

### Backend Architecture
The backend implements a Node.js Express server with TypeScript, serving both API endpoints and static files. The server architecture includes:
- Express middleware for request logging and error handling
- Modular route registration system
- Storage abstraction layer with in-memory implementation
- Development-time Vite integration for hot reloading
- Production static file serving

The backend is designed to be stateless with a pluggable storage interface, currently using in-memory storage but structured to easily support database implementations.

### Data Storage Solutions
The application uses a hybrid storage approach:
- **Firebase Firestore**: Primary database for user authentication, friend relationships, chat messages, and real-time data synchronization
- **In-Memory Storage**: Backend storage interface for user data with planned database migration
- **Local State**: Client-side state management for Pokemon calculations and team building
- **Drizzle ORM**: Configured for PostgreSQL with schema definitions, prepared for future database integration

The storage layer is abstracted through interfaces, allowing for easy migration from in-memory to persistent storage solutions.

### Authentication and Authorization
Authentication is handled through Firebase Authentication with custom user management:
- Email/password authentication with username-based system
- Firebase Auth UID mapping to custom user profiles
- Real-time authentication state management
- Protected routes requiring authentication
- User session persistence across browser sessions

### External Service Integrations
The application integrates with several external services and APIs:
- **Firebase Services**: Authentication, Firestore database, and real-time listeners
- **Pokemon Data APIs**: Integration with PokeAPI for sprite images and Pokemon data
- **Yakkun.com**: External links for detailed Pokemon information
- **HTML2Canvas**: Dynamic screenshot generation for team sharing
- **Replit Platform**: Development environment integration with cartographer and error modal plugins

The architecture supports real-time features through Firebase listeners, enabling live chat updates and friend status changes. The component structure is modular and scalable, with clear separation between UI components, business logic hooks, and data management layers.