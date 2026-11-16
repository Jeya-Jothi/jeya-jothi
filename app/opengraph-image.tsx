import { ImageResponse } from "next/og";

export const alt = "Jeya Jothi S, Frontend Developer Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#ffffff",
        padding: "64px 72px",
        color: "#1c0005",
      }}
    >
      <div style={{ display: "flex", fontSize: 36 }}>Jeya Jothi S</div>

      <div
        style={{
          display: "flex",
          fontSize: 230,
          fontWeight: 900,
          letterSpacing: "-0.04em",
          lineHeight: 0.9,
        }}
      >
        PORTFOLIO
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 36,
        }}
      >
        <span>Frontend Developer</span>
        <span style={{ color: "#840016" }}>React · Next.js · TypeScript</span>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 18,
          background: "#840016",
          display: "flex",
        }}
      />
    </div>,
    { ...size },
  );
}
