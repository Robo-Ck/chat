const http = require("http");
const fs = require("fs");
const path = require("path");
const db = require("./database")

const pathToIndex = path.join(__dirname, "static", "index.html");
const indexHtmlFile = fs.readFileSync(pathToIndex);
const scriptFile = fs.readFileSync(path.join(__dirname, "static", "script.js"));
const styleFile = fs.readFileSync(path.join(__dirname, "static", "style.css"));

const server = http.createServer((req, res) => {
    switch(req.url){
        case "/": return res.end(indexHtmlFile);
        case "/script.js": return res.end(scriptFile);
        case "/style.css": return res.end(styleFile);
    }
    res.statusCode = 404;
    return res.end("Error 404");
});
server.listen(3000);


//==== WebSocket====
const { Server } = require("socket.io");
const io = new Server(server);

io.on("connection", async (socket) => {
    console.log("a user connected. id = " + socket.id);

    let userNickName = "admin";

    // Надіслати історію при вході
    let messages = await db.getMessages();
    socket.emit("all_messages", messages);

    socket.on("new_message", async (message) => {
        await db.addMessage(message, 1);

        // Оновити список після запису
        let updatedMessages = await db.getMessages();

        io.emit("all_messages", updatedMessages);
    });
});