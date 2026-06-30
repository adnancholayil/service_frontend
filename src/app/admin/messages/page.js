'use client';

import React, { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_ADMIN_CONVERSATIONS, GET_ADMIN_MESSAGES } from '../../../graphql/queries/chat';
import Avatar from '../../../components/ui/Avatar';
import { MessageCircle, Search, ShieldAlert } from 'lucide-react';

export default function AdminMessagesPage() {
  const [activeConversationId, setActiveConversationId] = useState(null);
  
  const { data: convData, loading: convLoading } = useQuery(GET_ADMIN_CONVERSATIONS, {
    fetchPolicy: 'network-only',
  });
  
  const { data: msgData, loading: msgLoading } = useQuery(GET_ADMIN_MESSAGES, {
    variables: { conversationId: activeConversationId },
    skip: !activeConversationId,
    fetchPolicy: 'network-only',
  });

  const conversations = convData?.adminConversations || [];
  const activeMessages = [...(msgData?.adminMessages || [])].reverse();
  const activeConversation = conversations.find(c => c.id === activeConversationId);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 h-[calc(100vh-140px)] flex flex-col">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
          Message Tracking <MessageCircle className="h-6 w-6 text-indigo-500" />
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor all communications across the platform. Read-only view for moderation.
        </p>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col sm:flex-row min-h-0">
        
        {/* Conversations List */}
        <div className={`w-full sm:w-80 border-r border-slate-200 flex-col bg-slate-50/50 ${activeConversationId ? 'hidden sm:flex' : 'flex'}`}>
          <div className="p-4 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search conversations..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {convLoading ? (
              <div className="p-8 text-center text-slate-400 text-sm">Loading conversations...</div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">No conversations found</div>
            ) : (
              conversations.map((conv) => {
                const participants = conv.participants.map(p => p.name).join(' & ');
                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`p-4 flex items-center gap-3 cursor-pointer transition-all hover:bg-slate-100 ${
                      activeConversationId === conv.id ? 'bg-indigo-50 hover:bg-indigo-50' : ''
                    }`}
                  >
                    <div className="flex -space-x-3">
                      {conv.participants.slice(0,2).map(p => (
                        <Avatar key={p.id} src={p.avatar} alt={p.name} size="sm" className="border-2 border-white" />
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900 truncate">{participants}</h4>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {conv.lastMessage?.text || 'Started conversation...'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Message View */}
        <div className={`flex-1 flex-col bg-white ${activeConversationId ? 'flex' : 'hidden sm:flex'}`}>
          {activeConversation ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setActiveConversationId(null)}
                    className="sm:hidden p-1.5 -ml-1 mr-1 rounded-lg hover:bg-slate-200 text-slate-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  </button>
                  <div className="flex -space-x-2 mr-2">
                    {activeConversation.participants.map(p => (
                      <Avatar key={p.id} src={p.avatar} alt={p.name} size="sm" className="border-2 border-slate-50" />
                    ))}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {activeConversation.participants.map(p => p.name).join(' & ')}
                    </h4>
                    <span className="text-[10px] font-medium text-slate-500 capitalize">
                      {activeConversation.participants.map(p => p.role).join(' • ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/30">
                {msgLoading ? (
                  <div className="text-center text-slate-400 text-sm py-10">Loading messages...</div>
                ) : activeMessages.length === 0 ? (
                  <div className="text-center text-slate-400 text-sm py-10">No messages in this conversation.</div>
                ) : (
                  activeMessages.map((msg) => {
                    const hasAudio = msg.attachments && msg.attachments.length > 0 && msg.attachments[0].match(/\.(webm|mp3|wav|ogg|m4a|mp4|mpeg)/i);
                    return (
                      <div key={msg.id} className="flex flex-col items-start max-w-[85%]">
                        <div className="flex items-center gap-2 mb-1">
                          <Avatar src={msg.sender?.avatar} alt={msg.sender?.name} size="xs" className="w-5 h-5" />
                          <span className="text-[11px] font-bold text-slate-700">{msg.sender?.name}</span>
                          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">{msg.sender?.role}</span>
                          <span className="text-[10px] text-slate-400 ml-2">
                            {new Date(parseInt(msg.createdAt)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="ml-7 bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-700">
                          {hasAudio ? (
                            <div className="flex flex-col gap-1">
                              {msg.text && <span className="mb-2">{msg.text}</span>}
                              <audio controls src={msg.attachments[0]} className="h-10 w-60" />
                            </div>
                          ) : (
                            <p>{msg.text}</p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              
              <div className="p-4 border-t border-slate-200 bg-slate-50/50 text-center">
                <p className="text-xs text-slate-500 font-medium flex items-center justify-center gap-1.5">
                  <ShieldAlert className="h-3 w-3 text-indigo-400" />
                  Read-only tracking mode. You cannot reply to these messages.
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/30">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 border border-slate-200 shadow-sm">
                <MessageCircle className="h-8 w-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Select a conversation</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-sm">
                Choose a conversation from the list to monitor the messages exchanged between users and providers.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
