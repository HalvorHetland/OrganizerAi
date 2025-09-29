import React from 'react';
import { Member } from '../types';

const colorPalette = [
  'bg-red-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-purple-200', 'bg-custom-secondary',
  'dark:bg-red-800', 'dark:bg-blue-800', 'dark:bg-green-800', 'dark:bg-yellow-800', 'dark:bg-purple-800', 'dark:bg-custom-primary'
];

const textColorPalette = [
    'text-red-800', 'text-blue-800', 'text-green-800', 'text-yellow-800', 'text-purple-800', 'text-custom-primary-dark',
    'dark:text-red-100', 'dark:text-blue-100', 'dark:text-green-100', 'dark:text-yellow-100', 'dark:text-purple-100', 'dark:text-custom-background-light'
];

interface MemberAvatarProps {
    member: Member;
    isCurrentUser?: boolean;
    size?: 'small' | 'medium' | 'large';
}

const MemberAvatar: React.FC<MemberAvatarProps> = ({ member, isCurrentUser = false, size = 'medium' }) => {
    const sizeClasses = {
        small: 'w-7 h-7 text-xs',
        medium: 'w-10 h-10 text-sm',
        large: 'w-24 h-24 text-3xl'
    };

    if (member.profilePictureUrl) {
        return (
            <img
                src={member.profilePictureUrl}
                alt={member.name}
                title={member.name}
                className={`rounded-full object-cover ${sizeClasses[size]} ${isCurrentUser ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-custom-primary-light' : 'border-2 border-white dark:border-gray-800'}`}
            />
        );
    }

    const charCodeSum = member.name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const bgColor = colorPalette[charCodeSum % (colorPalette.length / 2)];
    const darkBgColor = colorPalette[(charCodeSum % (colorPalette.length / 2)) + (colorPalette.length / 2)];
    const textColor = textColorPalette[charCodeSum % (textColorPalette.length / 2)];
    const darkTextColor = textColorPalette[(charCodeSum % (textColorPalette.length / 2)) + (textColorPalette.length / 2)];

    return (
        <div 
          title={member.name}
          className={`rounded-full flex items-center justify-center font-bold ${sizeClasses[size]} ${bgColor} ${darkBgColor} ${textColor} ${darkTextColor} ${isCurrentUser ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-custom-primary-light' : 'border-2 border-white dark:border-gray-800'}`}
        >
            {member.name.charAt(0).toUpperCase()}
        </div>
    );
};

export default MemberAvatar;