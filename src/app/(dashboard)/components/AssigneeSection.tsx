import { SprintResume } from "@/core/interfaces/sprint-resume.interface";
import { getCurrentSprintIssues } from "@/lib/services/sprint-services";
import AssigneeCard from "./AssigneeCard";
import TeamStats from "./TeamStats";

export default async function AssigneeSection({
  currentSprint,
}: {
  currentSprint: SprintResume;
}) {
  const activeSprintNumber = parseInt(
    currentSprint?.name.replace("Tablero Sprint", "")
  );

  const issuesByAssignee = await getCurrentSprintIssues(currentSprint.id);
  const bestAssignee = issuesByAssignee.reduce((best, current) => {
    return current.performance > best.performance ? current : best;
  }, issuesByAssignee[0]);
  return (
    <div className="w-full space-y-6">
      {/* Section Header */}
      <div className="text-left">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Rendimiento del Equipo
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Análisis individual y estadísticas del sprint actual
        </p>
      </div>

      {/* Team Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {issuesByAssignee.map((assignee) => (
          <AssigneeCard
            key={
              assignee.assignee.emailAddress || assignee.assignee.displayName
            }
            assignee={assignee}
            bestAssignee={bestAssignee}
            activeSprintNumber={activeSprintNumber}
          />
        ))}
      </div>

      {/* Team Statistics Summary */}
      <TeamStats assignees={issuesByAssignee} />
    </div>
  );
}
