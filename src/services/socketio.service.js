// import { io } from 'socket.io-client';

// class SocketioService {
//   socket;
//   constructor() {}

//   setupSocketConnection(token) {
//     this.socket = io(process.env.VUE_APP_SOCKET_ENDPOINT, {
//       auth: {
//         token,
//       },
//     });
//     console.log(`Connecting socket...`);
    
//     this.socket.on('my broadcast', (data) => {
//       console.log(data);
//     });
//   }

//   subscribeToMessages(cb) {
//     if (!this.socket) return(true);
//     this.socket.on('message', msg => {
//       console.log('Room event received!');
//       return cb(null, msg);
//     });
//   }
  
//   sendMessage({message, roomName}, cb) {
//     if (this.socket) this.socket.emit('message', { message, roomName }, cb);
//   }
  
//   disconnect() {
//     if(this.socket) {
//       this.socket.disconnect();
//     }
//   }
// }

// export default new SocketioService();

import { io } from 'socket.io-client';

class SocketioService {
  socket;
  chatRoom ='';
  constructor() {}

  setupSocketConnection(token) {
    this.socket = io(process.env.VUE_APP_SOCKET_ENDPOINT, {
      // auth: {
      //   token,
      // },
    });
    console.log(`Connecting socket...`, token);
    
    this.socket.on('my broadcast', (data) => {
      console.log(data);
    });
  }

  // subscribeToMessages(cb) {
  //   if (!this.socket) return(true);
  //   this.socket.on('message', msg => {
  //     console.log('Room event received!');
  //     return cb(null, msg);
  //   });
  // }
  receiveMessage(cb){
    if(!this.socket) return true;
    this.socket.on("receiveMessage", message => {
      return cb(null, {message, name: "Stranger"});
    })
  }

  statusRoom(cb){
    if(!this.socket) return true;
    this.socket.on("statusRoom", message => {
      return cb(null, {message, name: "Bot"});
    })
  }
  
  // sendMessage({message, roomName}, cb) {
  //   if (this.socket) this.socket.emit('message', { message, roomName }, cb);
  // }

  sendMessage(message, cb) {
    if(this.socket) this.socket.emit('sendMessage',message,cb);
  }
  
  disconnect() {
    if(this.socket) {
      this.socket.disconnect();
    }
  }
}

export default new SocketioService();



// import { io } from 'socket.io-client';

// class SocketioService {
//   socket;
//   constructor() {}

//   setupSocketConnection() {
//     this.socket = io(process.env.VUE_APP_SOCKET_ENDPOINT);
//     this.socket.emit('my message', 'Hello there from Vue.');
    
//     this.socket.on('my broadcast', (data) => {
//       console.log(data, this.socket);
//     });
//   }
  
//   disconnect() {
//     if(this.socket) {
//       this.socket.disconnect();
//     }
//   }
// }

// export default new SocketioService();