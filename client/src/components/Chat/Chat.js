import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // 👈 useLocation hook
import queryString from 'query-string';
import io from 'socket.io-client';

import './Chat.css';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

let socket;


const Chat = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

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

    useEffect(() => {
        socket.on('message', (message) => {
            //adds every new message sent by admin or anyone to the messages array
            setMessages([...messages, message]);
        })
    }, [messages]);

    const sendMessage = (event) => {
        //preventing the default behavior  as you cick anywhwere the whole page is refreshed
        event.preventDefault();
        if (message) {
            socket.emit('sendMessage', message, () => setMessage(''))
        }
    }

    console.log(message, messages);
    return (
        //input for sending messages
        <div className="outerConatiner">
            <div className="container">
                <InfoBar room={room} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
                {/* <input
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
                /> */}
            </div>
        </div>
    );
};

export default Chat;
