import { IssueByAssignee } from "@/core/interfaces/issues-by-assignee.interface";

interface TeamStatsProps {
  assignees: IssueByAssignee[];
}

export default function TeamStats({ assignees }: TeamStatsProps) {
  const totalTeamIssues = assignees.reduce(
    (sum, assignee) => sum + assignee.totalIssues,
    0
  );
  const totalTeamDone = assignees.reduce(
    (sum, assignee) => sum + assignee.doneIssues,
    0
  );
  const totalTeamInProgress = assignees.reduce(
    (sum, assignee) => sum + assignee.inProgressIssues,
    0
  );
  const totalTeamToDo = assignees.reduce(
    (sum, assignee) => sum + assignee.toDoIssues,
    0
  );

  const teamVelocity =
    totalTeamIssues > 0
      ? Math.round((totalTeamDone / totalTeamIssues) * 100)
      : 0;
  const avgPerformance =
    assignees.length > 0
      ? Math.round(
          (assignees.reduce((sum, assignee) => sum + assignee.performance, 0) /
            assignees.length) *
            100
        )
      : 0;
  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Estadísticas del Equipo
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Métricas consolidadas de todo el equipo de desarrollo
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-900 text-center p-6 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
            {assignees.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Developers
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 text-center p-6 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
            {teamVelocity}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Completion Rate
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 text-center p-6 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
            {avgPerformance}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Avg Performance
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 text-center p-6 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">
            {totalTeamIssues}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Total Issues
          </div>
        </div>
      </div>

      {/* Team Distribution Visualization */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Distribución de Trabajo del Equipo
          </h4>
          <div className="text-2xl">👥</div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            <span>Progreso del equipo</span>
            <span>{teamVelocity}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
              style={{ width: `${teamVelocity}%` }}
            >
              {teamVelocity > 20 && (
                <span className="text-xs text-white font-medium">
                  {totalTeamDone}/{totalTeamIssues}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Distribution cards */}
        <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                  {totalTeamDone}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                  Completadas
                </div>
              </div>
              <div className="text-2xl">✅</div>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                  {totalTeamInProgress}
                </div>
                <div className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                  En Progreso
                </div>
              </div>
              <div className="text-2xl">🔄</div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-700 dark:text-gray-400">
                  {totalTeamToDo}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Pendientes
                </div>
              </div>
              <div className="text-2xl">📋</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
