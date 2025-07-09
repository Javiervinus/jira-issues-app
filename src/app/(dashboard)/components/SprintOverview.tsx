import { SprintResume } from "@/core/interfaces/sprint-resume.interface";
import {
  getCurrentSprintIssues,
  getSprintMetrics,
} from "@/lib/services/sprint-services";
import {
  ChartBarIcon,
  ChatBubbleLeftIcon,
  ClockIcon,
  SparklesIcon,
  TagIcon,
  TrophyIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

interface SprintOverviewProps {
  currentSprint: SprintResume;
}

export default async function SprintOverview({
  currentSprint,
}: SprintOverviewProps) {
  const [metrics, assignees] = await Promise.all([
    getSprintMetrics(currentSprint.id),
    getCurrentSprintIssues(currentSprint.id),
  ]);

  // Team highlights calculations
  const sortedByPerformance = [...assignees].sort(
    (a, b) => b.performance - a.performance
  );
  const topPerformer = sortedByPerformance[0];

  const sortedByStoryPoints = [...assignees]
    .filter((a) => (a.totalStoryPoints || 0) > 0)
    .sort((a, b) => (b.totalStoryPoints || 0) - (a.totalStoryPoints || 0));
  const storyPointLeader = sortedByStoryPoints[0];

  const sortedByActivity = [...assignees]
    .filter((a) => (a.recentlyUpdatedIssues || 0) > 0)
    .sort(
      (a, b) => (b.recentlyUpdatedIssues || 0) - (a.recentlyUpdatedIssues || 0)
    );
  const mostActive = sortedByActivity[0];

  const insightCards = [
    {
      title: "Story Points",
      value: `${metrics.completedStoryPoints}/${metrics.totalStoryPoints}`,
      subtitle: `${metrics.storyPointsProgress}% completado`,
      icon: ChartBarIcon,
      color: "blue",
      show: metrics.totalStoryPoints > 0,
    },
    {
      title: "Tiempo",
      value: `${metrics.totalTimeSpent}h`,
      subtitle: `de ${metrics.totalTimeEstimate}h estimadas`,
      icon: ClockIcon,
      color: "green",
      show: metrics.totalTimeEstimate > 0,
    },
    {
      title: "Actividad",
      value: `${metrics.recentComments + metrics.recentWorkLogs}`,
      subtitle: "acciones esta semana",
      icon: SparklesIcon,
      color: "purple",
      show: true,
    },
  ];

  const visibleInsights = insightCards.filter((card) => card.show);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Sprint Overview
      </h3>

      {/* Main Progress Section */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Progreso General
            </span>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {metrics.progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${metrics.progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{metrics.doneIssues} done</span>
            <span>{metrics.inProgressIssues} in progress</span>
            <span>{metrics.toDoIssues} to do</span>
          </div>
        </div>

        {/* Quick Insights */}
        {visibleInsights.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {visibleInsights.map((card, index) => {
              const IconComponent = card.icon;
              const colorClasses = {
                blue: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
                green:
                  "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20",
                purple:
                  "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20",
              };

              return (
                <div
                  key={index}
                  className="text-center p-3 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50"
                >
                  <div
                    className={`w-8 h-8 mx-auto mb-2 rounded-lg flex items-center justify-center ${
                      colorClasses[card.color as keyof typeof colorClasses]
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                    {card.value}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                    {card.subtitle}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Team Highlights Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex items-center space-x-2 mb-3">
          <UserGroupIcon className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">
            Team Highlights
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {/* Top Performer */}
          {topPerformer && (
            <div className="flex items-center space-x-3 p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
              <TrophyIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-yellow-700 dark:text-yellow-300 uppercase tracking-wide">
                    Top Performance
                  </p>
                  <span className="text-sm font-bold text-yellow-800 dark:text-yellow-200">
                    {Math.round(topPerformer.performance * 100)}%
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {topPerformer.assignee.displayName}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {topPerformer.doneIssues}/{topPerformer.totalIssues} tareas
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Story Point Leader & Most Active in same row */}
          <div className="grid grid-cols-2 gap-3">
            {storyPointLeader && (
              <div className="flex items-center space-x-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <ChartBarIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                      Story Points
                    </p>
                    <span className="text-sm font-bold text-blue-800 dark:text-blue-200">
                      {storyPointLeader.totalStoryPoints}pts
                    </span>
                  </div>
                  <p className="text-xs text-gray-900 dark:text-white truncate font-medium">
                    {storyPointLeader.assignee.displayName}
                  </p>
                </div>
              </div>
            )}

            {mostActive && (
              <div className="flex items-center space-x-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                <SparklesIcon className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wide">
                      Más Activo
                    </p>
                    <span className="text-sm font-bold text-green-800 dark:text-green-200">
                      {mostActive.recentlyUpdatedIssues}
                    </span>
                  </div>
                  <p className="text-xs text-gray-900 dark:text-white truncate font-medium">
                    {mostActive.assignee.displayName}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Priority Distribution */}
      {Object.keys(metrics.priorityDistribution).length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center space-x-2 mb-2">
            <TagIcon className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">
              Prioridades
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {Object.entries(metrics.priorityDistribution).map(
              ([priority, count]) => {
                const priorityColors = {
                  Highest:
                    "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
                  High: "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300",
                  Medium:
                    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
                  Low: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
                  Lowest:
                    "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300",
                };

                return (
                  <span
                    key={priority}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      priorityColors[priority as keyof typeof priorityColors] ||
                      "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300"
                    }`}
                  >
                    {priority}: {count}
                  </span>
                );
              }
            )}
          </div>
        </div>
      )}

      {/* Sprint Goal */}
      {currentSprint.goal && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-start space-x-2">
            <ChatBubbleLeftIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide mb-1">
                Sprint Goal
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                "{currentSprint.goal}"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
