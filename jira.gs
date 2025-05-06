/**
 * Gmail to Jira Add-on: Jira API Integration
 * 
 * This file contains all functions related to Jira API communication:
 * - Issue creation and updates
 * - Sprint management
 * - Project and board queries
 * - Status transitions
 * 
 * Author: Chanaka Rathnayaka (bmcrathnayaka@gmail.com)
 * 
 */


/**
 * Gets the current sprint ID for a project
 */
function getCurrentSprintId(authString, jiraDomain, jiraProjectKey) {
    const headers = createJiraHeaders(authString);
    
    try {
      // Get boards for project
      const boards = getProjectBoards(jiraDomain, jiraProjectKey, headers);
      if (!boards.length) {
        return null; // No boards found
      }
      
      // Get active sprint for first board
      const boardId = boards[0].id;
      const sprints = getActiveSprints(jiraDomain, boardId, headers);
      
      if (sprints.length === 0) {
        return null; // No active sprint found
      } else {
        return sprints[0].id;
      }
    } catch (error) {
      // Logger.log(`Error getting sprint ID: ${error.message}`);
      return createErrorResponse("Error getting sprint ID: " + error.message);
    }
  }
  
  /**
   * Gets all boards for a project
   */
  function getProjectBoards(jiraDomain, jiraProjectKey, headers) {
    const boardsUrl = `https://${jiraDomain}/rest/agile/1.0/board?projectKeyOrId=${jiraProjectKey}`;
    const boardsResponse = UrlFetchApp.fetch(boardsUrl, { method: 'get', headers: headers });
    return JSON.parse(boardsResponse.getContentText()).values;
  }
  
  /**
   * Gets active sprints for a board
   */
  function getActiveSprints(jiraDomain, boardId, headers) {
    const sprintsUrl = `https://${jiraDomain}/rest/agile/1.0/board/${boardId}/sprint?state=active`;
    const sprintsResponse = UrlFetchApp.fetch(sprintsUrl, { method: 'get', headers: headers });
    return JSON.parse(sprintsResponse.getContentText()).values;
  }
  
  /**
   * Transitions a task to In Progress
   */
  function addTaskToInProgress(issueKey, jiraDomain, authString) {
    const transitionPayload = {
      "transition": {
        "id": "21" 
      }
    };
    
    const issueURL = `https://${jiraDomain}/rest/api/2/issue/${issueKey}/transitions`;
    
    return UrlFetchApp.fetch(
      issueURL,
      {
        method: "post",
        contentType: "application/json",
        headers: {
          "Authorization": "Basic " + authString
        },
        payload: JSON.stringify(transitionPayload)
      }
    );
  }
  
  /**
   * Creates a new Jira issue
   */
  function createJiraIssue(jiraDomain, authString, payload) {
    const issueUrl = `https://${jiraDomain}/rest/api/2/issue/`;
    const headers = createJiraHeaders(authString);
    
    const response = UrlFetchApp.fetch(issueUrl, {
      method: 'post',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload)
    });
    
    return JSON.parse(response.getContentText());
  }
  
  /**
   * Adds an issue to a sprint
   */
  function addIssueToSprint(jiraDomain, authString, sprintId, issueKey) {
    const addToSprintUrl = `https://${jiraDomain}/rest/agile/1.0/sprint/${sprintId}/issue`;
    const headers = createJiraHeaders(authString);
    
    const payload = {
      "issues": [issueKey]
    };
    
    return UrlFetchApp.fetch(addToSprintUrl, {
      method: 'post',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload)
    });
  }
  
  /**
   * Creates standard headers for Jira API requests
   */
  function createJiraHeaders(authString) {
    return {
      'Authorization': `Basic ${authString}`,
      'Accept': 'application/json'
    };
  }