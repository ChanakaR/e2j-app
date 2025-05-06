# Gmail to Jira Integration App

A Google Workspace Add-on that seamlessly integrates Gmail with Jira, allowing users to create Jira issues directly from their emails.

## Features

- Create Jira issues directly from Gmail
- Support for both Backlog and AdHoc tasks
- Automatic sprint assignment for AdHoc tasks
- Customizable work estimates and due dates
- Seamless integration with Jira's Agile boards
- Automatic status updates based on start dates

## Prerequisites

- Google Workspace account
- Jira Cloud instance
- Jira API token
- Google Apps Script project

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/e2j-app.git
   cd e2j-app
   ```

2. **Configure Google Apps Script Project**
   - Create a new Google Apps Script project
   - Copy all `.gs` files into the project
   - Configure `appsscript.json` with your settings

3. **Configure Jira Integration**
   - Generate a Jira API token from your Atlassian account
   - Note down your Jira domain and project key
   - Ensure you have the necessary permissions in Jira

4. **Deploy the Add-on**
   - Deploy the script as a Google Workspace Add-on
   - Configure the necessary OAuth scopes
   - Test the deployment in your Google Workspace environment

## Configuration

### Required Settings

1. **Jira Settings**
   - Jira Domain (e.g., `your-domain.atlassian.net`)
   - Jira Email (your Atlassian account email)
   - Jira API Token (generated from Atlassian account)
   - Jira Project Key (e.g., `PROJ`)

2. **Google Apps Script Settings**
   - Configure OAuth scopes in `appsscript.json`
   - Set up URL fetch whitelist for Jira domain
   - Configure add-on metadata

   > **Note**: A sample `appsscript.json` file is provided in the repository. You can copy the contents from `appsscript.example.json` and replace the placeholder values with your specific configuration:
   > - Replace `YOUR_TIMEZONE` with your timezone
   > - Replace `YOUR_JIRA_URL` with your Jira domain
   > - Replace `YOUR_APP_NAME` with your add-on name
   > - Replace `YOUR_LOGO_URL` with your add-on logo URL
   > - Replace `YOUR_PRIMARY_COLOR_CODE` with your brand color

## Usage

1. **Installation**
   - Install the add-on from the Google Workspace Marketplace
   - Authorize the add-on with necessary permissions

2. **Creating Issues**
   - Open an email in Gmail
   - Click the add-on icon
   - Fill in the required fields:
     - Issue Summary
     - Work Type (Backlog/AdHoc)
     - Original Estimate
     - Start Date
     - Due Date
   - Click "Add to Jira"

3. **Task Types**
   - **Backlog Tasks**: Created in the project backlog
   - **AdHoc Tasks**: Automatically added to the current sprint

## Development

### Project Structure

- `main.gs`: Main entry point and core functionality
- `ui.gs`: UI components and card building
- `settings.gs`: Settings management
- `jira.gs`: Jira API integration
- `utilities.gs`: Helper functions and utilities

### Publishing to Google Workspace Marketplace

1. **Prepare Your Add-on**
   - Ensure all code is properly tested
   - Complete the add-on configuration in `appsscript.json`
   - Create necessary icons and screenshots
   - Prepare a detailed description of your add-on

2. **Configure OAuth Scopes**
   - Review and update required OAuth scopes in `appsscript.json`
   - Ensure you're requesting only necessary permissions
   - Document all required scopes in your marketplace listing

3. **Enable Google Marketplace SDK**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Workspace Marketplace SDK"
   - Click "Enable"
   - Configure the SDK settings:
     - Set up OAuth consent screen
     - Configure OAuth credentials
     - Set up API access

4. **Create Marketplace Listing**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Navigate to "APIs & Services" > "Marketplace"
   - Click "Create Listing"
   - Fill in required information:
     - Add-on name and description
     - Category and target users
     - Support information
     - Privacy policy URL
     - Terms of service URL

5. **Submit for Review**
   - Complete the security assessment
   - Provide test accounts if required
   - Submit your add-on for review
   - Address any feedback from the review team

6. **Post-Publication**
   - Monitor user feedback
   - Address any issues promptly
   - Keep documentation updated
   - Maintain compliance with Google's policies

## Security Considerations

- Never commit sensitive information to the repository
- Use environment variables for sensitive data
- Keep API tokens secure
- Regularly rotate API tokens
- Follow Google's security best practices

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please:
- Open an issue in the GitHub repository
- Contact the maintainers
- Check the documentation

## Author

Chanaka Rathnayaka
