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

    if (key === 'host') { parts.length > 1) {
      currentHost = parts[1];(host) => {
      hosts[currentHost] = '';nitialize each host with an empty hostname
    } else if (key === 'hostname' && currentHost) {
      hosts[currentHost] = parts[1];
    } else if (key === 'hostname' && currentHost) {
  }); hosts[currentHost] = parts[1];
    }
  return hosts;
}
  return hosts;
// Check if a host is online
function isOnline(ip, callback) {
  exec(`nc -z -w1 ${ip} 22`, (error) => {e...`);
    callback(!error);p} 22`, (error) => { callback) {
  });f (error) {c(`nc -z -w1 ${ip} 22`, (error) => {
}     console.log(`${ip} is offline.`);   callback(!error);
    } else {  });
// Handle IPC events for SSH connection
ipcMain.on('get-online-hosts', (event) => {
  const hosts = parseSSHConfig();
  const onlineHosts = [];
}  const hosts = parseSSHConfig();
  const checkHosts = Object.entries(hosts).map(([host, ip]) => {
    return new Promise((resolve) => {on
      const target = ip || host; // Use host as fallback if hostname is missingevent) => {ies(hosts).map(([host, ip]) => {
      isOnline(target, (online) => {
        if (online) onlineHosts.push({ host, ip: target });
        resolve();
      });heckHosts = Object.entries(hosts).map(([host, ip]) => {f (online) onlineHosts.push({ host, ip: target });
    });urn new Promise((resolve) => { resolve();
  }); const target = ip || host; });
      isOnline(target, (online) => {    });
  Promise.all(checkHosts).then(() => { host, ip: target });
    console.log('Online hosts:', onlineHosts);
    event.reply('online-hosts', onlineHosts); // Send online hosts to renderer });mise.all(checkHosts).then(() => {
  }); }); event.reply('online-hosts', onlineHosts); // Send online hosts to renderer
});  });  });

ipcMain.on('connect-ssh', (event, host) => {> {
  const sshCommand = `ssh ${host}`; onlineHosts); // Send online hosts to renderert, host) => {
  exec(sshCommand, (error) => {{host}`;
    if (error) {
      console.error(`Failed to connect to ${host}:`, error);ror) {
    }in.on('connect-ssh', (event, host) => { console.error(`Failed to connect to ${host}:`, error);
  });onst sshCommand = `ssh ${host}`; }
});  exec(sshCommand, (error) => {  });

app.on('ready', () => {nect to ${host}:`, error);
  mainWindow = new BrowserWindow({
    width: 800,indow({
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Required for IPC communicationWindow = new BrowserWindow({nodeIntegration: true,
    },idth: 800, contextIsolation: false, // Required for IPC communication
  });    height: 600,    },

  mainWindow.loadFile('src/ui/index.html'); // Corrected file path   nodeIntegration: true,
});      contextIsolation: false, // Required for IPC communication  mainWindow.loadFile('src/ui/index.html'); // Corrected file path

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { => {
    app.quit();ainWindow.loadFile('src/ui/index.html'); // Corrected file pathf (process.platform !== 'darwin') {
  } app.quit();
});  }
, () => {
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow = new BrowserWindow({ws().length === 0) {
      width: 800,w({
      height: 600,
      webPreferences: {
        nodeIntegration: true,s().length === 0) {
        contextIsolation: false,Window = new BrowserWindow({nodeIntegration: true,
      },idth: 800, contextIsolation: false,
    });      height: 600,      },

    mainWindow.loadFile('src/ui/index.html'); // Corrected file path     nodeIntegration: true,
  }     contextIsolation: false, mainWindow.loadFile('src/ui/index.html'); // Corrected file path
});      },  }







});  }    mainWindow.loadFile('src/ui/index.html'); // Corrected file path    });});
