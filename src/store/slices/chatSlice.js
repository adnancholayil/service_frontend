import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  conversations: [],
  activeConversationId: null,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveConversation(state, action) {
      state.activeConversationId = action.payload;
      const conv = state.conversations.find(c => c.id === action.payload);
      if (conv) {
        conv.unread = 0;
      }
    },
    sendMessage(state, action) {
      const { conversationId, text, senderId } = action.payload;
      const conv = state.conversations.find(c => c.id === conversationId);
      if (conv) {
        const newMsg = {
          id: `msg-${Date.now()}`,
          senderId,
          text,
          timestamp: new Date().toISOString()
        };
        conv.messages.push(newMsg);
        conv.lastMessage = text;
        conv.timestamp = newMsg.timestamp;
      }
    },
    receiveMessage(state, action) {
      const { conversationId, text, senderId } = action.payload;
      const conv = state.conversations.find(c => c.id === conversationId);
      if (conv) {
        const newMsg = {
          id: `msg-${Date.now()}`,
          senderId,
          text,
          timestamp: new Date().toISOString()
        };
        conv.messages.push(newMsg);
        conv.lastMessage = text;
        conv.timestamp = newMsg.timestamp;
        if (state.activeConversationId !== conversationId) {
          conv.unread += 1;
        }
      }
    },
    createConversation(state, action) {
      const { id, user } = action.payload;
      const exists = state.conversations.find(c => c.id === id || c.user.id === user.id);
      if (!exists) {
        state.conversations.unshift({
          id: id || `conv-${Date.now()}`,
          user,
          lastMessage: '',
          timestamp: new Date().toISOString(),
          unread: 0,
          messages: []
        });
      }
    }
  }
});

export const { setActiveConversation, sendMessage, receiveMessage, createConversation } = chatSlice.actions;
export default chatSlice.reducer;
