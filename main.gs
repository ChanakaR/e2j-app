/**
 * Gmail to Jira Add-on: Main File
 * 
 * This file contains the main entry points for the Gmail add-on.
 * It handles the core functionality including the initial loading
 * of the add-on and dispatching actions.
 * 
 * Author: Chanaka Rathnayaka (bmcrathnayaka@gmail.com)
 * 
 */

function loadAddOn(event) {
    var accessToken = event.gmail.accessToken;
    var messageId = event.gmail.messageId;
    GmailApp.setCurrentMessageAccessToken(accessToken);
    var mailMessage = GmailApp.getMessageById(messageId);
    var subject = mailMessage.getSubject();
    var from = mailMessage.getFrom();
  
    // Check if settings are configured
    var userProperties = PropertiesService.getUserProperties();
    var jiraDomain = userProperties.getProperty('jira_domain');
    
    // If settings aren't configured, show the settings card first
    if (!jiraDomain) {
      return [createSettingsCard()];
    }
    
    // Build and return the main card
    return [buildMainCard(subject, from)];
  }
  
  /**
   * Handles the "Add to Jira" button click
   */
  function addToJiraSprint(e) {
    // Extract parameters
    const params = extractParameters(e);
    
    // Validate dates
    if (!validateDates(params.startDate, params.dueDate)) {
      return createErrorResponse("Error: Start date cannot be after due date.");
    }
    
    // Process based on work type
    if (params.workTypeSelected === "backlog") {
      return handleBacklogTask(params);
    } else if (params.workTypeSelected === "adhoc") {
      return handleAdHocTask(params);
    }
    
    return createErrorResponse("Unknown work type selected");
  }