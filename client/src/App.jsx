import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/common/Header";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import LoanApplication from "./pages/Loans/LoanApplication";
import LoanStatus from "./pages/Loans/LoanStatus";
import SupportTickets from "./pages/Support/SupportTickets";
import CreateTicket from "./pages/Support/CreateTicket";
import LoansDashboard from "./pages/Loans/LoansDashboard";
import LoanCalculator from "./pages/Loans/LoanCalculator";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/loans/apply" element={<LoanApplication />} />
          <Route path="/loans/status" element={<LoanStatus />} />
          <Route path="/support" element={<SupportTickets />} />
          <Route path="/support/create" element={<CreateTicket />} />
          <Route path="/loans" element={<LoansDashboard />} />
          <Route path="/loans/apply" element={<LoanApplication />} />
          <Route path="/loans/calculator" element={<LoanCalculator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
