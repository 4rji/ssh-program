import React from 'react';
import HostItem from './HostItem';

const HostList = ({ hosts }) => {
    return (
        <div>
            {hosts.length === 0 ? (
                <p>No hay hosts online</p>
            ) : (
                <div>
                    <p>Hosts online encontrados: {hosts.length}</p>
                    {hosts.map((host) => (
                        <HostItem key={host.name} host={host} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HostList;