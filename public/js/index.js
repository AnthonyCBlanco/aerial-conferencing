
const socket = io('/');
const peer = new Peer();

peer.on('open' , (id)=>{
    socket.emit("newUser" , id);
});

io.on('connection' , (socket)=>{
    socket.on('newUser' , (id)=>{
        socket.join('/');
        socket.to('/').broadcast.emit("userJoined" , id);
    });
});