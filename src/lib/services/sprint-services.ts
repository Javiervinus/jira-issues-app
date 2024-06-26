import { IssueState } from "@/core/enums/issue-state.enum";
import { GetIssuesResponse } from "@/core/interfaces/get-issues-response";
import { GetSprintsResponse } from "@/core/interfaces/get-sprints-response";
import { IssueByAssignee } from "@/core/interfaces/issues-by-assignee.interface";
import { Issue } from "@/core/interfaces/issues.interface";
const baseUrl = "https://betterplan.atlassian.net/rest/agile/latest/";

export async function getLastSprints(): Promise<GetSprintsResponse> {
  //  create query params for the request with URLSearchParams
  const params = new URLSearchParams();
  params.append("state", "active,future");
  params.append("maxResults", "2");
  const query = params.toString();

  //  make the request to the Jira API
  const res = await fetch(`${baseUrl}/board/2/sprint?${query}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${process.env.JIRA_USER}:${process.env.JIRA_TOKEN}`
      ).toString("base64")}`,
    },
    next: {
      revalidate: 500,
    },
  });

  return res.json();
}
export async function getCurrentSprintIssues(sprintId: number) {
  const params = new URLSearchParams();
  params.append("jql", "project = 'Betterplan'");
  params.append(
    "fields",
    "status,assignee,issuetype,issuenum,issuenum,subtasks"
  );
  const query = params.toString();

  const res = await fetch(
    `${baseUrl}/board/2/sprint/${sprintId}/issue?${query}`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.JIRA_USER}:${process.env.JIRA_TOKEN}`
        ).toString("base64")}`,
      },
      next: {
        revalidate: 120,
      },
    }
  );

  const response = (await res.json()) as GetIssuesResponse;
  return getIssuesByAssignee(response.issues);
}
function getIssuesByAssignee(issues: Issue[]) {
  const issuesByAssignee: IssueByAssignee[] = [];
  issues.forEach((issue) => {
    const assignee = issue.fields.assignee;
    const assigneeIndex = issuesByAssignee.findIndex(
      (assigneeIssues) =>
        assigneeIssues.assignee.emailAddress === assignee?.emailAddress
    );
    let addIssue = false;
    if (assignee) {
      if (assigneeIndex === -1) {
        const issueByAssignee: IssueByAssignee = {
          assignee,
          issues: [],
          doneIssues: 0,
          totalIssues: 0,
          inProgressIssues: 0,
          toDoIssues: 0,
          performance: 0,
        };
        // se añaden las tareas que no son subtasks
        if (
          issue.fields.subtasks.length === 0 &&
          issue.fields.issuetype.subtask === false
        ) {
          addIssue = true;
        }
        if (
          issue.fields.subtasks.length === 0 &&
          issue.fields.issuetype.subtask === true
        ) {
          addIssue = true;
        }
        if (addIssue) {
          issueByAssignee.totalIssues++;
          if (
            issue.fields.status.name === IssueState.IN_DEV ||
            issue.fields.status.name === IssueState.DONE
          ) {
            issueByAssignee.doneIssues++;
          } else if (issue.fields.status.name === IssueState.IN_PROGRESS) {
            issueByAssignee.inProgressIssues++;
          } else if (issue.fields.status.name === IssueState.TO_DO) {
            issueByAssignee.toDoIssues++;
          }
          issueByAssignee.issues.push(issue);
          issuesByAssignee.push(issueByAssignee);
        }
      } else {
        if (
          issue.fields.subtasks.length === 0 &&
          issue.fields.issuetype.subtask === false
        ) {
          addIssue = true;
        } else {
          if (
            issue.fields.subtasks.length === 0 &&
            issue.fields.issuetype.subtask === true
          ) {
            addIssue = true;
          }
        }
        if (addIssue) {
          const issueByAssignee = issuesByAssignee[assigneeIndex];
          issueByAssignee.totalIssues++;
          if (
            issue.fields.status.name === IssueState.IN_DEV ||
            issue.fields.status.name === IssueState.DONE
          ) {
            issueByAssignee.doneIssues++;
          } else if (issue.fields.status.name === IssueState.IN_PROGRESS) {
            issueByAssignee.inProgressIssues++;
          } else if (issue.fields.status.name === IssueState.TO_DO) {
            issueByAssignee.toDoIssues++;
          }

          issueByAssignee.issues.push(issue);
        }
      }
    }
  });
  issuesByAssignee.forEach((assignee) => {
    assignee.performance =
      (assignee.doneIssues / assignee.totalIssues) * 0.7 +
      (assignee.inProgressIssues / assignee.totalIssues) * 0.2 +
      (1 / (assignee.toDoIssues + 1)) * 0.1;
  });

  return issuesByAssignee;
}
