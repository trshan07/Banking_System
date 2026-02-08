import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";

const CreateTicket = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [attachments, setAttachments] = useState([]);
  const [submitting, setSubmitting] = useState(false);

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

  const priorities = [
    { value: "Low", label: "Low - General inquiry" },
    { value: "Medium", label: "Medium - Account issues" },
    { value: "High", label: "High - Transaction problems" },
    { value: "Critical", label: "Critical - Security issues" },
  ];

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newAttachments = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (id) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const onSubmit = async (data) => {
    setSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Ticket data:", { ...data, attachments });
      // Here you would send data to your backend
      setSubmitting(false);
      navigate("/support", {
        state: { message: "Ticket created successfully!" },
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/support"
            className="text-blue-600 hover:text-blue-700 mb-4 inline-block"
          >
            ← Back to Support Tickets
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Create Support Ticket
          </h1>
          <p className="text-gray-600 mt-2">
            We're here to help! Please provide detailed information about your
            issue.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-lg shadow p-6"
        >
          {/* Subject */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <input
              type="text"
              {...register("subject", {
                required: "Subject is required",
                minLength: {
                  value: 10,
                  message: "Subject must be at least 10 characters",
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Briefly describe your issue..."
            />
            {errors.subject && (
              <p className="text-red-500 text-sm mt-1">
                {errors.subject.message}
              </p>
            )}
          </div>

          {/* Category and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority *
              </label>
              <select
                {...register("priority", { required: "Priority is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select priority level</option>
                {priorities.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
              {errors.priority && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.priority.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description *
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 50,
                  message: "Please provide at least 50 characters of detail",
                },
              })}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Please provide detailed information about your issue. Include any error messages, steps to reproduce, and what you were trying to accomplish..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              The more details you provide, the faster we can help you.
            </p>
          </div>

          {/* Attachments */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="text-gray-400 text-4xl mb-2">📎</div>
                <p className="text-gray-600">
                  Click to upload files or drag and drop
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Supports JPG, PNG, PDF, DOC - Max 10MB per file
                </p>
              </label>
            </div>

            {/* Attachments List */}
            {attachments.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Selected Files:
                </h4>
                <div className="space-y-2">
                  {attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                    >
                      <div className="flex items-center">
                        <span className="text-gray-400 mr-3">📄</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {attachment.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(attachment.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(attachment.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contact Preferences */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Contact Method
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  {...register("contactMethod")}
                  value="email"
                  defaultChecked
                  className="mr-2"
                />
                <span className="text-gray-700">Email</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  {...register("contactMethod")}
                  value="phone"
                  className="mr-2"
                />
                <span className="text-gray-700">Phone Call</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  {...register("contactMethod")}
                  value="both"
                  className="mr-2"
                />
                <span className="text-gray-700">Both Email and Phone</span>
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Link
              to="/support"
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? "Creating Ticket..." : "Create Ticket"}
            </button>
          </div>
        </form>

        {/* Help Tips */}
        <div className="mt-6 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Tips for Faster Resolution
          </h3>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>
              • Include specific error messages or transaction IDs when
              applicable
            </li>
            <li>• Provide step-by-step instructions to reproduce the issue</li>
            <li>• Mention when the issue first started occurring</li>
            <li>• Include screenshots for visual issues</li>
            <li>
              • Specify your device and browser information for technical issues
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;
