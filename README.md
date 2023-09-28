# Time Tracker

[![alt text]([http://url/to/img.png](https://github.com/mgalavai/timetrackr/blob/main/client.png?raw=true))
](https://github.com/mgalavai/timetrackr/blob/main/client.png?raw=true)


Time Tracker is a simple web application that allows users to log and view their worked hours on a daily basis. The app interfaces with a Google Spreadsheet to store and retrieve data, providing an easy-to-use and accessible platform for time tracking.

## Features

- User Authentication: Users can log in to the system to track their hours.
- Daily Time Logging: Users can log their worked hours for each day.
- Monthly Summary: View the total hours worked for the current month.
- Responsive UI: Works across a variety of devices.

## Prerequisites

- A Google Account and a configured Google Sheets API with an API key.
- A Google Spreadsheet set up as per the requirement of the application.
- A modern web browser that supports ES6 and Fetch API.

## Setup

1. Clone the repository to your local machine.
2. Open `index.html` in your web browser.
3. Input the necessary credentials in the login form to access the time tracking system.

## Usage

1. Log in using your email and passkey.
2. Click on a date cell to log hours for a specific date.
3. Input the number of hours worked and hit "Save".
4. The total hours worked for the current month is automatically updated and displayed.

## Configuration

Update the following variables in the main script to match your Google Sheets setup:

```javascript
const spreadsheetId = "your-spreadsheet-id";
const sheetName = "your-sheet-name";
const apiKey = "your-api-key";
