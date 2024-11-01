import { ExitIcon } from "@100mslive/react-icons";
import {
  selectIsConnectedToRoom,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import React from "react";

function Header() {
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const hmsActions = useHMSActions();
  const Customize =()=>{
            hmsActions.leave()
            console.log("yyou left the room ")
            if (Socket && Socket.connected) {
              Socket.disconnect();
            }

  }

  return (
    <header>
      
      {isConnected && (
        <button
          id="leave-btn"
          className="btn btn-danger"
          onClick={Customize}
        >
          <ExitIcon style={{ marginLeft: "0.25rem" }} /> Leave Room
        </button>
      )}
    </header>
  );
}

export default Header;
