import { SprintResume } from "@/core/interfaces/sprint-resume.interface";
import { getCurrentSprintIssues } from "@/lib/services/sprint-services";
import {
  ChartBarIcon,
  ClockIcon,
  TrophyIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

interface TeamHighlightsProps {
  currentSprint: SprintResume;
}

export default async function TeamHighlights({
  currentSprint,
}: TeamHighlightsProps) {
  const assignees = await getCurrentSprintIssues(currentSprint.id);

  // Find top performers
  const sortedByPerformance = [...assignees].sort(
    (a, b) => b.performance - a.performance
  );
  const topPerformer = sortedByPerformance[0];

  // Find most story points
  const sortedByStoryPoints = [...assignees]
    .filter((a) => (a.totalStoryPoints || 0) > 0)
    .sort((a, b) => (b.totalStoryPoints || 0) - (a.totalStoryPoints || 0));
  const storyPointLeader = sortedByStoryPoints[0];

  // Find most active (recently updated issues)
  const sortedByActivity = [...assignees]
    .filter((a) => (a.recentlyUpdatedIssues || 0) > 0)
    .sort(
      (a, b) => (b.recentlyUpdatedIssues || 0) - (a.recentlyUpdatedIssues || 0)
    );
  const mostActive = sortedByActivity[0];

  // Find best time efficiency
  const sortedByTimeEfficiency = [...assignees]
    .filter(
      (a) => (a.timeEfficiency || 0) > 0 && (a.totalTimeEstimate || 0) > 0
    )
    .sort((a, b) => (b.timeEfficiency || 0) - (a.timeEfficiency || 0));
  const timeEfficiencyLeader = sortedByTimeEfficiency[0];

  const highlights = [
    {
      title: "Top Performance",
      name: topPerformer?.assignee.displayName || "N/A",
      value: topPerformer
        ? `${Math.round(topPerformer.performance * 100)}%`
        : "N/A",
      subtitle: `${topPerformer?.doneIssues || 0}/${
        topPerformer?.totalIssues || 0
      } tareas`,
      icon: TrophyIcon,
      color: "yellow",
      show: !!topPerformer,
    },
    {
      title: "Story Points",
      name: storyPointLeader?.assignee.displayName || "N/A",
      value: `${storyPointLeader?.totalStoryPoints || 0}pts`,
      subtitle: `${storyPointLeader?.completedStoryPoints || 0} completados`,
      icon: ChartBarIcon,
      color: "blue",
      show: !!storyPointLeader,
    },
    {
      title: "Más Activo",
      name: mostActive?.assignee.displayName || "N/A",
      value: `${mostActive?.recentlyUpdatedIssues || 0}`,
      subtitle: "actualizaciones recientes",
      icon: UserGroupIcon,
      color: "green",
      show: !!mostActive,
    },
    {
      title: "Eficiencia",
      name: timeEfficiencyLeader?.assignee.displayName || "N/A",
      value: `${timeEfficiencyLeader?.timeEfficiency || 0}%`,
      subtitle: `${timeEfficiencyLeader?.totalTimeSpent || 0}h gastadas`,
      icon: ClockIcon,
      color: "purple",
      show: !!timeEfficiencyLeader,
    },
  ];

  const visibleHighlights = highlights.filter((h) => h.show);

  if (visibleHighlights.length === 0) {
    return (
      <div className="text-center py-4">
        <UserGroupIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No hay suficientes datos para mostrar highlights del equipo
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {visibleHighlights.map((highlight, index) => {
        const IconComponent = highlight.icon;
        const colorClasses = {
          yellow: "text-yellow-600 dark:text-yellow-400",
          blue: "text-blue-600 dark:text-blue-400",
          green: "text-green-600 dark:text-green-400",
          purple: "text-purple-600 dark:text-purple-400",
        };

        return (
          <div
            key={index}
            className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"
          >
            <div className="flex-shrink-0">
              <IconComponent
                className={`w-5 h-5 ${
                  colorClasses[highlight.color as keyof typeof colorClasses]
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                  {highlight.title}
                </p>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {highlight.value}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {highlight.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {highlight.subtitle}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
