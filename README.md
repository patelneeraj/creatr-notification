# Problem Statement: Notification System for Project Management Platform

## Background

- Our platform consists of three modules: Designs, Wireframes, and Webapps
- Projects go through four stages in their lifecycle: "Started", "Building", "Built", and "Failed"

## Objective

Develop a comprehensive notification system for our project management platform, including both frontend and backend components.

## Backend Requirements

1. Create a notification service that can:
   - Generate notifications for various events in the project lifecycle
   - Associate notifications with specific projects and modules
   - Store notification data (message, timestamp, project type, priority, etc.)
2. Develop an API to:
   - Fetch notifications (with filtering and sorting capabilities)
   - Mark notifications as read/unread
   - Implement real-time notification delivery (e.g., using WebSockets)

## Frontend Requirements

1. Notification Display
   - Show a list of past notifications with color-coded values based on project type or status
   - Implement sorting functionality (by time, project type, priority)
   - Separate unread and read notifications
   - Allow users to mark notifications as read/unread
   - Display notification description on click/hover
2. Real-time Notifications
   - Show toast notifications when new notifications are received
   - Implement a notification counter for unread notifications
3. Filtering and Sorting
   - Allow users to filter notifications by project type, priority, or status
   - Implement sorting options (e.g., by time, priority)
