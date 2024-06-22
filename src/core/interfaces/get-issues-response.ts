import { Issue } from "./issues.interface";

export interface GetIssuesResponse {
  maxResults: number;
  startAt: number;
  isLast: boolean;
  issues: Issue[];
}
