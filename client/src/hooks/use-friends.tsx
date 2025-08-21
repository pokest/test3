import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './use-auth';
import { Friend, FriendRequest } from '@/types/chat';

export const useFriends = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'friendships'), 
      where('users', 'array-contains', user.uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const currentFriends: Friend[] = [];
      const currentRequests: FriendRequest[] = [];

      const friendshipPromises = snapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data();
        const friendId = data.users.find((id: string) => id !== user.uid);
        
        if (data.status === 'accepted') {
          const userDoc = await getDoc(doc(db, 'users', friendId));
          const userData = userDoc.data();
          currentFriends.push({
            id: docSnapshot.id,
            friendId,
            username: userData?.username || 'Unknown',
            isOnline: false, // Would be determined by presence system
            status: 'オンライン'
          });
        } else if (data.status === 'pending' && data.requestedBy !== user.uid) {
          const userDoc = await getDoc(doc(db, 'users', friendId));
          const userData = userDoc.data();
          currentRequests.push({
            id: docSnapshot.id,
            requesterId: friendId,
            username: userData?.username || 'Unknown'
          });
        }
      });

      await Promise.all(friendshipPromises);
      setFriends(currentFriends);
      setFriendRequests(currentRequests);
    });

    return () => unsubscribe();
  }, [user]);

  const acceptRequest = async (requestId: string) => {
    await updateDoc(doc(db, 'friendships', requestId), { 
      status: 'accepted' 
    });
  };

  const declineRequest = async (requestId: string) => {
    await deleteDoc(doc(db, 'friendships', requestId));
  };

  return {
    friends,
    friendRequests,
    acceptRequest,
    declineRequest
  };
};
