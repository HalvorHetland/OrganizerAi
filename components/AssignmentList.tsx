import React, { useState, useMemo } from 'react';
import { Assignment, NotificationSetting, Member } from '../types';
import { ClipboardCheckIcon, BellIcon } from './IconComponents';
import MemberAvatar from './MemberAvatar';

interface AssignmentListProps {
  assignments: Assignment[];
  members: Member[];
  onToggleComplete: (id: number) => void;
  notificationSetting: NotificationSetting;
  currentUserId: number;
}

const AssignmentList: React.FC<AssignmentListProps> = ({ assignments, members, onToggleComplete, notificationSetting, currentUserId }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'my' | 'group'>('all');
  
  const sortedAssignments = useMemo(() => 
    [...assignments].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()),
  [assignments]);
  
  const filteredAssignments = useMemo(() => {
      if (activeFilter === 'my') {
          return sortedAssignments.filter(a => a.assignees.includes(currentUserId));
      }
      if (activeFilter === 'group') {
          return sortedAssignments.filter(a => a.assignees.length > 1);
      }
      return sortedAssignments;
  }, [sortedAssignments, activeFilter, currentUserId]);

  const isDueSoon = (dueDateStr: string): boolean => {
    if (!notificationSetting) return false;

    const dueDate = new Date(dueDateStr);
    const now = new Date();
    dueDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    
    const diffMillis = dueDate.getTime() - now.getTime();
    if (diffMillis < 0) return false;

    let thresholdMillis = notificationSetting.timeValue * 60 * 60 * 1000;
    if (notificationSetting.timeUnit === 'days') {
      thresholdMillis *= 24;
    }

    return diffMillis <= thresholdMillis;
  };

  const getAssignees = (assigneeIds: number[]): Member[] => {
    return assigneeIds.map(id => members.find(m => m.id === id)).filter(Boolean) as Member[];
  };

  const FilterButton: React.FC<{filterType: 'all' | 'my' | 'group', label: string}> = ({ filterType, label }) => (
    <button
      onClick={() => setActiveFilter(filterType)}
      className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
        activeFilter === filterType 
        ? 'bg-pink-500 text-white' 
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      {label}
    </button>
  );

  const emptyStateMessages = {
    all: "No assignments yet. Ask the assistant to add one!",
    my: "You have no individual assignments.",
    group: "There are no group assignments yet."
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-1">
         <div className="flex items-center">
            <ClipboardCheckIcon className="h-8 w-8 text-pink-400 dark:text-pink-300 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Assignments</h2>
         </div>
         <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700/50 p-1 rounded-lg">
            <FilterButton filterType="all" label="All" />
            <FilterButton filterType="my" label="My Assignments" />
            <FilterButton filterType="group" label="Group" />
         </div>
      </div>
       <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 flex items-center pl-1">
          <BellIcon className="h-4 w-4 mr-2"/> 
          <span>Notifications set for <b>{notificationSetting.timeValue} {notificationSetting.timeUnit}</b> before due date.</span>
       </div>
      <div className="space-y-4 overflow-y-auto pr-2 flex-1">
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map((assignment) => {
            const dueSoon = !assignment.isCompleted && isDueSoon(assignment.dueDate);
            const assignees = getAssignees(assignment.assignees);
            return (
                <div
                    key={assignment.id}
                    className={`p-4 rounded-lg flex flex-col transition-all duration-300 ${
                        assignment.isCompleted
                        ? 'bg-green-100 dark:bg-green-900/50'
                        : dueSoon 
                        ? 'bg-pink-100 dark:bg-pink-900/40 border-l-4 border-pink-400 dark:border-pink-300'
                        : 'bg-gray-50 dark:bg-gray-700/50'
                    }`}
                >
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={assignment.isCompleted}
                                onChange={() => onToggleComplete(assignment.id)}
                                className="h-5 w-5 rounded border-gray-300 text-pink-500 focus:ring-pink-400 cursor-pointer flex-shrink-0"
                            />
                            <div className="ml-4">
                                <p className={`font-semibold text-gray-900 dark:text-white ${assignment.isCompleted ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                                    {assignment.name}
                                </p>
                                <p className={`text-sm text-gray-500 dark:text-gray-400 ${assignment.isCompleted ? 'line-through' : ''}`}>
                                    Due: {assignment.dueDate}
                                </p>
                            </div>
                        </div>
                        {dueSoon && <BellIcon className="h-5 w-5 text-pink-500 dark:text-pink-300 animate-pulse" />}
                    </div>
                    {assignees.length > 0 && (
                        <div className="flex items-center justify-end mt-2 pt-2 border-t border-gray-200 dark:border-gray-700/50">
                            <div className="flex -space-x-2">
                                {assignees.map(member => <MemberAvatar key={member.id} member={member} isCurrentUser={member.id === currentUserId} size="small" />)}
                            </div>
                        </div>
                    )}
                </div>
            )
          })
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            {emptyStateMessages[activeFilter]}
          </p>
        )}
      </div>
    </div>
  );
};

export default AssignmentList;