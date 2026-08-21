"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn, formatNumber } from "@/lib/utils";
import { useSound } from "@/lib/sound";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changePositive?: boolean;
  icon: React.ReactNode;
  color: "cyan" | "violet" | "gold" | "pink";
}

function StatCard({ title, value, change, changePositive, icon, color }: StatCardProps) {
  const colorClasses = {
    cyan: "bg-neon-cyan/10 border-neon-cyan/20 text-neon-cyan",
    violet: "bg-neon-violet/10 border-neon-violet/20 text-neon-violet",
    gold: "bg-neon-gold/10 border-neon-gold/20 text-neon-gold",
    pink: "bg-pink-500/10 border-pink-500/20 text-pink-500",
  };

  return (
    <Card variant="glass" hover padding="lg" className={cn("border", colorClasses[color].replace("text-", "border-"))}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-caption text-ghost-muted mb-2">{title}</p>
          <p className="font-display font-bold text-display-md text-ghost-white">{value}</p>
          {change && (
            <p className={cn("mt-1 text-body-sm font-medium", changePositive ? "text-green-400" : "text-red-400")}>
              {change}
            </p>
          )}
        </div>
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", colorClasses[color])}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

export default function AdminDashboard() {
  const { playUIHover, playUIClick } = useSound();
  const [stats, setStats] = useState({
    visitors: { value: "12,341", change: "+12.5%", positive: true },
    pageViews: { value: "89,234", change: "+8.2%", positive: true },
    uniqueVisitors: { value: "9,876", change: "+15.1%", positive: true },
    videoClicks: { value: "3,421", change: "+22.4%", positive: true },
    joinRegistrations: { value: "567", change: "+34.2%", positive: true },
    feedbackCount: { value: "89", change: "+5", positive: true },
  });
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: "join", message: "New subscriber: john@example.com", time: "2 min ago" },
    { id: 2, type: "feedback", message: "New feedback: 5★ - Videos category", time: "15 min ago" },
    { id: 3, type: "video", message: "Video synced: \"Elden Ring DLC First Impressions\"", time: "1 hour ago" },
    { id: 4, type: "contact", message: "New contact message from jane@company.com", time: "3 hours ago" },
    { id: 5, type: "sync", message: "YouTube sync completed: 3 new videos added", time: "4 hours ago" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        visitors: { ...prev.visitors, value: String(parseInt(prev.visitors.value.replace(/,/g, "")) + Math.floor(Math.random() * 3)) },
        pageViews: { ...prev.pageViews, value: String(parseInt(prev.pageViews.value.replace(/,/g, "")) + Math.floor(Math.random() * 10)) },
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4"
      >
        <div>
          <h1 className="font-display font-bold text-display-xl text-ghost-white">DASHBOARD</h1>
          <p className="text-body-base text-ghost-muted mt-1">Real-time overview of your digital abyss</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => playUIClick()}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M4 4v15.393M4 4h15.393M4 4c5.737 0 10.393-4.656 10.393-10.393" /></svg>
            REFRESH
          </Button>
          <Button variant="secondary" size="sm" onClick={() => playUIClick()}>
            EXPORT REPORT
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5"
      >
        <StatCard
          title="VISITORS (30D)"
          value={stats.visitors.value}
          change={stats.visitors.change}
          changePositive={stats.visitors.positive}
          color="cyan"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
        />
        <StatCard
          title="PAGE VIEWS (30D)"
          value={stats.pageViews.value}
          change={stats.pageViews.change}
          changePositive={stats.pageViews.positive}
          color="violet"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>}
        />
        <StatCard
          title="UNIQUE VISITORS"
          value={stats.uniqueVisitors.value}
          change={stats.uniqueVisitors.change}
          changePositive={stats.uniqueVisitors.positive}
          color="cyan"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>}
        />
        <StatCard
          title="VIDEO CLICKS"
          value={stats.videoClicks.value}
          change={stats.videoClicks.change}
          changePositive={stats.videoClicks.positive}
          color="violet"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><polygon points="5 3 19 12 5 21 5 3" /></svg>}
        />
        <StatCard
          title="JOIN REGISTRATIONS"
          value={stats.joinRegistrations.value}
          change={stats.joinRegistrations.change}
          changePositive={stats.joinRegistrations.positive}
          color="gold"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>}
        />
        <StatCard
          title="FEEDBACK RECEIVED"
          value={stats.feedbackCount.value}
          change={stats.feedbackCount.change}
          changePositive={stats.feedbackCount.positive}
          color="pink"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card variant="glass" padding="lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-semibold text-display-sm text-ghost-white">RECENT ACTIVITY</h2>
              <Button variant="ghost" size="sm" onClick={() => playUIClick()}>VIEW ALL</Button>
            </div>
            <div className="space-y-3">
              {recentActivity.map((activity, i) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 p-4 glass rounded-xl border-glass-border/50 hover:border-neon-cyan/30 transition-all"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                    activity.type === "join" && "bg-neon-cyan/10 text-neon-cyan",
                    activity.type === "feedback" && "bg-neon-violet/10 text-neon-violet",
                    activity.type === "video" && "bg-neon-gold/10 text-neon-gold",
                    activity.type === "contact" && "bg-pink-500/10 text-pink-500",
                    activity.type === "sync" && "bg-neon-cyan/10 text-neon-cyan"
                  )}>
                    {activity.type === "join" && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>}
                    {activity.type === "feedback" && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>}
                    {activity.type === "video" && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3" /></svg>}
                    {activity.type === "contact" && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>}
                    {activity.type === "sync" && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M23 4v6h-6" /><path d="M1 20v-6h6" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body-sm text-ghost-white truncate">{activity.message}</p>
                    <p className="text-caption text-ghost-muted">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card variant="glass" padding="lg">
            <h2 className="font-display font-semibold text-display-sm text-ghost-white mb-6">QUICK ACTIONS</h2>
            <div className="space-y-3">
              <Button variant="secondary" className="w-full justify-start" onClick={() => playUIClick()}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                ADD FEATURED VIDEO
              </Button>
              <Button variant="secondary" className="w-full justify-start" onClick={() => playUIClick()}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                UPLOAD GALLERY IMAGE
              </Button>
              <Button variant="secondary" className="w-full justify-start" onClick={() => playUIClick()}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                CREATE ANNOUNCEMENT
              </Button>
              <Button variant="secondary" className="w-full justify-start" onClick={() => playUIClick()}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M23 4v6h-6" /><path d="M1 20v-6h6" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
                TRIGGER YOUTUBE SYNC
              </Button>
              <Button variant="secondary" className="w-full justify-start" onClick={() => playUIClick()}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                SEND TEST NOTIFICATION
              </Button>
              <Button variant="secondary" className="w-full justify-start" onClick={() => playUIClick()}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                VIEW SECURITY LOGS
              </Button>
            </div>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}