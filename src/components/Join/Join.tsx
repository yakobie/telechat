import React, { useEffect, useState } from 'react';

import { Link } from "react-router-dom";

interface IJoinProps {
}

const Join: React.FunctionComponent<IJoinProps> = (props) => {

    const [name, setName] = useState<string>("");
    const [room, setRoom] = useState<string>("");
    const [avatar, setAvatar] = useState<string>("");

  return(
    <div className="h-screen w-full bg-gray-800 flex justify-center">
      <div className="bg-gray-700 rounded w-1/4 m-auto grid grid-columns-1 justify-items-center">
        <h1 className="text-xl mt-5 text-slate-200">Join a Telechat</h1>
        <div>
          <input
            placeholder="Name"
            className="bg-gray-600 p-2 rounded text-slate-200 mt-5"
            type="text"
            onChange={event => setName(event.target.value)}
          />
        </div>

        <div>
        <input
            placeholder="Avatar URL"
            className="bg-gray-600 p-2 rounded text-slate-200 mt-5"
            type="text"
            onChange={event => setAvatar(event.target.value)}
          />
        </div>

        <div>
          <input
            placeholder="Room (Optional)"
            className="bg-gray-600 p-2 p text-slate-200 rounded mt-5"
            type="text"
            onChange={event => setRoom(event.target.value)}
          />
        </div>
        <Link
          onClick={event => (!name ? event.preventDefault() : null)}
          to={`/chat`}
          state={{username: name, roomToJoin: room, avatarUrl: avatar}}
        >
          <button className="mt-5 mb-10 bg-blue-800 py-2 px-6 rounded-lg hover:bg-blue-700" type="submit">
            {room != "" ? "Join A Room" : "Create A Room"}
          </button>
        </Link>

      </div>
    </div>
  );
};

export default Join;


