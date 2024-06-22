import { SprintResume } from "./sprint-resume.interface";

export interface GetSprintsResponse {
  maxResults: number;
  startAt: number;
  isLast: boolean;
  values: SprintResume[];
}
