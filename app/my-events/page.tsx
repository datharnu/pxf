"use client";

import { useSearchParams } from "next/navigation";
import EventCreatedBanner from "./components/EventCreatedBanner";

export default function MyEvents() {
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
