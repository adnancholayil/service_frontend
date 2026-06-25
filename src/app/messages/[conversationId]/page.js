'use client';

import React, { use, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setActiveConversation } from '../../../store/slices/chatSlice';
import MessagesPage from '../page';

export default function MessageRoomPage({ params }) {
  const resolvedParams = use(params);
  const { conversationId } = resolvedParams;
  const dispatch = useDispatch();

  useEffect(() => {
    if (conversationId) {
      dispatch(setActiveConversation(conversationId));
    }
  }, [conversationId, dispatch]);

  return <MessagesPage />;
}
