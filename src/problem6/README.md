## Software Requirements

### 1. Real-time Scoreboard Display
- The website features a scoreboard that displays the top 10 user scores.
- The scoreboard should be live-updated, reflecting any changes to user scores in real-time without requiring a page refresh.

### 2. User Actions and Score Updates
- Users can perform an action (the specifics of the action are outside the scope of this module).
- After the action is completed, an API call is made to the application server to update the user’s score.


### 3. Security Considerations
- To prevent malicious users from increasing their scores without authorization, the system must include security checks:
  - **Authentication**: Ensure that the user making the API call is authenticated.
  - **Data Validation**: Validate the data being sent to the server to ensure that the score update is legitimate.
  - **Rate Limiting**: Implement rate limiting to prevent a user from spamming the action and artificially inflating their score.
  - **Audit Logs**: Maintain an audit log of score updates to detect and investigate any suspicious activities.

## System Components

### 1. **Scoreboard API**
The Scoreboard API is responsible for handling score updates, validating incoming requests, and ensuring that the scoreboard is updated in real-time. Below are the key endpoints:

#### **1.1 PATCH /api/score/update**
- **Description**: Updates the score for a specific user.

#### **1.2 GET /api/score/top**
- **Description**: Retrieves the top 10 scores.


### 2. **Database**
   - Stores user scores
   - Indexes are used to quickly retrieve the top 10 scores.

### 3. **WebSocket Server**
   - As the score board is shared between all users, the server could emit general event on the score updates (WebSocket Event: `scoreboardUpdate`)

### 4. **Security Module**
   - Middleware for validating signed JWT tokens. If the token is missing or invalid, the server should respond with a 401 Unauthorized status.

## Data Flow

1. **User performs an action** → 2. **Action triggers an API call to update the score** → 3. **Server make a check for JWT token** → 4. **Server processes the request and updates the score** → 5. **WebSocket server emit event with the updated scores to all connected clients** → 6. **Scoreboard is updated in real-time on the website**

## Error Handling

- **Failed API Calls**: If an API call fails, the system should log the error and attempt to retry the request.
- **Scoreboard Update Failures**: If the WebSocket server fails to push updates, clients should periodically poll the server to ensure the scoreboard is up-to-date.

## Conclusion

This module is designed to provide a secure, real-time scoreboard that enhances user engagement while ensuring that score manipulation is prevented through rigorous security measures.
