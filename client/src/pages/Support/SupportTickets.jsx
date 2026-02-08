import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TicketCard from "./TicketCard";
import SupportStats from "./SupportStats";

const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Ticket categories
  const categories = [
    "Account Issues",
    "Transaction Problems",
    "Loan Services",
    "Card Services",
    "Online Banking",
    "Mobile App",
    "Security Concerns",
    "General Inquiry",
    "Technical Support",
    "Other",
  ];

  // Priority levels
  const priorities = ["Low", "Medium", "High", "Critical"];

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockTickets = [
      {
        id: "TKT-2024-001",
        subject: "Unable to access online banking",
        category: "Online Banking",
        priority: "High",
        status: "open",
        createdDate: "2024-01-15T10:30:00",
        lastUpdate: "2024-01-15T14:20:00",
        messages: [
          {
            id: 1,
            sender: "user",
            message:
              "I cannot login to my online banking account. It says invalid credentials.",
            timestamp: "2024-01-15T10:30:00",
            attachments: [],
          },
          {
            id: 2,
            sender: "support",
            message:
              "We are looking into this issue. Please try resetting your password.",
            timestamp: "2024-01-15T14:20:00",
            attachments: [],
          },
        ],
        assignedTo: "Sarah Johnson",
        customer: "John Doe",
      },
      {
        id: "TKT-2024-002",
        subject: "Credit card transaction dispute",
        category: "Card Services",
        priority: "Medium",
        status: "in_progress",
        createdDate: "2024-01-14T09:15:00",
        lastUpdate: "2024-01-15T11:45:00",
        messages: [
          {
            id: 1,
            sender: "user",
            message:
              "I noticed an unauthorized transaction on my credit card statement.",
            timestamp: "2024-01-14T09:15:00",
            attachments: ["transaction_screenshot.png"],
          },
        ],
        assignedTo: "Mike Chen",
        customer: "Jane Smith",
      },
      {
        id: "TKT-2024-003",
        subject: "Loan application status inquiry",
        category: "Loan Services",
        priority: "Low",
        status: "resolved",
        createdDate: "2024-01-10T14:20:00",
        lastUpdate: "2024-01-12T16:30:00",
        messages: [
          {
            id: 1,
            sender: "user",
            message:
              "Can you please update me on the status of my home loan application?",
            timestamp: "2024-01-10T14:20:00",
            attachments: [],
          },
          {
            id: 2,
            sender: "support",
            message:
              "Your loan application has been approved! You will receive the documents soon.",
            timestamp: "2024-01-12T16:30:00",
            attachments: ["approval_letter.pdf"],
          },
        ],
        assignedTo: "David Wilson",
        customer: "Robert Brown",
      },
      {
        id: "TKT-2024-004",
        subject: "Mobile app crashing on startup",
        category: "Mobile App",
        priority: "High",
        status: "open",
        createdDate: "2024-01-15T16:45:00",
        lastUpdate: "2024-01-15T16:45:00",
        messages: [
          {
            id: 1,
            sender: "user",
            message:
              "The mobile app crashes immediately when I try to open it on my iPhone.",
            timestamp: "2024-01-15T16:45:00",
            attachments: ["crash_log.txt"],
          },
        ],
        assignedTo: "Not Assigned",
        customer: "Emily Davis",
      },
    ];

    setTimeout(() => {
      setTickets(mockTickets);
      setFilteredTickets(mockTickets);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter tickets based on status and search term
  useEffect(() => {
    let filtered = tickets;

    if (activeFilter !== "all") {
      filtered = filtered.filter((ticket) => ticket.status === activeFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (ticket) =>
          ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTickets(filtered);
  }, [activeFilter, searchTerm, tickets]);

  const getStatusCount = (status) => {
    return tickets.filter((ticket) => ticket.status === status).length;
  };

  const statusFilters = [
    { key: "all", label: "All Tickets", count: tickets.length },
    { key: "open", label: "Open", count: getStatusCount("open") },
    {
      key: "in_progress",
      label: "In Progress",
      count: getStatusCount("in_progress"),
    },
    { key: "resolved", label: "Resolved", count: getStatusCount("resolved") },
    { key: "closed", label: "Closed", count: getStatusCount("closed") },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#96A78D] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00441b] mx-auto"></div>
            <p className="mt-4 text-[#00441b]">
              Loading your support tickets...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#96A78D] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#00441b]">
                Customer Support
              </h1>
              <p className="text-[#00441b] mt-2">
                Get help with your banking needs
              </p>
            </div>
            <Link
              to="/support/create"
              className="mt-4 md:mt-0 bg-[#00441b] text-white px-6 py-3 rounded-lg hover:bg-[#003316] transition-colors"
            >
              Create New Ticket
            </Link>
          </div>
        </div>

        {/* Support Statistics */}
        <SupportStats tickets={tickets} />

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeFilter === filter.key
                      ? "bg-[#00441b] text-white"
                      : "bg-[#3C7E9C] text-white hover:bg-[#2c6a85]"
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search tickets by subject, ID, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-[#3C7E9C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00441b] text-[#00441b] placeholder-[#3C7E9C]"
              />
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          {filteredTickets.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="text-[#3C7E9C] text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-[#00441b] mb-2">
                {activeFilter === "all"
                  ? "No Support Tickets"
                  : `No ${
                      statusFilters.find((f) => f.key === activeFilter)?.label
                    } Tickets`}
              </h3>
              <p className="text-[#3C7E9C] mb-4">
                {searchTerm
                  ? "No tickets match your search criteria."
                  : activeFilter === "all"
                  ? "You haven't created any support tickets yet."
                  : `You don't have any ${activeFilter.replace(
                      "_",
                      " "
                    )} tickets.`}
              </p>
              <Link
                to="/support/create"
                className="bg-[#00441b] text-white px-6 py-2 rounded-lg hover:bg-[#003316] transition-colors"
              >
                Create Your First Ticket
              </Link>
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))
          )}
        </div>

        {/* Quick Help Section */}
        <div className="mt-8 bg-[#3C7E9C] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Need Immediate Help?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl mb-2 text-white">📞</div>
              <h4 className="font-semibold text-white">Call Us</h4>
              <p className="text-white text-sm">1-800-SMART-BANK</p>
              <p className="text-white text-xs">24/7 Customer Support</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2 text-white">💬</div>
              <h4 className="font-semibold text-white">Live Chat</h4>
              <p className="text-white text-sm">Available 6AM-12AM EST</p>
              <p className="text-white text-xs">Instant messaging support</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2 text-white">📧</div>
              <h4 className="font-semibold text-white">Email</h4>
              <p className="text-white text-sm">support@smartbank.com</p>
              <p className="text-white text-xs">Response within 4 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTickets;
