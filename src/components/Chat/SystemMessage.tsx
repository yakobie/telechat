import * as React from 'react';

import { SessionChatMessage } from 'teleparty-websocket-lib';


interface ISystemMessageProps {
    msg: SessionChatMessage,
}

const SystemMessage: React.FunctionComponent<ISystemMessageProps> = (props) => {
  return(
    <div className={"flex pb-3 flex-row justify-center"}>
    <div className={"bg-red-800 text-white py-1 px-3 max-w-xs break-all rounded-lg "}>
        System Message: {props.msg.body}
        </div>
    </div>
  );
};

export default SystemMessage;
