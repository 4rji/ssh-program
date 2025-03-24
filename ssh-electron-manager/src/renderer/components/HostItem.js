import React from 'react';

const HostItem = ({ host, ip, onConnect }) => {
    return (
        <div className="host-item">
            <span>{host} - {ip}</span>
            <button onClick={() => onConnect(host)}>Connect</button>
        </div>
    );
};

export default HostItem;