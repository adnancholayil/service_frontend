'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessageSquare, Send, Sparkles, Smile, Image, Phone, Video } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client/react';

import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import { setActiveConversation } from '../../store/slices/chatSlice';
import { GET_CONVERSATIONS, GET_MESSAGES, SEND_MESSAGE, MESSAGE_SUBSCRIPTION } from '../../graphql/queries/chat';

export default function MessagesPage() {
  const dispatch = useDispatch();
  const { activeConversationId } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  const [messageText, setMessageText] = useState('');

  // GraphQL Queries
  const { data: convData, loading: convLoading } = useQuery(GET_CONVERSATIONS);
  const conversations = convData?.conversations || [];

  const { data: msgData, subscribeToMore } = useQuery(GET_MESSAGES, {
    variables: { conversationId: activeConversationId },
    skip: !activeConversationId,
    fetchPolicy: 'cache-and-network'
  });
  
  const [sendMessageMut] = useMutation(SEND_MESSAGE);

  // Setup Subscription for real-time messages
  React.useEffect(() => {
    if (activeConversationId && subscribeToMore) {
      const unsubscribe = subscribeToMore({
        document: MESSAGE_SUBSCRIPTION,
        variables: { conversationId: activeConversationId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const newMsg = subscriptionData.data.newMessage;
          
          // Don't add if already exists
          if (prev.messages.some(m => m.id === newMsg.id)) return prev;

          return Object.assign({}, prev, {
            messages: [...prev.messages, newMsg]
          });
        }
      });
      return () => unsubscribe();
    }
  }, [activeConversationId, subscribeToMore]);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const activeMessages = msgData?.messages || [];
  
  // Find the other participant for avatar/name
  const otherParticipant = activeConversation?.participants?.find(p => p.id !== user?.id) || {};

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConversationId) return;

    try {
      await sendMessageMut({
        variables: {
          recipientId: otherParticipant.id,
          text: messageText.trim()
        }
      });
      setMessageText('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleBackToInbox = () => {
    dispatch(setActiveConversation(null));
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col h-[calc(100dvh-8rem)] sm:h-[calc(100vh-4rem)] sm:py-6 overflow-hidden">
      
      {/* Title - Hide on mobile if conversation is active */}
      <div className={`px-4 sm:px-0 mb-2 sm:mb-4 shrink-0 pt-4 sm:pt-0 ${activeConversationId ? 'hidden sm:block' : 'block'}`}>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          Messages <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-brand" />
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Chat directly with your booked service partners.</p>
      </div>

      {/* Box layout split screen */}
      <div className="flex-1 min-h-0 flex sm:border border-border bg-card sm:rounded-2xl overflow-hidden sm:shadow-lg mb-0 sm:mb-0">
        
        {/* Left Side: Conversations list */}
        <div className={`w-full sm:w-80 border-r border-border flex flex-col bg-card shrink-0 ${activeConversationId ? 'hidden sm:flex' : 'flex'}`}>
          <div className="p-4 border-b border-border font-bold text-foreground bg-muted/30">Inbox</div>
          <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-border/60">
            {convLoading ? (
              <div className="flex justify-center p-6"><div className="h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent" /></div>
            ) : conversations.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center p-6 italic">No chats available</p>
            ) : (
              conversations.map((conv) => {
                const partner = conv.participants.find(p => p.id !== user?.id) || conv.participants[0];
                return (
                <div
                  key={conv.id}
                  onClick={() => dispatch(setActiveConversation(conv.id))}
                  className={`p-4 flex items-center gap-3 cursor-pointer transition-all hover:bg-muted ${
                    activeConversationId === conv.id ? 'bg-muted' : ''
                  }`}
                >
                  <Avatar src={partner?.avatar} alt={partner?.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-foreground truncate">{partner?.name}</h4>
                      <span className="text-[10px] text-muted-foreground">
                        {conv.lastMessage ? new Date(parseInt(conv.updatedAt)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-1 leading-normal">
                      {conv.lastMessage?.text || 'Start conversation...'}
                    </p>
                  </div>
                </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Message Window */}
        <div className={`flex-1 flex-col bg-background/50 dark:bg-card/20 ${activeConversationId ? 'flex' : 'hidden sm:flex'}`}>
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-3 sm:p-4 border-b border-border bg-card flex items-center justify-between shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Back button for mobile */}
                  <button 
                    onClick={handleBackToInbox}
                    className="sm:hidden p-1.5 -ml-1 mr-1 rounded-lg hover:bg-muted text-muted-foreground"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  </button>
                  <Avatar src={otherParticipant.avatar} alt={otherParticipant.name} size="sm" className="sm:h-10 sm:w-10 h-8 w-8" />
                  <div>
                    <h4 className="text-sm font-bold text-foreground leading-tight sm:leading-snug">{otherParticipant.name}</h4>
                    <span className="text-[10px] text-muted-foreground capitalize">{otherParticipant.role}</span>
                  </div>
                </div>
                <div className="flex gap-1 sm:gap-2">
                  <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground"><Phone className="h-4 w-4 sm:h-5 sm:w-5" /></button>
                  <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground"><Video className="h-4 w-4 sm:h-5 sm:w-5" /></button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                {activeMessages.map((msg) => {
                  const isMe = msg.sender.id === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[70%] p-3 rounded-2xl text-sm leading-relaxed shadow-xs ${
                          isMe
                            ? 'bg-brand text-white rounded-br-none'
                            : 'bg-card border border-border text-foreground rounded-bl-none'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <span
                          className={`text-[9px] block mt-1.5 ${
                            isMe ? 'text-indigo-200 text-right' : 'text-muted-foreground text-right'
                          }`}
                        >
                          {new Date(parseInt(msg.createdAt)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendMessage} className="p-2 sm:p-4 border-t border-border bg-card flex gap-1 sm:gap-2 shrink-0">
                <button type="button" className="p-2 rounded-lg hover:bg-muted text-muted-foreground hidden sm:block"><Smile className="h-5 w-5" /></button>
                <button type="button" className="p-2 rounded-lg hover:bg-muted text-muted-foreground"><Image className="h-5 w-5" /></button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-muted px-3 py-2 text-sm rounded-full text-foreground focus:outline-none focus:ring-1 focus:ring-brand border border-border"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
                <Button type="submit" className="rounded-full px-4 shrink-0 shadow-sm">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 p-6 bg-muted/10 h-full">
              <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center shadow-inner">
                <MessageSquare className="h-8 w-8 text-muted-foreground opacity-50" />
              </div>
              <h3 className="font-bold text-lg text-foreground">Select a Conversation</h3>
              <p className="text-xs text-muted-foreground max-w-xs">Pick one of your ongoing conversations from the inbox left sidebar to open the chat window.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
