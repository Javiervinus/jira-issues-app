"use client";
// import lottieAnimation from "@/assets/lotties/done.lottie";
import { SprintState } from "@/core/enums/sprint-state.enum";
import { SprintResume } from "@/core/interfaces/sprint-resume.interface";
import { DotLottiePlayer, PlayMode } from "@dotlottie/react-player";
import { differenceInBusinessDays, endOfDay, format, parseISO } from "date-fns";
import Countdown from "react-countdown";

export default function CountdownSection({
  lastSprints,
}: {
  lastSprints: SprintResume[];
}) {
  const activeSprint = lastSprints?.find(
    (sprint) => sprint.state === SprintState.ACTIVE
  );
  const endDate = parseISO(activeSprint?.endDate!);
  activeSprint!.endDate = endOfDay(endDate).toISOString();

  // Remover palabra "Tablero" del nombre del sprint
  const activeSprintName = activeSprint?.name.replace("Tablero Sprint", "");

  const daysSinceEnd = activeSprint
    ? Math.ceil(
        (Date.now() - new Date(activeSprint?.endDate!).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  const FinishedAnimation = () => (
    <div className="flex flex-col items-center justify-center">
      {/* <span className="text-xl animate-bounce">🎉</span> */}

      <div className="w-full h-14 text-center flex justify-center items-center">
        <DotLottiePlayer
          src={"done.lottie"}
          autoplay
          playMode={PlayMode.Normal}
          loop
          color="#000000"
          style={{ height: 100, width: 100, padding: 0 }}
        />
      </div>

      <span className="font-semibold  dark:drop-shadow-custom-dark ">
        {daysSinceEnd !== null
          ? `Finalizado hace ${daysSinceEnd} días`
          : "Finalizado"}
      </span>
    </div>
  );

  return (
    <div className="flex w-full flex-col gap-1 justify-center items-center text-center">
      <h1 className="font-medium text-3xl">Sprint {activeSprintName}</h1>
      {/* <span>{activeSprintName}</span> */}
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
              <span className="text-2xl">
                {padNumber(hours)}:{padNumber(minutes)}
              </span>
            );
          if (days === 0 && hours === 0)
            return (
              <span className="text-2xl">
                {padNumber(minutes)}:{padNumber(seconds)}{" "}
              </span>
            );

          return (
            <div className="flex flex-col">
              <span className="text-2xl">
                {differenceInBusinessDays(
                  new Date(activeSprint?.endDate!),
                  Date.now()
                )}{" "}
                días
              </span>
              <span className="text-md">
                {format(new Date(activeSprint?.endDate!), "PP")}
              </span>
            </div>
          );
        }}
      ></Countdown>
    </div>
  );
}
