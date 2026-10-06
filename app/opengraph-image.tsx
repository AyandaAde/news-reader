import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Eilo — Your world, in podcasts.";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          color: "#ffffff",
          padding: "64px 72px",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 28,
            letterSpacing: "0.28em",
            fontWeight: 700,
            color: "#EBB800",
          }}
        >
          EILO
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 72,
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              maxWidth: 900,
            }}
          >
            Your world, in podcasts.
          </div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.4,
              color: "#a3a3a3",
              maxWidth: 780,
            }}
          >
            Personalized AI audio from your email, news, and interests.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 22,
            color: "#737373",
          }}
        >
          <span>eilo.app</span>
          <span style={{ color: "#EBB800" }}>Listen anywhere</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
