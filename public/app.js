const socket=io();let pc,localStream;const $=id=>document.getElementById(id);const status=t=>{$('status').textContent=t};
function setup(){const room=$('room').value.trim();const role=$('role').value;if(!room)return status('Enter the pairing code.');socket.emit('join',{room,role});status(`Connected as ${role}. Waiting for the other device…`);if(role==='child')$('childControls').hidden=false;}
$('join').onclick=setup;
async function makePC(){pc=new RTCPeerConnection({iceServers:[{urls:'stun:stun.l.google.com:19302'}]});pc.onicecandidate=e=>{if(e.candidate)socket.emit('ice',e.candidate)};pc.ontrack=e=>{$('remote').srcObject=e.streams[0];status('Live camera stream connected.');};}
socket.on('peer-ready',async({role})=>{status(`${role} connected.`);if($('role').value==='parent'&&role==='child'){} });
socket.on('offer',async offer=>{if($('role').value!=='parent')return;await makePC();await pc.setRemoteDescription(offer);const ans=await pc.createAnswer();await pc.setLocalDescription(ans);socket.emit('answer',ans);});
socket.on('answer',async ans=>{if(pc)await pc.setRemoteDescription(ans)});
socket.on('ice',async c=>{try{if(pc)await pc.addIceCandidate(c)}catch(e){}});
socket.on('camera-stop',()=>{if($('remote').srcObject){$('remote').srcObject.getTracks().forEach(t=>t.stop());$('remote').srcObject=null}status('Child stopped the camera.');});
$('start').onclick=async()=>{if(!pc)await makePC();localStream=await navigator.mediaDevices.getUserMedia({video:true,audio:false});$('local').srcObject=localStream;localStream.getTracks().forEach(t=>pc.addTrack(t,localStream));const offer=await pc.createOffer();await pc.setLocalDescription(offer);socket.emit('offer',offer);status('🔴 Camera is ON — streaming with visible indicator.');};
$('stop').onclick=()=>{if(localStream)localStream.getTracks().forEach(t=>t.stop());socket.emit('camera-stop');status('Camera stopped.');};
