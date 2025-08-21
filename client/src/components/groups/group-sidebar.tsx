import { useState } from 'react';
import { Plus, Users, Settings, Crown, LogOut, Check, X } from 'lucide-react';
import { useGroups } from '@/hooks/use-groups';
import { useAuth } from '@/hooks/use-auth';
import { Group, GroupInvite } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface GroupSidebarProps {
  selectedGroup: Group | null;
  onGroupSelect: (group: Group) => void;
}

export const GroupSidebar: React.FC<GroupSidebarProps> = ({ selectedGroup, onGroupSelect }) => {
  const { user } = useAuth();
  const { groups, invites, loading, createGroup, acceptInvite, rejectInvite, leaveGroup, deleteGroup } = useGroups();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleCreateGroup = async () => {
    if (!groupName.trim() || creating) return;

    setCreating(true);
    try {
      await createGroup(groupName.trim(), groupDescription.trim() || undefined, isPrivate);
      setGroupName('');
      setGroupDescription('');
      setIsPrivate(false);
      setIsCreateDialogOpen(false);
    } finally {
      setCreating(false);
    }
  };

  const handleAcceptInvite = async (invite: GroupInvite) => {
    await acceptInvite(invite.id, invite.groupId);
  };

  const handleRejectInvite = async (invite: GroupInvite) => {
    await rejectInvite(invite.id);
  };

  const handleLeaveGroup = async (group: Group) => {
    if (confirm(`「${group.name}」グループから脱退しますか？`)) {
      await leaveGroup(group.id);
      if (selectedGroup?.id === group.id) {
        onGroupSelect(null as any);
      }
    }
  };

  const handleDeleteGroup = async (group: Group) => {
    if (confirm(`「${group.name}」グループを削除しますか？この操作は取り消せません。`)) {
      await deleteGroup(group.id);
      if (selectedGroup?.id === group.id) {
        onGroupSelect(null as any);
      }
    }
  };

  if (loading) {
    return (
      <div className="w-80 bg-[hsl(var(--gaming-sidebar))] border-r border-gray-700 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-10 bg-gray-700 rounded"></div>
          <div className="space-y-2">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-12 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-[hsl(var(--gaming-sidebar))] border-r border-gray-700 p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg text-white">グループチャット</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-gray-700"
              data-testid="button-create-group"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[hsl(var(--gaming-panel))] border-gray-600 text-white">
            <DialogHeader>
              <DialogTitle>新しいグループを作成</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="group-name">グループ名</Label>
                <Input
                  id="group-name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="グループ名を入力"
                  className="bg-[hsl(var(--gaming-dark))] border-gray-600 text-white"
                  data-testid="input-group-name"
                />
              </div>
              <div>
                <Label htmlFor="group-description">説明（任意）</Label>
                <Textarea
                  id="group-description"
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  placeholder="グループの説明を入力"
                  className="bg-[hsl(var(--gaming-dark))] border-gray-600 text-white"
                  rows={3}
                  data-testid="textarea-group-description"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="private-group"
                  checked={isPrivate}
                  onCheckedChange={(checked) => setIsPrivate(checked as boolean)}
                  data-testid="checkbox-private"
                />
                <Label htmlFor="private-group" className="text-sm">非公開グループ</Label>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCreateGroup}
                  disabled={!groupName.trim() || creating}
                  className="flex-1 bg-[hsl(var(--gaming-accent))] hover:bg-blue-600"
                  data-testid="button-create-confirm"
                >
                  {creating ? '作成中...' : '作成'}
                </Button>
                <Button
                  onClick={() => setIsCreateDialogOpen(false)}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  data-testid="button-create-cancel"
                >
                  キャンセル
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Group Invitations */}
      {invites.length > 0 && (
        <div className="mb-4">
          <h3 className="font-medium text-sm text-gray-400 mb-2">招待</h3>
          <div className="space-y-2">
            {invites.map((invite) => (
              <div key={invite.id} className="bg-[hsl(var(--gaming-panel))] rounded-lg p-3 border border-blue-600/30">
                <div className="text-sm font-medium">グループ招待</div>
                <div className="text-xs text-gray-400 mb-2">招待者ID: {invite.inviterId}</div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleAcceptInvite(invite)}
                    className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1 h-auto"
                    data-testid={`button-accept-invite-${invite.id}`}
                  >
                    <Check className="w-3 h-3 mr-1" />
                    承認
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRejectInvite(invite)}
                    className="border-red-600 text-red-400 hover:bg-red-600/20 text-xs px-2 py-1 h-auto"
                    data-testid={`button-reject-invite-${invite.id}`}
                  >
                    <X className="w-3 h-3 mr-1" />
                    拒否
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Groups List */}
      <div className="flex-1 overflow-y-auto">
        <h3 className="font-medium text-sm text-gray-400 mb-2">マイグループ</h3>
        <div className="space-y-2">
          {groups.map((group) => (
            <div
              key={group.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedGroup?.id === group.id
                  ? 'bg-[hsl(var(--gaming-accent))]/20 border border-[hsl(var(--gaming-accent))]'
                  : 'bg-[hsl(var(--gaming-panel))] hover:bg-gray-700 border border-transparent'
              }`}
              onClick={() => onGroupSelect(group)}
              data-testid={`group-item-${group.id}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="font-medium text-sm">{group.name}</div>
                    {group.description && (
                      <div className="text-xs text-gray-400 truncate">{group.description}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {group.ownerId === user?.uid && (
                    <Crown className="w-3 h-3 text-yellow-400" />
                  )}
                  <div className="flex flex-col gap-1">
                    {group.ownerId === user?.uid ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteGroup(group);
                        }}
                        className="p-1 h-auto text-red-400 hover:text-red-300 hover:bg-red-600/20"
                        data-testid={`button-delete-group-${group.id}`}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLeaveGroup(group);
                        }}
                        className="p-1 h-auto text-gray-400 hover:text-gray-300 hover:bg-gray-600/20"
                        data-testid={`button-leave-group-${group.id}`}
                      >
                        <LogOut className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                メンバー数: {group.memberIds.length}
                {group.isPrivate && ' • 非公開'}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {groups.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <Users className="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <p className="mb-2">グループがありません</p>
          <p className="text-sm">新しいグループを作成してチームビルドを共有しましょう</p>
        </div>
      )}
    </div>
  );
};