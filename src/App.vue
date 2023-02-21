<template>
  <div class="App">
    <div style="display: flex; flex-direction: row; justify-content: start;">
      <form @submit.prevent="submitToken">
        <!-- <input type="text" placeholder="Enter token" v-model="token" /> -->
        <button type="submit">Chat với người lạ nào !</button>
      </form>
      <button @click="stopChat()" v-show="stop">Stop</button>
      <button @click="nextRoom()" v-show="next">Next</button>

    </div>
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

export default {
  name: 'App',
  components: {
  },
  mounted() {
    this.toggleFormElements("form.input-div", true);
  },
  data() {
    return {
      token: '',
      inputMessageText: '',
      messages: [],
      stop: false,
      next: false
    };
  },
  methods: {
    toggleFormElements(formSelected, bDisabled) {
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
        if (data.message.includes("NextRoom")) {
          data.message = data.message.substr(8, data.message.length - 1);
          this.stop = false; this.next = false;
          this.toggleFormElements("form.input-div", true);
        }
        else if (this.messages.length > 0) {
          this.messages = [];
        }
        if (data.message.includes("Strangers have entered the room")) {
          const chatRoom = data.message.substr(data.message.indexOf("|") + 1, data.message.length - 1);
          localStorage.setItem('chatRoom', chatRoom);
          data.message = data.message.substr(0, data.message.indexOf("|"));
          this.toggleFormElements("form.input-div", false);
          this.stop = true; this.next = true;
        }
        if (data.message === 'The stranger has escaped. Waiting for the next one ....') {
          this.stop = false; this.next = false;
          this.toggleFormElements("form.input-div", true);
        }
        this.messages.push(data);
      });
      SocketioService.receiveMessage((err, data) => {
        console.log(data);
        this.messages.push(data);
      });
    },
    submitMessage() {
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
      this.toggleFormElements("form.input-div", true);
      localStorage.clear();
      // clear the input after the message is sent
          this.stop = false; this.next = false;
      this.inputMessageText = '';

    },
    nextRoom() {
      // SocketioService.disconnect();
      this.messages = [{ message: "Waiting for a stranger ...", name: "Bot" }];
          this.stop = false; this.next = false;
      // this.submitToken();
      SocketioService.nextRoom();
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