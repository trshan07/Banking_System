import React, { useState } from "react";
import {
  FaTasks,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaHourglassHalf,
  FaFlag,
  FaExclamationTriangle,
  FaUserCircle,
  FaUsers,
  FaCalendarAlt,
  FaPaperclip,
  FaComment,
  FaReply,
  FaPaperPlane,
  FaSearch,
  FaFilter,
  FaSort,
  FaDownload,
  FaUpload,
  FaCloudUploadAlt,
  FaSave,
  FaTimes,
  FaCheck,
  FaUndo,
  FaRedo,
  FaHistory,
  FaChartLine,
  FaChartPie,
  FaChartBar,
  FaList,
  FaThLarge,
  FaThList,
  FaEllipsisH,
  FaEllipsisV,
  FaAngleDown,
  FaAngleUp,
  FaAngleRight,
  FaAngleLeft,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaRegStar,
  FaTag,
  FaTags,
  FaFolder,
  FaFolderOpen,
  FaArchive,
  FaInbox,
  FaSend,
  FaShare,
  FaLink,
  FaCopy,
  FaPrint,
  FaFilePdf,
  FaFileExcel,
  FaFileCsv,
  FaFileAlt,
  FaFileImage,
  FaFileWord,
  FaFilePowerpoint,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

const TaskManagement = () => {
  const [viewMode, setViewMode] = useState("list"); // list, grid, board
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("dueDate");
  const [sortOrder, setSortOrder] = useState("asc");
  const [commentText, setCommentText] = useState("");

  // Employee Info
  const [employeeInfo] = useState({
    name: "John Smith",
    id: "EMP-2024-0123",
    department: "Customer Support",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  });

  // Tasks Data
  const [tasks, setTasks] = useState([
    {
      id: "TSK-001",
      title: "Review KYC Applications",
      description:
        "Process and verify 15 pending KYC applications from new customers",
      status: "in-progress",
      priority: "high",
      category: "KYC Processing",
      assignedBy: "Sarah Johnson",
      assignedTo: ["John Smith"],
      createdDate: "2024-03-15",
      dueDate: "2024-03-20",
      completedDate: null,
      estimatedHours: 8,
      loggedHours: 4.5,
      progress: 60,
      attachments: ["kyc_guidelines.pdf", "verification_checklist.xlsx"],
      comments: [
        {
          id: 1,
          user: "Sarah Johnson",
          avatar: "https://randomuser.me/api/portraits/women/2.jpg",
          comment: "Please prioritize applications with complete documentation",
          timestamp: "2024-03-15 10:30 AM",
        },
        {
          id: 2,
          user: "John Smith",
          avatar: "https://randomuser.me/api/portraits/men/1.jpg",
          comment: "I've completed 5 applications so far",
          timestamp: "2024-03-16 02:15 PM",
        },
      ],
      subtasks: [
        { id: 1, title: "Verify identity documents", completed: true },
        { id: 2, title: "Check address proof", completed: true },
        { id: 3, title: "Validate income documents", completed: false },
        { id: 4, title: "Update system records", completed: false },
      ],
      tags: ["kyc", "verification", "customer"],
      dependencies: [],
    },
    {
      id: "TSK-002",
      title: "Customer Support Ticket Resolution",
      description:
        "Respond to high-priority support tickets from premium customers",
      status: "pending",
      priority: "urgent",
      category: "Customer Support",
      assignedBy: "Michael Chen",
      assignedTo: ["John Smith", "Emily Davis"],
      createdDate: "2024-03-16",
      dueDate: "2024-03-18",
      completedDate: null,
      estimatedHours: 6,
      loggedHours: 2,
      progress: 30,
      attachments: ["ticket_details.pdf", "customer_complaints.xlsx"],
      comments: [
        {
          id: 1,
          user: "Michael Chen",
          avatar: "https://randomuser.me/api/portraits/men/3.jpg",
          comment: "These are VIP customers, please handle with priority",
          timestamp: "2024-03-16 09:00 AM",
        },
      ],
      subtasks: [
        { id: 1, title: "Review ticket history", completed: true },
        { id: 2, title: "Contact customers", completed: false },
        { id: 3, title: "Resolve issues", completed: false },
      ],
      tags: ["support", "vip", "urgent"],
      dependencies: [],
    },
    {
      id: "TSK-003",
      title: "Loan Application Processing",
      description: "Review and process 5 new home loan applications",
      status: "completed",
      priority: "medium",
      category: "Loan Processing",
      assignedBy: "Sarah Johnson",
      assignedTo: ["John Smith"],
      createdDate: "2024-03-10",
      dueDate: "2024-03-17",
      completedDate: "2024-03-16",
      estimatedHours: 10,
      loggedHours: 12,
      progress: 100,
      attachments: ["loan_applications.pdf", "approval_letters.docx"],
      comments: [
        {
          id: 1,
          user: "Sarah Johnson",
          avatar: "https://randomuser.me/api/portraits/women/2.jpg",
          comment: "Great work on processing these applications!",
          timestamp: "2024-03-16 04:30 PM",
        },
      ],
      subtasks: [
        { id: 1, title: "Verify income documents", completed: true },
        { id: 2, title: "Check credit score", completed: true },
        { id: 3, title: "Calculate eligibility", completed: true },
        { id: 4, title: "Generate offer letter", completed: true },
      ],
      tags: ["loans", "processing", "home-loan"],
      dependencies: [],
    },
    {
      id: "TSK-004",
      title: "Fraud Report Investigation",
      description: "Investigate suspicious transaction report #FR-2024-0123",
      status: "in-progress",
      priority: "high",
      category: "Fraud Management",
      assignedBy: "Security Team",
      assignedTo: ["John Smith"],
      createdDate: "2024-03-14",
      dueDate: "2024-03-19",
      completedDate: null,
      estimatedHours: 12,
      loggedHours: 6,
      progress: 50,
      attachments: ["fraud_report.pdf", "transaction_history.xlsx"],
      comments: [
        {
          id: 1,
          user: "Security Team",
          avatar: "https://randomuser.me/api/portraits/men/5.jpg",
          comment: "Please coordinate with IT for transaction logs",
          timestamp: "2024-03-14 11:15 AM",
        },
      ],
      subtasks: [
        { id: 1, title: "Analyze transaction pattern", completed: true },
        { id: 2, title: "Contact affected customer", completed: true },
        { id: 3, title: "Review security logs", completed: false },
        { id: 4, title: "Prepare investigation report", completed: false },
      ],
      tags: ["fraud", "security", "investigation"],
      dependencies: ["TSK-002"],
    },
    {
      id: "TSK-005",
      title: "Update KYC Documentation",
      description:
        "Update KYC verification guidelines and documentation templates",
      status: "pending",
      priority: "low",
      category: "Documentation",
      assignedBy: "Sarah Johnson",
      assignedTo: ["John Smith"],
      createdDate: "2024-03-12",
      dueDate: "2024-03-25",
      completedDate: null,
      estimatedHours: 4,
      loggedHours: 1,
      progress: 25,
      attachments: [],
      comments: [],
      subtasks: [
        { id: 1, title: "Review current guidelines", completed: true },
        { id: 2, title: "Update templates", completed: false },
        { id: 3, title: "Get approval from compliance", completed: false },
      ],
      tags: ["documentation", "kyc", "process"],
      dependencies: [],
    },
    {
      id: "TSK-006",
      title: "Team Meeting Preparation",
      description: "Prepare presentation for weekly team meeting",
      status: "pending",
      priority: "medium",
      category: "Meeting",
      assignedBy: "Sarah Johnson",
      assignedTo: ["John Smith"],
      createdDate: "2024-03-17",
      dueDate: "2024-03-19",
      completedDate: null,
      estimatedHours: 3,
      loggedHours: 0,
      progress: 0,
      attachments: [],
      comments: [],
      subtasks: [
        { id: 1, title: "Compile weekly stats", completed: false },
        { id: 2, title: "Create presentation", completed: false },
        { id: 3, title: "Send agenda to team", completed: false },
      ],
      tags: ["meeting", "presentation", "team"],
      dependencies: [],
    },
  ]);

  // Task Categories
  const categories = [
    {
      id: 1,
      name: "KYC Processing",
      color: "from-emerald-500 to-teal-500",
      count: 3,
    },
    {
      id: 2,
      name: "Customer Support",
      color: "from-sky-500 to-blue-500",
      count: 5,
    },
    {
      id: 3,
      name: "Loan Processing",
      color: "from-violet-500 to-purple-500",
      count: 2,
    },
    {
      id: 4,
      name: "Fraud Management",
      color: "from-rose-500 to-pink-500",
      count: 1,
    },
    {
      id: 5,
      name: "Documentation",
      color: "from-amber-500 to-orange-500",
      count: 2,
    },
    { id: 6, name: "Meeting", color: "from-cyan-500 to-sky-500", count: 1 },
  ];

  // Task Statistics
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    pending: tasks.filter((t) => t.status === "pending").length,
    overdue: tasks.filter(
      (t) => new Date(t.dueDate) < new Date() && t.status !== "completed",
    ).length,
    highPriority: tasks.filter(
      (t) => t.priority === "high" || t.priority === "urgent",
    ).length,
  };

  // New Task Form
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    category: "KYC Processing",
    dueDate: "",
    estimatedHours: "",
    assignedTo: [],
    attachments: [],
    tags: [],
    subtasks: [],
  });

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setTaskForm({
      ...taskForm,
      [name]: value,
    });
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setTaskForm({
      ...taskForm,
      attachments: [...taskForm.attachments, ...files.map((f) => f.name)],
    });
    toast.success(`${files.length} file(s) uploaded`);
  };

  // Create new task
  const handleCreateTask = () => {
    setLoading(true);

    // Validate form
    if (!taskForm.title || !taskForm.description || !taskForm.dueDate) {
      toast.error("Please fill in all required fields");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const newTask = {
        id: `TSK-${String(tasks.length + 1).padStart(3, "0")}`,
        ...taskForm,
        status: "pending",
        assignedBy: employeeInfo.name,
        assignedTo: [employeeInfo.name],
        createdDate: new Date().toISOString().split("T")[0],
        completedDate: null,
        loggedHours: 0,
        progress: 0,
        comments: [],
        dependencies: [],
      };

      setTasks([newTask, ...tasks]);
      toast.success("Task created successfully");
      setShowTaskModal(false);
      setTaskForm({
        title: "",
        description: "",
        priority: "medium",
        category: "KYC Processing",
        dueDate: "",
        estimatedHours: "",
        assignedTo: [],
        attachments: [],
        tags: [],
        subtasks: [],
      });
      setLoading(false);
    }, 1500);
  };

  // Update task status
  const handleUpdateStatus = (taskId, newStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
              completedDate:
                newStatus === "completed"
                  ? new Date().toISOString().split("T")[0]
                  : task.completedDate,
              progress: newStatus === "completed" ? 100 : task.progress,
            }
          : task,
      ),
    );
    toast.success(`Task status updated to ${newStatus}`);
  };

  // Update task progress
  const handleUpdateProgress = (taskId, progress) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, progress: progress } : task,
      ),
    );
  };

  // Log hours
  const handleLogHours = (taskId, hours) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, loggedHours: task.loggedHours + hours }
          : task,
      ),
    );
    toast.success(`${hours} hours logged`);
  };

  // Toggle subtask completion
  const handleToggleSubtask = (taskId, subtaskId) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const updatedSubtasks = task.subtasks.map((subtask) =>
            subtask.id === subtaskId
              ? { ...subtask, completed: !subtask.completed }
              : subtask,
          );
          // Calculate progress based on subtasks
          const completedCount = updatedSubtasks.filter(
            (s) => s.completed,
          ).length;
          const progress =
            updatedSubtasks.length > 0
              ? Math.round((completedCount / updatedSubtasks.length) * 100)
              : task.progress;
          return { ...task, subtasks: updatedSubtasks, progress };
        }
        return task;
      }),
    );
  };

  // Add comment
  const handleAddComment = (taskId) => {
    if (!commentText.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    const newComment = {
      id: Date.now(),
      user: employeeInfo.name,
      avatar: employeeInfo.avatar,
      comment: commentText,
      timestamp: new Date().toLocaleString(),
    };

    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, comments: [...task.comments, newComment] }
          : task,
      ),
    );
    setCommentText("");
    toast.success("Comment added");
  };

  // Delete task
  const handleDeleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter((task) => task.id !== taskId));
      toast.success("Task deleted");
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "from-rose-500 to-pink-500";
      case "high":
        return "from-orange-500 to-red-500";
      case "medium":
        return "from-amber-500 to-yellow-500";
      case "low":
        return "from-emerald-500 to-teal-500";
      default:
        return "from-slate-500 to-gray-600";
    }
  };

  // Get priority icon
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "urgent":
        return <FaExclamationTriangle className="text-rose-500" />;
      case "high":
        return <FaFlag className="text-orange-500" />;
      case "medium":
        return <FaClock className="text-amber-500" />;
      case "low":
        return <FaCheckCircle className="text-emerald-500" />;
      default:
        return <FaTasks className="text-slate-500" />;
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-700";
      case "in-progress":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <FaCheckCircle className="text-emerald-600" />;
      case "in-progress":
        return <FaHourglassHalf className="text-blue-600" />;
      case "pending":
        return <FaClock className="text-amber-600" />;
      default:
        return <FaTasks className="text-slate-600" />;
    }
  };

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter((task) => {
      if (activeTab === "all") return true;
      if (activeTab === "pending") return task.status === "pending";
      if (activeTab === "in-progress") return task.status === "in-progress";
      if (activeTab === "completed") return task.status === "completed";
      if (activeTab === "overdue")
        return (
          new Date(task.dueDate) < new Date() && task.status !== "completed"
        );
      if (activeTab === "high-priority")
        return task.priority === "high" || task.priority === "urgent";
      return true;
    })
    .filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.id.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "dueDate") {
        return sortOrder === "asc"
          ? new Date(a.dueDate) - new Date(b.dueDate)
          : new Date(b.dueDate) - new Date(a.dueDate);
      }
      if (sortBy === "priority") {
        const priorityOrder = { urgent: 1, high: 2, medium: 3, low: 4 };
        return sortOrder === "asc"
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      if (sortBy === "progress") {
        return sortOrder === "asc"
          ? a.progress - b.progress
          : b.progress - a.progress;
      }
      return 0;
    });

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Task Management</h2>
          <p className="text-slate-500">
            Manage and track your daily tasks and assignments
          </p>
        </div>
        <button
          onClick={() => setShowTaskModal(true)}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center shadow-md"
        >
          <FaPlus className="mr-2" /> Create Task
        </button>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Total Tasks</p>
          <p className="text-2xl font-bold text-slate-800">{taskStats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Completed</p>
          <p className="text-2xl font-bold text-emerald-600">
            {taskStats.completed}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">In Progress</p>
          <p className="text-2xl font-bold text-blue-600">
            {taskStats.inProgress}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Pending</p>
          <p className="text-2xl font-bold text-amber-600">
            {taskStats.pending}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">Overdue</p>
          <p className="text-2xl font-bold text-rose-600">
            {taskStats.overdue}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <p className="text-sm text-slate-500">High Priority</p>
          <p className="text-2xl font-bold text-orange-600">
            {taskStats.highPriority}
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() =>
              setActiveTab(category.name.toLowerCase().replace(" ", "-"))
            }
            className={`bg-gradient-to-r ${category.color} rounded-xl p-4 text-white hover:shadow-lg transition-all hover:-translate-y-1`}
          >
            <p className="text-lg font-bold">{category.count}</p>
            <p className="text-sm opacity-90">{category.name}</p>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("all")}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "all"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            All Tasks
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "pending"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveTab("in-progress")}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "in-progress"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "completed"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveTab("overdue")}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "overdue"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            Overdue
            {taskStats.overdue > 0 && (
              <span className="ml-2 bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full text-xs">
                {taskStats.overdue}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("high-priority")}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "high-priority"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            High Priority
          </button>
        </nav>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex bg-white rounded-lg border border-slate-300">
          <button
            onClick={() => setViewMode("list")}
            className={`px-4 py-2 rounded-l-lg ${
              viewMode === "list"
                ? "bg-emerald-600 text-white"
                : "hover:bg-slate-100 text-slate-600"
            }`}
          >
            <FaThList />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`px-4 py-2 ${
              viewMode === "grid"
                ? "bg-emerald-600 text-white"
                : "hover:bg-slate-100 text-slate-600"
            }`}
          >
            <FaThLarge />
          </button>
          <button
            onClick={() => setViewMode("board")}
            className={`px-4 py-2 rounded-r-lg ${
              viewMode === "board"
                ? "bg-emerald-600 text-white"
                : "hover:bg-slate-100 text-slate-600"
            }`}
          >
            <FaTasks />
          </button>
        </div>

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="progress">Progress</option>
        </select>

        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
        >
          {sortOrder === "asc" ? <FaAngleUp /> : <FaAngleDown />}
        </button>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center"
        >
          <FaFilter className="mr-2" /> Filters
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
          <div className="grid md:grid-cols-4 gap-4">
            <select className="px-3 py-2 border border-slate-300 rounded-lg">
              <option>All Priorities</option>
              <option>Urgent</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <select className="px-3 py-2 border border-slate-300 rounded-lg">
              <option>All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id}>{cat.name}</option>
              ))}
            </select>
            <input
              type="date"
              placeholder="From Date"
              className="px-3 py-2 border border-slate-300 rounded-lg"
            />
            <input
              type="date"
              placeholder="To Date"
              className="px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
              Clear Filters
            </button>
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Task List View */}
      {viewMode === "list" && (
        <div className="space-y-4">
          {paginatedTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}
                    >
                      {task.status}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full bg-gradient-to-r ${getPriorityColor(task.priority)} text-white`}
                    >
                      {task.priority}
                    </span>
                    <span className="text-xs text-slate-400">{task.id}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    {task.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    {task.description}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-sm">
                      <span className="text-slate-500">Category:</span>
                      <span className="ml-2 text-slate-700">
                        {task.category}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-slate-500">Due Date:</span>
                      <span
                        className={`ml-2 ${
                          new Date(task.dueDate) < new Date() &&
                          task.status !== "completed"
                            ? "text-rose-600 font-semibold"
                            : "text-slate-700"
                        }`}
                      >
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-slate-500">Assigned By:</span>
                      <span className="ml-2 text-slate-700">
                        {task.assignedBy}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-slate-500">Hours:</span>
                      <span className="ml-2 text-slate-700">
                        {task.loggedHours}/{task.estimatedHours}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500">Progress</span>
                      <span className="text-slate-700">{task.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-emerald-600 h-2 rounded-full"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center space-x-2">
                    {task.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => {
                      setSelectedTask(task);
                      setShowDetailsModal(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="View Details"
                  >
                    <FaEye />
                  </button>
                  {task.status !== "completed" && (
                    <>
                      <button
                        onClick={() =>
                          handleUpdateStatus(task.id, "in-progress")
                        }
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Start Progress"
                      >
                        <FaHourglassHalf />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(task.id, "completed")}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                        title="Mark Complete"
                      >
                        <FaCheckCircle />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Grid View */}
      {viewMode === "grid" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}
                >
                  {task.status}
                </span>
                <span className="text-xs text-slate-400">{task.id}</span>
              </div>

              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                {task.title}
              </h3>
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                {task.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <FaCalendarAlt className="text-slate-400 mr-2" />
                  <span className="text-slate-600">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <FaUserCircle className="text-slate-400 mr-2" />
                  <span className="text-slate-600">{task.assignedBy}</span>
                </div>
                <div className="flex items-center text-sm">
                  {getPriorityIcon(task.priority)}
                  <span className="ml-2 text-slate-600 capitalize">
                    {task.priority} Priority
                  </span>
                </div>
              </div>

              {/* Progress Circle */}
              <div className="relative w-16 h-16 mx-auto mb-4">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#e2e8f0"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#10b981"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - task.progress / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-slate-700">
                  {task.progress}%
                </span>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <div className="flex space-x-1">
                  {task.tags.slice(0, 2).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                  {task.tags.length > 2 && (
                    <span className="text-xs text-slate-400">
                      +{task.tags.length - 2}
                    </span>
                  )}
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => {
                      setSelectedTask(task);
                      setShowDetailsModal(true);
                    }}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <FaEye />
                  </button>
                  {task.status !== "completed" && (
                    <button
                      onClick={() => handleUpdateStatus(task.id, "completed")}
                      className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                    >
                      <FaCheckCircle />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Board View */}
      {viewMode === "board" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pending Column */}
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-700">Pending</h3>
              <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs">
                {tasks.filter((t) => t.status === "pending").length}
              </span>
            </div>
            <div className="space-y-4">
              {tasks
                .filter((t) => t.status === "pending")
                .map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-lg shadow p-4 border border-slate-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full bg-gradient-to-r ${getPriorityColor(task.priority)} text-white`}
                      >
                        {task.priority}
                      </span>
                      <span className="text-xs text-slate-400">{task.id}</span>
                    </div>
                    <h4 className="font-medium text-slate-800 mb-2">
                      {task.title}
                    </h4>
                    <p className="text-xs text-slate-500 mb-3">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex -space-x-2">
                        <FaUserCircle className="text-slate-400 text-xl" />
                      </div>
                      <button
                        onClick={() => {
                          setSelectedTask(task);
                          setShowDetailsModal(true);
                        }}
                        className="text-xs text-emerald-600 hover:text-emerald-700"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-700">In Progress</h3>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                {tasks.filter((t) => t.status === "in-progress").length}
              </span>
            </div>
            <div className="space-y-4">
              {tasks
                .filter((t) => t.status === "in-progress")
                .map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-lg shadow p-4 border border-slate-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full bg-gradient-to-r ${getPriorityColor(task.priority)} text-white`}
                      >
                        {task.priority}
                      </span>
                      <span className="text-xs text-slate-400">{task.id}</span>
                    </div>
                    <h4 className="font-medium text-slate-800 mb-2">
                      {task.title}
                    </h4>
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-500">Progress</span>
                        <span className="text-slate-700">{task.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div
                          className="bg-emerald-600 h-1.5 rounded-full"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex -space-x-2">
                        <FaUserCircle className="text-slate-400 text-xl" />
                      </div>
                      <button
                        onClick={() => {
                          setSelectedTask(task);
                          setShowDetailsModal(true);
                        }}
                        className="text-xs text-emerald-600 hover:text-emerald-700"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Completed Column */}
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-700">Completed</h3>
              <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs">
                {tasks.filter((t) => t.status === "completed").length}
              </span>
            </div>
            <div className="space-y-4">
              {tasks
                .filter((t) => t.status === "completed")
                .map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-lg shadow p-4 border border-slate-200 hover:shadow-md transition-all opacity-75"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700">
                        Completed
                      </span>
                      <span className="text-xs text-slate-400">{task.id}</span>
                    </div>
                    <h4 className="font-medium text-slate-800 mb-2 line-through">
                      {task.title}
                    </h4>
                    <p className="text-xs text-slate-500 mb-3">
                      Completed:{" "}
                      {task.completedDate
                        ? new Date(task.completedDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          setSelectedTask(task);
                          setShowDetailsModal(true);
                        }}
                        className="text-xs text-emerald-600 hover:text-emerald-700"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaChevronLeft />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === i + 1
                  ? "bg-emerald-600 text-white"
                  : "border border-slate-300 hover:bg-slate-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaChevronRight />
          </button>
        </div>
      )}

      {/* Create Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">
                  Create New Task
                </h3>
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={taskForm.title}
                    onChange={handleFormChange}
                    placeholder="Enter task title"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={taskForm.description}
                    onChange={handleFormChange}
                    rows="4"
                    placeholder="Enter task description"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  ></textarea>
                </div>

                {/* Priority and Category */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={taskForm.priority}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={taskForm.category}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Due Date and Hours */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      name="dueDate"
                      value={taskForm.dueDate}
                      onChange={handleFormChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Estimated Hours
                    </label>
                    <input
                      type="number"
                      name="estimatedHours"
                      value={taskForm.estimatedHours}
                      onChange={handleFormChange}
                      min="1"
                      placeholder="Enter hours"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    placeholder="Enter tags separated by commas"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Attachments */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Attachments
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="task-file-upload"
                    />
                    <label
                      htmlFor="task-file-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      <FaCloudUploadAlt className="mr-2" /> Upload Files
                    </label>
                    <p className="text-xs text-slate-500 mt-2">
                      Supported: PDF, DOC, XLS, JPG (Max 10MB)
                    </p>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowTaskModal(false)}
                    className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateTask}
                    disabled={loading}
                    className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors flex items-center disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <FaSave className="mr-2" /> Create Task
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      {showDetailsModal && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <h3 className="text-xl font-bold text-slate-800">
                    Task Details
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedTask.status)}`}
                  >
                    {selectedTask.status}
                  </span>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-6">
                {/* Task Info */}
                <div>
                  <h4 className="text-lg font-semibold text-slate-800 mb-2">
                    {selectedTask.title}
                  </h4>
                  <p className="text-slate-600">{selectedTask.description}</p>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-lg">
                  <div>
                    <p className="text-xs text-slate-500">Task ID</p>
                    <p className="text-sm font-medium text-slate-800">
                      {selectedTask.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Category</p>
                    <p className="text-sm font-medium text-slate-800">
                      {selectedTask.category}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Priority</p>
                    <p className="text-sm font-medium capitalize text-slate-800">
                      {selectedTask.priority}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Assigned By</p>
                    <p className="text-sm font-medium text-slate-800">
                      {selectedTask.assignedBy}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Created Date</p>
                    <p className="text-sm font-medium text-slate-800">
                      {selectedTask.createdDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Due Date</p>
                    <p
                      className={`text-sm font-medium ${
                        new Date(selectedTask.dueDate) < new Date() &&
                        selectedTask.status !== "completed"
                          ? "text-rose-600"
                          : "text-slate-800"
                      }`}
                    >
                      {selectedTask.dueDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Hours Logged</p>
                    <p className="text-sm font-medium text-slate-800">
                      {selectedTask.loggedHours}/{selectedTask.estimatedHours}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Progress</p>
                    <p className="text-sm font-medium text-emerald-600">
                      {selectedTask.progress}%
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-700">Overall Progress</span>
                    <span className="text-slate-700">
                      {selectedTask.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-emerald-600 h-3 rounded-full"
                      style={{ width: `${selectedTask.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Subtasks */}
                {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-slate-800 mb-3">
                      Subtasks
                    </h5>
                    <div className="space-y-2">
                      {selectedTask.subtasks.map((subtask) => (
                        <div
                          key={subtask.id}
                          className="flex items-center space-x-3"
                        >
                          <input
                            type="checkbox"
                            checked={subtask.completed}
                            onChange={() =>
                              handleToggleSubtask(selectedTask.id, subtask.id)
                            }
                            className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                          />
                          <span
                            className={`text-sm ${subtask.completed ? "line-through text-slate-400" : "text-slate-700"}`}
                          >
                            {subtask.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attachments */}
                {selectedTask.attachments &&
                  selectedTask.attachments.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-slate-800 mb-3">
                        Attachments
                      </h5>
                      <div className="space-y-2">
                        {selectedTask.attachments.map((file, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-slate-50 p-2 rounded"
                          >
                            <div className="flex items-center">
                              <FaFileAlt className="text-slate-400 mr-2" />
                              <span className="text-sm text-slate-700">
                                {file}
                              </span>
                            </div>
                            <button className="text-emerald-600 hover:text-emerald-700">
                              <FaDownload />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Comments */}
                <div>
                  <h5 className="font-semibold text-slate-800 mb-3">
                    Comments
                  </h5>
                  <div className="space-y-4 mb-4">
                    {selectedTask.comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-3">
                        <img
                          src={comment.avatar}
                          alt={comment.user}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-800">
                              {comment.user}
                            </p>
                            <p className="text-xs text-slate-400">
                              {comment.timestamp}
                            </p>
                          </div>
                          <p className="text-sm text-slate-600">
                            {comment.comment}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Comment */}
                  <div className="flex space-x-3">
                    <img
                      src={employeeInfo.avatar}
                      alt={employeeInfo.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <textarea
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        rows="2"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      ></textarea>
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => handleAddComment(selectedTask.id)}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center"
                        >
                          <FaPaperPlane className="mr-2" /> Post Comment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {selectedTask.status !== "completed" && (
                  <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                    <button
                      onClick={() => {
                        handleLogHours(selectedTask.id, 1);
                      }}
                      className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
                    >
                      Log Hours
                    </button>
                    <button
                      onClick={() => {
                        handleUpdateStatus(selectedTask.id, "completed");
                        setShowDetailsModal(false);
                      }}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                      Mark Complete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;
