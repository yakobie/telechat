import * as React from 'react';

import { SessionChatMessage } from 'teleparty-websocket-lib';


interface IChatMessageProps {
    msg: SessionChatMessage,
    local: boolean,
}

const ChatMessage: React.FunctionComponent<IChatMessageProps> = (props) => {

    let userNickname = props.msg.userNickname ? props.msg.userNickname : "-"

    var stringToColour = function(str: string) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        var colour = '#';
        for (var i = 0; i < 3; i++) {
          var value = (hash >> (i * 8)) & 0xFF;
          colour += ('00' + value.toString(16)).substr(-2);
        }
        return colour;
    }
    
    function invertHex(hex: string) {
        return (Number(`0x1${hex}`) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase()
      }

    return(
        <div className={`flex pb-3 ${props.local ? "flex-row-reverse" : "flex-row"}`}>
            
            {
                props.msg.userIcon ? 

                <div className='w-8 h-8 rounded-full text-xl flex mx-2 justify-center'><img src={props.msg.userIcon}/></div>
                :
                <div style={{backgroundColor: stringToColour(userNickname), color: invertHex(stringToColour(userNickname))}} className='w-8 h-8 rounded-full text-xl flex mx-2 justify-center'> {userNickname.charAt(0).toUpperCase()} </div>
            }
            
            <div className={` ${props.local ? "bg-blue-600 rounded-bl-lg" : "bg-gray-600 rounded-br-lg"}  text-white py-1 px-3 max-w-xs break-all rounded-t-lg `}>
                {props.msg.body}
            </div>
        </div>
    );
};

export default ChatMessage;

