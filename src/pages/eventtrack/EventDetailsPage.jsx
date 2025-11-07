// EventDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, Typography, Spin } from "antd";

const { Title, Paragraph } = Typography;

const mockEventDatabase = {
  EVT123456: {
    eventName: "Annual Tech Conference 2025",
    eventDate: "2025-12-01",
    location: "New Delhi",
  },
  EVT7891011: {
    eventName: "Music Fest 2025",
    eventDate: "2025-10-15",
    location: "Mumbai",
  },
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const EventDetailsPage = () => {
  const query = useQuery();
  const eventId = query.get("eventId");
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulate fetching event and submitting scan info
  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    // Mock fetching event details by eventId
    const eventDetails = mockEventDatabase[eventId];

    if (eventDetails) {
      setEvent(eventDetails);


    } else {
      setEvent(null);
    }

    setLoading(false);
  }, [eventId]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!event) {
    return (
      <Card style={{ maxWidth: 400, margin: "40px auto", textAlign: "center" }}>
        <Title level={3}>Event Not Found</Title>
        <Paragraph>No event found for ID: {eventId}</Paragraph>
      </Card>
    );
  }

  return (
    <Card style={{ maxWidth: 400, margin: "40px auto", textAlign: "center" }}>
      <Title level={3}>{event.eventName}</Title>
      <Paragraph>Date: {event.eventDate}</Paragraph>
      <Paragraph>Location: {event.location}</Paragraph>
      <Paragraph type="success" style={{ marginTop: 20 }}>
        Scan successful! Your attendance has been recorded.
      </Paragraph>
    </Card>
  );
};

export default EventDetailsPage;
