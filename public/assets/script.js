let socket = io();

const formDOM = document.getElementById('form');
const inputDOM = document.getElementById('input');
const messagesDOM = document.getElementById('messages');

let msg = '';
let writtenTime = '';
let writtenDate = '';

const getAllThreads = async () => {
    messagesDOM.classList.add('active');

    try {
        let allMsgRecordsDto = await axios.get("/api/msg_records");
        let { data } = allMsgRecordsDto;

        let allMsgRecords = data.map((msgRecord) => {
            const { message, time_date } = msgRecord;
            return `
                <ul id="messages">
                    <li>
                        <h2>${message}</h2>
                        <h3>${time_date}</h3>
                    </li>
                </ul>
            `
        })
        .join("");

        messagesDOM.innerHTML = allMsgRecords;

    } catch (err) {
        console.log(err);
    }
};

if(!msg && !writtenTime && !writtenDate){
    getAllThreads();
}

formDOM.addEventListener('submit', async (e) => {
    e.preventDefault();
    if(inputDOM.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

socket.on('chat message', async (data) => {
    const splitedData = data.split('/* space */');
    msg = splitedData[0];
    const splitedTimeDate = splitedData[1].split(' ');
    writtenTime = splitedTimeDate[0];
    writtenDate = splitedTimeDate[1];
    console.log(writtenTime, writtenDate);
    
    const item = document.createElement('li');
    const h3Div = document.createElement('div');

    // Create h2 element for message
    const messageHeader = document.createElement('h2');
    messageHeader.textContent = msg;

    // Create h3 element for current time
    const timeDateHeader = document.createElement('h3');
    timeDateHeader.textContent = writtenTime + ' ' + writtenDate;

    try {
        await axios.post("/api/msg_record", {
            message: msg,
            time_date: writtenTime + ' ' + writtenDate,
        });

        // getAllThreads();

    } catch (err) {
        console.log(err);
    }

    // Append both headers to the list item
    item.appendChild(messageHeader);
    item.appendChild(h3Div);
    h3Div.appendChild(timeDateHeader);

    // Append the list item to the messages list
    messagesDOM.appendChild(item);
});