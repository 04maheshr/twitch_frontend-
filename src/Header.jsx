import { ExitIcon } from "@100mslive/react-icons";
import {
  selectIsConnectedToRoom,
  selectLocalPeer,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import React, { useState, useEffect } from "react";

function Header() {
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const hmsActions = useHMSActions();
  const [isStreaming, setIsStreaming] = useState(false);
  const localPeer = useHMSStore(selectLocalPeer);
  const sessionId = localPeer?.sessionId;

  useEffect(() => {
    // Optional: Log when the local peer joins or when isConnected changes
    console.log("Is Connected to Room:", isConnected);
  }, [isConnected]);

  const handleLeave = () => {
    hmsActions.leave();
    console.log("You left the room");
    if (Socket && Socket.connected) {
      Socket.disconnect();
    }
  };

  const handleStartStream = async () => {
    const streamKey = localStorage.getItem('Stream_Key:');
    const roomId = localStorage.getItem('room_id');

    console.log("Stream Key:", streamKey);
    console.log("Room ID:", roomId);

    if (!streamKey || !roomId) {
        console.error("Stream key or room ID is missing.");
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/start-stream', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ streamKey, roomId }),
        });

        if (response.ok) {
            console.log("Streaming started successfully");
            setIsStreaming(true);
        } else {
            console.error("Streaming failed", await response.text());
        }
    } catch (error) {
        console.error("Error while starting stream:", error);
        setIsStreaming(false);
    }
  };

  return (
    <header>
      {isConnected && (
        <>
          <button
            id="leave-btn"
            className="btn btn-danger"
            onClick={handleLeave}
          >
            <ExitIcon style={{ marginLeft: "0.25rem" }} /> Leave Room
          </button>
          <button
            id="start-stream-btn"
            className="btn btn-primary"
            onClick={handleStartStream}
            disabled={isStreaming}
          >
            Start Stream
          </button>
        </>
      )}
    </header>
  );
}

export default Header;
