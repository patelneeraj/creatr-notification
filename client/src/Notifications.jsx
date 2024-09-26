import React, { useState, useEffect } from "react";
import "./notifications.css";
import axios from "axios";

const NotificationDisplay = ({ initialNotifications }) => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [sortCriteria, setSortCriteria] = useState("priority");
  const [sortOrder, setSortOrder] = useState("desc");
  const [notifDescId, setNotifDescId] = useState("");
  const [readNotifList, setReadNotifList] = useState([]);

  const userId = "neeraj";

  const markNotifAsRead = (notifId) => {
    axios
      .post("http://localhost:3000/api/readNotification", {
        userId: userId,
        notifId: notifId,
      })
      .then((result) => {
        setReadNotifList([...readNotifList, notifId]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const sortNotifications = (criteria, order) => {
    const sortedNotifications = [...notifications].sort((a, b) => {
      if (criteria === "priority") {
        return order === "asc"
          ? a.priority - b.priority
          : b.priority - a.priority;
      } else if (criteria === "projectType") {
        return order === "asc"
          ? a.projectType.localeCompare(b.projectType)
          : b.projectType.localeCompare(a.projectType);
      }
      return 0;
    });
    setNotifications(sortedNotifications);
  };

  useEffect(() => {
    sortNotifications(sortCriteria, sortOrder);
  }, [sortCriteria, sortOrder, readNotifList]);

  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:3000/api/sse");

    eventSource.onmessage = (event) => {
      const newRecord = JSON.parse(event.data);
      setNotifications((prevRecords) => [...prevRecords, newRecord]);
      alert("New Notification!");
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 1:
        return "Low";
      case 2:
        return "Medium";
      case 3:
        return "High";
      case 4:
        return "Super High";
      case 5:
        return "Ultra High";
      default:
        return "Unknown";
    }
  };

  const getUnreadNotifCount = () => {
    let count = 0;
    initialNotifications.forEach((element) => {
      if (element.readUsers.includes(userId)) {
        count++;
      }
    });
    return count;
  };

  return (
    <div className="notification-display">
      <h1>Notifications</h1>

      <h2>Unread Notifications : {getUnreadNotifCount()}</h2>

      <div className="controls">
        <div>
          <label>Sort by: </label>
          <select
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value)}
          >
            <option value="priority">Priority</option>
            <option value="projectType">Project Type</option>
          </select>
        </div>
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          {sortOrder === "asc" ? "Ascending" : "Descending"}
        </button>
      </div>
      <ul className="notification-list">
        {notifications.map((notif) => (
          <li key={notif.notifId} className="notification-item">
            <div
              onClick={() => {
                setNotifDescId(notifDescId == "" ? notif.notifId : "");
              }}
            >
              <div className="notification-header">
                <span className="project-type">{notif.projectType}</span>
                <span className={`priority priority-${notif.priority}`}>
                  {getPriorityLabel(notif.priority)}
                </span>
              </div>
              <div className="notification-body">
                <p className="message">{notif.message}</p>
                <p className="details">
                  Module: {notif.module} | New Stage: {notif.newStage}
                </p>
                <p className="project-id">Project ID: {notif.projectId}</p>
                {notif.notifId == notifDescId ? <p>{notif.description}</p> : ""}
              </div>
            </div>
            <button
              onClick={() => {
                markNotifAsRead(notif.notifId);
              }}
              disabled={
                readNotifList.filter((item) => {
                  return item == notif.notifId;
                }).length || notif.readUsers.includes(userId)
              }
            >
              Mark Read
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationDisplay;
