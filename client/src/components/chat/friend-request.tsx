import { UserCheck, UserX } from 'lucide-react';
import { FriendRequest as FriendRequestType } from '@/types/chat';
import { Button } from '@/components/ui/button';

interface FriendRequestProps {
  request: FriendRequestType;
  onAccept: (requestId: string) => Promise<void>;
  onDecline: (requestId: string) => Promise<void>;
}

export const FriendRequest: React.FC<FriendRequestProps> = ({
  request,
  onAccept,
  onDecline
}) => {
  return (
    <div
      className="p-2 rounded-md bg-gray-700/50 mb-2"
      data-testid={`friend-request-${request.username}`}
    >
      <p className="text-sm font-medium">{request.username}</p>
      <div className="flex gap-2 mt-1">
        <Button
          onClick={() => onAccept(request.id)}
          size="sm"
          className="bg-green-600 hover:bg-green-700 p-1 rounded-full"
          data-testid={`button-accept-${request.username}`}
        >
          <UserCheck className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => onDecline(request.id)}
          size="sm"
          className="bg-red-600 hover:bg-red-700 p-1 rounded-full"
          data-testid={`button-decline-${request.username}`}
        >
          <UserX className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
