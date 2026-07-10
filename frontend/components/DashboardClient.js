"use client";

import { useState } from "react";
import DashboardLayout from "./DashboardLayout";
import DashboardOverview from "./DashboardOverview";
import DataTable from "./DataTable";
import MediaGallery from "./MediaGallery";
import ServerMonitor from "./ServerMonitor";
import TagsManager from "./TagsManager";

export default function DashboardClient({ posts, toolsPosts, stats, mediaFiles = [] }) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === "overview" && (
        <DashboardOverview stats={stats} />
      )}
      
      {activeTab === "posts" && (
        <DataTable 
          data={posts} 
          type="posts" 
          title="Tất cả bài viết" 
          description="Quản lý các bài viết trên blog của bạn" 
        />
      )}
      
      {activeTab === "tools" && (
        <DataTable 
          data={toolsPosts} 
          type="tools" 
          title="Tất cả ứng dụng" 
          description="Quản lý các trang công cụ và ứng dụng" 
        />
      )}

      {activeTab === "tags" && (
        <TagsManager posts={posts} toolsPosts={toolsPosts} />
      )}
      
      {activeTab === "media" && (
        <MediaGallery mediaFiles={mediaFiles} />
      )}
      
      {activeTab === "server" && (
        <ServerMonitor />
      )}
    </DashboardLayout>
  );
}
