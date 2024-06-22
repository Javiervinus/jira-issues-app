"use client";
// import lottieAnimation from "@/assets/lotties/done.lottie";
import { SprintState } from "@/core/enums/sprint-state.enum";
import { SprintResume } from "@/core/interfaces/sprint-resume.interface";
import { DotLottiePlayer, PlayMode } from "@dotlottie/react-player";
import Countdown from "react-countdown";

export default function CountdownSection({
  lastSprints,
}: {
  lastSprints: SprintResume[];
}) {
  const activeSprint = lastSprints?.find(
    (sprint) => sprint.state === SprintState.ACTIVE
  );
  // Remover palabra "Tablero" del nombre del sprint
  const activeSprintName = activeSprint?.name.replace("Tablero Sprint", "");

  const daysSinceEnd = activeSprint
    ? Math.ceil(
        (Date.now() - new Date(activeSprint?.endDate!).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <div className="flex w-full flex-col gap-1 justify-center items-center text-center">
      <h1 className="font-medium text-3xl">Sprint actual</h1>
      <span>{activeSprintName}</span>
      <Countdown className="text-3xl" date={activeSprint?.endDate}>
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

          <span className="font-semibold drop-shadow-custom-light dark:drop-shadow-custom-dark ">
            {daysSinceEnd !== null
              ? `Finalizado hace ${daysSinceEnd} días`
              : "Finalizado"}
          </span>
        </div>
      </Countdown>
    </div>
  );
}
