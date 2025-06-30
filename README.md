# Neural Grader Dashboard

A comprehensive AI-powered lumber grading and quality control system that provides real-time monitoring, batch management, and automated defect detection for lumber processing facilities.

## 🎯 Purpose

The Neural Grader Dashboard is designed to:
- **Automate lumber grading** using AI-powered defect detection
- **Monitor production lines** in real-time with camera feeds
- **Manage orders and batches** throughout the production process
- **Track quality metrics** and generate performance reports
- **Handle warranty claims** and customer feedback
- **Schedule shifts** and manage user permissions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone and install dependencies:**
   \`\`\`bash
   git clone <repository-url>
   cd neural-grader-dashboard
   npm install
   \`\`\`

2. **Start the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production
\`\`\`bash
npm run build
npm start
\`\`\`

## 📁 Project Structure

\`\`\`
neural-grader-dashboard/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Authentication routes
│   ├── batches/                  # Order/batch management
│   ├── board-finder/             # Board search and inspection
│   ├── line-check/               # Production line monitoring
│   ├── tools/                    # Utility tools (claims, scheduler)
│   └── layout.tsx                # Root layout
├── components/                   # Reusable UI components
│   ├── ui/                       # Base UI components (buttons, cards, etc.)
│   ├── dashboard-shell.tsx       # Main navigation and layout
│   ├── dashboard-overview.tsx    # Homepage dashboard
│   └── [feature-components]/     # Feature-specific components
├── lib/                          # Utility functions and constants
├── types/                        # TypeScript type definitions
├── data/                         # Sample data and mock APIs
└── public/                       # Static assets (images, icons)
\`\`\`

## 🏗️ Key Components

### Core Layout
- **`DashboardShell`** - Main application shell with navigation, header, and responsive layout
- **`DashboardOverview`** - Homepage with KPIs, recent activity, and quick actions

### Feature Modules
- **Board Management** - Individual board inspection, grading, and defect tracking
- **Order/Batch System** - Production order lifecycle management
- **Line Monitoring** - Real-time camera feeds and production metrics
- **Claims System** - Customer warranty claims and resolution tracking
- **User Management** - Role-based access control and user administration

### Data Flow
1. **Orders** are created and scheduled for production
2. **Boards** are scanned and graded using AI detection
3. **Defects** are identified, marked, and tracked
4. **Quality metrics** are calculated and reported
5. **Claims** can be filed and tracked through resolution

## 🔧 Configuration

### Environment Variables
Currently, the app runs with mock data. For production deployment, you'll need:
- Database connection strings
- AI model API endpoints  
- Camera feed URLs
- Authentication providers

### Customization
- **Grading Rules** - Configure via `/grading` page
- **User Roles** - Manage via `/users` page  
- **Defect Types** - Defined in `types/board.ts`

## 🎨 Design System

The project uses:
- **Tailwind CSS** for styling
- **shadcn/ui** for base components
- **Lucide React** for icons
- **Responsive design** with mobile-first approach

## 📊 Data Models

### Board
\`\`\`typescript
interface Board {
  id: string
  batchId: string
  grade: string
  defects: Defect[]
  dimensions: { length: string, width: string, thickness: string }
  // ... see types/board.ts for complete definition
}
\`\`\`

### Order/Batch
Production orders containing multiple boards with tracking through the grading process.

## 🚧 Known Limitations & TODOs

### Current Limitations
- **Mock Data**: All data is currently mocked - needs real API integration
- **Authentication**: Login page exists but no real auth implementation
- **Real-time Updates**: Camera feeds and metrics need WebSocket connections
- **File Uploads**: Board images are static - needs file upload system

### Priority TODOs
1. **Backend Integration**
   - Connect to real database
   - Implement REST/GraphQL APIs
   - Add authentication system

2. **Real-time Features**
   - WebSocket connections for live updates
   - Camera feed integration
   - Push notifications

3. **Advanced Features**
   - Export/reporting functionality
   - Advanced filtering and search
   - Batch operations for bulk actions

4. **Performance**
   - Implement virtual scrolling for large datasets
   - Add caching layer
   - Optimize image loading

## 🤝 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow React functional component patterns
- Implement proper error boundaries
- Add loading states for async operations

### Component Structure
\`\`\`typescript
// Preferred component structure
interface ComponentProps {
  // Props with clear types
}

export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // Hooks at the top
  // Event handlers
  // Render logic
  
  return (
    // JSX with clear structure
  )
}
\`\`\`

### File Naming
- Components: `PascalCase.tsx`
- Utilities: `kebab-case.ts`
- Pages: `kebab-case/page.tsx`

## 📞 Support

For questions about the codebase or architecture decisions, refer to:
- Component documentation in individual files
- Type definitions in `/types` directory
- Sample data in `/data` directory

---

**Last Updated**: December 2024
**Version**: 1.0.0
\`\`\`

Now let me refactor the main dashboard shell component for better maintainability:
