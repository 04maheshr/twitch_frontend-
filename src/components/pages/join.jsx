import { useState, useRef } from "react";
import { useHMSActions } from "@100mslive/react-sdk";
import { ArrowRightIcon } from "@100mslive/react-icons";
import Socket from "../service/socket";

function Join() {
  const hmsActions = useHMSActions();
  const roomCodeRef = useRef(null);
  const userNameRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Function to handle joining an existing room
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

  // Function to create a new room and join as the host
  const createRoom = async () => {
    setLoading(true);
    setErrorMessage(""); // Clear any previous error messages

    try {
      // Call the backend API to create the room
      const response = await fetch(`${import.meta.env.VITE_URL}/api/create-room`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create room: " + response.statusText);
      }

      const { roomCode } = await response.json();
      Socket.emit("joinRoom", roomCode);

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
    <div className="home min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h2 className="text-3xl font-bold text-purple-500 mb-4">Create or Join Room</h2>
      <p className="text-gray-300 mb-6">Enter your room code and name before joining</p>
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg shadow-lg">
        <div className="input-container mb-4">
          <input
            ref={roomCodeRef}
            id="room-code"
            type="text"
            name="roomCode"
            placeholder="Your Room Code"
            required
            className="w-full p-3 rounded bg-gray-800 text-purple-500 placeholder-purple-500"
          />
        </div>
        <div className="input-container mb-6">
          <input
            required
            ref={userNameRef}
            id="name"
            type="text"
            name="name"
            placeholder="Your Name"
            className="w-full p-3 rounded bg-gray-800 text-purple-500 placeholder-purple-500"
          />
        </div>
        <button type="submit" className="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50" disabled={loading}>
          Join Now
          <ArrowRightIcon
            height={16}
            width={16}
            className="ml-2"
          />
        </button>
      </form>
    </div>
  );
}
export default Join;