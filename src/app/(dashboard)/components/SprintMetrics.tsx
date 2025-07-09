import { SprintResume } from "@/core/interfaces/sprint-resume.interface";
import { getSprintMetrics } from "@/lib/services/sprint-services";

interface SprintMetricsProps {
  currentSprint: SprintResume;
}

export default async function SprintMetrics({
  currentSprint,
}: SprintMetricsProps) {
  const metrics = await getSprintMetrics(currentSprint.id);

  return (
    <div className="space-y-4">
      {/* Progress Overview */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Progreso
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
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {metrics.doneIssues} de {metrics.totalIssues} completadas
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-lg font-bold text-green-600 dark:text-green-400">
            {metrics.doneIssues}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Done</div>
        </div>
        <div>
          <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
            {metrics.inProgressIssues}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            In Progress
          </div>
        </div>
        <div>
          <div className="text-lg font-bold text-gray-600 dark:text-gray-400">
            {metrics.toDoIssues}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">To Do</div>
        </div>
      </div>

      {/* Team & Activity Stats */}
      <div className="grid grid-cols-2 gap-3 text-center">
        <div>
          <div className="text-sm font-bold text-purple-600 dark:text-purple-400">
            {metrics.uniqueAssignees}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Devs</div>
        </div>
        <div>
          <div className="text-sm font-bold text-orange-600 dark:text-orange-400">
            {metrics.averageIssuesPerAssignee}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Avg/Dev
          </div>
        </div>
      </div>

      {/* Activity Indicators */}
      {(metrics.recentlyCreated > 0 ||
        metrics.recentlyUpdated > 0 ||
        metrics.highPriorityIssues > 0) && (
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
          {metrics.recentlyCreated > 0 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">
                Nuevas (7d):
              </span>
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {metrics.recentlyCreated}
              </span>
            </div>
          )}
          {metrics.recentlyUpdated > 0 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">
                Actualizadas (7d):
              </span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {metrics.recentlyUpdated}
              </span>
            </div>
          )}
          {metrics.highPriorityIssues > 0 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">
                Alta prioridad:
              </span>
              <span className="font-medium text-red-600 dark:text-red-400">
                {metrics.highPriorityIssues}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Sprint Goal */}
      {currentSprint.goal && (
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-300 italic">
            "{currentSprint.goal}"
          </p>
        </div>
      )}
    </div>
  );
}
