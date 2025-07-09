import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  console.log("OG API called with URL:", request.url);

  try {
    const { searchParams } = new URL(request.url);
    const sprint = searchParams.get("sprint") || "Sprint Actual";
    const dates = searchParams.get("dates") || "";
    const updated = searchParams.get("updated") || "Hoy";
    const status = searchParams.get("status") || "";

    console.log("OG API params:", { sprint, dates, updated, status });

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            background:
              "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1f1f1f 100%)",
            color: "white",
            position: "relative",
          }}
        >
          {/* Subtle pattern overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.02) 0%, transparent 50%)",
              display: "flex",
            }}
          />

          {/* Main content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              padding: "40px",
              textAlign: "center",
              zIndex: 1,
            }}
          >
            {/* Header section - Sprint más prominente */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "50px",
              }}
            >
              <div
                style={{
                  fontSize: "120px",
                  marginRight: "40px",
                  display: "flex",
                }}
              >
                🚀
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    fontSize: "40px",
                    color: "#a0a0a0",
                    fontWeight: 400,
                    lineHeight: 1,
                    marginBottom: "12px",
                    display: "flex",
                  }}
                >
                  Betterplan Dashboard
                </div>
                <div
                  style={{
                    fontSize: "84px",
                    fontWeight: 800,
                    lineHeight: 1,
                    background:
                      "linear-gradient(45deg, #ffffff 0%, #e0e0e0 100%)",
                    backgroundClip: "text",
                    color: "transparent",
                    display: "flex",
                  }}
                >
                  Sprint {sprint}
                </div>
              </div>
            </div>

            {/* Content grid - Enfoque en días restantes */}
            <div
              style={{
                display: "flex",
                gap: "30px",
                width: "100%",
                maxWidth: "1000px",
              }}
            >
              {/* Fechas del sprint */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "30px 40px",
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "20px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  flex: 1,
                }}
              >
                <div
                  style={{
                    fontSize: "26px",
                    color: "#9ca3af",
                    marginBottom: "16px",
                    display: "flex",
                  }}
                >
                  Período del Sprint
                </div>
                <div
                  style={{
                    fontSize: "36px",
                    fontWeight: 600,
                    color: "#ffffff",
                    display: "flex",
                    textAlign: "center",
                  }}
                >
                  {dates || "Fechas del sprint"}
                </div>
              </div>

              {/* Días restantes - MÁS PROMINENTE */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "30px 40px",
                  background: "rgba(34, 197, 94, 0.15)",
                  borderRadius: "20px",
                  border: "2px solid rgba(34, 197, 94, 0.4)",
                  flex: 1,
                  boxShadow: "0 0 30px rgba(34, 197, 94, 0.2)",
                }}
              >
                <div
                  style={{
                    fontSize: "26px",
                    color: "#86efac",
                    marginBottom: "16px",
                    display: "flex",
                  }}
                >
                  Estado del Sprint
                </div>
                <div
                  style={{
                    fontSize: "42px",
                    fontWeight: 700,
                    color: "#22c55e",
                    display: "flex",
                    textAlign: "center",
                  }}
                >
                  {status || "Estado del sprint"}
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error("OG API Error:", e);
    return new Response(`Failed to generate the image: ${e.message}`, {
      status: 500,
    });
  }
}
