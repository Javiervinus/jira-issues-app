"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { IssueByAssignee } from "@/core/interfaces/issues-by-assignee.interface";
import IssuesHoverCard from "@/ui/common/components/IssuesHoverCard";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { IssueState } from "@/core/enums/issue-state.enum";
import { useState } from "react";
export default function AssigneeCard({
  assignee,
  bestAssignee,
  activeSprintNumber,
}: {
  assignee: IssueByAssignee;
  bestAssignee: IssueByAssignee;
  activeSprintNumber: number;
}) {
  const [openToDo, setOpenToDo] = useState(false);
  const [openInProgress, setOpenInProgress] = useState(false);
  const [openDone, setOpenDone] = useState(false);

  return (
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
            <AvatarFallback>{assignee.assignee.displayName[0]}</AvatarFallback>
          </Avatar>
        </span>
        {assignee.assignee.displayName === "Claudio Godoi" && (
          <div className="block">
            <Badge variant="outline">Sprint {activeSprintNumber - 12}</Badge>
          </div>
        )}
      </h2>

      <div className="flex w-full flex-col gap-2">
        <HoverCard
          openDelay={0}
          open={openToDo}
          onOpenChange={setOpenToDo}
          closeDelay={100}
        >
          <span>
            Por hacer:{" "}
            <HoverCardTrigger
              onClick={() => setOpenToDo(!openToDo)}
              className={`  ${
                assignee.toDoIssues > 0
                  ? "cursor-pointer underline"
                  : " no-underline"
              }`}
            >
              {assignee.toDoIssues}
            </HoverCardTrigger>
            {assignee.toDoIssues > 0 && (
              <HoverCardContent className="w-auto">
                <IssuesHoverCard
                  issues={assignee.issues.filter(
                    (issue) => issue.fields.status.name === IssueState.TO_DO
                  )}
                />
              </HoverCardContent>
            )}
          </span>
        </HoverCard>
        <HoverCard
          openDelay={0}
          open={openInProgress}
          onOpenChange={setOpenInProgress}
          closeDelay={100}
        >
          <span>
            En progreso:{" "}
            <HoverCardTrigger
              onClick={() => setOpenInProgress(!openInProgress)}
              className={`  ${
                assignee.inProgressIssues > 0
                  ? "cursor-pointer underline"
                  : " no-underline"
              }`}
            >
              {assignee.inProgressIssues}
            </HoverCardTrigger>
            {
              // Show hover card only if there are issues in progress
              assignee.inProgressIssues > 0 && (
                <HoverCardContent className="w-auto">
                  <IssuesHoverCard
                    issues={assignee.issues.filter(
                      (issue) =>
                        issue.fields.status.name === IssueState.IN_PROGRESS
                    )}
                  />
                </HoverCardContent>
              )
            }
          </span>
        </HoverCard>
        <HoverCard
          openDelay={0}
          open={openDone}
          onOpenChange={setOpenDone}
          closeDelay={100}
        >
          <span>
            Hechas:{" "}
            <HoverCardTrigger
              onClick={() => setOpenDone(!openDone)}
              className={`  ${
                assignee.doneIssues > 0
                  ? "cursor-pointer underline"
                  : "no-underline"
              }`}
            >
              {assignee.doneIssues}
            </HoverCardTrigger>
            <HoverCardContent className="w-auto">
              <IssuesHoverCard
                issues={assignee.issues.filter(
                  (issue) =>
                    issue.fields.status.name === IssueState.DONE ||
                    issue.fields.status.name === IssueState.IN_DEV
                )}
              />
            </HoverCardContent>
          </span>
        </HoverCard>

        {/* <span>En progreso: {assignee.inProgressIssues} </span>
      <span>Hechas: {assignee.doneIssues} </span> */}
      </div>
    </article>
  );
}
