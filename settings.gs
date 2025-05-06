/**
 * Gmail to Jira Add-on: Settings
 * 
 * This file manages all settings-related functionality:
 * - Creating settings UI
 * - Saving user preferences
 * - Loading and validating configurations
 * 
 * Author: Chanaka Rathnayaka (bmcrathnayaka@gmail.com)
 * 
 */

/**
 * Creates the settings card
 */
function createSettingsCard() {
    return CardService.newCardBuilder()
      .setHeader(CardService.newCardHeader().setTitle("Jira Settings"))
      .addSection(buildSettingsSection())
      .build();
  }
  
  /**
   * Builds the settings form section
   */
  function buildSettingsSection() {
    var userProperties = PropertiesService.getUserProperties();
    
    return CardService.newCardSection()
      .addWidget(CardService.newTextInput()
        .setFieldName("jira_domain")
        .setTitle("Jira Domain")
        .setValue(userProperties.getProperty("jira_domain") || ""))
      .addWidget(CardService.newTextInput()
        .setFieldName("jira_email")
        .setTitle("Jira Email")
        .setValue(userProperties.getProperty("jira_email") || ""))
      .addWidget(CardService.newTextInput()
        .setFieldName("jira_api_token")
        .setTitle("Jira API Token")
        .setHint("Generate this in your Atlassian account settings")
        .setValue(userProperties.getProperty("jira_api_token") || ""))
      .addWidget(CardService.newTextInput()
        .setFieldName("jira_project_key")
        .setTitle("Jira Project Key")
        .setValue(userProperties.getProperty("jira_project_key") || ""))
      .addWidget(CardService.newButtonSet()
        .addButton(CardService.newTextButton()
          .setText("Save Settings")
          .setOnClickAction(CardService.newAction()
            .setFunctionName("saveSettings"))));
  }
  
  /**
   * Saves the settings to UserProperties
   */
  function saveSettings(e) {
    var userProperties = PropertiesService.getUserProperties();
    
    userProperties.setProperties({
      'jira_domain': e.formInput.jira_domain,
      'jira_email': e.formInput.jira_email,
      'jira_api_token': e.formInput.jira_api_token,
      'jira_project_key': e.formInput.jira_project_key
    });
    
    return createSuccessResponse("Settings saved successfully!");
  }
  
  /**
   * Opens the settings card
   */
  function openSettings(e) {
    return CardService.newActionResponseBuilder()
      .setNavigation(CardService.newNavigation()
        .pushCard(createSettingsCard()))
      .build();
  }