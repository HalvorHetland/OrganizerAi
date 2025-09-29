import React, { useState } from 'react';
import { Member } from '../types';
import { UsersIcon, PlusIcon, TrashIcon } from './IconComponents';
import MemberAvatar from './MemberAvatar';

interface GroupMembersProps {
  members: Member[];
  onAddMember: (name: string) => void;
  onRemoveMember: (id: number) => void;
  t: (key: string) => string;
}

const GroupMembers: React.FC<GroupMembersProps> = ({ members, onAddMember, onRemoveMember, t }) => {
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
        <UsersIcon className="h-7 w-7 sm:h-8 sm:w-8 text-custom-primary-light dark:text-custom-secondary mr-3" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{t('projectGroup')}</h2>
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
                    aria-label={`${t('removeMember')} ${member.name}`}
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
          placeholder={t('addNewMember')}
          className="flex-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-primary-light text-gray-900 dark:text-white"
        />
        <button
          type="submit"
          className="p-2 bg-custom-primary text-white rounded-full hover:bg-custom-primary-dark disabled:bg-custom-primary/50 dark:disabled:bg-custom-primary/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-primary-light transition-colors"
          disabled={!newMemberName.trim()}
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default GroupMembers;
