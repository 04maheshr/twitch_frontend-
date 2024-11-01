import { useEffect, useState } from "react";
import { CiChat1 } from "react-icons/ci";
import Socket from "../service/socket";

const Chatbox = () => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]); 

    useEffect(() => {
        console.log("i am called");
        
        // Listen for incoming messages
        Socket.on("clientMessage", (incomingMessage) => {
            setMessages((prevMessages) => [...prevMessages, incomingMessage]); // Update messages state
        });

        return () => {
            Socket.off("clientMessage");
        };
    }, [Socket]);

    const toggleChatbox = () => {
        setShow(!show);
    };

    const sendMessage = () => {
        console.log("call from the send messages");
        if (message) {
            console.log("call from the send messages");
            Socket.emit("sendMessage", `${name}: ${message}`);
            setMessage('');
        }
    };

    return (
        <div className="fixed bottom-6 right-6">
            <CiChat1
                className="w-12 h-12 p-2 cursor-pointer bg-white rounded-full shadow-lg text-purple-700 hover:bg-purple-700 hover:text-white transition duration-300 ease-in-out"
                onClick={toggleChatbox}
            />
            {show && (
                <div
                    className="bg-black bg-opacity-90 w-80 h-96 flex flex-col justify-between rounded-lg shadow-2xl p-4 transform transition-transform duration-500 ease-out"
                    style={{ border: '1px solid #6b46c1' }}
                >
                    <div className="flex-1 overflow-y-auto mb-4 p-2 ">
                        <ul id="message_Container" className="space-y-2">
                            {messages.map((msg, index) => (
                                <li key={index} className="text-white p-2 rounded">
                                    {msg}
                                </li>
                            ))}
                            {/* Old messages will be rendered here */}
                        </ul>
                    </div>
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Enter your message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full p-2 rounded-lg border border-purple-700 bg-gray-800 text-white outline-none focus:ring-2 focus:ring-purple-700"
                        />
                        <button
                            onClick={sendMessage}
                            className="w-full p-2 mt-2 rounded-lg bg-purple-700 text-white hover:bg-purple-900 transition duration-300 ease-in-out"
                        >
                            Send Message
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbox;
