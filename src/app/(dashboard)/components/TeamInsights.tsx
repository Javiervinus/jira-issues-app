import { SprintResume } from "@/core/interfaces/sprint-resume.interface";
import {
  getCurrentSprintIssues,
  getSprintMetrics,
} from "@/lib/services/sprint-services";
import {
  ChatBubbleLeftIcon,
  SparklesIcon,
  TagIcon,
  TrophyIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

interface TeamInsightsProps {
  currentSprint: SprintResume;
}

export default async function TeamInsights({
  currentSprint,
}: TeamInsightsProps) {
  const [metrics, assignees] = await Promise.all([
    getSprintMetrics(currentSprint.id),
    getCurrentSprintIssues(currentSprint.id),
  ]);

  // Team highlights calculations
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

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 h-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Team Insights
      </h3>

      {/* Team Highlights */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <UserGroupIcon className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">
            Highlights
          </span>
        </div>

        <div className="space-y-3">
          {/* Top Performer */}
          {topPerformer && (
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
              <TrophyIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300 uppercase tracking-wide">
                    Top Performance
                  </p>
                  <span className="text-lg font-bold text-yellow-800 dark:text-yellow-200">
                    {Math.round(topPerformer.performance * 100)}%
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {topPerformer.assignee.displayName}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {topPerformer.doneIssues}/{topPerformer.totalIssues} tareas
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Most Active */}
          {mostActive && (
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
              <SparklesIcon className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-green-700 dark:text-green-300 uppercase tracking-wide">
                    Más Activo
                  </p>
                  <span className="text-lg font-bold text-green-800 dark:text-green-200">
                    {mostActive.recentlyUpdatedIssues}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {mostActive.assignee.displayName}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    actualizaciones recientes
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Priority Distribution */}
      {Object.keys(metrics.priorityDistribution).length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <TagIcon className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">
              Prioridades
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
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
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
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
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-start space-x-2">
            <ChatBubbleLeftIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide mb-2">
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
