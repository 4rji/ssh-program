# SSH Electron Manager

This project is an Electron application that serves as an SSH host manager. It allows users to connect to SSH hosts defined in their SSH configuration file. The application checks for online hosts and provides a user-friendly interface to manage SSH connections.

## Features

- Parses the SSH configuration file located at `~/.ssh/config`.
- Checks the online status of SSH hosts.
- Displays a list of online hosts with the option to connect via SSH.
- Built using Electron and React for a modern desktop application experience.

## Project Structure

```
ssh-electron-manager
├── src
│   ├── main
│   │   ├── main.js          # Main entry point of the Electron application
│   │   ├── sshUtils.js      # Utility functions for SSH operations
│   │   └── preload.js       # Preload script for secure IPC communication
│   └── renderer
│       ├── app.js           # Main JavaScript file for the renderer process
│       ├── index.html       # Main HTML file for the renderer process
│       ├── components
│       │   ├── HostList.js   # Component to display a list of SSH hosts
│       │   └── HostItem.js   # Component for a single SSH host item
│       └── styles
│           └── app.css      # CSS styles for the application
├── assets
│   └── icons
│       └── app-icon.png     # Application icon
├── package.json              # npm configuration file
├── webpack.config.js         # Webpack configuration file
├── .gitignore                # Git ignore file
└── README.md                 # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd ssh-electron-manager
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Build the application:
   ```
   npm run build
   ```

4. Start the application:
   ```
   npm start
   ```

## Usage

- Upon starting the application, it will automatically search for online SSH hosts defined in your SSH configuration file.
- The application will display a list of online hosts. Click the "Connect" button next to a host to initiate an SSH connection.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.