export interface ChatUser {
  id: string;
  username: string;
  displayName: string;
  isOnline: boolean;
  status: string;
}

export interface FriendRequest {
  id: string;
  requesterId: string;
  username: string;
}

export interface Friend {
  id: string;
  friendId: string;
  username: string;
  isOnline: boolean;
  status: string;
}

export interface GroupChat {
  id: string;
  name: string;
  memberCount: number;
  hasNewMessages: boolean;
}
