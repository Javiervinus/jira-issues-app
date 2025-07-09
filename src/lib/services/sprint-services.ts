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
    "status,assignee,issuetype,issuenum,subtasks,priority,created,updated,summary,labels,customfield_10016,parent,comment,worklog,timeestimate,timeoriginalestimate,timespent"
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

export async function getSprintMetrics(sprintId: number) {
  const params = new URLSearchParams();
  params.append("jql", "project = 'Betterplan'");
  params.append(
    "fields",
    "status,assignee,issuetype,issuenum,subtasks,priority,created,updated,labels,customfield_10016,parent,comment,worklog,timeestimate,timeoriginalestimate,timespent"
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
  return calculateSprintMetrics(response.issues);
}

function calculateSprintMetrics(issues: Issue[]) {
  const mainIssues = issues.filter(
    (issue) =>
      (issue.fields.subtasks.length === 0 && !issue.fields.issuetype.subtask) ||
      (issue.fields.subtasks.length === 0 && issue.fields.issuetype.subtask)
  );

  const totalIssues = mainIssues.length;
  const doneIssues = mainIssues.filter(
    (issue) =>
      issue.fields.status.name === IssueState.IN_DEV ||
      issue.fields.status.name === IssueState.DONE
  ).length;
  const inProgressIssues = mainIssues.filter(
    (issue) => issue.fields.status.name === IssueState.IN_PROGRESS
  ).length;
  const toDoIssues = mainIssues.filter(
    (issue) => issue.fields.status.name === IssueState.TO_DO
  ).length;

  const issueTypeDistribution = mainIssues.reduce((acc, issue) => {
    const type = issue.fields.issuetype.name;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // NEW: Priority distribution
  const priorityDistribution = mainIssues.reduce((acc, issue) => {
    const priority = issue.fields.priority?.name || "Sin prioridad";
    acc[priority] = (acc[priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // NEW: Analyze recent activity (last 7 days)
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const recentlyCreated = mainIssues.filter((issue) => {
    if (issue.fields.created) {
      const created = new Date(issue.fields.created);
      return created >= sevenDaysAgo;
    }
    return false;
  }).length;

  const recentlyUpdated = mainIssues.filter((issue) => {
    if (issue.fields.updated) {
      const updated = new Date(issue.fields.updated);
      return updated >= sevenDaysAgo;
    }
    return false;
  }).length;

  // NEW: Unique assignees count
  const uniqueAssignees = new Set(
    mainIssues
      .map((issue) => issue.fields.assignee?.displayName)
      .filter(Boolean)
  ).size;

  // NEW: Blocked or high priority issues
  const highPriorityIssues = mainIssues.filter(
    (issue) =>
      issue.fields.priority?.name === "High" ||
      issue.fields.priority?.name === "Highest"
  ).length;

  // NEW: Story Points analysis
  const totalStoryPoints = mainIssues.reduce((sum, issue) => {
    return sum + (issue.fields.customfield_10016 || 0);
  }, 0);

  const completedStoryPoints = mainIssues
    .filter(
      (issue) =>
        issue.fields.status.name === IssueState.IN_DEV ||
        issue.fields.status.name === IssueState.DONE
    )
    .reduce((sum, issue) => {
      return sum + (issue.fields.customfield_10016 || 0);
    }, 0);

  // NEW: Labels analysis
  const allLabels = mainIssues.flatMap((issue) => issue.fields.labels || []);
  const labelDistribution = allLabels.reduce((acc, label) => {
    acc[label.name] = (acc[label.name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // NEW: Epic/Parent analysis
  const issuesWithParent = mainIssues.filter(
    (issue) => issue.fields.parent
  ).length;
  const epicDistribution = mainIssues
    .filter((issue) => issue.fields.parent)
    .reduce((acc, issue) => {
      const epicKey = issue.fields.parent!.key;
      const epicSummary = issue.fields.parent!.fields.summary;
      acc[epicKey] = {
        key: epicKey,
        summary: epicSummary,
        count: (acc[epicKey]?.count || 0) + 1,
      };
      return acc;
    }, {} as Record<string, { key: string; summary: string; count: number }>);

  // NEW: Recent activity analysis
  const recentComments = mainIssues
    .flatMap((issue) => issue.fields.comment?.comments || [])
    .filter((comment) => {
      const commentDate = new Date(comment.created);
      return commentDate >= sevenDaysAgo;
    }).length;

  const recentWorkLogs = mainIssues
    .flatMap((issue) => issue.fields.worklog?.worklogs || [])
    .filter((worklog) => {
      const worklogDate = new Date(worklog.started);
      return worklogDate >= sevenDaysAgo;
    }).length;

  // NEW: Time tracking analysis
  const totalTimeEstimate = mainIssues.reduce((sum, issue) => {
    return sum + (issue.fields.timeoriginalestimate || 0);
  }, 0);

  const totalTimeSpent = mainIssues.reduce((sum, issue) => {
    return sum + (issue.fields.timespent || 0);
  }, 0);

  const timeEfficiency =
    totalTimeEstimate > 0
      ? Math.round((totalTimeSpent / totalTimeEstimate) * 100)
      : 0;

  return {
    totalIssues,
    doneIssues,
    inProgressIssues,
    toDoIssues,
    completionPercentage:
      totalIssues > 0 ? Math.round((doneIssues / totalIssues) * 100) : 0,
    issueTypeDistribution,
    priorityDistribution,
    progressPercentage:
      totalIssues > 0
        ? Math.round(
            ((doneIssues + inProgressIssues * 0.5) / totalIssues) * 100
          )
        : 0,
    // Existing metrics
    recentlyCreated,
    recentlyUpdated,
    uniqueAssignees,
    highPriorityIssues,
    averageIssuesPerAssignee:
      uniqueAssignees > 0 ? Math.round(totalIssues / uniqueAssignees) : 0,
    // NEW metrics
    totalStoryPoints,
    completedStoryPoints,
    storyPointsProgress:
      totalStoryPoints > 0
        ? Math.round((completedStoryPoints / totalStoryPoints) * 100)
        : 0,
    labelDistribution,
    epicDistribution,
    issuesWithParent,
    recentComments,
    recentWorkLogs,
    totalTimeEstimate: Math.round(totalTimeEstimate / 3600), // Convert to hours
    totalTimeSpent: Math.round(totalTimeSpent / 3600), // Convert to hours
    timeEfficiency,
  };
}

function getIssuesByAssignee(issues: Issue[]) {
  const issuesByAssignee: IssueByAssignee[] = [];

  // Agregar logging detallado para debugging
  // console.log("📊 Total issues recibidas:", issues.length);

  const uniqueAssignees = Array.from(
    new Set(issues.map((i) => i.fields.assignee?.displayName).filter(Boolean))
  );
  // console.log("👥 Assignees únicos:", uniqueAssignees);

  // Análisis de tipos de issues
  const issueTypes = issues.reduce((acc, issue) => {
    const type = issue.fields.issuetype.subtask ? "Subtask" : "Main Task";
    const hasSubtasks =
      issue.fields.subtasks.length > 0 ? " (con subtasks)" : "";
    const key = type + hasSubtasks;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  // console.log("📋 Tipos de issues:", issueTypes);

  // LOG ESPECIAL: Analizar la tarea BT-5342 y sus subtasks
  const bt5342 = issues.find((issue) => issue.key === "BT-5342");
  if (bt5342) {
    // console.log("🎯 ANÁLISIS BT-5342:", {
    //   assignee: bt5342.fields.assignee?.displayName,
    //   status: bt5342.fields.status.name,
    //   subtasks: bt5342.fields.subtasks.map((st) => st.key),
    // });

    // Buscar las subtasks de BT-5342 en la lista
    bt5342.fields.subtasks.forEach((subtaskInfo) => {
      const subtask = issues.find((issue) => issue.key === subtaskInfo.key);
      if (subtask) {
        // console.log(`  🔧 Subtask ${subtask.key}:`, {
        //   assignee: subtask.fields.assignee?.displayName,
        //   status: subtask.fields.status.name,
        // });
      } else {
        // console.log(
        //   `  ❌ Subtask ${subtaskInfo.key}: NO ENCONTRADA en la respuesta de la API`
        // );
      }
    });
  }

  issues.forEach((issue) => {
    const assignee = issue.fields.assignee;

    // Log de issues sin assignee
    if (!assignee) {
      // console.log("⚠️  Issue sin assignee:", issue.key);
      return; // Skip issues sin assignee
    }

    // LOG ESPECIAL: Buscar las subtasks específicas que faltan
    if (
      issue.key === "BT-5352" ||
      issue.key === "BT-5348" ||
      issue.key === "BT-5342"
    ) {
      // console.log(`🎯 ISSUE ESPECÍFICA ${issue.key}:`, {
      //   assignee: assignee?.displayName,
      //   status: issue.fields.status.name,
      //   isSubtask: issue.fields.issuetype.subtask,
      //   subtasksCount: issue.fields.subtasks.length,
      // });
    }

    // BUG FIX: Usar displayName como key único en lugar de emailAddress
    // porque emailAddress podría estar undefined o ser inconsistente
    const assigneeKey = assignee.displayName;
    const assigneeIndex = issuesByAssignee.findIndex(
      (assigneeIssues) => assigneeIssues.assignee.displayName === assigneeKey
    );

    let addIssue = false;

    // NUEVA LÓGICA: Incluir todas las issues que el dev trabaja
    const isMainTask =
      issue.fields.subtasks.length === 0 && !issue.fields.issuetype.subtask;
    const isSubtask = issue.fields.issuetype.subtask;
    const isMainTaskWithSubtasks =
      issue.fields.subtasks.length > 0 && !issue.fields.issuetype.subtask;

    // INCLUIR TODO lo que el dev trabaja:
    // 1. Tareas principales sin subtasks (tareas simples)
    // 2. Tareas principales CON subtasks (coordinación/management)
    // 3. Subtasks (trabajo real del dev)
    if (isMainTask || isSubtask || isMainTaskWithSubtasks) {
      addIssue = true;
    }

    // console.log(
    //   `🔍 Issue ${issue.key} (${issue.fields.issuetype.name}): assignee=${assignee.displayName}, subtasks=${issue.fields.subtasks.length}, isSubtask=${isSubtask}, status=${issue.fields.status.name}, addIssue=${addIssue}`
    // );

    if (addIssue) {
      if (assigneeIndex === -1) {
        // console.log(`➕ Creando nuevo assignee: ${assignee.displayName}`);
        // Crear nuevo assignee
        const issueByAssignee: IssueByAssignee = {
          assignee,
          issues: [issue],
          doneIssues: 0,
          totalIssues: 1,
          inProgressIssues: 0,
          toDoIssues: 0,
          performance: 0,
        };

        // Contar por estado
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

        issuesByAssignee.push(issueByAssignee);
      } else {
        // console.log(
        //   `➕ Agregando issue ${issue.key} a assignee existente: ${assignee.displayName}`
        // );
        // Assignee existente
        const issueByAssignee = issuesByAssignee[assigneeIndex];
        issueByAssignee.totalIssues++;
        issueByAssignee.issues.push(issue);

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
      }
    }
  });

  // ARREGLAR: Calcular performance correctamente
  issuesByAssignee.forEach((assignee) => {
    const completionRate = assignee.doneIssues / assignee.totalIssues;
    const progressRate = assignee.inProgressIssues / assignee.totalIssues;
    const todoRate = assignee.toDoIssues / assignee.totalIssues;

    // Nueva fórmula: 100% si completó todo, sino considerar progreso
    if (assignee.doneIssues === assignee.totalIssues) {
      assignee.performance = 1.0; // 100% si completó todo
    } else {
      // Fórmula más balanceada: 70% completado + 25% en progreso + 5% bonus por pocas pendientes
      assignee.performance =
        completionRate * 0.7 + progressRate * 0.25 + (1 - todoRate) * 0.05; // Bonus por NO tener muchas pendientes
    }

    // Asegurar que no pase de 1.0
    assignee.performance = Math.min(assignee.performance, 1.0);

    // NEW: Calculate additional metrics
    assignee.highPriorityIssues = assignee.issues.filter(
      (issue) =>
        issue.fields.priority?.name === "High" ||
        issue.fields.priority?.name === "Highest"
    ).length;

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    assignee.recentlyUpdatedIssues = assignee.issues.filter((issue) => {
      if (issue.fields.updated) {
        const updated = new Date(issue.fields.updated);
        return updated >= sevenDaysAgo;
      }
      return false;
    }).length;

    assignee.mainTasksCount = assignee.issues.filter(
      (issue) => !issue.fields.issuetype.subtask
    ).length;

    assignee.subtasksCount = assignee.issues.filter(
      (issue) => issue.fields.issuetype.subtask
    ).length;

    // Most common issue type
    const issueTypeCounts = assignee.issues.reduce((acc, issue) => {
      const type = issue.fields.issuetype.name;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    assignee.mostCommonIssueType =
      Object.entries(issueTypeCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      "N/A";

    // NEW: Story Points for this assignee
    assignee.totalStoryPoints = assignee.issues.reduce((sum, issue) => {
      return sum + (issue.fields.customfield_10016 || 0);
    }, 0);

    assignee.completedStoryPoints = assignee.issues
      .filter(
        (issue) =>
          issue.fields.status.name === IssueState.IN_DEV ||
          issue.fields.status.name === IssueState.DONE
      )
      .reduce((sum, issue) => {
        return sum + (issue.fields.customfield_10016 || 0);
      }, 0);

    // NEW: Labels for this assignee
    const assigneeLabels = assignee.issues.flatMap(
      (issue) => issue.fields.labels || []
    );
    assignee.mostCommonLabel =
      assigneeLabels.length > 0
        ? assigneeLabels.reduce((acc, label) => {
            acc[label.name] = (acc[label.name] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        : {};

    assignee.mostCommonLabelName =
      Object.entries(assignee.mostCommonLabel).sort(
        ([, a], [, b]) => (b as number) - (a as number)
      )[0]?.[0] || "N/A";

    // NEW: Epic/Parent distribution for this assignee
    assignee.epicsWorked = assignee.issues
      .filter((issue) => issue.fields.parent)
      .reduce((acc, issue) => {
        const epicKey = issue.fields.parent!.key;
        acc[epicKey] = (acc[epicKey] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    // NEW: Time tracking for this assignee
    assignee.totalTimeEstimate = Math.round(
      assignee.issues.reduce((sum, issue) => {
        return sum + (issue.fields.timeoriginalestimate || 0);
      }, 0) / 3600 // Convert to hours
    );

    assignee.totalTimeSpent = Math.round(
      assignee.issues.reduce((sum, issue) => {
        return sum + (issue.fields.timespent || 0);
      }, 0) / 3600 // Convert to hours
    );

    assignee.timeEfficiency =
      assignee.totalTimeEstimate > 0
        ? Math.round(
            (assignee.totalTimeSpent / assignee.totalTimeEstimate) * 100
          )
        : 0;

    // console.log(
    //   `👤 ${assignee.assignee.displayName}: ${assignee.doneIssues}/${
    //     assignee.totalIssues
    //   } = ${Math.round(assignee.performance * 100)}%`
    // );

    // Log detallado de las issues por estado
    // console.log(`  📋 Issues para ${assignee.assignee.displayName}:`);
    assignee.issues.forEach((issue) => {
      const type = issue.fields.issuetype.subtask ? "Subtask" : "Main";
      // console.log(`    - ${issue.key} (${type}): ${issue.fields.status.name}`);
    });
  });

  // console.log("📈 Total assignees procesados:", issuesByAssignee.length);
  return issuesByAssignee;
}
