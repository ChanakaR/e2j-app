/**
 * Gmail to Jira Add-on: Utilities
 * 
 * This file contains helper functions and utilities:
 * - Date processing and formatting
 * - Parameter extraction and validation
 * - Response builders
 * - Error handling
 * 
 * Author: Chanaka Rathnayaka (bmcrathnayaka@gmail.com)
 * 
 */

/**
 * Extracts and processes parameters from the event object
 */
function extractParameters(e) {
    const params = {
      subject: e.parameters.subject,
      from: e.parameters.from,
      jiraProjectKey: e.parameters.jiraProjectKey,
      jiraDomain: e.parameters.jiraDomain,
      authString: e.parameters.authString,
      issueSummary: e.formInput.issueSummary,
      workTypeSelected: e.formInput.workTypeSelected,
      originalEstimate: e.formInput.originalEstimate
    };
    
    // Process dates
    params.dueDate = processDateInput(e.formInput.dueDate);
    params.dueDateFormatted = formatDate(params.dueDate);
    
    params.startDate = processDateInput(e.formInput.startDate);
    params.startDateFormatted = formatDate(params.startDate);
    
    // Check if start date is today
    params.isStartDateToday = isDateToday(params.startDate);
    
    return params;
  }
  
  /**
   * Processes date input from form
   */
  function processDateInput(dateInput) {
    var dateMs;
    if (typeof dateInput === 'object' && dateInput !== null) {
      dateMs = dateInput.msSinceEpoch || dateInput.milliseconds || dateInput.value;
    } else {
      dateMs = dateInput;
    }
    return new Date(dateMs);
  }
  
  /**
   * Formats a date as YYYY-MM-DD
   */
  function formatDate(date) {
    return Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }
  
  /**
   * Checks if a date is today
   */
  function isDateToday(date) {
    var today = new Date();
    var todayFormatted = formatDate(today);
    var dateFormatted = formatDate(date);
    return dateFormatted === todayFormatted;
  }
  
  /**
   * Validates that start date is not after due date
   */
  function validateDates(startDate, dueDate) {
    return startDate <= dueDate;
  }
  
  /**
   * Creates a success response
   */
  function createSuccessResponse(message) {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText(message))
      .build();
  }
  
  /**
   * Creates an error response
   */
  function createErrorResponse(message) {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText(message))
      .build();
  }
  
  /**
   * Handles a backlog task creation
   */
  function handleBacklogTask(params) {
    try {
      // Create backlog issue payload
      const backlogPayload = {
        "fields": {
          "project": {
            "key": params.jiraProjectKey
          },
          "summary": params.issueSummary,
          "description": "Email Subject: " + params.subject + "\nFrom: " + params.from,
          "issuetype": {
              "name": "New"
          },
          "timetracking": {
            "originalEstimate": params.originalEstimate
          },
          "duedate": params.dueDateFormatted,
          "customfield_10015": params.startDateFormatted
        }
      };
      
      // Create the issue
      const newIssue = createJiraIssue(params.jiraDomain, params.authString, backlogPayload);
      
      return createSuccessResponse("SUCCESS: Task is added to backlog " + newIssue.key);
    } catch (error) {
      // Logger.log("Error creating backlog task: " + error.message);
      return createErrorResponse("ERROR: " + error.message);
    }
  }
  
  /**
   * Handles an AdHoc task creation
   */
  function handleAdHocTask(params) {
    try {
      // Create AdHoc issue payload
      const adhocPayload = {
        "fields": {
          "project": {
            "key": params.jiraProjectKey
          },
          "summary": params.issueSummary,
          "description": "Email Subject: " + params.subject + "\nFrom: " + params.from,
          "issuetype": {
            "name": "AdHoc"
          },
          "priority": {
            "name": "High"
          },
          "parent": {
            "key": "TOPS-5"
          },
          "timetracking": {
            "originalEstimate": params.originalEstimate
          },
          "duedate": params.dueDateFormatted,
          "customfield_10015": params.startDateFormatted
        }
      };
      
      // Create the issue
      const newIssue = createJiraIssue(params.jiraDomain, params.authString, adhocPayload);
      
      // Get the active sprint ID for the project
      const sprintId = getCurrentSprintId(params.authString, params.jiraDomain, params.jiraProjectKey);
      
      if (sprintId) {
        // Add the issue to the active sprint
        addIssueToSprint(params.jiraDomain, params.authString, sprintId, newIssue.key);
        
        // If start date is today, move to In Progress
        if (params.isStartDateToday) {
          addTaskToInProgress(newIssue.key, params.jiraDomain, params.authString);
        }
        
        return createSuccessResponse("SUCCESS: AdHoc task added to current sprint " + newIssue.key);
      } else {
        return createErrorResponse("FAILED: Created AdHoc task, but no active sprint found.");
      }
    } catch (error) {
      // Logger.log("Error creating AdHoc task: " + error.message);
      return createErrorResponse("ERROR: " + error.message);
    }
  }