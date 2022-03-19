import React, { useEffect, useState, useRef} from 'react';

import { useLocation } from 'react-router-dom';


import { TelepartyClient, SocketEventHandler, SocketMessageTypes, SessionChatMessage, MessageList } from 'teleparty-websocket-lib';
import {useIsTyping} from 'use-is-typing';

import ChatMessage from './ChatMessage';
import SystemMessage from './SystemMessage';

import '../../App.css';


interface LocationState {
    username: string,
    roomToJoin: string,
    avatarUrl: string,
}


export interface IChatProps {

}


let client: TelepartyClient


//everytime it is rendered, scroll to it
const ScrollToMe = () => {
    const elementRef = useRef(null);
    useEffect(() => {
        const lRef = elementRef.current as any
        lRef.scrollIntoView();
    });
    return <div ref={elementRef} />;
};


const Chat: React.FunctionComponent<IChatProps> = (props) => {

    const [isTyping, registerTyping] = useIsTyping();

    const location  = useLocation();

    const { username, roomToJoin, avatarUrl } = location.state as LocationState || "";

    const [myId, setMyId] = useState<string>("");

    const [currentRoom, setCurrentRoom] = useState<string>("");
    const [messages, setMessages] = useState<SessionChatMessage[]>([]);

    const [typingUsers, setTypingUsers] = useState<string[]>([]);


    function addToMessages( msg: SessionChatMessage )
    {
        setMessages( messages => messages.concat(msg));
    }

    function messageHandler(message: any) {
        console.log(message);

        if(message.type == "userId") {
            setMyId(message.data.userId);
        }
        
        if(message.type == "sendMessage" && !message.data.isSystemMessage) {  
            let msg = (message.data as SessionChatMessage);  
            addToMessages(msg);
        }

        if(message.type == "sendMessage" && message.data.isSystemMessage)
        {
            let msg = (message.data as SessionChatMessage);
            switch(msg.body) {
                
                default: 
                    break;

                case 'joined':
                    msg.body = msg.userNickname + " joined the chat."
                    addToMessages(msg);
                    break;

                case 'left':
                    msg.body = msg.userNickname + " left the chat."
                    addToMessages(msg);
                    break;                
            }
        }

        if(message.type == "setTypingPresence") {  
            let data = message.data;

            if(data.usersTyping.length > 0)
            {
                setTypingUsers( typingUsers => typingUsers.concat(data.usersTyping));
            } else {
                setTypingUsers([]);
            }
        }
    }

    async function joinOrCreateRoom() {
        const createRoom = async () => {
            await client.createChatRoom(username).then(setCurrentRoom);
        }

        if(roomToJoin != "" && username != "")
        {
            client.joinChatRoom(username, roomToJoin, avatarUrl)
            .catch((e) => {
                alert(e)
            })
            .then((res) => {
                setMessages(messages => messages.concat((res as MessageList).messages));
            });
            
            setCurrentRoom(roomToJoin);
        } 

        if(roomToJoin == "" && username != "") {
            createRoom();
        }
    }


    const eventHandler: SocketEventHandler = {
        onConnectionReady: () => { joinOrCreateRoom() },
        onClose: () => { alert("socket has failed, please reload the app to attempt to re-establish") },
        onMessage: (message) => { messageHandler(message) }
    };
    
    useEffect(() => { 
        client = new TelepartyClient(eventHandler);
    }, []);

    useEffect(()=> { 
        client.sendMessage(SocketMessageTypes.SET_TYPING_PRESENCE, {
            typing: isTyping
        })
    }, [isTyping])


    function sendMessage(msg: string) {
        client.sendMessage(SocketMessageTypes.SEND_MESSAGE, {
            body: msg
        });
    }


    return (
        <div className="h-screen w-full bg-gray-900 flex justify-center">
        
        <div className="mt-5 w-3/6 bg-gray-800 h-3/4 drop-shadow-lg">
          
          <div className='text-center text-slate-300 font-semibold text-xl'>
            Hello {username} ({myId}), Welcome to room: {currentRoom}
          </div>

          <div id="messages" className="flex flex-auto flex-col h-full px-5 overflow-y-scroll bg-gray-700">
          
            <div className='text-center text-slate-300 font-semibold pb-4 pt-4'>
                This is the beginning of the conversation in room: {currentRoom}
            </div>
            
            {messages.map((value, index) => {
                if(!value.isSystemMessage)
                {
                    return(<ChatMessage key={index} msg={value} local={value.userNickname === username}/>)
                } else {
                    return(<SystemMessage key={index} msg={value}/>);
                }
            })}

            <ScrollToMe/>

          </div>

          <div className='bg-gray-700 h-8 flex flex-row w-full break-words'>
              {typingUsers.map((value, index) => (<div className='px-1 text-slate-200 text-lg'><h1 key={index}>{value}</h1></div>))}    
              {typingUsers.length > 0 ? typingUsers.length > 1 ?  (<span className='text-slate-200 text-lg'>are typing</span>) : (<span className='text-slate-200 text-lg'>is typing</span>) : ""}
          </div>

          <div>
            <input
              placeholder=""
              className="w-full bg-gray-600 p-2 rounded text-slate-200 mt-5"
              type="text"
              onKeyDown={(e) => {if (e.key === 'Enter') { sendMessage((e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value = "" } }}
              ref={registerTyping}
            />
          </div>



        </div>
      </div>
    );


}

export default Chat;