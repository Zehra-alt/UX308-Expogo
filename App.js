import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Modal } from 'react-native';
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
      
      <Text style={{fontSize: 24}}>☕ Velvet Roast Rewards</Text>
      <Text style={{fontSize: 18, marginBottom: 20}}>Points: {points} / 10</Text>

      <Button title="Open Chatbot" onPress={() => setChatOpen(true)} />

      <Modal visible={chatOpen} animationType="slide">
        <View style={styles.chatContainer}>

          <Text style={{fontSize: 20}}>Chatbot</Text>

          {messages.map((msg, index) => (
            <Text key={index}>{msg}</Text>
          ))}

          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type here..."
          />

          <Button title="Send" onPress={sendMessage} />
          <Button title="Close" onPress={() => setChatOpen(false)} />

        </View>
      </Modal>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  }
});