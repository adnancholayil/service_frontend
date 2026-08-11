'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useRouter } from 'next/navigation';
import { MessageSquare, Send, Mic, Square, ArrowLeft } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client/react';

import Avatar from '../../../components/ui/Avatar';
import Button from '../../../components/ui/Button';
import { setActiveConversation } from '../../../store/slices/chatSlice';
import { GET_CONVERSATIONS, GET_MESSAGES, SEND_MESSAGE, MESSAGE_SUBSCRIPTION } from '../../../graphql/queries/chat';

export default function ProviderMessagesPage() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { activeConversationId } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  const [messageText, setMessageText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isUploadingVoice, setIsUploadingVoice] = useState(false);
  const audioChunksRef = React.useRef([]);
  const recordingTimerRef = React.useRef(null);
  const messagesEndRef = React.useRef(null);

  const { data: convData, loading: convLoading } = useQuery(GET_CONVERSATIONS);
  const conversations = convData?.conversations || [];

  useEffect(() => {
    const cid = searchParams.get('conversationId');
    if (cid && cid !== activeConversationId) {
      dispatch(setActiveConversation(cid));
      router.replace('/provider/messages');
    }
  }, [searchParams, dispatch, activeConversationId, router]);

  const { data: msgData, subscribeToMore } = useQuery(GET_MESSAGES, {
    variables: { conversationId: activeConversationId },
    skip: !activeConversationId,
    fetchPolicy: 'cache-and-network',
  });

  const [sendMessageMut] = useMutation(SEND_MESSAGE);

  React.useEffect(() => {
    if (activeConversationId && subscribeToMore) {
      const unsubscribe = subscribeToMore({
        document: MESSAGE_SUBSCRIPTION,
        variables: { conversationId: activeConversationId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const newMsg = subscriptionData.data.newMessage;
          if (prev.messages.some(m => m.id === newMsg.id)) return prev;
          return Object.assign({}, prev, { messages: [...prev.messages, newMsg] });
        },
      });
      return () => unsubscribe();
    }
  }, [activeConversationId, subscribeToMore]);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const activeMessages = [...(msgData?.messages || [])].sort((a, b) => parseInt(a.createdAt) - parseInt(b.createdAt));
  const otherParticipant = activeConversation?.participants?.find(p => p.id !== user?.id) || {};

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType });
        await uploadVoiceMessage(audioBlob, recorder.mimeType);
        stream.getTracks().forEach(t => t.stop());
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingDuration(0);
      recordingTimerRef.current = setInterval(() => setRecordingDuration(p => p + 1), 1000);
    } catch (err) { console.error('Microphone error:', err); }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
      clearInterval(recordingTimerRef.current);
    }
  };

  const uploadVoiceMessage = async (audioBlob, mimeType) => {
    setIsUploadingVoice(true);
    try {
      let ext = 'webm';
      if (mimeType.includes('mp4')) ext = 'mp4';
      else if (mimeType.includes('ogg')) ext = 'ogg';
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', audioBlob, `voice-${Date.now()}.${ext}`);
      const res = await fetch('http://localhost:4000/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.status === 'success' && data.url) {
        await sendMessageMut({ variables: { recipientId: otherParticipant.id, text: '🎤 Voice message', attachments: [data.url] } });
      }
    } catch (err) { console.error('Upload failed:', err); }
    finally { setIsUploadingVoice(false); }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConversationId) return;
    try {
      await sendMessageMut({ variables: { recipientId: otherParticipant.id, text: messageText.trim() } });
      setMessageText('');
    } catch (err) { console.error(err); }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">

      {/* Header */}
      <div className="px-5 py-3 border-b border-border shrink-0 flex items-center justify-between bg-card">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            Messages <MessageSquare className="h-4 w-4 text-brand" />
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Chat with your customers directly.</p>
        </div>
      </div>

      {/* Chat panel */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* Conversation list */}
        <div className={`w-64 border-r border-border flex flex-col bg-card shrink-0 ${activeConversationId ? 'hidden sm:flex' : 'flex'}`}>
          <div className="px-4 py-3 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Inbox
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-slate-50">
            {convLoading ? (
              <div className="flex justify-center p-6">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-2 p-6">
                <MessageSquare className="h-8 w-8 text-muted" />
                <p className="text-xs text-muted-foreground text-center">No conversations yet</p>
              </div>
            ) : (
              conversations.map((conv) => {
                const partner = conv.participants.find(p => p.id !== user?.id) || conv.participants[0];
                const isActive = activeConversationId === conv.id;
                return (
                  <div
                    key={conv.id}
                    onClick={() => dispatch(setActiveConversation(conv.id))}
                    className={`p-3 flex items-center gap-3 cursor-pointer transition-all hover:bg-muted/50 ${isActive ? 'bg-brand/10 border-l-2 border-brand' : ''}`}
                  >
                    <Avatar src={partner?.avatar} alt={partner?.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-foreground truncate">{partner?.name}</h4>
                        <span className="text-[9px] text-muted-foreground shrink-0 ml-1">
                          {conv.lastMessage ? new Date(parseInt(conv.updatedAt)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                        {conv.lastMessage?.text || 'Start conversation...'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Message window */}
        <div className={`flex-1 flex-col bg-muted/50/50 min-w-0 ${activeConversationId ? 'flex' : 'hidden sm:flex'}`}>
          {activeConversation ? (
            <>
              {/* Chat header */}
              <div className="px-4 py-3 border-b border-border bg-card flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => dispatch(setActiveConversation(null))}
                    className="sm:hidden p-1.5 rounded-lg hover:bg-muted text-muted-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <Avatar src={otherParticipant.avatar} alt={otherParticipant.name} size="sm" />
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{otherParticipant.name}</h4>
                    <span className="text-[10px] text-muted-foreground capitalize">{otherParticipant.role}</span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                {activeMessages.map((msg) => {
                  const isMe = msg.sender.id === user?.id;
                  const hasAudio = msg.attachments?.length > 0 && msg.attachments[0].match(/\.(webm|mp3|wav|ogg|m4a|mpeg)/i);
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                        isMe
                          ? 'bg-brand text-white rounded-br-none'
                          : 'bg-card border border-border text-foreground rounded-bl-none shadow-sm'
                      }`}>
                        {hasAudio ? (
                          <div className="flex flex-col gap-1">
                            <span className="text-xs opacity-80">{msg.text}</span>
                            <audio controls src={msg.attachments[0]} className="h-9 w-48" />
                          </div>
                        ) : (
                          <p>{msg.text}</p>
                        )}
                        <span className={`text-[9px] block mt-1 ${isMe ? 'text-white/80 text-right' : 'text-muted-foreground text-right'}`}>
                          {new Date(parseInt(msg.createdAt)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="px-3 py-2 border-t border-border bg-card flex gap-2 shrink-0 items-center">
                {isRecording ? (
                  <div className="flex-1 bg-red-50 px-4 py-2 text-xs rounded-full flex items-center justify-between border border-red-200">
                    <div className="flex items-center gap-2 text-red-500 font-medium animate-pulse">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-500" /> Recording...
                    </div>
                    <span className="text-red-400 font-mono text-[10px]">
                      {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 bg-muted px-4 py-2 text-sm rounded-full text-foreground focus:outline-none focus:ring-1 focus:ring-brand border border-border"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    disabled={isUploadingVoice}
                  />
                )}
                {isRecording ? (
                  <button type="button" onClick={stopRecording} className="p-2 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-colors">
                    <Square className="h-4 w-4 fill-current" />
                  </button>
                ) : (
                  <button type="button" onClick={startRecording} disabled={isUploadingVoice} className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors">
                    <Mic className="h-4 w-4" />
                  </button>
                )}
                {!isRecording && (
                  <button type="submit" disabled={isUploadingVoice || !messageText.trim()} className="p-2 rounded-full bg-brand hover:bg-brand-hover text-white disabled:opacity-40 transition-colors">
                    <Send className="h-4 w-4" />
                  </button>
                )}
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 p-6">
              <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="font-semibold text-sm text-muted-foreground">Select a conversation</p>
              <p className="text-xs text-muted-foreground text-center max-w-xs">Pick a chat from the left panel to start messaging.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
