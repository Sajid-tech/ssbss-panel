import { Col, Row, Typography } from "antd";
import dayjs from "dayjs";

const { Text } = Typography;

export default function EventCard({ eventdetails }) {
  const statusColor =
    eventdetails.event_status === "Active" ? "#d9f7be" : "#ffa39e";
  const gridItemStyle = {
    border: "1px solid #f0f0f0",
    padding: "4px 16px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minHeight: 60,
  };

  return (
    <div
      style={{
        margin: "20px auto",
        border: "1px solid #d9d9d9",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      {/* Title */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #f0f0f0",
          background: statusColor,
        }}
      >
        <Text strong style={{ fontSize: 16 }}>
          {eventdetails.event_name}
        </Text>
      </div>

      {/* Content Grid */}
      <Row gutter={0}>
        <Col span={12} style={gridItemStyle}>
          <Text strong>Description</Text>
          <Text>{eventdetails.event_description}</Text>
        </Col>
        <Col span={12} style={gridItemStyle}>
          <Text strong>Member Allowed</Text>
          <Text>{eventdetails.event_member_allowed}</Text>
        </Col>
        <Col span={12} style={gridItemStyle}>
          <Text strong>No. Member Allowed</Text>
          <Text>{eventdetails.event_no_member_allowed}</Text>
        </Col>
        <Col span={12} style={gridItemStyle}>
          <Text strong>From Date</Text>
          <Text>
            {eventdetails.event_from_date
              ? dayjs(eventdetails.event_from_date).format("DD MMM YYYY")
              : "-"}
          </Text>
        </Col>
        <Col span={12} style={gridItemStyle}>
          <Text strong>To Date</Text>
          <Text>
            {eventdetails.event_from_date
              ? dayjs(eventdetails.event_to_date).format("DD MMM YYYY")
              : "-"}
          </Text>
        </Col>
        <Col span={12} style={gridItemStyle}>
          <Text strong>Payment</Text>
          <Text>{eventdetails.event_payment}</Text>
        </Col>
        {eventdetails.event_payment === "Yes" && (
          <Col span={12} style={gridItemStyle}>
            <Text strong>Amount</Text>
            <Text>{eventdetails.event_amount}</Text>
          </Col>
        )}
        {/* <Col span={12} style={gridItemStyle}>
          <Text strong>Status</Text>
          <Text>{eventdetails.event_status}</Text>
        </Col> */}
      </Row>
    </div>
  );
}
