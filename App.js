import { ScrollView } from 'react-native';
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Modal, TouchableOpacity } from 'react-native';
import { handleInput, clearInput } from './Order.js';

export default function App() {
  const [points, setPoints] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  function sendMessage(){
    if(!input) return;

    const response = handleInput(input);

    setMessages(prev => [
      ...prev, 
      `You: ${input}`, 
      ...response.map(r => `Bot: ${r}`)
    ]);

    setInput("");

    // detect order completion
    if(response.some(r => r.includes("Thank you for your order!"))){
      setPoints(prev => {
        const newPoints = prev + 1;

        if(newPoints === 10){
          alert("🎉 Your 10th order is FREE!");
          return 0;
        }

        return newPoints;
      });

      clearInput();
    }
  }

  return (
    <View style={styles.container}>
      
      <Text style={{fontSize: 26, fontWeight: '600'}}>☕ Velvet Roast Rewards</Text>
      <Text style={{fontSize: 18, marginBottom: 20}}>Points: {points} / 10</Text>
      <Text style={{color: '#666'}}>Buy 9, get your 10th free ☕</Text>

      <TouchableOpacity 
  style={styles.fab} 
  onPress={() => {
  setChatOpen(true);
  setMessages([]);
  clearInput();
}}
>
  <Text style={{color: 'white', fontSize: 20}}>💬</Text>
</TouchableOpacity>

      <Modal visible={chatOpen} animationType="slide">
        <View style={styles.chatContainer}>

          <Text style={{fontSize: 20}}>Chatbot</Text>

         {messages.map((msg, index) => {
  const isUser = msg.startsWith("You:");

  return (
    <View
      key={index}
      style={[
        styles.messageBubble,
        isUser ? styles.userBubble : styles.botBubble
      ]}
    >
      <Text style={{ color: isUser ? 'white' : 'black' }}>
        {msg.replace("You: ", "").replace("Bot: ", "")}
      </Text>
    </View>
  );
})}

          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type here..."
          />

          <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
           placeholder="Type your order..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
       <Text style={{ color: 'white' }}>Send</Text>
        </TouchableOpacity>
          </View>

<TouchableOpacity onPress={() => setChatOpen(false)}>
  <Text style={{ marginTop: 10, color: '#666' }}>Close</Text>
</TouchableOpacity>
          

        </View>
      </Modal>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf6f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatContainer: {
    flex: 1,
    padding: 20,
    marginTop: 40
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10
  },

  fab: {
  position: 'absolute',
  bottom: 30,
  right: 30,
  backgroundColor: '#000',
  width: 60,
  height: 60,
  borderRadius: 30,
  justifyContent: 'center',
  alignItems: 'center'
},
messageBubble: {
  padding: 10,
  borderRadius: 15,
  marginVertical: 5,
  maxWidth: '80%'
},

userBubble: {
  backgroundColor: '#000',
  alignSelf: 'flex-end'
},

botBubble: {
  backgroundColor: '#eee',
  alignSelf: 'flex-start'
}
});