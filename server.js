const express=require('express');
const http=require('http');
const {Server}=require('socket.io');
const path=require('path');
const app=express(); const server=http.createServer(app); const io=new Server(server);
app.use(express.static(path.join(__dirname,'public')));
app.get('/health',(_,res)=>res.json({ok:true,service:'CamSafetyKids Live Camera'}));
io.on('connection',socket=>{
 socket.on('join',({room,role})=>{ if(!room||!['parent','child'].includes(role)) return; socket.join(room); socket.data.room=room; socket.data.role=role; socket.to(room).emit('peer-ready',{role}); });
 for(const ev of ['offer','answer','ice']) socket.on(ev,data=>{ if(socket.data.room) socket.to(socket.data.room).emit(ev,data); });
 socket.on('camera-stop',()=>{if(socket.data.room) socket.to(socket.data.room).emit('camera-stop');});
 socket.on('disconnect',()=>{if(socket.data.room) socket.to(socket.data.room).emit('peer-left',{role:socket.data.role});});
});
const port=process.env.PORT||3000; server.listen(port,'0.0.0.0',()=>console.log(`CamSafetyKids running: http://127.0.0.1:${port}`));
