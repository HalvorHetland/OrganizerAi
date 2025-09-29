import React, { useState, useEffect } from 'react';
import { ScheduleEvent, Member } from '../types';
import { CalendarIcon, CloseIcon } from './IconComponents';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<ScheduleEvent, 'id'> & { id?: number }) => void;
  eventToEdit?: ScheduleEvent | null;
  members: Member[];
  t: (key: string) => string;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose, onSave, eventToEdit, members, t }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [attendeeIds, setAttendeeIds] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (eventToEdit) {
        setTitle(eventToEdit.title);
        setDate(eventToEdit.date);
        setTime(eventToEdit.time);
        setAttendeeIds(eventToEdit.attendees);
      } else {
        setTitle('');
        setDate('');
        setTime('');
        setAttendeeIds([]);
      }
    }
  }, [eventToEdit, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleAttendeeChange = (memberId: number) => {
    setAttendeeIds(prev =>
      prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time) {
        alert("Please fill in all fields.");
        return;
    }
    onSave({
      id: eventToEdit?.id,
      title,
      date,
      time,
      attendees: attendeeIds.length > 0 ? attendeeIds : [members.find(m => m.name === 'Me')?.id || 1], // Default to 'Me' if none selected
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-lg m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <CalendarIcon className="h-6 w-6 text-custom-primary-light mr-3" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {eventToEdit ? t('editEventTitle') : t('addEvent')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Close"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
            <div className="space-y-4">
                <div>
                    <label htmlFor="event-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('eventTitle')}</label>
                    <input
                        type="text"
                        id="event-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-primary-light"
                    />
                </div>
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label htmlFor="event-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('date')}</label>
                        <input
                            type="date"
                            id="event-date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            className="mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-primary-light"
                        />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="event-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('time')}</label>
                        <input
                            type="time"
                            id="event-time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                            className="mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-primary-light"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('attendees')}</label>
                    <div className="mt-2 space-y-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg max-h-40 overflow-y-auto">
                        {members.map(member => (
                            <div key={member.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`attendee-${member.id}`}
                                    checked={attendeeIds.includes(member.id)}
                                    onChange={() => handleAttendeeChange(member.id)}
                                    className="h-4 w-4 rounded border-gray-300 text-custom-primary focus:ring-custom-primary-light"
                                />
                                <label htmlFor={`attendee-${member.id}`} className="ml-3 text-sm text-gray-700 dark:text-gray-300">{member.name}</label>
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
                    {t('cancel')}
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 rounded-lg text-white bg-custom-primary hover:bg-custom-primary-dark"
                >
                    {eventToEdit ? t('saveChangesBtn') : t('addEventBtn')}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;
