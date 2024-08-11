import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Threads = ({ onSelectThread }) => {
    const [threads, setThreads] = useState([]);

    useEffect(() => {
        axios.get('/api/threads')
            .then(response => setThreads(response.data))
            .catch(error => console.error('Error fetching threads:', error));
    }, []);

    return (
        <div>
            <h1>Threads</h1>
            <ul>
                {threads.map(thread => (
                    <li key={thread.Id} onClick={() => onSelectThread(thread.Id)}>
                        {thread.Title}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Threads;