"use client";

import { DotLottiePlayer, PlayMode } from "@dotlottie/react-player";
import { differenceInBusinessDays, format } from "date-fns";
import Countdown from "react-countdown";

interface SprintCountdownProps {
  endDate: string;
  activeSprintName: string;
  startDate: string;
}

export default function SprintCountdown({
  endDate,
  activeSprintName,
  startDate,
}: SprintCountdownProps) {
  const daysSinceEnd = Math.ceil(
    (Date.now() - new Date(endDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const FinishedAnimation = () => (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 flex justify-center items-center mb-3">
        <DotLottiePlayer
          src={"done.lottie"}
          autoplay
          playMode={PlayMode.Normal}
          loop
          color="#000000"
          style={{ height: 64, width: 64, padding: 0 }}
        />
      </div>
      <div className="text-xl font-bold text-green-600 dark:text-green-400 mb-1">
        ¡Sprint Completado!
      </div>
      <span className="font-medium text-gray-600 dark:text-gray-300 text-sm">
        {daysSinceEnd !== null
          ? `Finalizado hace ${daysSinceEnd} día${
              daysSinceEnd !== 1 ? "s" : ""
            }`
          : "Sprint finalizado"}
      </span>
    </div>
  );

  return (
    <div className="text-center">
      <div className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-2">
        Tiempo restante
      </div>
      <Countdown
        date={endDate}
        daysInHours={true}
        renderer={({ days, hours, minutes, seconds, completed }) => {
          if (completed) {
            return <FinishedAnimation />;
          }
          const padNumber = (num: number) => String(num).padStart(2, "0");

          if (days === 0)
            return (
              <div className="text-center">
                <span className="text-3xl font-bold text-orange-500">
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
                <span className="text-3xl font-bold text-red-500">
                  {padNumber(minutes)}:{padNumber(seconds)}
                </span>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  ¡Últimos minutos!
                </div>
              </div>
            );

          const businessDays = differenceInBusinessDays(
            new Date(endDate),
            Date.now()
          );

          return (
            <div className="text-center">
              <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {businessDays}
              </span>
              <div className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                días laborales restantes
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Finaliza el {format(new Date(endDate), "PPP")}
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
