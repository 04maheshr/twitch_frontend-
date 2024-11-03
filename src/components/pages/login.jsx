const Login = () => {
    const CLIENT_ID = import.meta.env.VITE_APP_TWITCH_CLIENT_ID;
    const REDIRECT_URI = `${import.meta.env.VITE_URL_REDIRECT_URI}`; // Redirect to homepage after login
    const STATE = "c3ab8aa609ea11e793ae92361f002671";
  
    const SCOPES = encodeURIComponent(
      "chat:edit chat:read channel:manage:broadcast channel:read:stream_key clips:edit channel:manage:videos"
    );
  
    const handleLogin = () => {
      if (!CLIENT_ID) {
        console.error("Twitch Client ID is not defined");
        return;
      }
      console.log(import.meta.env.VITE_APP_TWITCH_CLIENT_ID);
      const authUrl = `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
        REDIRECT_URI
      )}&scope=${SCOPES}&state=${STATE}`;
  
      console.log("Redirecting to:", authUrl); // Debug log
      window.location.replace(authUrl);
    };
  
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <button
          onClick={handleLogin}
          className="px-6 py-3 text-white bg-purple-600 hover:bg-purple-700 active:bg-purple-800 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Login with Twitch
        </button>
      </div>
    );
  };
  
  export default Login;
  