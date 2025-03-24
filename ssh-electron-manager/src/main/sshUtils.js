// This file contains utility functions for parsing the SSH config file and checking if hosts are online.

const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

function parseSSHConfig() {
    const hosts = {};
    const sshConfigPath = path.join(process.env.HOME, '.ssh', 'config');

    if (!fs.existsSync(sshConfigPath)) {
        return hosts;
    }

    const configContent = fs.readFileSync(sshConfigPath, 'utf-8');
    const lines = configContent.split('\n');

    let currentHost = null;

    lines.forEach(line => {
        line = line.replace(/#.*$/, '').trim();
        if (!line) return;

        const parts = line.split(/\s+/);
        const key = parts[0].toLowerCase();

        if (key === 'host') {
            parts.slice(1).forEach(h => {
                hosts[h] = '';
                currentHost = h;
            });
        } else if (key === 'hostname' && currentHost) {
            hosts[currentHost] = parts[1];
        }
    });

    return hosts;
}

function isOnline(ip, port = 22) {
    return new Promise((resolve) => {
        const command = `nc -z -w1 ${ip} ${port}`;
        exec(command, (error) => {
            resolve(!error);
        });
    });
}

module.exports = { parseSSHConfig, isOnline };