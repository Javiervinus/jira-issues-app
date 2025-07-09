import { SprintState } from "@/core/enums/sprint-state.enum";
import { SprintResume } from "@/core/interfaces/sprint-resume.interface";
import {
  getCurrentSprintIssues,
  getSprintMetrics,
} from "@/lib/services/sprint-services";
import { SparklesIcon, TrophyIcon } from "@heroicons/react/24/outline";
import { differenceInDays, format, parseISO } from "date-fns";
import SprintCountdown from "./SprintCountdown";

interface SprintHeroProps {
  lastSprints: SprintResume[];
}

export default async function SprintHero({ lastSprints }: SprintHeroProps) {
  const activeSprint = lastSprints?.find(
    (sprint) => sprint.state === SprintState.ACTIVE
  );

  if (!activeSprint) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg p-8 border border-gray-200 dark:border-gray-800">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            No hay sprint activo
          </h2>
        </div>
      </div>
    );
  }

  const [metrics, assignees] = await Promise.all([
    getSprintMetrics(activeSprint.id),
    getCurrentSprintIssues(activeSprint.id),
  ]);

  // Sprint timing calculations
  const startDate = parseISO(activeSprint.startDate);
  const endDate = parseISO(activeSprint.endDate!);
  const totalDays = differenceInDays(endDate, startDate);
  const daysElapsed = differenceInDays(new Date(), startDate);
  const sprintProgress =
    totalDays > 0
      ? Math.min(Math.round((daysElapsed / totalDays) * 100), 100)
      : 0;

  // Team highlights
  const sortedByPerformance = [...assignees].sort(
    (a, b) => b.performance - a.performance
  );
  const topPerformer = sortedByPerformance[0];

  const sortedByActivity = [...assignees]
    .filter((a) => (a.recentlyUpdatedIssues || 0) > 0)
    .sort(
      (a, b) => (b.recentlyUpdatedIssues || 0) - (a.recentlyUpdatedIssues || 0)
    );
  const mostActive = sortedByActivity[0];

  const activeSprintName = activeSprint.name.replace("Tablero Sprint", "");

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[400px]">
        {/* Left Section: Sprint Info & Countdown */}
        <div className="lg:col-span-2 p-8 flex flex-col justify-center">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            {/* Sprint Header */}
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 mb-4">
                Sprint Activo
              </div>
              <h1 className="font-bold text-3xl md:text-4xl text-gray-900 dark:text-white mb-2">
                Sprint {activeSprintName}
              </h1>
              <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                {format(startDate, "PPP")} - {format(endDate, "PPP")}
              </div>
            </div>

            {/* Sprint Progress Bar */}
            <div className="w-full max-w-md mx-auto">
              <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
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
                className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium"
                suppressHydrationWarning
              >
                Día {daysElapsed} de {totalDays} días laborales
              </div>
            </div>

            {/* Countdown */}
            <SprintCountdown
              endDate={activeSprint.endDate!}
              activeSprintName={activeSprintName}
              startDate={activeSprint.startDate}
            />
          </div>
        </div>

        {/* Right Section: Metrics & Team Insights */}
        <div className="lg:col-span-1 bg-gray-50 dark:bg-gray-800/50 p-6 space-y-6">
          {/* Progress Overview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Progreso General
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Completado
                </span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {metrics.progressPercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${metrics.progressPercentage}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-center">
                <div>
                  <div className="font-bold text-green-600 dark:text-green-400">
                    {metrics.doneIssues}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">Done</div>
                </div>
                <div>
                  <div className="font-bold text-yellow-600 dark:text-yellow-400">
                    {metrics.inProgressIssues}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    Progress
                  </div>
                </div>
                <div>
                  <div className="font-bold text-gray-600 dark:text-gray-400">
                    {metrics.toDoIssues}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">To Do</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div>
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3 uppercase tracking-wide">
              Métricas Rápidas
            </h4>
            <div className="space-y-2">
              {metrics.totalStoryPoints > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">
                    Story Points
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {metrics.completedStoryPoints}/{metrics.totalStoryPoints}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">
                  Actividad semanal
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {metrics.recentComments + metrics.recentWorkLogs}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Equipo</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {metrics.uniqueAssignees} devs
                </span>
              </div>
            </div>
          </div>

          {/* Team Highlights */}
          {(topPerformer || mostActive) && (
            <div>
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3 uppercase tracking-wide">
                Team Highlights
              </h4>
              <div className="space-y-3">
                {topPerformer && (
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                    <TrophyIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300 uppercase">
                          Top Performance
                        </span>
                        <span className="text-sm font-bold text-yellow-800 dark:text-yellow-200">
                          {Math.round(topPerformer.performance * 100)}%
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {topPerformer.assignee.displayName}
                      </p>
                    </div>
                  </div>
                )}
                {mostActive && (
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <SparklesIcon className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-green-700 dark:text-green-300 uppercase">
                          Más Activo
                        </span>
                        <span className="text-sm font-bold text-green-800 dark:text-green-200">
                          {mostActive.recentlyUpdatedIssues}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {mostActive.assignee.displayName}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Priority Tags */}
          {Object.keys(metrics.priorityDistribution).length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3 uppercase tracking-wide">
                Prioridades
              </h4>
              <div className="flex flex-wrap gap-1">
                {Object.entries(metrics.priorityDistribution)
                  .slice(0, 4)
                  .map(([priority, count]) => {
                    const priorityColors = {
                      Highest:
                        "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
                      High: "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300",
                      Medium:
                        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
                      Low: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
                    };

                    return (
                      <span
                        key={priority}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          priorityColors[
                            priority as keyof typeof priorityColors
                          ] ||
                          "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300"
                        }`}
                      >
                        {priority}: {count}
                      </span>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
