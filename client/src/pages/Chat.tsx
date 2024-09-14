import React, {useEffect, useRef, useState} from 'react';
import socket from '../util/socket';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import {Avatar, Button, Card, CardContent, CardHeader, Input, List, ListItem, Stack, Typography} from '@mui/material';
import { API_SERVER } from '../config';
import {checkLogin, ErrorDiv} from "../common";
import './Chat.css';
import {animateScroll} from 'react-scroll';
import {useNavigate} from "react-router-dom";

/* ------ Response format from API ------ */
interface User { 
  _id?: string,
  firstName?: string,
  lastName?: string,
  fullName?: string,
  image?: string
}

interface Message {
  _id: string,
  sender: User,  
  message: string,
  timestamp: string,
  global?: boolean, 
  conversationId?: string 
}
/* ------ Response format from API ------ */

let cacheUser = {};

function checkUser(user: any) {
  return user._id && user.fullName && user.image;
}

let shouldScroll = true;

function scrollHandler(event: React.UIEvent<HTMLDivElement>) {
  const scrollTop = (event.target as HTMLDivElement).scrollTop;
  const scrollHeight = (event.target as HTMLDivElement).scrollHeight;
  const clientHeight = (event.target as HTMLDivElement).clientHeight;
  shouldScroll = scrollTop + clientHeight + 2 >= scrollHeight;
}

function scrollToBottom() {
  if (shouldScroll) {
    animateScroll.scrollToBottom({containerId: "chat-main"});
  }
}

function Chat() {
  // Note: data from API will be in reverse-chronological order (most to least recent) 
  const [messages, setMessages] = useState<Message[]>([]); 
  const [user, setUser] = useState<User>(cacheUser);
  const [error, setError] = useState("");
  const messagesRef = useRef<Message[]>([]);
  messagesRef.current = messages;
  const navigate = useNavigate();

  useEffect(() => {
    // Connect to the socket server
    let messageHandler = (data: Message) => { // Begin listening for new messages
      let newMessages = [...messagesRef.current];
      newMessages.push(data);
      setMessages(newMessages);
    };
    let helloHandler = () => {
      getMessages();
    };
    socket.on('hello', helloHandler);
    socket.on('message', messageHandler);
    socket.connect();
    socket.emit('hello');

    // Populate the initial messages array with chat history
    const getMessages = async () => {
      axios.get(API_SERVER + '/api/chat/global', {
        withCredentials: true
      })
        .then(res => {
          if (res.data) {
            let retrievedMessages: Message[] = res.data;
            retrievedMessages.reverse();
            if (messagesRef.current.length > 0) {
              const top = messagesRef.current[0];
              const index = retrievedMessages.findIndex((msg) => msg._id === top._id);
              if (index >= 0) {
                retrievedMessages = retrievedMessages.slice(0, index);
              }
            }
            setMessages(retrievedMessages.concat(messagesRef.current));
          }
        })
        .catch((err) => {
          setError(`Failed to get chat messages: ${err}`)
        });
    };

    // Also populate user and userId (to determine which messages are sent by us)
    let getUser = async () => {
      axios.get(API_SERVER + '/api/user', {
        withCredentials: true
      })
        .then(res => {
          if (res.data) {
            return res.data.user
          }
          return null;
        })
        .then(user =>{
          let u: User = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            image: user.image
          }
          cacheUser = u;
          setUser(u);
        })
        .catch((err) => {
          if (err.response && err.response.data) {
            if (checkLogin(err.response.data, navigate)) {
              setError(`Failed to get user info: ${err.response.data.error}`)
            } else {
              socket.disconnect();
            }
          } else {
            setError(`Failed to get user info: ${err.message}`)
          }
        });
    }

    if (!checkUser(user)) getUser();

    return () => {
      socket.off('hello', helloHandler);
      socket.off('message', messageHandler);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(scrollToBottom, [messages]);

  // Handle when we send a message
  const onSubmit: SubmitHandler<{message: string}> = (data: any) => {
    if (!data.message) return;
    // Broadcast message to other users (through server socket)
    socket.emit('message', {
      message: data.message,
      global: true,
      conversationId: undefined
      // The server automatically populates sender from session data, and timestamp at receive
    });
    reset();
  };

  // Form setup from react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: {isValid, isDirty},
  } = useForm<{message: string}>({mode: 'onChange'});

  return (
    <div className="Chat">
      {error && (<ErrorDiv error={error} />)}
      <div className="Chat-main" id="chat-main" onScroll={scrollHandler}>
        <List>
          {messages.map((message, index) => (
            <ListItem key={index} style={{
              display: "flex",
              justifyContent: message.sender._id === user._id ? "flex-end" : "flex-start",
            }}>
              <Card>
                <CardHeader
                  subheader={new Date(message.timestamp).toLocaleTimeString()}
                  title={message.sender._id === user._id ? <i>You</i> : message.sender.fullName}
                  avatar={<Avatar alt={message.sender.fullName} src={message.sender.image} />}
                />
                <CardContent><Typography>{message.message}</Typography></CardContent>
              </Card>
            </ListItem>
          ))}
        </List>
      </div>

      <div className="Chat-send">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="row" justifyContent="space-between">
            <Input fullWidth placeholder='Send message ' {...register('message', {required: true})}/>
            <Button type="submit" disabled={!isDirty || !isValid}>Send</Button>
          </Stack>
        </form>
      </div>
    </div>
  );
}

export default Chat;
