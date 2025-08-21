import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './use-auth';

interface Chat {
  id: string;
  name: string;
  type: 'dm' | 'group';
}

export const useChat = () => {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);

  const createDirectMessage = async (friendId: string, friendUsername: string) => {
    if (!user) return null;

    const sortedUsers = [user.uid, friendId].sort();
    const q = query(collection(db, 'chats'), where('users', '==', sortedUsers));
    const querySnapshot = await getDocs(q);

    let chatId: string;
    
    if (!querySnapshot.empty) {
      chatId = querySnapshot.docs[0].id;
    } else {
      const newChatRef = await addDoc(collection(db, 'chats'), {
        users: sortedUsers,
        type: 'dm',
        createdAt: new Date()
      });
      chatId = newChatRef.id;
    }

    const chat = {
      id: chatId,
      name: friendUsername,
      type: 'dm' as const
    };

    setActiveChat(chat);
    return chat;
  };

  return {
    activeChat,
    setActiveChat,
    chats,
    createDirectMessage
  };
};
