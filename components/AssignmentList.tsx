import React, { useState, useMemo } from 'react';
import { Assignment, NotificationSetting, Member } from '../types';
import { ClipboardCheckIcon, BellIcon, TrashIcon } from './IconComponents';
import MemberAvatar from './MemberAvatar';

interface AssignmentListProps {
  assignments: Assignment[];
  members: Member[];
  onToggleComplete: (id: number) => void;
  onDeleteAssignment: (id: number) => void;
  notificationSetting: NotificationSetting;
  currentUserId: number;
}

const AssignmentList: React.FC<AssignmentListProps> = ({ assignments, members, onToggleComplete, onDeleteAssignment, notificationSetting, currentUserId }) => {
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
      className={`px-3 py-1 text-sm font-medium rounded-md transition-colors flex-1 sm:flex-initial text-center ${
        activeFilter === filterType 
        ? 'bg-custom-primary text-white' 
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      {label}
    </button>
  );

  const emptyStateMessages = {
    all: "No assignments yet. Ask the assistant to add one!",
    my: "You have no individual tasks.",
    group: "There are no group assignments yet."
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2">
         <div className="flex items-center mb-3 sm:mb-0">
            <ClipboardCheckIcon className="h-7 w-7 sm:h-8 sm:w-8 text-custom-primary-light dark:text-custom-secondary mr-3" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Assignments</h2>
         </div>
         <div className="flex items-center space-x-1 sm:space-x-2 bg-gray-100 dark:bg-gray-700/50 p-1 rounded-lg self-stretch sm:self-auto">
            <FilterButton filterType="all" label="All" />
            <FilterButton filterType="my" label="My Tasks" />
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
                    className={`p-4 rounded-lg flex flex-col transition-all duration-300 group ${
                        assignment.isCompleted
                        ? 'bg-green-100 dark:bg-green-900/50'
                        : dueSoon 
                        ? 'bg-custom-background-light dark:bg-custom-primary/30 border-l-4 border-custom-primary-light dark:border-custom-secondary'
                        : 'bg-gray-50 dark:bg-gray-700/50'
                    }`}
                >
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={assignment.isCompleted}
                                onChange={() => onToggleComplete(assignment.id)}
                                className="h-5 w-5 rounded border-gray-300 text-custom-primary focus:ring-custom-primary-light cursor-pointer flex-shrink-0"
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
                        <div className="flex items-center space-x-2">
                          {dueSoon && <BellIcon className="h-5 w-5 text-custom-primary dark:text-custom-secondary animate-pulse" />}
                          <button
                              onClick={() => onDeleteAssignment(assignment.id)}
                              className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                              aria-label={`Delete assignment: ${assignment.name}`}
                          >
                              <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
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