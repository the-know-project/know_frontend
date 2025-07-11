import { useState } from "react";
import { Eye, Users, UserPlus, BarChart3, ChevronDown } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import Card from "../../../shared/ui/card";
import DropdownMenu from "../../../shared/ui/dropdown-menu";
import { cn } from "../../../utils/cn";
export default function AnalyticsPage() {
  const [selectedRange, setSelectedRange] = useState("Monthly");

  const earningsData = [
    { name: "Mar", earnings: 10 },
    { name: "Apr", earnings: 30 },
    { name: "May", earnings: 20 },
    { name: "Jun", earnings: 50 },
    { name: "Jul", earnings: 65 },
    { name: "Aug", earnings: 40 },
    { name: "Sep", earnings: 85 },
    { name: "Oct", earnings: 60 },
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Audience Overview */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card icon={<Users />} label="Followers" value="1,365" />
        <Card icon={<Eye />} label="Post Views" value="1,504,003" />
        <Card icon={<UserPlus />} label="Following" value="393" />
        <Card icon={<BarChart3 />} label="Profile Views" value="2,043" />
      </div>

      {/* Engagement Insights (no gauge) */}
      <Card title="Buyer Engagement Insights">
        <div className="flex flex-col items-center justify-center py-6">
          <motion.div
            className="flex h-24 w-24 items-center justify-center rounded-full border-8 border-orange-500 text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <p className="text-sm font-semibold">Engagement</p>
              <p className="text-muted-foreground text-xs">Insights</p>
            </div>
          </motion.div>
          <p className="text-muted-foreground mt-4 text-center text-xs">
            Top Interested Buyers (70%) & Conversion Rate (30%)
          </p>
        </div>
      </Card>

      {/* Earnings Chart */}
      <Card
        title="Earnings"
        action={
          <DropdownMenu selected={selectedRange} onChange={setSelectedRange} />
        }
      >
        <div className="mb-4 text-3xl font-bold">$120,785</div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={earningsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="earnings"
              stroke="#f97316"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Post Performance */}
      <Card title="All Time Post Performance">
        <div className="space-y-6">
          {[
            {
              image: "/Painting1.png",
              title: "The Man",
              date: "Published Oct 2, 2024",
              views: "1,765",
              followers: "546",
              engagement: "3,440",
            },
            {
              image: "/Painting2.png",
              title: "Kamari Woman",
              date: "Published Nov 8, 2024",
              views: "18,980",
              followers: "452",
              engagement: "10,900",
            },
          ].map((post, idx) => (
            <motion.div
              key={idx}
              className="grid grid-cols-4 items-center gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
            >
              <img
                src={post.image}
                alt={post.title}
                className="h-16 w-16 rounded-md object-cover"
              />
              <div>
                <p className="font-semibold">{post.title}</p>
                <p className="text-muted-foreground text-sm">{post.date}</p>
              </div>
              <div className="text-center">
                <p className="font-bold">{post.views}</p>
                <p className="text-muted-foreground text-sm">Views</p>
              </div>
              <div className="text-center">
                <p className="font-bold">{post.followers}</p>
                <p className="text-muted-foreground text-sm">Followers</p>
                <p className="font-semibold text-orange-500">
                  {post.engagement}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
