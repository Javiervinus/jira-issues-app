import { getLastSprints } from "@/lib/services/sprint-services";

import { SprintState } from "@/core/enums/sprint-state.enum";
import { ModeToggle } from "@/ui/common/components/ModeToggle";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Metadata } from "next";
import AssigneeSection from "./components/AssigneeSection";
import NextSprintInfo from "./components/NextSprintInfo";
import OGPreview from "./components/OGPreview";
import SprintHero from "./components/SprintHero";

const enterpriseName = "Betterplan";

// Función helper para generar metadatos (reutilizable)
async function getPageMetadata() {
  const lastSprints = (await getLastSprints())?.values;
  const activeSprint = lastSprints?.find(
    (sprint) => sprint.state === SprintState.ACTIVE
  );
  const lastUpdated = format(new Date(), "PPP 'a las' p", { locale: es });
  const lastUpdatedShort = format(new Date(), "dd/MM/yyyy HH:mm", {
    locale: es,
  });

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
      description: `Dashboard de sprints de ${enterpriseName}. Monitoreo en tiempo real del equipo de desarrollo. Última actualización: ${lastUpdated}`,
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

  // Calculate days remaining
  const daysRemaining = activeSprint.endDate
    ? Math.max(
        0,
        Math.floor(
          (new Date(activeSprint.endDate).getTime() - new Date().getTime()) /
            (1000 * 3600 * 24)
        )
      )
    : 0;

  const sprintStatus =
    daysRemaining > 0 ? `${daysRemaining} días restantes` : "Sprint finalizado";

  return {
    title: `🚀 Sprint ${sprintName} - ${enterpriseName}`,
    description: `Sprint activo del ${sprintDates} • ${sprintStatus} • Dashboard actualizado el ${lastUpdatedShort}`,
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
