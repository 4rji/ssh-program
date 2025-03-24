const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { exec } = require('child_process');

let mainWindow;

// Parse SSH config to retrieve hosts
function parseSSHConfig() {
  const sshConfigPath = path.join(os.homedir(), '.ssh', 'config');
  const hosts = {};

  if (!fs.existsSync(sshConfigPath)) return hosts;

  const lines = fs.readFileSync(sshConfigPath, 'utf-8').split('\n');
  let currentHost = null;

  lines.forEach((line) => {
    line = line.split('#')[0].trim(); // Remove comments and trim whitespace
    if (!line) return;

    const parts = line.split(/\s+/);
    const key = parts[0].toLowerCase();

    if (key === 'host' && parts.length > 1) {
      parts.slice(1).forEach((host) => {
        hosts[host] = ''; // Initialize each host with an empty hostname
      });
      currentHost = parts[1];
    } else if (key === 'hostname' && currentHost) {
      hosts[currentHost] = parts[1];
    }
  });

  return hosts;
}

// Check if a host is online
function isOnline(ip, callback) {
  exec(`nc -z -w1 ${ip} 22`, (error) => {
    callback(!error);
  });
}

// Handle IPC events for SSH connection
ipcMain.on('get-online-hosts', (event) => {
  const hosts = parseSSHConfig();
  const onlineHosts = [];

  const checkHosts = Object.entries(hosts).map(([host, ip]) => {
    return new Promise((resolve) => {
      const target = ip || host; // Use host as fallback if hostname is missing
      isOnline(target, (online) => {
        if (online) onlineHosts.push({ host, ip: target });
        resolve();
      });
    });
  });

  Promise.all(checkHosts).then(() => {
    event.reply('online-hosts', onlineHosts); // Send online hosts to renderer
  });
});

ipcMain.on('connect-ssh', (event, host) => {
  const sshCommand = `ssh ${host}`;
  exec(sshCommand, (error) => {
    if (error) {
      console.error(`Failed to connect to ${host}:`, error);
    }
  });
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Required for IPC communication
    },
  });

  mainWindow.loadFile('src/ui/index.html'); // Corrected file path
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    mainWindow.loadFile('src/ui/index.html'); // Corrected file path
  }
});
