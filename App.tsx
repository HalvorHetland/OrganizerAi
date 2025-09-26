import React, { useState, useCallback, useEffect } from 'react';
import { Assignment, ScheduleEvent, Message, ChatMessage, NotificationSetting, Member } from './types';
import { sendMessageToGemini } from './services/geminiService';
import { GraduationCapIcon, BellIcon, ChatBubbleIcon, ClipboardCheckIcon, CalendarIcon, UsersIcon, UserIcon, MoonIcon, SunIcon } from './components/IconComponents';
import AssignmentList from './components/AssignmentList';
import ScheduleView from './components/ScheduleView';
import ChatInterface from './components/ChatInterface';
import NotificationSettingsModal from './components/NotificationSettingsModal';
import GroupMembers from './components/GroupMembers';
import Login from './components/Login';
import ProfilePage from './components/ProfilePage';
import { GenerateContentResponse } from '@google/genai';

type Page = 'chat' | 'assignments' | 'schedule' | 'group' | 'profile';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<Member | null>(null);

  const [members, setMembers] = useState<Member[]>([
    { id: 1, name: "Me", email: "me@university.edu", profilePictureUrl: "https://i.pravatar.cc/150?u=me" },
    { id: 2, name: "Alice", email: "alice@university.edu", profilePictureUrl: "https://i.pravatar.cc/150?u=alice" }
  ]);

  const [assignments, setAssignments] = useState<Assignment[]>([
    {id: 1, name: "Calculus Homework", dueDate: "2024-09-15", isCompleted: false, assignees: [1]},
    {id: 2, name: "History Essay Draft", dueDate: "2024-09-20", isCompleted: true, assignees: [2]},
    {id: 3, name: "Group Project Proposal", dueDate: "2024-09-22", isCompleted: false, assignees: [1, 2]},
  ]);
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>([
    {id: 1, title: "Study Group for Physics", date: "2024-09-14", time: "15:00", attendees: [1, 2]},
    {id: 2, title: "Professor's Office Hours", date: "2024-09-16", time: "11:30", attendees: [1]},
  ]);
  const [messages, setMessages] = useState<Message[]>([
      {role: 'model', text: "Hello! I'm your student organizer assistant. You can add assignments for your group, schedule events, and manage your team members."}
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationSetting, setNotificationSetting] = useState<NotificationSetting>({ timeValue: 2, timeUnit: 'days' });
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [activePage, setActivePage] = useState<Page>('chat');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleLogin = () => {
      const user = members.find(m => m.id === 1); // Simulate logging in user "Me"
      if (user) {
          setCurrentUser(user);
          setIsAuthenticated(true);
      }
  };

  const handleUpdateProfile = (updatedUser: Member) => {
    setCurrentUser(updatedUser);
    setMembers(prev => prev.map(m => m.id === updatedUser.id ? updatedUser : m));
    // Also update the "Me" user's name if it was changed
    if (updatedUser.id === 1) {
        setMembers(prev => prev.map(m => m.id === 1 ? {...m, name: updatedUser.name} : m))
    }
  };

  const handleToggleAssignment = (id: number) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isCompleted: !a.isCompleted } : a))
    );
  };

  const handleAddMember = (name: string) => {
    if (name.trim() && !members.find(m => m.name.toLowerCase() === name.toLowerCase())) {
        const newMember: Member = { 
            id: Date.now(), 
            name, 
            email: `${name.toLowerCase()}@university.edu`,
            profilePictureUrl: `https://i.pravatar.cc/150?u=${name}`
        };
        setMembers(prev => [...prev, newMember]);
        return `Successfully added ${name} to the group.`;
    }
    return `${name} is already in the group or the name is invalid.`;
  };

  const handleRemoveMember = (id: number) => {
      let memberName = '';
      setMembers(prev => prev.filter(m => {
          if (m.id === id) {
              memberName = m.name;
              return false;
          }
          return true;
      }));

      // Also remove member from assignments and schedules
      setAssignments(prev => prev.map(a => ({...a, assignees: a.assignees.filter(assigneeId => assigneeId !== id) })));
      setScheduleEvents(prev => prev.map(e => ({...e, attendees: e.attendees.filter(attendeeId => attendeeId !== id) })));
      
      return `Successfully removed ${memberName} from the group.`;
  };

  const handleSaveNotificationSettings = (newSetting: NotificationSetting) => {
    setNotificationSetting(newSetting);
    setMessages(prev => [...prev, {
      role: 'model',
      text: `OK! I've updated your notification preferences to ${newSetting.timeValue} ${newSetting.timeUnit} before a deadline.`
    }]);
  };

  const getMemberIdsFromNames = (names: string[]): number[] => {
      if (!names || names.length === 0 || !currentUser) return [];
      return names
          .map(name => {
              if (name.toLowerCase() === 'me') return currentUser.id;
              return members.find(m => m.name.toLowerCase() === name.toLowerCase())?.id
          })
          .filter(Boolean) as number[];
  };

  const processFunctionCall = (response: GenerateContentResponse) => {
    const functionCalls = response.functionCalls;

    if (!functionCalls || functionCalls.length === 0 || !currentUser) {
      return null;
    }

    const functionCall = functionCalls[0];
    const { name, args } = functionCall;
    let functionResultText = "";

    switch (name) {
      case 'addAssignment':
        // Fix: Cast unknown `args` properties to their expected types.
        const assigneeIds = getMemberIdsFromNames((args.assignees as string[]) || []);
        // Fix: Cast unknown `args.assignees` to access `length` property.
        if (assigneeIds.length === 0 && (!args.assignees || (args.assignees as string[]).length === 0)) {
            assigneeIds.push(currentUser.id); // Default to current user
        }
        // Fix: Cast `args.name` and `args.dueDate` to string.
        setAssignments(prev => [...prev, { id: Date.now(), name: args.name as string, dueDate: args.dueDate as string, isCompleted: false, assignees: assigneeIds }]);
        functionResultText = `Successfully added assignment: ${args.name as string}`;
        break;
      case 'completeAssignment':
        let assignmentFound = false;
        setAssignments(prev => prev.map(a => {
            // Fix: Cast unknown `args.name` to string before calling `toLowerCase`.
            if (a.name.toLowerCase() === (args.name as string).toLowerCase()) {
                assignmentFound = true;
                return { ...a, isCompleted: true };
            }
            return a;
        }));
        functionResultText = assignmentFound ? `Successfully marked '${args.name as string}' as complete.` : `Assignment '${args.name as string}' not found.`;
        break;
      case 'listAssignments':
        let assignmentsToList = assignments;
        if (args.filter === 'my') {
            assignmentsToList = assignments.filter(a => a.assignees.includes(currentUser.id));
        } else if (args.filter === 'group') {
            assignmentsToList = assignments.filter(a => a.assignees.length > 1);
        }
        functionResultText = JSON.stringify(assignmentsToList.map(a => ({...a, assignees: a.assignees.map(id => members.find(m=>m.id === id)?.name)})));
        break;
      case 'addScheduleEvent':
        // Fix: Cast unknown `args.attendees` to string array.
        const attendeeIds = getMemberIdsFromNames((args.attendees as string[]) || []);
        // Fix: Cast unknown `args.attendees` to access `length` property.
         if (attendeeIds.length === 0 && (!args.attendees || (args.attendees as string[]).length === 0)) {
            attendeeIds.push(currentUser.id); // Default to current user
        }
        // Fix: Cast `args.title`, `args.date`, and `args.time` to string.
        setScheduleEvents(prev => [...prev, { id: Date.now(), title: args.title as string, date: args.date as string, time: args.time as string, attendees: attendeeIds }]);
        functionResultText = `Successfully added event: ${args.title as string}`;
        break;
      case 'listScheduleEvents':
        functionResultText = JSON.stringify(scheduleEvents.map(e => ({...e, attendees: e.attendees.map(id => members.find(m=>m.id === id)?.name)})));
        break;
      case 'addMember':
        // Fix: Cast unknown `args.name` to string.
        functionResultText = handleAddMember(args.name as string);
        break;
      case 'removeMember':
        // Fix: Cast unknown `args.name` to string before calling `toLowerCase`.
        const memberToRemove = members.find(m => m.name.toLowerCase() === (args.name as string).toLowerCase());
        if (memberToRemove) {
            functionResultText = handleRemoveMember(memberToRemove.id);
        } else {
            functionResultText = `Member '${args.name as string}' not found.`;
        }
        break;
      case 'getStudyTips':
        functionResultText = "Of course! Here are a few tips: 1. Use the Pomodoro Technique (25 mins study, 5 mins break). 2. Find a dedicated study space. 3. Test yourself with practice questions to reinforce learning.";
        break;
      case 'addNotificationPreference':
        const { timeValue, timeUnit } = args;
        if ((timeUnit === 'days' || timeUnit === 'hours') && typeof timeValue === 'number') {
            // Fix: Cast `timeUnit` to the expected literal type.
            setNotificationSetting({ timeValue, timeUnit: timeUnit as 'days' | 'hours' });
            functionResultText = `Notification preference updated to ${timeValue} ${timeUnit} before deadline.`;
        } else {
            functionResultText = `Invalid time unit or value. Please use 'days' or 'hours'.`;
        }
        break;
      default:
        functionResultText = `Unknown function: ${name}`;
    }

    return {
        role: "tool",
        parts: [{
            functionResponse: {
                name,
                response: {
                    content: functionResultText,
                }
            }
        }]
    };
  };

  const handleSendMessage = useCallback(async (text: string) => {
    setIsLoading(true);
    const userMessage: Message = { role: 'user', text };
    setMessages(prev => [...prev, userMessage]);

    const chatHistory: ChatMessage[] = messages.map(msg => ({
      role: msg.role === 'tool' ? 'model' : msg.role, 
      parts: [{ text: msg.text }]
    }));
    chatHistory.push({ role: 'user', parts: [{ text }] });

    try {
      let response = await sendMessageToGemini(chatHistory as any);
      let functionResponsePart = processFunctionCall(response);
      
      while (functionResponsePart) {
          const toolMessage: Message = { role: 'tool', text: functionResponsePart.parts[0].functionResponse.response.content as string };
          // FIX: The userMessage is already added to the message list. Avoid adding it again.
          setMessages(prev => [...prev, toolMessage]);

          const newHistory = [...chatHistory, {
              role: 'model',
              parts: response.candidates?.[0].content.parts || []
          }, {
              // FIX: The role for a function response must be 'tool'.
              role: 'tool',
              parts: functionResponsePart.parts,
          }];

          response = await sendMessageToGemini(newHistory as any);
          functionResponsePart = processFunctionCall(response);
      }

      const modelResponseText = response.text;
      const modelMessage: Message = { role: 'model', text: modelResponseText };
      setMessages(prev => [...prev, modelMessage]);

    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage: Message = { role: 'model', text: "Sorry, I encountered an error. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, assignments, scheduleEvents, notificationSetting, members, currentUser]);

  const NavLink: React.FC<{
    page: Page;
    label: string;
    // FIX: Specify that the icon component accepts a className prop to fix cloneElement error.
    icon: React.ReactElement<{ className?: string }>;
  }> = ({ page, label, icon }) => (
    <button
      onClick={() => setActivePage(page)}
      className={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
        activePage === page
          ? 'bg-pink-500 text-white'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
      }`}
    >
      {React.cloneElement(icon, { className: 'h-6 w-6 mr-4' })}
      <span className="font-medium">{label}</span>
    </button>
  );

  const renderContent = () => {
    if (!currentUser) return null;
    switch (activePage) {
      case 'assignments':
        return <AssignmentList assignments={assignments} members={members} onToggleComplete={handleToggleAssignment} notificationSetting={notificationSetting} currentUserId={currentUser.id} />;
      case 'schedule':
        return <ScheduleView events={scheduleEvents} members={members} />;
      case 'group':
        return <GroupMembers members={members} onAddMember={handleAddMember} onRemoveMember={handleRemoveMember} />;
       case 'profile':
        return <ProfilePage user={currentUser} onUpdateProfile={handleUpdateProfile} />;
      case 'chat':
      default:
        return <ChatInterface messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} />;
    }
  };

  const pageTitles: { [key in Page]: string } = {
    chat: 'Chat Assistant',
    assignments: 'Assignments',
    schedule: 'Schedule',
    group: 'Project Group',
    profile: 'My Profile'
  };

  if (!isAuthenticated) {
      return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen font-sans bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <aside className="w-64 bg-white dark:bg-gray-800 flex-col p-4 shadow-2xl hidden md:flex">
        <div className="flex items-center mb-8 px-2">
          <GraduationCapIcon className="h-10 w-10 text-pink-400" />
          <h1 className="ml-3 text-2xl font-bold text-gray-900 dark:text-white">Organizer AI</h1>
        </div>
        <nav className="flex flex-col space-y-2">
          <NavLink page="chat" label="Chat Assistant" icon={<ChatBubbleIcon />} />
          <NavLink page="assignments" label="Assignments" icon={<ClipboardCheckIcon />} />
          <NavLink page="schedule" label="Schedule" icon={<CalendarIcon />} />
          <NavLink page="group" label="Project Group" icon={<UsersIcon />} />
          <NavLink page="profile" label="Profile" icon={<UserIcon />} />
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {pageTitles[activePage]}
            </h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400 dark:focus:ring-offset-gray-800"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
              </button>
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400 dark:focus:ring-offset-gray-800"
                aria-label="Open notification settings"
              >
                <BellIcon className="h-6 w-6" />
              </button>
              <button onClick={() => setActivePage('profile')} className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400 rounded-full">
                  <img src={currentUser?.profilePictureUrl} alt="Profile" className="h-9 w-9 rounded-full object-cover" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {renderContent()}
        </main>
      </div>

      <NotificationSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSave={handleSaveNotificationSettings}
        currentSetting={notificationSetting}
      />
    </div>
  );
};

export default App;
