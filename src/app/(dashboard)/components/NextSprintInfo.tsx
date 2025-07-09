import { Badge } from "@/components/ui/badge";
import { SprintState } from "@/core/enums/sprint-state.enum";
import { SprintResume } from "@/core/interfaces/sprint-resume.interface";
import { differenceInDays, format, parseISO } from "date-fns";

interface NextSprintInfoProps {
  sprints: SprintResume[];
}

export default function NextSprintInfo({ sprints }: NextSprintInfoProps) {
  const futureSprint = sprints?.find(
    (sprint) => sprint.state === SprintState.FUTURE
  );

  if (!futureSprint || !futureSprint.startDate) {
    return null;
  }

  const nextSprintName = futureSprint.name.replace("Tablero Sprint", "");

  let startDate: Date;
  let daysUntilStart: number;

  try {
    startDate = parseISO(futureSprint.startDate);
    daysUntilStart = differenceInDays(startDate, new Date());
  } catch (error) {
    console.error("Error parsing sprint date:", error);
    return null;
  }

  return (
    <div className="w-full max-w-5xl mx-auto mb-6">
      <div className="p-4 rounded-lg border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Próximo Sprint
            </h3>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Sprint {nextSprintName}</span>
              <Badge variant="outline" className="text-xs">
                🔮 Futuro
              </Badge>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Comienza: {format(startDate, "PPP")}
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold" suppressHydrationWarning>
              {daysUntilStart > 0 ? daysUntilStart : 0}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              días restantes
            </div>
          </div>
        </div>
        {futureSprint.goal && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
            <p className="text-sm">
              <strong>Objetivo:</strong> {futureSprint.goal}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
