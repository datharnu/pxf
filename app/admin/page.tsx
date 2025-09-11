/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import NextImage from "next/image"; // Not used in current implementation
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Calendar,
  BarChart3,
  FileImage,
  LogOut,
  Shield,
  Activity,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { clearAuthData } from "@/app/utils/auth";
import {
  getAdminStats,
  getAdminUsers,
  getAdminEvents,
  getAdminMedia,
  getAdminPayments,
  toggleUserStatus,
  toggleEventStatus,
  moderateMedia,
  formatAdminDate,
  formatFileSize,
  getRoleBadgeStyle,
  getStatusBadgeStyle,
  getMediaTypeBadgeStyle,
  getMediaTypeIcon,
  formatCurrency,
  getPaymentStatusBadgeStyle,
  getPaymentMethodIcon,
  type AdminStats,
  type AdminUser,
  type AdminEvent,
  type AdminMedia,
  type AdminPayment,
} from "@/app/utils/admin";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "users" | "events" | "media" | "payments"
  >("dashboard");

  const [usersPage, setUsersPage] = useState(1);
  const [eventsPage, setEventsPage] = useState(1);
  const [mediaPage, setMediaPage] = useState(1);
  const [mediaTypeFilter, setMediaTypeFilter] = useState<
    "all" | "image" | "video"
  >("all");
  const [selectedMedia, setSelectedMedia] = useState<AdminMedia | null>(null);
  const [paymentsPage, setPaymentsPage] = useState(1);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<
    "all" | "pending" | "paid" | "failed" | "refunded"
  >("all");

  // Admin access is now handled by AdminRouteGuard in layout

  // Fetch admin stats
  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["admin-stats"],
    queryFn: getAdminStats,
    enabled: activeTab === "dashboard",
  });

  // Fetch users
  const {
    data: usersData,
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["admin-users", usersPage],
    queryFn: () => getAdminUsers(usersPage, 10),
    enabled: activeTab === "users",
  });

  // Fetch events
  const {
    data: eventsData,
    isLoading: eventsLoading,
    refetch: refetchEvents,
  } = useQuery({
    queryKey: ["admin-events", eventsPage],
    queryFn: () => getAdminEvents(eventsPage, 10),
    enabled: activeTab === "events",
  });

  // Fetch media
  const {
    data: mediaData,
    isLoading: mediaLoading,
    refetch: refetchMedia,
  } = useQuery({
    queryKey: ["admin-media", mediaPage, mediaTypeFilter],
    queryFn: () =>
      getAdminMedia(
        mediaPage,
        10,
        mediaTypeFilter === "all" ? undefined : mediaTypeFilter
      ),
    enabled: activeTab === "media",
  });

  // Fetch payments
  const { data: paymentsData, isLoading: paymentsLoading } = useQuery({
    queryKey: ["admin-payments", paymentsPage, paymentStatusFilter],
    queryFn: () =>
      getAdminPayments(
        paymentsPage,
        10,
        paymentStatusFilter === "all" ? undefined : paymentStatusFilter
      ),
    enabled: activeTab === "payments",
  });

  // Debug media data
  useEffect(() => {
    if (mediaData) {
      console.log("Media data received:", mediaData);
      if (mediaData?.data?.[0]) {
        const sampleMedia = mediaData.data[0];
        console.log("Sample media item:", sampleMedia);
        console.log("File URL:", sampleMedia.fileUrl);
        console.log("Thumbnail URL:", sampleMedia.thumbnailUrl);
        console.log("File Type:", sampleMedia.fileType);
        console.log("Filename:", sampleMedia.filename);
        console.log("Original Name:", sampleMedia.originalName);
      }
    }
  }, [mediaData]);

  const handleLogout = () => {
    clearAuthData();
    router.push("/");
    toast.success("Logged out successfully");
  };

  const handleToggleUserStatus = async (
    userId: string,
    currentStatus: boolean
  ) => {
    try {
      await toggleUserStatus(userId);
      toast.success(
        `User ${currentStatus ? "deactivated" : "activated"} successfully`
      );
      refetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to update user status");
    }
  };

  const handleToggleEventStatus = async (
    eventId: string,
    currentStatus: boolean
  ) => {
    try {
      await toggleEventStatus(eventId);
      toast.success(
        `Event ${currentStatus ? "deactivated" : "activated"} successfully`
      );
      refetchEvents();
    } catch (error: any) {
      toast.error(error.message || "Failed to update event status");
    }
  };

  const handleModerateMedia = async (
    mediaId: string,
    action: "approve" | "reject" | "delete"
  ) => {
    try {
      await moderateMedia(mediaId, action);
      const actionText =
        action === "approve"
          ? "approved"
          : action === "reject"
          ? "rejected"
          : "deleted";
      toast.success(`Media ${actionText} successfully`);
      refetchMedia();
    } catch (error: any) {
      toast.error(error.message || "Failed to moderate media");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-orange-500" />
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "dashboard"
                  ? "border-orange-500 text-orange-500"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "users"
                  ? "border-orange-500 text-orange-500"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Users</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "events"
                  ? "border-orange-500 text-orange-500"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Events</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("media")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "media"
                  ? "border-orange-500 text-orange-500"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileImage className="h-4 w-4" />
                <span>Media</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("payments")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "payments"
                  ? "border-orange-500 text-orange-500"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Payments</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Dashboard Overview</h2>

            {statsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-800 rounded-lg p-6 animate-pulse"
                  >
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-gray-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Users</p>
                      <p className="text-3xl font-bold text-white">
                        {stats?.data?.totals?.users || 0}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Events</p>
                      <p className="text-3xl font-bold text-white">
                        {stats?.data?.totals?.events || 0}
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-green-500" />
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Media</p>
                      <p className="text-3xl font-bold text-white">
                        {stats?.data?.totals?.media || 0}
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-orange-500" />
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">
                        New Users (7 days)
                      </p>
                      <p className="text-3xl font-bold text-white">
                        {stats?.data?.last7Days?.users || 0}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-cyan-500" />
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">
                        New Events (7 days)
                      </p>
                      <p className="text-3xl font-bold text-white">
                        {stats?.data?.last7Days?.events || 0}
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-purple-500" />
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">
                        New Media (7 days)
                      </p>
                      <p className="text-3xl font-bold text-white">
                        {stats?.data?.last7Days?.media || 0}
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-pink-500" />
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Revenue</p>
                      <p className="text-3xl font-bold text-white">
                        ₦
                        {stats?.data?.payments?.totalRevenue?.toLocaleString() ||
                          0}
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-green-500" />
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Paid Events</p>
                      <p className="text-3xl font-bold text-white">
                        {stats?.data?.payments?.paid || 0}
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-emerald-500" />
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Free Events</p>
                      <p className="text-3xl font-bold text-white">
                        {stats?.data?.payments?.free || 0}
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-500" />
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Pending Payments</p>
                      <p className="text-3xl font-bold text-white">
                        {stats?.data?.payments?.pending || 0}
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-yellow-500" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">User Management</h2>

            {usersLoading ? (
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="animate-pulse space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-700 rounded"></div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {usersData?.data?.map((user: AdminUser) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-white">
                                {user.fullname}
                              </div>
                              <div className="text-sm text-gray-400">
                                {user.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeStyle(
                                user.role
                              )}`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeStyle(
                                user.isActive
                              )}`}
                            >
                              {user.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {formatAdminDate(user.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() =>
                                handleToggleUserStatus(user.id, user.isActive)
                              }
                              className={`${
                                user.isActive
                                  ? "text-red-600 hover:text-red-900"
                                  : "text-green-600 hover:text-green-900"
                              }`}
                            >
                              {user.isActive ? "Deactivate" : "Activate"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {usersData?.pagination && (
                  <div className="bg-gray-700 px-4 py-3 flex items-center justify-between border-t border-gray-600">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => setUsersPage(Math.max(1, usersPage - 1))}
                        disabled={usersPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setUsersPage(usersPage + 1)}
                        disabled={usersPage >= usersData.pagination.pages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-300">
                          Showing{" "}
                          <span className="font-medium">
                            {(usersPage - 1) * 10 + 1}
                          </span>{" "}
                          to{" "}
                          <span className="font-medium">
                            {Math.min(
                              usersPage * 10,
                              usersData.pagination.total
                            )}
                          </span>{" "}
                          of{" "}
                          <span className="font-medium">
                            {usersData.pagination.total}
                          </span>{" "}
                          results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          <button
                            onClick={() =>
                              setUsersPage(Math.max(1, usersPage - 1))
                            }
                            disabled={usersPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-500 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                          >
                            Previous
                          </button>
                          <button
                            onClick={() => setUsersPage(usersPage + 1)}
                            disabled={usersPage >= usersData.pagination.pages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-500 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                          >
                            Next
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Event Management</h2>

            {eventsLoading ? (
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="animate-pulse space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-700 rounded"></div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Event
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Creator
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {eventsData?.data?.map((event: AdminEvent) => (
                        <tr key={event.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-white">
                                {event.title}
                              </div>
                              <div className="text-sm text-gray-400 truncate max-w-xs">
                                {event.description}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm text-white">
                                {event.creator.fullname}
                              </div>
                              <div className="text-sm text-gray-400">
                                {event.creator.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {formatAdminDate(event.eventDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeStyle(
                                event.isActive
                              )}`}
                            >
                              {event.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() =>
                                handleToggleEventStatus(
                                  event.id,
                                  event.isActive
                                )
                              }
                              className={`${
                                event.isActive
                                  ? "text-red-600 hover:text-red-900"
                                  : "text-green-600 hover:text-green-900"
                              }`}
                            >
                              {event.isActive ? "Deactivate" : "Activate"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {eventsData?.pagination && (
                  <div className="bg-gray-700 px-4 py-3 flex items-center justify-between border-t border-gray-600">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() =>
                          setEventsPage(Math.max(1, eventsPage - 1))
                        }
                        disabled={eventsPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setEventsPage(eventsPage + 1)}
                        disabled={eventsPage >= eventsData.pagination.pages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-300">
                          Showing{" "}
                          <span className="font-medium">
                            {(eventsPage - 1) * 10 + 1}
                          </span>{" "}
                          to{" "}
                          <span className="font-medium">
                            {Math.min(
                              eventsPage * 10,
                              eventsData.pagination.total
                            )}
                          </span>{" "}
                          of{" "}
                          <span className="font-medium">
                            {eventsData.pagination.total}
                          </span>{" "}
                          results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          <button
                            onClick={() =>
                              setEventsPage(Math.max(1, eventsPage - 1))
                            }
                            disabled={eventsPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-500 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                          >
                            Previous
                          </button>
                          <button
                            onClick={() => setEventsPage(eventsPage + 1)}
                            disabled={eventsPage >= eventsData.pagination.pages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-500 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                          >
                            Next
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Media Tab */}
        {activeTab === "media" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Media Management</h2>

              {/* Media Type Filter */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setMediaTypeFilter("all")}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    mediaTypeFilter === "all"
                      ? "bg-orange-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  All Media
                </button>
                <button
                  onClick={() => setMediaTypeFilter("image")}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    mediaTypeFilter === "image"
                      ? "bg-orange-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Images
                </button>
                <button
                  onClick={() => setMediaTypeFilter("video")}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    mediaTypeFilter === "video"
                      ? "bg-orange-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Videos
                </button>
              </div>
            </div>

            {mediaLoading ? (
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="animate-pulse space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-700 rounded"></div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Media
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Event
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Uploader
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Type & Size
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Uploaded
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {mediaData?.data?.map((media: AdminMedia) => (
                        <tr key={media.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                {(() => {
                                  // Determine if it's an image based on fileType or filename
                                  const isImage =
                                    media.fileType?.startsWith("image/") ||
                                    media.filename?.match(
                                      /\.(jpg|jpeg|png|gif|webp|svg)$/i
                                    ) ||
                                    media.originalName?.match(
                                      /\.(jpg|jpeg|png|gif|webp|svg)$/i
                                    );

                                  const isVideo =
                                    media.fileType?.startsWith("video/") ||
                                    media.filename?.match(
                                      /\.(mp4|avi|mov|wmv|flv|webm|mkv)$/i
                                    ) ||
                                    media.originalName?.match(
                                      /\.(mp4|avi|mov|wmv|flv|webm|mkv)$/i
                                    );

                                  if (isImage) {
                                    const imageUrl =
                                      media.thumbnailUrl || media.fileUrl;
                                    console.log(
                                      "Attempting to load image:",
                                      imageUrl
                                    );

                                    return (
                                      <div
                                        className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-700 cursor-pointer hover:opacity-80 transition-opacity"
                                        onClick={() => setSelectedMedia(media)}
                                      >
                                        {/* Test with a known working image first */}
                                        <img
                                          className="h-full w-full object-cover"
                                          src={
                                            imageUrl ||
                                            "https://via.placeholder.com/48x48/4F46E5/FFFFFF?text=IMG"
                                          }
                                          alt={
                                            media.originalName || media.filename
                                          }
                                          onLoad={() => {
                                            console.log(
                                              "✅ Image loaded successfully:",
                                              imageUrl
                                            );
                                          }}
                                          onError={(e) => {
                                            console.log(
                                              "❌ Image failed to load:",
                                              imageUrl
                                            );
                                            console.log("Error event:", e);
                                            // Try a test image to see if the issue is with the URL or the display
                                            console.log("Trying test image...");
                                            e.currentTarget.src =
                                              "https://via.placeholder.com/48x48/4F46E5/FFFFFF?text=IMG";
                                          }}
                                        />
                                        <div
                                          className="absolute inset-0 bg-gray-700 flex items-center justify-center"
                                          style={{ display: "none" }}
                                        >
                                          <span className="text-2xl">🖼️</span>
                                        </div>
                                      </div>
                                    );
                                  } else if (isVideo) {
                                    return (
                                      <div
                                        className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-700 cursor-pointer hover:opacity-80 transition-opacity"
                                        onClick={() => setSelectedMedia(media)}
                                      >
                                        <video
                                          className="h-full w-full object-cover"
                                          src={media.fileUrl}
                                          muted
                                          onLoadStart={() => {
                                            console.log(
                                              "Video loading started:",
                                              media.fileUrl
                                            );
                                          }}
                                          onError={(e) => {
                                            console.log(
                                              "Video failed to load:",
                                              media.fileUrl
                                            );
                                            console.log("Error event:", e);
                                            // Fallback to icon if video fails to load
                                            e.currentTarget.style.display =
                                              "none";
                                            const fallback = e.currentTarget
                                              .nextElementSibling as HTMLElement;
                                            if (fallback) {
                                              fallback.style.display = "flex";
                                            }
                                          }}
                                        />
                                        <div
                                          className="absolute inset-0 bg-gray-700 flex items-center justify-center"
                                          style={{ display: "none" }}
                                        >
                                          <span className="text-2xl">🎥</span>
                                        </div>
                                      </div>
                                    );
                                  } else {
                                    return (
                                      <div
                                        className="h-12 w-12 rounded-lg bg-gray-700 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                                        onClick={() => setSelectedMedia(media)}
                                      >
                                        <span className="text-2xl">
                                          {getMediaTypeIcon(
                                            media.fileType || "unknown"
                                          )}
                                        </span>
                                      </div>
                                    );
                                  }
                                })()}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-white truncate">
                                  {media.originalName || media.filename}
                                </div>
                                <div className="text-sm text-gray-400">
                                  {media.filename}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                  URL: {media.thumbnailUrl || media.fileUrl}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm text-white">
                                {media.event?.title || "Unknown Event"}
                              </div>
                              <div className="text-sm text-gray-400">
                                {media.event?.eventSlug || media.eventId}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm text-white">
                                {media.uploader?.fullname || "Unknown User"}
                              </div>
                              <div className="text-sm text-gray-400">
                                {media.uploader?.email || "No email"}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMediaTypeBadgeStyle(
                                  media.fileType || "unknown"
                                )}`}
                              >
                                {media.fileType?.split("/")[0] || "unknown"}
                              </span>
                              <div className="text-sm text-gray-400">
                                {media.fileSize
                                  ? formatFileSize(media.fileSize)
                                  : "Unknown size"}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeStyle(
                                media.isActive
                              )}`}
                            >
                              {media.isActive ? "Approved" : "Rejected"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {formatAdminDate(media.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              {!media.isActive && (
                                <button
                                  onClick={() =>
                                    handleModerateMedia(media.id, "approve")
                                  }
                                  className="text-green-600 hover:text-green-900 flex items-center space-x-1"
                                >
                                  <Eye className="h-4 w-4" />
                                  <span>Approve</span>
                                </button>
                              )}
                              {media.isActive && (
                                <button
                                  onClick={() =>
                                    handleModerateMedia(media.id, "reject")
                                  }
                                  className="text-yellow-600 hover:text-yellow-900 flex items-center space-x-1"
                                >
                                  <EyeOff className="h-4 w-4" />
                                  <span>Reject</span>
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  handleModerateMedia(media.id, "delete")
                                }
                                className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {mediaData?.pagination && (
                  <div className="bg-gray-700 px-4 py-3 flex items-center justify-between border-t border-gray-600">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => setMediaPage(Math.max(1, mediaPage - 1))}
                        disabled={mediaPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setMediaPage(mediaPage + 1)}
                        disabled={mediaPage >= mediaData.pagination.pages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-300">
                          Showing{" "}
                          <span className="font-medium">
                            {(mediaPage - 1) * 10 + 1}
                          </span>{" "}
                          to{" "}
                          <span className="font-medium">
                            {Math.min(
                              mediaPage * 10,
                              mediaData.pagination.total
                            )}
                          </span>{" "}
                          of{" "}
                          <span className="font-medium">
                            {mediaData.pagination.total}
                          </span>{" "}
                          results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          <button
                            onClick={() =>
                              setMediaPage(Math.max(1, mediaPage - 1))
                            }
                            disabled={mediaPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-500 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                          >
                            Previous
                          </button>
                          <button
                            onClick={() => setMediaPage(mediaPage + 1)}
                            disabled={mediaPage >= mediaData.pagination.pages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-500 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                          >
                            Next
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === "payments" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Payment Management</h2>

              {/* Payment Status Filter */}
              <div className="flex space-x-2">
                <select
                  value={paymentStatusFilter}
                  onChange={(e) => {
                    setPaymentStatusFilter(
                      e.target.value as
                        | "all"
                        | "pending"
                        | "paid"
                        | "failed"
                        | "refunded"
                    );
                    setPaymentsPage(1);
                  }}
                  className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Payments</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>

            {paymentsLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            ) : paymentsData?.data && paymentsData.data.length > 0 ? (
              <div className="bg-gray-800 rounded-lg shadow">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Payment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Method
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Event
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {paymentsData.data.map((payment: AdminPayment) => (
                        <tr key={payment.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                                  <span className="text-lg">
                                    {getPaymentMethodIcon(
                                      payment.paymentMethod
                                    )}
                                  </span>
                                </div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-white truncate">
                                  {payment.paystackReference || payment.id}
                                </div>
                                <div className="text-sm text-gray-400">
                                  {payment.paymentMethod || "Unknown"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-white">
                              {formatCurrency(payment.amount, payment.currency)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusBadgeStyle(
                                payment.status
                              )}`}
                            >
                              {(payment.status || "unknown").toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-white">
                              {payment.paymentMethod || "Unknown"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-white">
                              {payment.event?.title || "Unknown Event"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-white">
                              {payment.user?.fullname || "Unknown User"}
                            </div>
                            <div className="text-sm text-gray-400">
                              {payment.user?.email || ""}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-white">
                              {formatAdminDate(payment.createdAt)}
                            </div>
                            {payment.paidAt && (
                              <div className="text-sm text-gray-400">
                                Paid: {formatAdminDate(payment.paidAt)}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {paymentsData.pagination.pages > 1 && (
                  <div className="bg-gray-700 px-4 py-3 flex items-center justify-between border-t border-gray-600 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => setPaymentsPage(paymentsPage - 1)}
                        disabled={paymentsPage <= 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-500 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setPaymentsPage(paymentsPage + 1)}
                        disabled={paymentsPage >= paymentsData.pagination.pages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-500 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-300">
                          Showing{" "}
                          <span className="font-medium">
                            {(paymentsPage - 1) * 10 + 1}
                          </span>{" "}
                          to{" "}
                          <span className="font-medium">
                            {Math.min(
                              paymentsPage * 10,
                              paymentsData.pagination.total
                            )}
                          </span>{" "}
                          of{" "}
                          <span className="font-medium">
                            {paymentsData.pagination.total}
                          </span>{" "}
                          results
                        </p>
                      </div>
                      <div>
                        <nav
                          className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                          aria-label="Pagination"
                        >
                          <button
                            onClick={() => setPaymentsPage(paymentsPage - 1)}
                            disabled={paymentsPage <= 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-500 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                          >
                            Previous
                          </button>
                          <button
                            onClick={() => setPaymentsPage(paymentsPage + 1)}
                            disabled={
                              paymentsPage >= paymentsData.pagination.pages
                            }
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-500 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                          >
                            Next
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-300">
                  No payments found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  No payments match your current filter criteria.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Media Preview Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">
                {selectedMedia.originalName || selectedMedia.filename}
              </h3>
              <button
                onClick={() => setSelectedMedia(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              {(() => {
                const isImage =
                  selectedMedia.fileType?.startsWith("image/") ||
                  selectedMedia.filename?.match(
                    /\.(jpg|jpeg|png|gif|webp|svg)$/i
                  ) ||
                  selectedMedia.originalName?.match(
                    /\.(jpg|jpeg|png|gif|webp|svg)$/i
                  );

                const isVideo =
                  selectedMedia.fileType?.startsWith("video/") ||
                  selectedMedia.filename?.match(
                    /\.(mp4|avi|mov|wmv|flv|webm|mkv)$/i
                  ) ||
                  selectedMedia.originalName?.match(
                    /\.(mp4|avi|mov|wmv|flv|webm|mkv)$/i
                  );

                if (isImage) {
                  return (
                    <img
                      className="max-w-full max-h-[70vh] object-contain mx-auto"
                      src={selectedMedia.thumbnailUrl || selectedMedia.fileUrl}
                      alt={selectedMedia.originalName || selectedMedia.filename}
                    />
                  );
                } else if (isVideo) {
                  return (
                    <video
                      className="max-w-full max-h-[70vh] mx-auto"
                      src={selectedMedia.fileUrl}
                      controls
                      autoPlay
                    />
                  );
                } else {
                  return (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">
                        {getMediaTypeIcon(selectedMedia.fileType || "unknown")}
                      </div>
                      <p className="text-gray-400">
                        Preview not available for this file type
                      </p>
                      <a
                        href={selectedMedia.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-500 hover:text-orange-400 mt-2 inline-block"
                      >
                        Download File
                      </a>
                    </div>
                  );
                }
              })()}
            </div>
            <div className="p-4 border-t border-gray-700 bg-gray-700">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">File Type:</span>
                  <span className="text-white ml-2">
                    {selectedMedia.fileType || "Unknown"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">File Size:</span>
                  <span className="text-white ml-2">
                    {selectedMedia.fileSize
                      ? formatFileSize(selectedMedia.fileSize)
                      : "Unknown"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Event:</span>
                  <span className="text-white ml-2">
                    {selectedMedia.event?.title || "Unknown Event"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Uploader:</span>
                  <span className="text-white ml-2">
                    {selectedMedia.uploader?.fullname || "Unknown User"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
