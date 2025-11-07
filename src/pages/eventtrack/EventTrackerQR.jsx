import { Scanner } from "@yudiel/react-qr-scanner";
import { App, Card, Spin, Modal, InputNumber, Button } from "antd";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { EVENT_TRACK } from "../../api";
import { useApiMutation } from "../../hooks/useApiMutation";

const EventMidScanner = ({
  eventId,
  setOpenQrDialog,
  scanning,
  NoofMember,
  setMultiMemberModal,
  multiMemberModal,
}) => {
  const { message } = App.useApp();
  const [scanResult, setScanResult] = useState("");
  const [peopleCount, setPeopleCount] = useState(1);
  const [midValueState, setMidValueState] = useState(null);
  const timeoutRef = useRef(null);
  const { trigger: submitTrigger, loading: submitLoading } = useApiMutation();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const submitEvent = async (midValue, count) => {
    const payload = {
      event_no_of_people: count,
      event_id: eventId || 1,
      event_member_mid: midValue,
      event_entry_date: dayjs().format("YYYY-MM-DD"),
    };

    try {
      const res = await submitTrigger({
        url: EVENT_TRACK,
        method: "post",
        data: payload,
      });

      if (res.code === 201) {
        message.success(res.message || "Event saved!");
        // setOpenQrDialog(false);
      } else {
        message.error(res.message || "Failed to save event.");
      }
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Error submitting event."
      );
      console.error(error);
    }
  };

  const handleScan = async (detectedCodes) => {
    if (detectedCodes && detectedCodes.length > 0) {
      const scannedValue = detectedCodes[0].rawValue;
      setScanResult(scannedValue);

      if (scannedValue.includes("mid=")) {
        const midMatch = scannedValue.match(/mid=([^&\s]+)/);
        const midValue = midMatch ? midMatch[1] : null;

        if (!midValue) {
          message.error("MID not found in scanned data.");
          return;
        }

        if (NoofMember == "One Card One Member") {
          submitEvent(midValue, 1);
        } else if (NoofMember == "One Card Multi Member") {
          setMultiMemberModal(true);
          setMidValueState(midValue);
        }
      } else {
        message.error("MID not found in scanned code.");
      }

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setScanResult("");
      }, 3000);
    }
  };

  const handleError = (err) => {
    console.error("Scan error:", err);
    message.error("Error scanning QR code");
  };

  return (
    <>
      {submitLoading ? (
        <Card
          style={{
            maxWidth: 400,
            minHeight: 260,
            margin: "20px auto",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin />
        </Card>
      ) : (
        <>
          {scanning && (
            <Scanner
              onScan={handleScan}
              onError={handleError}
              className="scanner"
              styles={{
                container: { width: "100%", maxWidth: "400px", margin: "auto" },
                video: { width: "100%", height: "auto" },
              }}
            />
          )}
        </>
      )}

      {/* Multi Member Input Modal */}
      <Modal
        open={multiMemberModal}
        title="Enter Number of People"
        onCancel={() => setMultiMemberModal(false)}
        footer={null}
      >
        <InputNumber
          min={1}
          max={20}
          value={peopleCount}
          onChange={(val) => setPeopleCount(val)}
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <Button
          type="primary"
          block
          onClick={() => {
            submitEvent(midValueState, peopleCount);
            setMultiMemberModal(false);
          }}
        >
          Submit
        </Button>
      </Modal>
    </>
  );
};

export default EventMidScanner;
