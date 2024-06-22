import { SprintState } from "../enums/sprint-state.enum";

export interface SprintResume {
  id: number;
  self: string;
  state: SprintState;
  name: string;
  startDate: string;
  endDate?: string;
  createdDate: string;
  originBoardId: number;
  goal?: string;
}
