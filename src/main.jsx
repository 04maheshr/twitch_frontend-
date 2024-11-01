import { StrictMode } from "react";
import ReactDOM from "react-dom/client"; // Changed import
import { HMSRoomProvider } from "@100mslive/react-sdk";
import App1 from "./App1";
import { UserContext,UserProvider } from './components/Usercontext/UserContext';
import './index.css'; // Make sure to import your CSS file

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement); // Use createRoot
root.render(
  <StrictMode>
    <UserProvider>
    <HMSRoomProvider>
      <App1/>
    </HMSRoomProvider>
    </UserProvider>
  </StrictMode>
);

   
    