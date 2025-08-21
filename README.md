# Mimesiss

A modern workshop management application built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🔐 **User Authentication** - Secure login/signup with Supabase Auth
- 👨‍💼 **Admin Dashboard** - Complete admin panel for managing workshops and users
- 👤 **User Account Management** - Personal dashboard and profile management
- 📅 **Workshop Management** - Create, view, and register for workshops
- 🛡️ **Role-based Access Control** - Admin and user roles with proper permissions
- 📱 **Responsive Design** - Works perfectly on all devices

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Icons**: React Icons

## Security Approach

The application uses a layered security approach:

1. **Public access data** (like workshop listings) use appropriate RLS policies to safely allow public viewing
2. **User-specific data** is protected with RLS policies ensuring users only see their own information
3. **Admin operations** use the service role key only within admin-specific API routes
4. **RLS policies** provide defense in depth, even if application logic has flaws
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd workshop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update the following variables in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Set up the database**
   
   Run the SQL commands in `database-setup.sql` in your Supabase SQL editor to create the necessary tables and policies.

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Setup

The application requires the following tables in your Supabase database:

- `profiles` - User profile information
- `workshops` - Workshop details
- `workshop_registrations` - User workshop registrations

Run the SQL commands in `database-setup.sql` to set up your database with the correct schema, Row Level Security policies, and triggers.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── admin/             # Admin panel
│   └── workshops/         # Workshop listings
├── components/            # Reusable components
├── lib/                   # Utility functions and configurations
│   └── supabase/         # Supabase client configurations
└── types/                 # TypeScript type definitions
```

## User Roles

### Regular Users
- View and register for workshops
- Manage their profile
- View their dashboard with workshop history

### Administrators
- All regular user permissions
- Create and manage workshops
- View and manage all users
- Access to admin dashboard

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key (for admin operations) |

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Key Features

1. **Authentication Flow**
   - Signup/Login with email and password
   - Automatic profile creation on signup
   - Protected routes with middleware

2. **Admin Features**
   - User management
   - Workshop creation and management
   - Registration oversight

3. **User Features**
   - Workshop browsing and registration
   - Profile management
   - Personal dashboard

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
