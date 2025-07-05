# Personal Finance Visualizer 💰

A comprehensive personal finance management web application built with Next.js, React, and modern web technologies. Track transactions, manage budgets, visualize spending patterns, and get AI-powered financial insights.

![Personal Finance Visualizer](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-7-green?style=for-the-badge&logo=mongodb)

![image](https://github.com/user-attachments/assets/19a8aed8-3727-4865-9c24-07ac02e37a46)
![image](https://github.com/user-attachments/assets/94c532af-4374-4dac-bee1-bbe2ccbd41ee)


## 🌟 Features

### 📊 Stage 1: Transaction Management ✅
- ✅ **Add/Edit/Delete Transactions** - Complete CRUD operations with form validation
- ✅ **Smart Transaction List** - Search, filter, and sort transactions
- ✅ **Monthly Expense Charts** - Interactive bar charts showing spending trends
- ✅ **Real-time Validation** - Form validation with error handling and success feedback

### 🎯 Stage 2: Categories & Analytics ✅
- ✅ **Predefined Categories** - 12 color-coded spending categories
- ✅ **Category-wise Pie Charts** - Visual breakdown of spending by category
- ✅ **Dashboard Summary Cards** - Key financial metrics at a glance
  - Total income/expenses this month
  - Net income (surplus/deficit)
  - Top spending category
  - Category breakdown with percentages
- ✅ **Advanced Analytics** - Spending insights and trends

### 💰 Stage 3: Budget Management ✅
- ✅ **Monthly Budget Setting** - Set spending limits for each category
- ✅ **Budget vs Actual Comparison** - Visual charts showing budget performance
- ✅ **Budget Tracking** - Real-time budget utilization monitoring
- ✅ **Spending Insights** - Intelligent analysis of spending patterns
- ✅ **Budget Alerts** - Visual indicators for overspending

### 🤖 AI Financial Analyzer ✅
- ✅ **Gemini AI Integration** - Powered by Google's Gemini 1.5 Flash model
- ✅ **Financial Health Score** - Overall financial wellness rating (0-100)
- ✅ **Personalized Recommendations** - AI-driven financial advice
- ✅ **Spending Pattern Analysis** - Intelligent insights on spending habits
- ✅ **Budget Optimization** - Smart suggestions for better financial management
- ✅ **Savings Goals** - Personalized savings recommendations

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **React**: React 19 with TypeScript
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **Charts**: Recharts for interactive data visualization
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React

### Backend
- **API Routes**: Next.js API routes
- **Database**: MongoDB with Mongoose ODM
- **AI Integration**: Google Gemini AI (Generative AI)
- **Validation**: Zod for schema validation

### Development Tools
- **TypeScript**: Full type safety
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Custom Hooks**: Reusable API logic

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/personal-finance-visualizer.git
   cd personal-finance-visualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   DB_NAME=personal_finance
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                      # Next.js app router
│   ├── api/                  # API routes
│   │   ├── transactions/     # Transaction CRUD operations
│   │   │   ├── route.ts      # GET, POST transactions
│   │   │   └── [id]/route.ts # GET, PUT, DELETE by ID
│   │   ├── categories/       # Category management
│   │   │   └── route.ts      # GET categories
│   │   ├── budgets/          # Budget management
│   │   │   ├── route.ts      # GET, POST budgets
│   │   │   └── [id]/route.ts # PUT, DELETE budgets
│   │   └── ai-analysis/      # AI financial analysis
│   │       └── route.ts      # POST AI analysis
│   ├── globals.css           # Global styles with Tailwind
│   ├── layout.tsx            # Root layout with metadata
│   └── page.tsx              # Main dashboard with tabs
├── components/               # React components
│   ├── ui/                   # shadcn/ui base components
│   │   ├── button.tsx        # Button component
│   │   ├── card.tsx          # Card component
│   │   ├── input.tsx         # Input component
│   │   ├── label.tsx         # Label component
│   │   ├── select.tsx        # Select component
│   │   └── dialog.tsx        # Dialog component
│   ├── Charts.tsx            # Chart components (Bar, Pie)
│   ├── SummaryCards.tsx      # Dashboard summary cards
│   ├── TransactionForm.tsx   # Add/edit transaction form
│   ├── TransactionList.tsx   # Transaction list with actions
│   ├── BudgetForm.tsx        # Budget creation form
│   ├── BudgetManagement.tsx  # Budget management interface
│   ├── BudgetVsActual.tsx    # Budget comparison charts
│   ├── SpendingInsights.tsx  # Spending analytics
│   └── AIFinancialAnalyzer.tsx # AI analysis interface
├── hooks/                    # Custom React hooks
│   └── useApi.ts             # API data fetching hooks
├── lib/                      # Utility functions and configs
│   ├── utils.ts              # Utility functions
│   ├── mongodb.ts            # MongoDB connection
│   ├── database.ts           # Database operations
│   └── aiAnalyzer.ts         # AI analysis logic
└── types/                    # TypeScript type definitions
    └── index.ts              # Application types
```

## 🔧 Key Features Implementation

### 💳 Transaction Management
- **CRUD Operations**: Complete create, read, update, delete functionality
- **Form Validation**: Real-time validation with error messages
- **Category Assignment**: Dropdown selection with color indicators
- **Date Handling**: Smart date picker with validation
- **Currency Formatting**: Indian Rupee (₹) formatting throughout

### 📊 Data Visualization
- **Interactive Charts**: Built with Recharts for responsive visualizations
- **Real-time Updates**: Charts update immediately when data changes
- **Color-coded Categories**: Consistent color scheme across all visualizations
- **Responsive Design**: Charts adapt to different screen sizes

### 💰 Budget Management
- **Budget Setting**: Monthly budget limits for each category
- **Progress Tracking**: Visual progress bars showing budget utilization
- **Overspending Alerts**: Color-coded indicators for budget status
- **Budget Analytics**: Detailed comparison of budgeted vs actual spending

### 🤖 AI Financial Analysis
- **Gemini Integration**: Google's latest AI model for financial insights
- **Comprehensive Analysis**: Multiple aspects of financial health
- **Actionable Recommendations**: Specific, personalized advice
- **Spending Pattern Recognition**: AI identifies spending trends

## 🔌 API Endpoints

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/[id]` - Get specific transaction
- `PUT /api/transactions/[id]` - Update transaction
- `DELETE /api/transactions/[id]` - Delete transaction

### Categories
- `GET /api/categories` - Get all categories with predefined list

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create new budget
- `PUT /api/budgets/[id]` - Update budget
- `DELETE /api/budgets/[id]` - Delete budget

### AI Analysis
- `POST /api/ai-analysis` - Get AI financial analysis

## 📊 Database Schema

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
}
```

### Budget
```typescript
interface Budget {
  _id?: string;
  category: string;
  amount: number;
  month: number;
  year: number;
  createdAt?: Date;
  updatedAt?: Date;
}
```

## 🎨 UI/UX Features

### 🎯 Modern Design
- **Clean Interface**: Minimalist design with focus on usability
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Color-coded Categories**: Visual distinction for different expense types
- **Loading States**: Smooth loading indicators for better UX
- **Error Handling**: User-friendly error messages and validation

### 🔄 Interactive Elements
- **Tabbed Navigation**: Easy switching between Dashboard, Budgets, Insights, and AI Analyzer
- **Modal Forms**: Smooth form interactions with proper validation
- **Hover Effects**: Interactive buttons and cards
- **Progress Indicators**: Visual feedback for budget progress

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production
```env
MONGODB_URI=your_mongodb_connection_string
DB_NAME=personal_finance
GEMINI_API_KEY=your_gemini_api_key
```

### Build Commands
```bash
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🔮 Future Enhancements

### 🌟 Planned Features
- **Dark Mode Toggle** - Theme switching capability
- **Data Export/Import** - CSV/JSON export functionality
- **Recurring Transactions** - Automatic transaction scheduling
- **Multi-currency Support** - Support for multiple currencies
- **Advanced Filtering** - Complex filtering and search options
- **Goal Tracking** - Financial goal setting and tracking
- **Bill Reminders** - Automated bill payment reminders
- **Investment Tracking** - Portfolio management features

### 🔧 Technical Improvements
- **Progressive Web App** - Offline capability and app-like experience
- **Push Notifications** - Budget alerts and reminders
- **Advanced Analytics** - Machine learning for spending predictions
- **API Integration** - Bank account integration for automatic transaction import
- **Multi-user Support** - User authentication and account management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for beautiful, accessible UI components
- **Recharts** for powerful, customizable charts
- **Google Gemini AI** for intelligent financial analysis
- **MongoDB** for reliable data storage
- **Next.js** for the amazing React framework

---

**Built with ❤️ using Next.js, React, and modern web technologies**

*Track your finances, achieve your goals, and build a better financial future!*
