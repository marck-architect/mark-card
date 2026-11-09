import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/config/profile.config";

export const alt = `${profile.name}, ${profile.title} at ${profile.company}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(
    path.join(process.cwd(), "public", "images", "logo-white.png"),
  );
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#15191e",
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(201,168,110,0.28), rgba(21,25,30,0) 65%)",
          color: "#f6f0e4",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={520} height={147} alt="" />
        <div
          style={{
            width: 120,
            height: 3,
            backgroundColor: "#c9a86e",
            marginTop: 56,
            marginBottom: 40,
          }}
        />
        <div style={{ fontSize: 64, fontWeight: 700, color: "#ffffff" }}>
          {profile.name}
        </div>
        <div style={{ fontSize: 34, marginTop: 14, color: "#e8c889" }}>
          {profile.title}
        </div>
      </div>
    ),
    size,
  );
}
