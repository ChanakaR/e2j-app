/**
 * Gmail to Jira Add-on: UI Components
 * 
 * This file contains functions for building UI components:
 * - Card building
 * - Form elements
 * - Buttons and interactive elements
 * - Layout structures
 * 
 * Author: Chanaka Rathnayaka (bmcrathnayaka@gmail.com)
 * 
 */

/**
 * Builds the main card UI
 */
function buildMainCard(subject, from) {
    var userProperties = PropertiesService.getUserProperties();
    var jiraDomain = userProperties.getProperty('jira_domain');
    var jiraEmail = userProperties.getProperty('jira_email');
    var jiraAPIToken = userProperties.getProperty('jira_api_token');
    var jiraProjectKey = userProperties.getProperty('jira_project_key');
    
    var authString = Utilities.base64Encode(`${jiraEmail}:${jiraAPIToken}`);
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
  
    return CardService.newCardBuilder()
        .setHeader(CardService.newCardHeader().setTitle("Email to Jira"))
        .addSection(buildMainCardSection(subject, from, authString, jiraDomain, jiraProjectKey, tomorrow))
        .build();
  }
  
  /**
   * Builds the main section of the card
   */
  function buildMainCardSection(subject, from, authString, jiraDomain, jiraProjectKey, tomorrow) {
    return CardService.newCardSection()
        .addWidget(buildIssueSummary(subject))
        .addWidget(CardService.newTextParagraph().setText(" ")) 
        .addWidget(CardService.newTextParagraph().setText(" ")) 
        .addWidget(buildWorkTypeDropdown())
        .addWidget(buildOriginalEstimateInput())
        .addWidget(CardService.newTextParagraph().setText(" ")) 
        .addWidget(buildStartDatePicker())
        .addWidget(buildDueDatePicker(tomorrow))
        .addWidget(CardService.newTextParagraph().setText("\u00A0\u00A0\n")) 
        .addWidget(buildButtonSet(subject, from, authString, jiraDomain, jiraProjectKey));
  }
  
  /**
   * Builds the Issue summary input
   */
  function buildIssueSummary(subject) {
    return CardService.newTextInput()
        .setTitle("Issue Summary")
        .setFieldName("issueSummary")
        .setValue(subject);
  }
  
  /**
   * Builds the work type dropdown
   */
  function buildWorkTypeDropdown() {
    return CardService.newSelectionInput()
        .setType(CardService.SelectionInputType.DROPDOWN)
        .setTitle("Work Type")
        .setFieldName("workTypeSelected")
        .addItem("Backlog Task", "backlog", true)
        .addItem("AdHoc Task", "adhoc", false);
  }
  
  /**
   * Builds the original estimate input
   */
  function buildOriginalEstimateInput() {
    return CardService.newTextInput()
        .setTitle("Original Estimate")
        .setFieldName("originalEstimate")
        .setValue("1h")  // Default value set to 1 hour
        .setHint("Format: 1h, 1h 30m, 2d (Default is m)");
  }
  
  /**
   * Builds the start date picker
   */
  function buildStartDatePicker() {
    return CardService.newDatePicker()
        .setTitle("Start Date")
        .setFieldName("startDate")
        .setValueInMsSinceEpoch(new Date().getTime());
  }
  
  /**
   * Builds the due date picker
   */
  function buildDueDatePicker(tomorrow) {
    return CardService.newDatePicker()
        .setTitle("Due Date")
        .setFieldName("dueDate")
        .setValueInMsSinceEpoch(tomorrow.getTime());
  }
  
  /**
   * Builds the button set
   */
  function buildButtonSet(subject, from, authString, jiraDomain, jiraProjectKey) {
    return CardService.newButtonSet()
      .addButton(buildAddToJiraButton(subject, from, authString, jiraDomain, jiraProjectKey))
      .addButton(buildSettingsButton());
  }
  
  /**
   * Builds the Add to Jira button
   */
  function buildAddToJiraButton(subject, from, authString, jiraDomain, jiraProjectKey) {
    return CardService.newTextButton()
        .setText("Add to Jira")
        .setAltText("Add Email to Jira Task")
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED_TONAL)
        .setOnClickAction(CardService.newAction()
            .setFunctionName("addToJiraSprint")
            .setParameters({
              "subject": subject,
              "from": from,
              "authString": authString,
              "jiraDomain": jiraDomain,
              "jiraProjectKey": jiraProjectKey
            })
        );
  }
  
  /**
   * Builds the settings button
   */
  function buildSettingsButton() {
    return CardService.newTextButton()
      .setAltText("Open Settings")
      .setMaterialIcon(CardService.newMaterialIcon().setName('settings'))
      .setOnClickAction(CardService.newAction()
        .setFunctionName("openSettings"));
  }