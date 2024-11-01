import { useState, useRef } from "react";
import { useHMSActions } from "@100mslive/react-sdk";
import { ArrowRightIcon } from "@100mslive/react-icons";
import Socket from "../service/socket";

function Create() {
  const hmsActions = useHMSActions();
  const roomCodeRef = useRef(null);
  const userNameRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const roomCode = roomCodeRef.current?.value;

    try {
      const authToken = await hmsActions.getAuthTokenByRoomCode({ roomCode });
      Socket.emit("joinRoom", roomCode); 
      await hmsActions.join({
        userName: userNameRef.current?.value,
        authToken,
      });
    } catch (error) {
      console.error("Error joining room:", error);
      setErrorMessage("Failed to join room. Please check the room code.");
    }
  };

  const createRoom = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${import.meta.env.VITE_URL}/api/create-room`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create room: " + response.statusText);
      }

      Socket.on('connect', () => {
        console.log('Connected to server:', Socket.id);
      });

      Socket.on('connect_error', (err) => {
        console.error('Connection error:', err);
      });

      const { roomCode } = await response.json();
      Socket.emit("joinRoom", roomCode);
      console.log("Generated Room Code:", roomCode);

      const authToken = await hmsActions.getAuthTokenByRoomCode({ roomCode });
      await hmsActions.join({
        userName: userNameRef.current?.value,
        authToken,
      });
    } catch (error) {
      console.error("Error creating or joining room:", error);
      setErrorMessage("Error creating or joining room: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home bg-black min-h-screen flex flex-col items-center justify-center text-white">
      <h2 className="text-3xl font-bold text-purple-600 mt-8">Create or Join Room</h2>
      <p className="text-gray-400 mb-4">Enter your room code and name before joining</p>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <div className="input-container mb-4">
          <input
            required
            ref={userNameRef}
            id="name"
            type="text"
            name="name"
            placeholder="Your Name"
            className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:border-purple-600"
          />
        </div>
      </form>
      <button
        onClick={createRoom}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full disabled:opacity-50 mt-4"
        disabled={loading}
      >
        {loading ? "Creating Room..." : "Create Room"}
      </button>
    </div>
  );
}

export default Create;
