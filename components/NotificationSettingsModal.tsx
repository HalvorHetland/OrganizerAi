import React, { useState, useEffect } from 'react';
import { NotificationSetting } from '../types';
import { BellIcon, CloseIcon } from './IconComponents';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newSetting: NotificationSetting) => void;
  currentSetting: NotificationSetting;
}

const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentSetting,
}) => {
  const [timeValue, setTimeValue] = useState(currentSetting.timeValue);
  const [timeUnit, setTimeUnit] = useState(currentSetting.timeUnit);

  useEffect(() => {
    if (isOpen) {
        setTimeValue(currentSetting.timeValue);
        setTimeUnit(currentSetting.timeUnit);
    }
  }, [currentSetting, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    onSave({ timeValue: Number(timeValue), timeUnit });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-md m-4 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <BellIcon className="h-6 w-6 text-custom-primary-light mr-3" />
            <h2 id="modal-title" className="text-2xl font-bold text-gray-800 dark:text-white">
              Notification Settings
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-primary-light dark:focus:ring-offset-gray-800"
            aria-label="Close settings"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Set how far in advance you want to be reminded about assignment deadlines.
        </p>

        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-700 dark:text-gray-300 font-medium">Remind me before deadline:</span>
            <div className="flex items-center mt-2 space-x-3">
              <input
                type="number"
                value={timeValue}
                onChange={(e) => setTimeValue(Number(e.target.value))}
                min="1"
                className="w-24 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-primary-light text-gray-900 dark:text-white"
              />
              <select
                value={timeUnit}
                onChange={(e) => setTimeUnit(e.target.value as 'days' | 'hours')}
                className="p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-primary-light text-gray-900 dark:text-white"
              >
                <option value="days">Days</option>
                <option value="hours">Hours</option>
              </select>
            </div>
          </label>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-offset-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg text-white bg-custom-primary hover:bg-custom-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-primary-light dark:focus:ring-offset-gray-800"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettingsModal;