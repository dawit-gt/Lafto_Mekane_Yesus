import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// The picture shown when someone shares a link to the site on Telegram,
// WhatsApp, Facebook and similar apps. Made once when the site is built.
export const alt = "EECMY Lafto Mekaneyesus Congregation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logo = await readFile(join(process.cwd(), "public", "logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "linear-gradient(135deg, #073b78 0%, #0059b5 100%)",
          padding: "0 90px",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 360,
            height: 360,
            borderRadius: 180,
            background: "#ffffff",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <img src={logoSrc} width={330} height={330} alt="" />
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginLeft: 70 }}>
          <div style={{ fontSize: 34, letterSpacing: 6, color: "#f4c64f", fontWeight: 700 }}>
            EECMY
          </div>
          <div style={{ marginTop: 14, fontSize: 84, fontWeight: 700, lineHeight: 1.05 }}>
            Lafto Mekaneyesus
          </div>
          <div style={{ marginTop: 14, fontSize: 52, fontWeight: 700, color: "#cfe0f5" }}>
            Congregation
          </div>
          <div style={{ marginTop: 30, fontSize: 28, color: "#cfe0f5" }}>
            Worship · Sermons · Ministries · Events
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
