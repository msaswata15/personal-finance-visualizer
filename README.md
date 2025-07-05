# Personal Finance Visualizer

A modern web application for tracking personal finances built with Next.js, React, and shadcn/ui.

## Features

### Stage 1: Basic Transaction Tracking ✅
- ✅ Add/Edit/Delete transactions (amount, date, description)
- ✅ Transaction list view with search and filtering
- ✅ Monthly expenses bar chart
- ✅ Form validation with error handling

### Stage 2: Categories ✅
- ✅ Predefined categories for transactions
- ✅ Category-wise pie chart
- ✅ Dashboard with summary cards:
  - Total income/expenses this month
  - Net income (surplus/deficit)
  - Top spending category
  - Category breakdown with percentages

### Stage 3: Budgeting (Coming Soon)
- Set monthly category budgets
- Budget vs actual comparison chart
- Spending insights and alerts

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **Charts**: Recharts
- **Form Handling**: React Hook Form + Zod validation
- **Styling**: Tailwind CSS v4
- **Data Storage**: Mock API (MongoDB ready)

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd personal-finance-visualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   ├── transactions/  # Transaction CRUD operations
│   │   └── categories/    # Category management
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main dashboard
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── Charts.tsx        # Chart components
│   ├── SummaryCards.tsx  # Dashboard summary cards
│   ├── TransactionForm.tsx # Add/edit transaction form
│   └── TransactionList.tsx # Transaction list with actions
├── hooks/                # Custom React hooks
│   └── useApi.ts         # API data fetching hooks
├── lib/                  # Utility functions
│   ├── mock-db.ts        # Mock database for development
│   └── utils.ts          # Utility functions
└── types/                # TypeScript type definitions
    └── index.ts          # Application types
```

## Key Features

### Dashboard
- **Summary Cards**: Real-time overview of financial health
- **Monthly Expense Chart**: Bar chart showing spending trends over 6 months
- **Category Breakdown**: Pie chart with spending by category
- **Recent Transactions**: List of latest transactions with edit/delete actions

### Transaction Management
- **Add Transactions**: Form with validation for amount, date, description, and category
- **Edit Transactions**: Click edit icon to modify existing transactions
- **Delete Transactions**: Remove transactions with confirmation
- **Categories**: Predefined categories with color coding

### Data Visualization
- **Responsive Charts**: Built with Recharts for beautiful, interactive visualizations
- **Real-time Updates**: Charts update immediately when transactions are added/edited
- **Color-coded Categories**: Consistent color scheme across all visualizations

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## API Endpoints

- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/[id]` - Get specific transaction
- `PUT /api/transactions/[id]` - Update transaction
- `DELETE /api/transactions/[id]` - Delete transaction
- `GET /api/categories` - Get all categories

## Database Schema

### Transaction
```typescript
interface Transaction {
  _id?: string;
  amount: number;
  date: Date;
  description: string;
  category: string;
  type: 'expense' | 'income';
  createdAt?: Date;
  updatedAt?: Date;
}
```

### Category
```typescript
interface Category {
  _id?: string;
  name: string;
  color: string;
  budget?: number;
}
```

## Deployment

This application is ready for deployment on platforms like Vercel, Netlify, or any Node.js hosting service.

### Environment Variables (for MongoDB)
```env
MONGODB_URI=your_mongodb_connection_string
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this project for your personal finance tracking needs!

## Screenshots

The application features a clean, modern interface with:
- Responsive design that works on desktop and mobile
- Dark/light mode support (coming soon)
- Intuitive navigation and user experience
- Real-time data updates
- Error handling and loading states

## Future Enhancements

- MongoDB integration for persistent data storage
- User authentication and multi-user support
- Budget tracking and alerts
- Recurring transactions
- Data export functionality
- Advanced filtering and search
- Mobile app (React Native)
- Dark mode toggle
