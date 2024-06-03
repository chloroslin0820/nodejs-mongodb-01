import express from "express";
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getTime, getDate } from "./time-date-utils.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import ChatMsg from "./models/ChatMsg.js";
import cors from 'cors';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const __dirname = dirname(fileURLToPath(import.meta.url));

const publicDirectoryPath = join(__dirname, 'public');
app.use(express.static(publicDirectoryPath));
app.use(express.json());
app.use(cors());

dotenv.config();
const PORT = process.env.PORT;
const dbUri = process.env.MONGO_URL;

mongoose
.connect(dbUri)
.then(() => console.log('Database connected sucessfully'))
.catch((err) => console.log('Error occurs:', err));

app.get("/api/msg_records", async (req, res) => {
    try {
        const allMsgRecords = await ChatMsg.find({});
        res.status(200).json(allMsgRecords);
    } catch (err) {
        console.log(err);
    }
});

const messages = new Set();
app.post("/api/msg_record", async (req, res) => {
    try {
        const { message, time_date } = req.body;
        const uniqueMsg = `${message} ${time_date}`;

        if (!messages.has(uniqueMsg)) {
            messages.add(uniqueMsg);
            
            const createMsgRecord = await ChatMsg.create(req.body);
            res.status(200).json(createMsgRecord);
        } else {
            res.status(200).send('Duplicate message');
        }

    } catch (err) {
        console.log(err);
    }
});

io.on('connection', (socket) => {
    
    socket.on('chat message', (msg) => {

        setInterval(() => {
            if(msg){
                const currentTime = getTime();
                const currentDate = getDate();
                io.emit('chat message', msg + '/* space */' + currentTime + ' ' + currentDate);
            }
            msg = '';
        }, 1000);
    });
});

httpServer.listen(process.env.PORT || PORT, () => {
    console.log('Server is running on port 3000');
});