import { SprintResume } from "@/core/interfaces/sprint-resume.interface";
import { getSprintMetrics } from "@/lib/services/sprint-services";
import {
  ChartBarIcon,
  ChatBubbleLeftIcon,
  ClockIcon,
  CodeBracketIcon,
  SparklesIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

interface SprintInsightsProps {
  currentSprint: SprintResume;
}

export default async function SprintInsights({
  currentSprint,
}: SprintInsightsProps) {
  const metrics = await getSprintMetrics(currentSprint.id);

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
    {
      title: "Epics",
      value: Object.keys(metrics.epicDistribution).length.toString(),
      subtitle: "features en progreso",
      icon: CodeBracketIcon,
      color: "orange",
      show: Object.keys(metrics.epicDistribution).length > 0,
    },
  ];

  const visibleCards = insightCards.filter((card) => card.show);

  return (
    <div className="space-y-4">
      {/* Main Progress */}
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

      {/* Quick Insights Grid */}
      {visibleCards.length > 0 && (
        <div
          className={`grid ${
            visibleCards.length === 1
              ? "grid-cols-1"
              : visibleCards.length === 2
              ? "grid-cols-2"
              : visibleCards.length === 3
              ? "grid-cols-3"
              : "grid-cols-2"
          } gap-3`}
        >
          {visibleCards.map((card, index) => {
            const IconComponent = card.icon;
            const colorClasses = {
              blue: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
              green:
                "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20",
              purple:
                "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20",
              orange:
                "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20",
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

      {/* Sprint Goal */}
      {currentSprint.goal && (
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-start space-x-2">
            <ChatBubbleLeftIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-600 dark:text-gray-300 italic leading-relaxed">
              "{currentSprint.goal}"
            </p>
          </div>
        </div>
      )}

      {/* Priority Distribution */}
      {Object.keys(metrics.priorityDistribution).length > 0 && (
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <TagIcon className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
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
    </div>
  );
}
