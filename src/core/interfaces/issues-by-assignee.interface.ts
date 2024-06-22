import { Issue } from "./issues.interface";

export interface IssueByAssignee {
  assignee: {
    emailAddress: string;
    avatarUrls: {
      "48x48": string;
      "24x24": string;
      "16x16": string;
      "32x32": string;
    };
    displayName: string;
  };
  issues: Issue[];
  doneIssues: number;
  totalIssues: number;
  inProgressIssues: number;
}
