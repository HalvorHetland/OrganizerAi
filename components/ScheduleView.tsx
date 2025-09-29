import React from 'react';
import { ScheduleEvent, Member, NotificationTime } from '../types';
import { CalendarIcon, TrashIcon, PlusIcon, PencilIcon, BellIcon } from './IconComponents';
import MemberAvatar from './MemberAvatar';

interface ScheduleViewProps {
  events: ScheduleEvent[];
  members: Member[];
  onDeleteEvent: (id: number) => void;
  onAdd: () => void;
  onEdit: (event: ScheduleEvent) => void;
  notificationTime: NotificationTime;
  t: (key: string) => string;
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ events, members, onDeleteEvent, onAdd, onEdit, notificationTime, t }) => {
    const sortedEvents = [...events].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
    });

  const getAttendees = (attendeeIds: number[]): Member[] => {
    return attendeeIds.map(id => members.find(m => m.id === id)).filter(Boolean) as Member[];
  };

  const isHappeningSoon = (dateStr: string, timeStr: string): boolean => {
    if (!notificationTime) return false;

    const eventDateTime = new Date(`${dateStr}T${timeStr}`);
    const now = new Date();
    
    const diffMillis = eventDateTime.getTime() - now.getTime();
    if (diffMillis < 0) return false;

    let thresholdMillis;
    switch (notificationTime.timeUnit) {
      case 'days':
        thresholdMillis = notificationTime.timeValue * 24 * 60 * 60 * 1000;
        break;
      case 'hours':
        thresholdMillis = notificationTime.timeValue * 60 * 60 * 1000;
        break;
      case 'minutes':
        thresholdMillis = notificationTime.timeValue * 60 * 1000;
        break;
      default:
        return false;
    }

    return diffMillis <= thresholdMillis;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2">
         <div className="flex items-center mb-3 sm:mb-0">
            <CalendarIcon className="h-7 w-7 sm:h-8 sm:w-8 text-custom-primary-light dark:text-custom-secondary mr-3" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{t('schedule')}</h2>
            <button
                onClick={onAdd}
                className="ml-4 p-1.5 text-white bg-custom-primary hover:bg-custom-primary-dark rounded-full transition-colors"
                aria-label={t('addNewEvent')}
            >
                <PlusIcon className="h-5 w-5" />
            </button>
         </div>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 flex items-center pl-1">
          <BellIcon className="h-4 w-4 mr-2"/> 
          <span>Notifications set for <b>{notificationTime.timeValue} {t(notificationTime.timeUnit)}</b> {t('notificationUnitEvent')}</span>
       </div>
      <div className="space-y-4 overflow-y-auto pr-2 flex-1">
        {sortedEvents.length > 0 ? (
          sortedEvents.map((event) => {
            const attendees = getAttendees(event.attendees);
            const happeningSoon = isHappeningSoon(event.date, event.time);
            return (
              <div key={event.id} className={`p-4 rounded-lg flex flex-col group transition-all duration-300 ${
                  happeningSoon
                  ? 'bg-custom-background-light dark:bg-custom-primary/30 border-l-4 border-custom-primary-light dark:border-custom-secondary'
                  : 'bg-gray-50 dark:bg-gray-700/50'
              }`}>
                <div className="flex items-start w-full">
                  <div className="w-20 text-right mr-4 flex-shrink-0">
                      <p className="font-bold text-custom-primary dark:text-custom-secondary">{event.time}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{event.date}</p>
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-900 dark:text-white flex items-center">
                      {event.title}
                      {happeningSoon && <BellIcon className="h-4 w-4 text-custom-primary dark:text-custom-secondary animate-pulse ml-2" />}
                    </p>
                  </div>
                   <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                        <button
                            onClick={() => onEdit(event)}
                            className="p-1 text-gray-400 hover:text-custom-primary dark:hover:text-custom-secondary rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                            aria-label={`${t('editEvent')}: ${event.title}`}
                        >
                            <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => onDeleteEvent(event.id)}
                            className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                            aria-label={`${t('deleteEvent')}: ${event.title}`}
                        >
                            <TrashIcon className="h-5 w-5" />
                        </button>
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
            {t('emptySchedule')}
          </p>
        )}
      </div>
    </div>
  );
};

export default ScheduleView;
