import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc, arrayUnion, arrayRemove, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './use-auth';
import { Group, GroupInvite } from '@shared/schema';

export const useGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [invites, setInvites] = useState<GroupInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load user's groups
  useEffect(() => {
    if (!user) {
      setGroups([]);
      setInvites([]);
      setLoading(false);
      return;
    }

    const groupsQuery = query(
      collection(db, 'groups'),
      where('memberIds', 'array-contains', user.uid),
      orderBy('createdAt', 'desc')
    );

    const invitesQuery = query(
      collection(db, 'groupInvites'),
      where('inviteeId', '==', user.uid),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeGroups = onSnapshot(groupsQuery, (snapshot) => {
      const groupsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Group[];
      setGroups(groupsList);
      setLoading(false);
    });

    const unsubscribeInvites = onSnapshot(invitesQuery, (snapshot) => {
      const invitesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as GroupInvite[];
      setInvites(invitesList);
    });

    return () => {
      unsubscribeGroups();
      unsubscribeInvites();
    };
  }, [user]);

  const createGroup = async (name: string, description?: string, isPrivate = false) => {
    if (!user) return;

    await addDoc(collection(db, 'groups'), {
      name,
      description,
      ownerId: user.uid,
      memberIds: [user.uid],
      isPrivate,
      createdAt: new Date()
    });
  };

  const inviteToGroup = async (groupId: string, inviteeId: string) => {
    if (!user) return;

    await addDoc(collection(db, 'groupInvites'), {
      groupId,
      inviterId: user.uid,
      inviteeId,
      status: 'pending',
      createdAt: new Date()
    });
  };

  const acceptInvite = async (inviteId: string, groupId: string) => {
    if (!user) return;

    // Update invite status
    await updateDoc(doc(db, 'groupInvites', inviteId), {
      status: 'accepted'
    });

    // Add user to group
    await updateDoc(doc(db, 'groups', groupId), {
      memberIds: arrayUnion(user.uid)
    });
  };

  const rejectInvite = async (inviteId: string) => {
    await updateDoc(doc(db, 'groupInvites', inviteId), {
      status: 'rejected'
    });
  };

  const leaveGroup = async (groupId: string) => {
    if (!user) return;

    await updateDoc(doc(db, 'groups', groupId), {
      memberIds: arrayRemove(user.uid)
    });
  };

  const deleteGroup = async (groupId: string) => {
    if (!user) return;
    
    const group = groups.find(g => g.id === groupId);
    if (group?.ownerId !== user.uid) return; // Only owner can delete

    await deleteDoc(doc(db, 'groups', groupId));
  };

  return {
    groups,
    invites,
    loading,
    createGroup,
    inviteToGroup,
    acceptInvite,
    rejectInvite,
    leaveGroup,
    deleteGroup
  };
};