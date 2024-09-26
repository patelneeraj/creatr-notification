import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import axios from "axios";
import "./App.css";
import NotificationDisplay from "./Notifications";

function App() {
  async function fetchAllNotifs() {
    axios
      .post("http://localhost:3000/api/notifications", {
        sort: 1,
      })
      .then((result) => {
        setNotifsArray(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const [notifsArray, setNotifsArray] = useState([]);

  useEffect(() => {
    fetchAllNotifs();
  }, []);

  return (
    <>
      <NotificationDisplay initialNotifications={notifsArray} />
    </>
  );
}

export default App;
