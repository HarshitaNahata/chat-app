import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // 👈 useLocation hook
import queryString from 'query-string';
import io from 'socket.io-client';

let socket;

const Chat = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    const location = useLocation(); // ✅ get location safely
    const ENDPOINT = 'http://localhost:5000';

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);
        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);

        socket.emit('join', { name, room });

        return () => {
            socket.emit('disconnect');
            socket.off();
        };
    }, [ENDPOINT, location.search]);

    return (
        <div>
            <h1>Chat</h1>
        </div>
    );
};

export default Chat;
