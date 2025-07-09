"use client";
import { SprintState } from "@/core/enums/sprint-state.enum";
import { SprintResume } from "@/core/interfaces/sprint-resume.interface";
import { DotLottiePlayer, PlayMode } from "@dotlottie/react-player";
import {
  differenceInBusinessDays,
  differenceInDays,
  endOfDay,
  format,
  parseISO,
} from "date-fns";
import Countdown from "react-countdown";

export default function CountdownSection({
  lastSprints,
}: {
  lastSprints: SprintResume[];
}) {
  const activeSprint = lastSprints?.find(
    (sprint) => sprint.state === SprintState.ACTIVE
  );

  // Calculate sprint duration and progress
  const startDate = activeSprint ? parseISO(activeSprint.startDate) : null;
  const endDate = activeSprint ? parseISO(activeSprint.endDate!) : null;
  const totalDays =
    startDate && endDate ? differenceInDays(endDate, startDate) : 0;
  const daysElapsed = startDate ? differenceInDays(new Date(), startDate) : 0;
  const sprintProgress =
    totalDays > 0
      ? Math.min(Math.round((daysElapsed / totalDays) * 100), 100)
      : 0;

  if (activeSprint && endDate) {
    activeSprint.endDate = endOfDay(endDate).toISOString();
  }

  // Remover palabra "Tablero" del nombre del sprint
  const activeSprintName = activeSprint?.name.replace("Tablero Sprint", "");

  const daysSinceEnd = activeSprint
    ? Math.ceil(
        (Date.now() - new Date(activeSprint?.endDate!).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  const FinishedAnimation = () => (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 flex justify-center items-center mb-4">
        <DotLottiePlayer
          src={"done.lottie"}
          autoplay
          playMode={PlayMode.Normal}
          loop
          color="#000000"
          style={{ height: 80, width: 80, padding: 0 }}
        />
      </div>
      <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
        ¡Sprint Completado!
      </div>
      <span className="font-medium text-gray-600 dark:text-gray-300">
        {daysSinceEnd !== null
          ? `Finalizado hace ${daysSinceEnd} día${
              daysSinceEnd !== 1 ? "s" : ""
            }`
          : "Sprint finalizado"}
      </span>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-8 border border-gray-200 dark:border-gray-800">
      <div className="flex flex-col gap-6 justify-center items-center text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 mb-2">
            Sprint Activo
          </div>
          <h1 className="font-bold text-3xl md:text-4xl text-gray-900 dark:text-white">
            Sprint {activeSprintName}
          </h1>
          {activeSprint && startDate && endDate && (
            <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              {format(startDate, "PPP")} - {format(endDate, "PPP")}
            </div>
          )}
        </div>

        {/* Sprint Progress Bar */}
        {activeSprint && totalDays > 0 && (
          <div className="w-full max-w-md">
            <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">
              <span>Progreso del Sprint</span>
              <span suppressHydrationWarning>{sprintProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${sprintProgress}%` }}
                suppressHydrationWarning
              />
            </div>
            <div
              className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium"
              suppressHydrationWarning
            >
              Día {daysElapsed} de {totalDays} días laborales
            </div>
          </div>
        )}

        {/* Countdown */}
        <div className="text-center">
          <div className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-3">
            Tiempo restante
          </div>
          <Countdown
            date={activeSprint?.endDate}
            daysInHours={true}
            renderer={({ days, hours, minutes, seconds, completed }) => {
              if (completed) {
                return <FinishedAnimation />;
              }
              const padNumber = (num: number) => String(num).padStart(2, "0");

              if (days === 0)
                return (
                  <div className="text-center">
                    <span className="text-4xl font-bold text-orange-500">
                      {padNumber(hours)}:{padNumber(minutes)}
                    </span>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Horas restantes
                    </div>
                  </div>
                );
              if (days === 0 && hours === 0)
                return (
                  <div className="text-center">
                    <span className="text-4xl font-bold text-red-500">
                      {padNumber(minutes)}:{padNumber(seconds)}
                    </span>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      ¡Últimos minutos!
                    </div>
                  </div>
                );

              const businessDays = differenceInBusinessDays(
                new Date(activeSprint?.endDate!),
                Date.now()
              );

              return (
                <div className="text-center">
                  <span
                    className="text-5xl font-bold text-blue-600 dark:text-blue-400"
                    suppressHydrationWarning
                  >
                    {businessDays}
                  </span>
                  <div className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                    días laborales restantes
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Finaliza el{" "}
                    {format(new Date(activeSprint?.endDate!), "PPP")}
                  </div>
                </div>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
