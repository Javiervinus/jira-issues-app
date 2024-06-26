import { SprintResume } from "@/core/interfaces/sprint-resume.interface";
import { getCurrentSprintIssues } from "@/lib/services/sprint-services";
import AssigneeCard from "./AssigneeCard";

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
    <div
      className={`mb-32 grid mt-4 text-center gap-2 lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-3 lg:text-left`}
    >
      {issuesByAssignee.map((assignee) => (
        <AssigneeCard
          key={assignee.assignee.emailAddress}
          assignee={assignee}
          bestAssignee={bestAssignee}
          activeSprintNumber={activeSprintNumber}
        />
      ))}
    </div>
  );
}
