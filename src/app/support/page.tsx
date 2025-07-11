"use client"

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const requests = ["Refund Request", "Technical Issue", "Account Support"];

export default function SupportTicketPage() {
  const [selectedType, setSelectedType] = useState("");
  const [remark, setRemark] = useState("");

  const supportHistory = [
    {
      id: "ST46728399",
      type: "Refund Request",
      date: "16/02/2025",
      status: "In Progress",
    },
    {
      id: "ST67928396",
      type: "Refund Request",
      date: "25/01/2025",
      status: "Completed",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-10">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Support Ticket</h2>
        <p className="mt-1 text-sm text-gray-500">
          Need help? We're here for you whenever you run into an issue.
        </p>
      </div>

      {/* Form */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-800">
          Create a new ticket
        </h3>
        <p className="text-sm text-gray-500">
          Fill in the right information here and click submit.
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Select request type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Request type</option>
              {requests.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Customer Name
            </label>
            <input
              type="text"
              value="Hydon Precious"
              className="w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm"
              readOnly
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Ticket Number
            </label>
            <input
              type="text"
              value="123478992201"
              className="w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm"
              readOnly
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="text"
              value="21/03/2025"
              className="w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm"
              readOnly
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Remarks
            </label>
            <input
              type="text"
              placeholder="Input remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <button className="mt-4 rounded-md bg-blue-900 px-6 py-2 text-sm font-medium text-white transition hover:bg-blue-800">
            Submit Ticket
          </button>
        </div>
      </div>

      {/* Support History */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-800">Support History</h3>
        <p className="text-sm text-gray-500">
          Here is your most recent history.
        </p>

        <div className="divide-y divide-gray-200">
          {supportHistory.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className="grid grid-cols-4 py-4 text-sm"
            >
              <div>
                <p className="font-medium text-gray-900">{item.id}</p>
                <p className="text-gray-500">Ticket number</p>
              </div>
              <div>
                <p className="text-gray-700">{item.type}</p>
                <p className="text-gray-500">Request type</p>
              </div>
              <div>
                <p className="text-gray-700">{item.date}</p>
                <p className="text-gray-500">Date</p>
              </div>
              <div>
                <p
                  className={
                    item.status === "Completed"
                      ? "font-medium text-green-600"
                      : "font-medium text-orange-500"
                  }
                >
                  {item.status}
                </p>
                <p className="text-gray-500">Request Status</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
