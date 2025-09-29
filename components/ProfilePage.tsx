import React, { useState, useRef } from 'react';
import { Member } from '../types';
import { UserIcon, CameraIcon } from './IconComponents';
import MemberAvatar from './MemberAvatar';

interface ProfilePageProps {
  user: Member;
  onUpdateProfile: (updatedUser: Member) => void;
  t: (key: string) => string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateProfile, t }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email || '');
  const [profilePic, setProfilePic] = useState(user.profilePictureUrl);
  const [language, setLanguage] = useState(user.language || 'en');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...user,
      name,
      email,
      profilePictureUrl: profilePic,
      language: language as 'en' | 'es' | 'fr',
    });
    alert('Profile updated successfully!');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 h-full">
      <div className="flex items-center mb-6">
        <UserIcon className="h-7 w-7 sm:h-8 sm:w-8 text-custom-primary-light dark:text-custom-secondary mr-3" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{t('myProfile')}</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="flex flex-col items-center space-y-4 mb-8">
            <div className="relative">
                <MemberAvatar member={{...user, profilePictureUrl: profilePic}} size="large" />
                 <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-custom-primary text-white rounded-full p-2 hover:bg-custom-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-primary-light dark:focus:ring-offset-gray-800"
                    aria-label={t('changeProfilePic')}
                >
                    <CameraIcon className="h-5 w-5" />
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />
            </div>
        </div>
        
        <div className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('name')}
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-primary-light text-gray-900 dark:text-white"
                />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('emailAddress')}
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-primary-light text-gray-900 dark:text-white"
                />
            </div>
            <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('language')}
                </label>
                <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as 'en' | 'es' | 'fr')}
                    className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-primary-light text-gray-900 dark:text-white"
                >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                </select>
            </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            className="w-full px-4 py-3 rounded-lg text-white font-semibold bg-custom-primary hover:bg-custom-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-primary-light dark:focus:ring-offset-gray-800"
          >
            {t('saveChanges')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
