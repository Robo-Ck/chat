const fs = require("fs");

// Шлях до файлу, у якому буде наша база даних
const dbFile = "./chat.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const dbWrapper = require("sqlite");
let db;

dbWrapper
  .open({
    filename: dbFile,
    driver: sqlite3.Database
  })
  .then(async dBase => {
    db = dBase;

    // Використвуємо try-catch у разі якщо виникнуть помилки
    try {
      // Перевіряємо чи існує уже файл бази даних
      if (!exists) {
        // Якщо не існує то створюємо таблиці
        await db.run(
            `CREATE TABLE user(
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                login TEXT,
                password TEXT
            );`
        );

        await db.run(
          `INSERT INTO user (login, password) VALUES 
          ('admin', 'admin'), 
          ('JavaScript', 'banana'), 
          ('user1', 'password1');`
        );

        await db.run(
            `CREATE TABLE message(
                msg_id INTEGER PRIMARY KEY AUTOINCREMENT,
                content TEXT,
                autor INTEGER,
                FOREIGN KEY(autor) REFERENCES user(user_id)
            );`
        );
      } else {
        console.log(await db.all("SELECT * from user"));
      }
    } catch (dbError) {
      console.error(dbError);
    }
  });


module.exports = {
  getMessages: async () => {
    try {
      return await db.all(
        `SELECT msg_id, content, login, user_id from message
         JOIN user ON message.autor = user.user_id`
        );
    } catch (dbError) {
      console.error(dbError);
    }
  },
  addMessage: async (msg, userId) => {
    await db.run(
      `INSERT INTO message (content, autor) VALUES (?, ?)`,
      [msg, userId]
    );
  }
};