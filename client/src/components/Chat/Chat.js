
import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import { useLocation } from 'react-router-dom'; // <-- Add this
import './Chat.css';

const ENDPOINT = 'http://localhost:5000';
// const ENDPOINT = 'https://project-chat-application.herokuapp.com/';

let socket;

const Chat = () => {
    const location = useLocation();
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);

        socket = io(ENDPOINT);

        setRoom(room);
        setName(name)

        socket.emit('join', { name, room }, (error) => {
            if (error) {
                alert(error);
            }
        });
    }, [location.search]);

    useEffect(() => {
        socket.on('message', message => {
            console.log('Received message:', message);
            setMessages(messages => [...messages, message]);
        });

        socket.on("roomData", ({ users }) => {
            setUsers(users);
        });
    }, []);

    //changes
    // const sendMessage = (event) => {
    //     event.preventDefault();

    //     if (message) {
    //         socket.emit('sendMessage', message, () => setMessage(''));
    //     }
    // }
    const sendMessage = (event) => {
        event.preventDefault();
        if (message.trim()) {
            // Include room in emission
            socket.emit('sendMessage', {
                message: message.trim(),
                room: room // From state
            }, () => setMessage(''));
        }
    }


    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room} />
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
            <TextContainer users={users} />
        </div>
    );
}

export default Chat;
