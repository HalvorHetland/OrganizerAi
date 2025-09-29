import React, { useState, useEffect } from 'react';
import { Assignment, Member } from '../types';
import { ClipboardCheckIcon, CloseIcon } from './IconComponents';

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assignment: Omit<Assignment, 'id' | 'isCompleted'> & { id?: number }) => void;
  assignmentToEdit?: Assignment | null;
  members: Member[];
}

const AssignmentModal: React.FC<AssignmentModalProps> = ({ isOpen, onClose, onSave, assignmentToEdit, members }) => {
  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assigneeIds, setAssigneeIds] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (assignmentToEdit) {
        setName(assignmentToEdit.name);
        setDueDate(assignmentToEdit.dueDate);
        setAssigneeIds(assignmentToEdit.assignees);
      } else {
        // Reset form for "add" mode
        setName('');
        setDueDate('');
        setAssigneeIds([]);
      }
    }
  }, [assignmentToEdit, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleAssigneeChange = (memberId: number) => {
    setAssigneeIds(prev =>
      prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]
    );
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dueDate) {
        alert("Please fill in all fields.");
        return;
    }
    onSave({
      id: assignmentToEdit?.id,
      name,
      dueDate,
      assignees: assigneeIds.length > 0 ? assigneeIds : [members.find(m => m.name === 'Me')?.id || 1], // Default to 'Me' if none selected
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-lg m-4 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <ClipboardCheckIcon className="h-6 w-6 text-custom-primary-light mr-3" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {assignmentToEdit ? 'Edit Assignment' : 'Add Assignment'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-primary-light dark:focus:ring-offset-gray-800"
            aria-label="Close"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
            <div className="space-y-4">
                <div>
                    <label htmlFor="assignment-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assignment Name</label>
                    <input
                        type="text"
                        id="assignment-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-primary-light text-gray-900 dark:text-white"
                    />
                </div>
                <div>
                    <label htmlFor="due-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
                    <input
                        type="date"
                        id="due-date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                        className="mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-primary-light text-gray-900 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assign To</label>
                    <div className="mt-2 space-y-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg max-h-40 overflow-y-auto">
                        {members.map(member => (
                            <div key={member.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`assignee-${member.id}`}
                                    checked={assigneeIds.includes(member.id)}
                                    onChange={() => handleAssigneeChange(member.id)}
                                    className="h-4 w-4 rounded border-gray-300 text-custom-primary focus:ring-custom-primary-light"
                                />
                                <label htmlFor={`assignee-${member.id}`} className="ml-3 text-sm text-gray-700 dark:text-gray-300">{member.name}</label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 rounded-lg text-white bg-custom-primary hover:bg-custom-primary-dark"
                >
                    {assignmentToEdit ? 'Save Changes' : 'Add Assignment'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentModal;