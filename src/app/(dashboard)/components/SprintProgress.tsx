import { SprintResume } from "@/core/interfaces/sprint-resume.interface";
import { getSprintMetrics } from "@/lib/services/sprint-services";
import {
  ChartBarIcon,
  ClockIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

interface SprintProgressProps {
  currentSprint: SprintResume;
}

export default async function SprintProgress({
  currentSprint,
}: SprintProgressProps) {
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
  ];

  const visibleInsights = insightCards.filter((card) => card.show);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 h-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Sprint Progress
      </h3>

      {/* Main Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Progreso General
          </span>
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {metrics.progressPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${metrics.progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>{metrics.doneIssues} done</span>
          <span>{metrics.inProgressIssues} in progress</span>
          <span>{metrics.toDoIssues} to do</span>
        </div>
      </div>

      {/* Quick Insights */}
      {visibleInsights.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">
            Métricas Clave
          </h4>
          <div className="space-y-3">
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
                  className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      colorClasses[card.color as keyof typeof colorClasses]
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {card.title}
                      </span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {card.value}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {card.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
