import { GetSprintsResponse } from "@/core/interfaces/get-sprints-response";

export class SprintServices {
  static baseUrl = "https://betterplan.atlassian.net/rest/agile/latest/";

  static async getLastSprints(): Promise<GetSprintsResponse> {
    //  create query params for the request with URLSearchParams
    const params = new URLSearchParams();
    params.append("state", "active,future");
    params.append("maxResults", "2");
    const query = params.toString();

    //  make the request to the Jira API
    const res = await fetch(`${this.baseUrl}/board/2/sprint?${query}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.JIRA_USER}:${process.env.JIRA_TOKEN}`
        ).toString("base64")}`,
      },
    });

    return res.json();
  }
}
