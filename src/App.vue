<!-- <template>
  <div class="App">
    <form @submit.prevent="submitToken">
      <input type="text" placeholder="Enter token" v-model="token" />
      <button type="submit">Submit</button>
    </form>
    <div class="box">
      <div class="messages">
        <div v-for="user in messages" :key="user.id">
          {{user.name}}: {{user.message}}
        </div>
      </div>
      <div class="messages"></div>
      <form class="input-div" @submit.prevent="submitMessage">
        <input type="text" placeholder="Type in text" v-model="inputMessageText" />
        <button type="submit">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import SocketioService from './services/socketio.service.js';

// static data only for demo purposes, in real world scenario, this would be already stored on client
const SENDER = {
  id: "123",
  name: "John Doe",
};

export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      token: '',
      inputMessageText: '',
      messages: []
    };
  },
  methods: {
    submitToken() {
      console.log(this.token);
      SocketioService.setupSocketConnection(this.token);
      SocketioService.subscribeToMessages((err, data) => {
        console.log(data);
        this.messages.push(data);
      });
    },
    submitMessage() {
      const CHAT_ROOM = "myRandomChatRoomId";
      const message = this.inputMessageText;
      SocketioService.sendMessage({message, roomName: CHAT_ROOM}, cb => {
        // callback is acknowledgement from server
        console.log(cb);
        this.messages.push({
          message,
          ...SENDER
        });
        // clear the input after the message is sent
        this.inputMessageText = '';
      });
    }
  },
  beforeUnmount() {
    SocketioService.disconnect();
  }
}
</script>

<style>
.App {
  padding: 1rem;
}

.box {
  width: fit-content;
  height: 400px;
  border: solid 1px #000;
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
}

.messages {
  flex-grow: 1;
}

.input-div {
  display: flex;
  width: 100%;
}
</style> -->

<template>
  <div class="App">
    <form @submit.prevent="submitToken">
      <!-- <input type="text" placeholder="Enter token" v-model="token" /> -->
      <button type="submit">Chat với người lạ nào !</button>
    </form>
    <button @click="stopChat()">Stop</button>
    <button @click="nextRoom()">Next</button>
    <div class="box">
      <div class="messages">
        <template v-for="user in messages" :key="user.id">
          <div style="text-align: left;" v-if="user.name === 'Stranger' || user.name === 'Bot'">
            <b>{{ user.name }}:</b> {{ user.message }}
          </div>
          <div style="text-align: right;" v-else>
            {{ user.message }} <b>:{{ user.name }}</b>
          </div>
        </template>
      </div>
      <div class="messages"></div>
      <form class="input-div" @submit.prevent="submitMessage">
        <input type="text" placeholder="Type in text" v-model="inputMessageText" />
        <button type="submit">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import SocketioService from './services/socketio.service.js';

// static data only for demo purposes, in real world scenario, this would be already stored on client
// const SENDER = {
//   id: "123",
//   name: "John Doe",
// };

export default {
  name: 'App',
  components: {
  },
  mounted() {
    this.toggleFormElements("form.input-div",true);
  },
  data() {
    return {
      token: '',
      inputMessageText: '',
      messages: [],
    };
  },
  methods: {
    toggleFormElements(formSelected,bDisabled) {
      let form = document.querySelector(formSelected);
      let inputs = form.getElementsByTagName("input");
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].disabled = bDisabled;
      }
      let selects = form.getElementsByTagName("select");
      for (let i = 0; i < selects.length; i++) {
        selects[i].disabled = bDisabled;
      }
      let textareas = form.getElementsByTagName("textarea");
      for (let i = 0; i < textareas.length; i++) {
        textareas[i].disabled = bDisabled;
      }
      let buttons = form.getElementsByTagName("button");
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = bDisabled;
      }
    },
    submitToken() {
      console.log(this.token);
      SocketioService.setupSocketConnection(this.token);
      SocketioService.statusRoom((err, data) => {
        console.log(data);
        if (this.messages.length > 0) {
          this.messages = [];
        }
        if(data.message === 'Strangers have entered the room'){
          this.toggleFormElements("form.input-div",false);
        }
        if(data.message === 'The stranger has escaped. Waiting for the next one ....'){
          this.toggleFormElements("form.input-div",true);
        }
        this.messages.push(data);
      });
      SocketioService.receiveMessage((err, data) => {
        console.log(data);
        this.messages.push(data);
      });
    },
    submitMessage() {
      // const CHAT_ROOM = "myRandomChatRoomId";
      console.log("sending message....");
      const message = this.inputMessageText;
      SocketioService.sendMessage(message, cb => {
        // callback is acknowledgement from server
        console.log(cb);
        this.messages.push({
          message,
          name: "Me"
        });
        // clear the input after the message is sent
        this.inputMessageText = '';
      });
    },
    stopChat() {
      SocketioService.disconnect();
      this.messages.push({
        message: "You left room !",
        name: "Bot"
      });
      this.toggleFormElements("form.input-div",true);
      // clear the input after the message is sent
      this.inputMessageText = '';
      
    },
    nextRoom() {
      SocketioService.disconnect();
      this.messages = [];
      this.submitToken();
    }
  },
  beforeUnmount() {
    SocketioService.disconnect();
  }
  
}
</script>

<style>
.App {
  padding: 1rem;
}

.box {
  width: fit-content;
  height: 400px;
  border: solid 1px #000;
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  width: 310px;
  overflow: scroll;
}

.messages {
  flex-grow: 1;
}

.input-div {
  display: flex;
  width: 100%;
}
</style>




<!-- <template>
  <img alt="Vue logo" src="./assets/logo.png">
</template>

<script>
import SocketioService from './services/socketio.service.js';

export default {
  name: 'App',
  components: {
  },
  created() {
    SocketioService.setupSocketConnection();
  },
  beforeUnmount() {
    SocketioService.disconnect();
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style> -->

