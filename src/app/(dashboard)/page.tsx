import { getLastSprints } from "@/lib/services/sprint-services";

import { SprintState } from "@/core/enums/sprint-state.enum";
import { ModeToggle } from "@/ui/common/components/ModeToggle";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Metadata } from "next";
import { headers } from "next/headers";
import AssigneeSection from "./components/AssigneeSection";
import NextSprintInfo from "./components/NextSprintInfo";
import OGPreview from "./components/OGPreview";
import SprintHero from "./components/SprintHero";

const enterpriseName = "Betterplan";

// Función para obtener la zona horaria del usuario basada en headers
function getUserTimezone() {
  const headersList = headers();

  // Intentar obtener zona horaria de diferentes headers
  const cfTimezone = headersList.get("cf-timezone"); // Cloudflare
  const xTimezone = headersList.get("x-timezone"); // Custom header

  // Si no hay headers específicos, intentar inferir de Accept-Language o usar fallback
  if (cfTimezone) {
    return cfTimezone;
  }

  if (xTimezone) {
    return xTimezone;
  }

  // Mapeo de países comunes a zonas horarias (fallback básico)
  const acceptLanguage = headersList.get("accept-language") || "";

  if (acceptLanguage.includes("es-CL") || acceptLanguage.includes("cl")) {
    return "America/Santiago"; // Chile
  }

  if (acceptLanguage.includes("es-PE") || acceptLanguage.includes("pe")) {
    return "America/Lima"; // Perú
  }

  if (acceptLanguage.includes("es-CO") || acceptLanguage.includes("co")) {
    return "America/Bogota"; // Colombia
  }

  if (acceptLanguage.includes("es-EC") || acceptLanguage.includes("ec")) {
    return "America/Guayaquil"; // Ecuador
  }

  // Fallback por defecto (Ecuador/GMT-5)
  return "America/Guayaquil";
}

// Función para formatear fecha con zona horaria específica
function formatWithTimezone(date: Date, formatStr: string, timezone: string) {
  try {
    // Usar Intl.DateTimeFormat para obtener la fecha en la zona horaria correcta
    const formatter = new Intl.DateTimeFormat("es-ES", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const parts = formatter.formatToParts(date);
    const year = parts.find((part) => part.type === "year")?.value;
    const month = parts.find((part) => part.type === "month")?.value;
    const day = parts.find((part) => part.type === "day")?.value;
    const hour = parts.find((part) => part.type === "hour")?.value;
    const minute = parts.find((part) => part.type === "minute")?.value;

    // Crear nueva fecha con los valores de la zona horaria
    const localDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);

    // Usar date-fns para formatear con el formato deseado
    return format(localDate, formatStr, { locale: es });
  } catch (error) {
    // Fallback si hay error con la zona horaria
    console.warn("Error formatting with timezone:", error);
    return format(date, formatStr, { locale: es });
  }
}

// Función helper para generar metadatos (reutilizable)
async function getPageMetadata() {
  const lastSprints = (await getLastSprints())?.values;
  const activeSprint = lastSprints?.find(
    (sprint) => sprint.state === SprintState.ACTIVE
  );

  // Obtener zona horaria del usuario
  const userTimezone = getUserTimezone();
  const now = new Date();

  // Formatear fechas usando la zona horaria del usuario
  const lastUpdated = formatWithTimezone(now, "PPP 'a las' p", userTimezone);
  const lastUpdatedShort = formatWithTimezone(
    now,
    "dd/MM/yyyy HH:mm",
    userTimezone
  );

  // Determinar la URL base de manera inteligente
  const getBaseUrl = () => {
    // 1. Si está configurada explícitamente, usarla
    if (process.env.NEXT_PUBLIC_BASE_URL) {
      return process.env.NEXT_PUBLIC_BASE_URL;
    }

    // 2. En producción de Vercel, usar VERCEL_URL
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }

    // 3. Fallback para desarrollo local
    return "http://localhost:5200";
  };

  const baseUrl = getBaseUrl();

  if (!activeSprint) {
    return {
      title: "JIRA Sprint Dashboard - No hay sprint activo",
      description: `Dashboard de sprints de ${enterpriseName}. Monitoreo en tiempo real del equipo de desarrollo. Última actualización: ${lastUpdated} (${userTimezone})`,
      imageUrl: `/api/og?sprint=Sin%20Sprint&dates=&updated=${encodeURIComponent(
        lastUpdatedShort
      )}`,
      url: baseUrl,
    };
  }

  const sprintName = activeSprint.name.replace("Tablero Sprint", "").trim();
  const sprintDates =
    activeSprint.startDate && activeSprint.endDate
      ? `${format(new Date(activeSprint.startDate), "dd MMM", {
          locale: es,
        })} - ${format(new Date(activeSprint.endDate), "dd MMM yyyy", {
          locale: es,
        })}`
      : "";

  // Calculate days remaining usando la zona horaria del usuario
  const daysRemaining = activeSprint.endDate
    ? Math.max(
        0,
        Math.floor(
          (new Date(activeSprint.endDate).getTime() - now.getTime()) /
            (1000 * 3600 * 24)
        )
      )
    : 0;

  const sprintStatus =
    daysRemaining > 0 ? `${daysRemaining} días restantes` : "Sprint finalizado";

  return {
    title: `🚀 Sprint ${sprintName} - ${enterpriseName}`,
    description: `Sprint activo del ${sprintDates} • ${sprintStatus} • Actualizado el ${lastUpdatedShort} (${userTimezone})`,
    imageUrl: `/api/og?sprint=${encodeURIComponent(
      sprintName
    )}&dates=${encodeURIComponent(sprintDates)}&updated=${encodeURIComponent(
      lastUpdatedShort
    )}&status=${encodeURIComponent(sprintStatus)}`,
    url: baseUrl,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const { title, description, imageUrl, url } = await getPageMetadata();

  return {
    title,
    description,
    keywords: [
      "JIRA",
      "Sprint",
      "Dashboard",
      "Scrum",
      "Agile",
      enterpriseName,
      "Development Team",
    ],
    authors: [{ name: "javiervinus" }],
    robots: "index, follow",
    openGraph: {
      title,
      description,
      url,
      siteName: `${enterpriseName} JIRA Dashboard`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "es_ES",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      site: "@javiervinus",
      creator: "@javiervinus",
      title,
      description,
    },
  };
}

export default async function Home() {
  const lastSprints = (await getLastSprints())?.values;
  const ogMetadata = await getPageMetadata();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black relative">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-sm dark:bg-black/95 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">J</span>
            </div>
            <div>
              <h1 className="md:text-xl text-lg font-bold text-gray-900 dark:text-white">
                JIRA Sprint Dashboard
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {enterpriseName}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ModeToggle />
            <div className="text-xs text-gray-500 dark:text-gray-400 hidden md:block">
              by javiervinus
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Hero Section - Unified Sprint Overview */}
        <section>
          {" "}
          <SprintHero lastSprints={lastSprints} />{" "}
        </section>

        {/* Team Performance Section */}
        {lastSprints && lastSprints[0] && (
          <section className="space-y-6">
            <AssigneeSection currentSprint={lastSprints[0]} />
          </section>
        )}

        {/* Next Sprint Info */}
        {lastSprints && lastSprints.length > 1 && (
          <section>
            <NextSprintInfo sprints={lastSprints} />
          </section>
        )}
      </main>
      {/* OG Preview - Solo en desarrollo */}
      <OGPreview
        title={ogMetadata.title}
        description={ogMetadata.description}
        imageUrl={ogMetadata.imageUrl}
        url={ogMetadata.url}
      />
    </div>
  );
}
