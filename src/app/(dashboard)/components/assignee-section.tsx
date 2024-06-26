import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { IssueState } from "@/core/enums/issue-state.enum";
import { SprintResume } from "@/core/interfaces/sprint-resume.interface";
import { getCurrentSprintIssues } from "@/lib/services/sprint-services";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
        <article
          key={assignee.assignee.emailAddress}
          className="flex flex-col relative gap-4 h-full p-4 rounded-lg border border-gray-300 dark:border-neutral-700 lg:p-6 lg:gap-6 lg:dark:border-neutral-800/30"
        >
          {assignee === bestAssignee && (
            <span className="absolute -top-1 -right-6 rotate-[40deg] transform -translate-x-1/2 -translate-y-4 mt-2 ">
              <FontAwesomeIcon
                className="w-6 text-yellow-500 dark:text-yellow-400"
                icon={faCrown}
              />
            </span>
          )}

          <h2 className="text-2xl font-semibold inline">
            {assignee.assignee.displayName}{" "}
            <span className="inline-flex items-center">
              <Avatar className="h-5 w-5">
                <AvatarImage src={assignee.assignee.avatarUrls["24x24"]} />
                <AvatarFallback>
                  {assignee.assignee.displayName[0]}
                </AvatarFallback>
              </Avatar>
            </span>
            {assignee.assignee.displayName === "Claudio Godoi" && (
              <div className="block">
                <Badge variant="outline">
                  Sprint {activeSprintNumber - 12}
                </Badge>
              </div>
            )}
          </h2>

          <div className="flex w-full flex-col gap-2">
            <HoverCard>
              <span>
                Por hacer:{" "}
                <HoverCardTrigger className="no-underline md:underline cursor-pointer">
                  {assignee.toDoIssues}
                </HoverCardTrigger>
                <HoverCardContent className="w-auto">
                  <ul>
                    {assignee.issues
                      .filter(
                        (issue) => issue.fields.status.name === IssueState.TO_DO
                      )
                      .map((issue) => (
                        <li key={issue.key}>{issue.key}</li>
                      ))}
                  </ul>
                </HoverCardContent>
              </span>
            </HoverCard>
            <HoverCard>
              <span>
                En progreso:{" "}
                <HoverCardTrigger className=" no-underline md:underline cursor-pointer">
                  {assignee.inProgressIssues}
                </HoverCardTrigger>
                <HoverCardContent className="w-auto">
                  <ul>
                    {assignee.issues
                      .filter(
                        (issue) =>
                          issue.fields.status.name === IssueState.IN_PROGRESS
                      )
                      .map((issue) => (
                        <li key={issue.key}>{issue.key}</li>
                      ))}
                  </ul>
                </HoverCardContent>
              </span>
            </HoverCard>
            <HoverCard>
              <span>
                Hechas:{" "}
                <HoverCardTrigger className="no-underline md:underline cursor-pointer">
                  {assignee.doneIssues}
                </HoverCardTrigger>
                <HoverCardContent className="w-auto">
                  <ul>
                    {assignee.issues
                      .filter(
                        (issue) =>
                          issue.fields.status.name === IssueState.DONE ||
                          issue.fields.status.name === IssueState.IN_DEV
                      )
                      .map((issue) => (
                        <li key={issue.key}>{issue.key}</li>
                      ))}
                  </ul>
                </HoverCardContent>
              </span>
            </HoverCard>

            {/* <span>En progreso: {assignee.inProgressIssues} </span>
            <span>Hechas: {assignee.doneIssues} </span> */}
          </div>
        </article>
      ))}
    </div>
  );
}
