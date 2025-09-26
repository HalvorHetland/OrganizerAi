import React, { useState } from 'react';
import { Member } from '../types';
import { UsersIcon, PlusIcon, TrashIcon } from './IconComponents';
import MemberAvatar from './MemberAvatar';

interface GroupMembersProps {
  members: Member[];
  onAddMember: (name: string) => void;
  onRemoveMember: (id: number) => void;
}

const GroupMembers: React.FC<GroupMembersProps> = ({ members, onAddMember, onRemoveMember }) => {
  const [newMemberName, setNewMemberName] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemberName.trim()) {
      onAddMember(newMemberName.trim());
      setNewMemberName('');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 h-full flex flex-col">
      <div className="flex items-center mb-4">
        <UsersIcon className="h-8 w-8 text-pink-400 dark:text-pink-300 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Project Group</h2>
      </div>
      <div className="space-y-3 overflow-y-auto pr-2 flex-1 mb-4">
        {members.map((member) => (
          <div key={member.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 flex items-center justify-between">
            <div className="flex items-center">
              <MemberAvatar member={member} size="medium" />
              <p className="font-semibold text-gray-900 dark:text-white ml-3">{member.name}</p>
            </div>
            {member.name !== 'Me' && (
                <button
                    onClick={() => onRemoveMember(member.id)}
                    className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                    aria-label={`Remove ${member.name}`}
                >
                    <TrashIcon className="h-5 w-5" />
                </button>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleAddSubmit} className="flex items-center space-x-2 border-t border-gray-200 dark:border-gray-700 pt-4">
        <input
          type="text"
          value={newMemberName}
          onChange={(e) => setNewMemberName(e.target.value)}
          placeholder="Add new member..."
          className="flex-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-900 dark:text-white"
        />
        <button
          type="submit"
          className="p-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 disabled:bg-pink-300 dark:disabled:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400 transition-colors"
          disabled={!newMemberName.trim()}
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default GroupMembers;