// src/jobs/processNotifications.js

const axios = require('axios');
const mysql = require('mysql'); // Set up the database connection as needed

// MySQL connection
const connection = mysql.createConnection({
    host: 'database-1.czkmaymg2cn3.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'HAze179416$%',
    database: 'librarydb'
  });
  
  // Connect to the database
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err.stack);
      return;
    }
    console.log('Connected to MySQL database as id ' + connection.threadId);
  });




// Main function to process notifications
const processNotificationQueue = async () => {
  const query = `SELECT * FROM notifications_queue WHERE processed = 0 AND action_type = 'book_ready' LIMIT 10`;

  connection.query(query, (err, notifications) => {
    if (err) {
      console.error('Error fetching notifications:', err);
      return;
    }

    notifications.forEach(async (notification) => {
      const { id, user_id, book_id } = notification;

      try {
        // Call the backend route to send the email using axios
        const response = await axios.post('https://librarydbbackend.onrender.com/send-book-ready-email', {
          userId: user_id,
          bookId: book_id
        });

        if (response.status === 200) {
          // Mark notification as processed in the database
          connection.query(`UPDATE notifications_queue SET processed = 1 WHERE id = ?`, [id], (updateErr) => {
            if (updateErr) {
              console.error(`Error marking notification ${id} as processed:`, updateErr);
            } else {
              console.log(`Notification ID ${id} processed successfully.`);
            }
          });
        } else {
          console.error(`Failed to send email for notification ID ${id}`);
        }
      } catch (error) {
        console.error(`Error processing notification ID ${id}:`, error);
      }
    });
  });
};

module.exports = processNotificationQueue;
