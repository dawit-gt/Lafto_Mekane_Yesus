import { ImageResponse } from "next/og";

// The picture shown when someone shares a link to the site on Telegram,
// WhatsApp, Facebook and similar apps. Made once when the site is built.
export const alt = "Lafto Mekaneyesus, Ethiopian Evangelical Church Mekane Yesus";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1e4635",
          padding: "72px 80px",
          color: "#f6f2e7",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: 72, height: 6, background: "#b98a34" }} />
          <div
            style={{
              marginLeft: 20,
              fontSize: 28,
              letterSpacing: 4,
              color: "#b98a34",
              fontWeight: 700,
            }}
          >
            EECMY
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 104, fontWeight: 700, lineHeight: 1.05 }}>
            Lafto Mekaneyesus
          </div>
          <div style={{ marginTop: 28, fontSize: 38, color: "#dcd3be", lineHeight: 1.3 }}>
            Ethiopian Evangelical Church Mekane Yesus
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 30, color: "#dcd3be" }}>
          Worship · Sermons · Ministries · Events
        </div>
      </div>
    ),
    { ...size }
  );
}