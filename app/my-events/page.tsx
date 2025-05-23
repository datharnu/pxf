"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import EventCreatedBanner from "./components/EventCreatedBanner";

// Extract the component that uses useSearchParams into a separate component
function MyEventsContent() {
  const searchParams = useSearchParams();

  const created = searchParams.get("created");
  const title = searchParams.get("title");
  const description = searchParams.get("description");
  const eventCode = searchParams.get("eventCode");
  const shareUrl = searchParams.get("shareUrl");
  const coverImage = searchParams.get("coverImage");

  const eventCreated = created === "true";

  const event = {
    id: "temp",
    title: title || "",
    description: description || "",
    eventCode: eventCode || "",
    shareUrl: shareUrl || "",
    coverImage: coverImage || "",
    dateCreated: new Date().toISOString(),
  };

  return (
    <div className="p-4">
      {eventCreated && <EventCreatedBanner event={event} />}
      {/* Other content like your list of events will go here */}
    </div>
  );
}

// Loading component to show while Suspense is resolving
function MyEventsLoading() {
  return (
    <div className="p-4">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
}

export default function MyEvents() {
  return (
    <Suspense fallback={<MyEventsLoading />}>
      <MyEventsContent />
    </Suspense>
  );
}
