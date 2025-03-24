import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import HostList from './components/HostList';
import './styles/app.css';

const App = () => {
    const [hosts, setHosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadHosts();
    }, []);

    const loadHosts = () => {
        setLoading(true);
        setError('');
        ipcRenderer.invoke('load-hosts')
            .then((result) => {
                setHosts(result);
                setLoading(false);
            })
            .catch((err) => {
                setError('Error loading hosts');
                setLoading(false);
            });
    };

    return (
        <div className="app">
            <h1>SSH Host Manager</h1>
            {loading && <p>Buscando hosts online...</p>}
            {error && <p className="error">{error}</p>}
            {!loading && <HostList hosts={hosts} />}
            <button onClick={loadHosts}>Refrescar</button>
        </div>
    );
};

export default App;