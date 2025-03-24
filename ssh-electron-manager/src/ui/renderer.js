const { ipcRenderer } = require('electron');

const statusElement = document.getElementById('status');
const hostListElement = document.getElementById('host-list');

// Fetch online hosts
function fetchOnlineHosts() {
  statusElement.textContent = 'Fetching online hosts...';
  hostListElement.innerHTML = '';
  ipcRenderer.send('get-online-hosts');
}

// Handle the response with online hosts
ipcRenderer.on('online-hosts', (event, onlineHosts) => {
  console.log('Received online hosts:', onlineHosts); // Debugging log
  if (onlineHosts.length === 0) {
    statusElement.textContent = 'No online hosts found.';
    return;
  }

  statusElement.textContent = `Found ${onlineHosts.length} online host(s):`;
  hostListElement.innerHTML = ''; // Clear previous list
  onlineHosts.forEach(({ host, ip }) => {
    const hostItem = document.createElement('div');
    hostItem.className = 'host-item';

    const hostLabel = document.createElement('span');
    hostLabel.textContent = `${host} (${ip})`;

    const connectButton = document.createElement('button');
    connectButton.textContent = 'Connect';
    connectButton.onclick = () => connectToHost(host);

    hostItem.appendChild(hostLabel);
    hostItem.appendChild(connectButton);
    hostListElement.appendChild(hostItem);
  });
});

// Connect to a selected host
function connectToHost(host) {
  ipcRenderer.send('connect-ssh', host);
}

// Fetch hosts on load
fetchOnlineHosts();
