import React from 'react';
import { ScheduleEvent, Member } from '../types';
import { CalendarIcon } from './IconComponents';
import MemberAvatar from './MemberAvatar';

interface ScheduleViewProps {
  events: ScheduleEvent[];
  members: Member[];
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ events, members }) => {
    const sortedEvents = [...events].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
    });

  const getAttendees = (attendeeIds: number[]): Member[] => {
    return attendeeIds.map(id => members.find(m => m.id === id)).filter(Boolean) as Member[];
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 h-full flex flex-col">
      <div className="flex items-center mb-4">
        <CalendarIcon className="h-7 w-7 sm:h-8 sm:w-8 text-custom-primary-light dark:text-custom-secondary mr-3" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Schedule</h2>
      </div>
      <div className="space-y-4 overflow-y-auto pr-2 flex-1">
        {sortedEvents.length > 0 ? (
          sortedEvents.map((event) => {
            const attendees = getAttendees(event.attendees);
            return (
              <div key={event.id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 flex flex-col">
                <div className="flex items-start w-full">
                  <div className="w-20 text-right mr-4 flex-shrink-0">
                      <p className="font-bold text-custom-primary dark:text-custom-secondary">{event.time}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{event.date}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{event.title}</p>
                  </div>
                </div>
                {attendees.length > 0 && (
                  <div className="flex items-center justify-end mt-2 pt-2 border-t border-gray-200 dark:border-gray-700/50">
                      <div className="flex -space-x-2">
                          {attendees.map(member => <MemberAvatar key={member.id} member={member} size="small" />)}
                      </div>
                  </div>
                )}
              </div>
            )
          })
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            Your schedule is empty. Ask the assistant to add an event.
          </p>
        )}
      </div>
    </div>
  );
};

export default ScheduleView;