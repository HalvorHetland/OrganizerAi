
type TranslationKeys = {
  [key: string]: string;
};

type Translations = {
  en: TranslationKeys;
  es: TranslationKeys;
  fr: TranslationKeys;
};

export const translations: Translations = {
  en: {
    // App/Nav
    organizerAI: 'Organizer AI',
    chatAssistant: 'Chat Assistant',
    assignments: 'Assignments',
    schedule: 'Schedule',
    projectGroup: 'Project Group',
    profile: 'Profile',
    tasks: 'Tasks', // mobile nav
    group: 'Group', // mobile nav
    toggleTheme: 'Toggle theme',
    openNotifications: 'Open notification settings',

    // Login
    smartAssistant: 'Your smart student assistant.',
    emailAddress: 'Email address',
    password: 'Password',
    logIn: 'Log in',

    // Chat
    chatSubheader: 'How can I help you organize your day?',
    disableSpeech: 'Disable automatic speech',
    enableSpeech: 'Enable automatic speech',
    readAloud: 'Read message aloud',
    useMic: 'Use microphone',
    listening: 'Listening...',
    askPlaceholder: 'Ask me to add an assignment...',
    
    // Assignments
    myTasks: 'My Tasks',
    all: 'All',
    notificationUnit: 'before due date.',
    emptyAssignmentsAll: 'No assignments yet. Ask the assistant to add one!',
    emptyAssignmentsMy: 'You have no individual tasks.',
    emptyAssignmentsGroup: 'There are no group assignments yet.',
    due: 'Due:',
    editAssignment: 'Edit Assignment',
    deleteAssignment: 'Delete Assignment',
    addNewAssignment: 'Add new assignment',

    // Schedule
    notificationUnitEvent: 'before event.',
    emptySchedule: 'Your schedule is empty. Ask the assistant to add an event.',
    editEvent: 'Edit event',
    deleteEvent: 'Delete event',
    addNewEvent: 'Add new event',
    
    // Group
    addNewMember: 'Add new member...',
    removeMember: 'Remove',
    
    // Profile
    myProfile: 'My Profile',
    changeProfilePic: 'Change profile picture',
    name: 'Name',
    saveChanges: 'Save Changes',
    language: 'Language',
    
    // Modals
    cancel: 'Cancel',
    // Notification Modal
    notificationSettings: 'Notification Settings',
    closeSettings: 'Close settings',
    assignmentDeadlines: 'Assignment Deadlines',
    assignmentDeadlinesDesc: 'Set when to be reminded about assignment deadlines.',
    scheduleEvents: 'Schedule Events',
    scheduleEventsDesc: 'Set when to be reminded about upcoming events.',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    saveSettings: 'Save Settings',
    // Assignment Modal
    addAssignment: 'Add Assignment',
    assignmentName: 'Assignment Name',
    dueDate: 'Due Date',
    assignTo: 'Assign To',
    addAssignmentBtn: 'Add Assignment',
    saveChangesBtn: 'Save Changes',
    // Schedule Modal
    addEvent: 'Add Event',
    editEventTitle: 'Edit Event',
    eventTitle: 'Event Title',
    date: 'Date',
    time: 'Time',
    attendees: 'Attendees',
    addEventBtn: 'Add Event',
  },
  es: {
    // App/Nav
    organizerAI: 'Organizador IA',
    chatAssistant: 'Asistente de Chat',
    assignments: 'Tareas',
    schedule: 'Horario',
    projectGroup: 'Grupo de Proyecto',
    profile: 'Perfil',
    tasks: 'Tareas',
    group: 'Grupo',
    toggleTheme: 'Cambiar tema',
    openNotifications: 'Abrir configuración de notificaciones',
    
    // Login
    smartAssistant: 'Tu asistente estudiantil inteligente.',
    emailAddress: 'Correo electrónico',
    password: 'Contraseña',
    logIn: 'Iniciar sesión',

    // Chat
    chatSubheader: '¿Cómo puedo ayudarte a organizar tu día?',
    disableSpeech: 'Desactivar voz automática',
    enableSpeech: 'Activar voz automática',
    readAloud: 'Leer mensaje en voz alta',
    useMic: 'Usar micrófono',
    listening: 'Escuchando...',
    askPlaceholder: 'Pídeme que agregue una tarea...',

    // Assignments
    myTasks: 'Mis Tareas',
    all: 'Todas',
    notificationUnit: 'antes de la fecha de entrega.',
    emptyAssignmentsAll: 'Aún no hay tareas. ¡Pídele al asistente que agregue una!',
    emptyAssignmentsMy: 'No tienes tareas individuales.',
    emptyAssignmentsGroup: 'Aún no hay tareas de grupo.',
    due: 'Vence:',
    editAssignment: 'Editar Tarea',
    deleteAssignment: 'Eliminar Tarea',
    addNewAssignment: 'Agregar nueva tarea',

    // Schedule
    notificationUnitEvent: 'antes del evento.',
    emptySchedule: 'Tu horario está vacío. Pídele al asistente que agregue un evento.',
    editEvent: 'Editar evento',
    deleteEvent: 'Eliminar evento',
    addNewEvent: 'Agregar nuevo evento',
    
    // Group
    addNewMember: 'Agregar nuevo miembro...',
    removeMember: 'Eliminar',

    // Profile
    myProfile: 'Mi Perfil',
    changeProfilePic: 'Cambiar foto de perfil',
    name: 'Nombre',
    saveChanges: 'Guardar Cambios',
    language: 'Idioma',
    
    // Modals
    cancel: 'Cancelar',
    // Notification Modal
    notificationSettings: 'Configuración de Notificaciones',
    closeSettings: 'Cerrar configuración',
    assignmentDeadlines: 'Fechas de Entrega de Tareas',
    assignmentDeadlinesDesc: 'Establece cuándo recibir recordatorios para las tareas.',
    scheduleEvents: 'Eventos del Horario',
    scheduleEventsDesc: 'Establece cuándo recibir recordatorios para los próximos eventos.',
    days: 'Días',
    hours: 'Horas',
    minutes: 'Minutos',
    saveSettings: 'Guardar Configuración',
    // Assignment Modal
    addAssignment: 'Agregar Tarea',
    assignmentName: 'Nombre de la Tarea',
    dueDate: 'Fecha de Entrega',
    assignTo: 'Asignar A',
    addAssignmentBtn: 'Agregar Tarea',
    saveChangesBtn: 'Guardar Cambios',
    // Schedule Modal
    addEvent: 'Agregar Evento',
    editEventTitle: 'Editar Evento',
    eventTitle: 'Título del Evento',
    date: 'Fecha',
    time: 'Hora',
    attendees: 'Asistentes',
    addEventBtn: 'Agregar Evento',
  },
  fr: {
    // App/Nav
    organizerAI: 'Organisateur IA',
    chatAssistant: 'Assistant de Chat',
    assignments: 'Devoirs',
    schedule: 'Emploi du temps',
    projectGroup: 'Groupe de Projet',
    profile: 'Profil',
    tasks: 'Tâches',
    group: 'Groupe',
    toggleTheme: 'Changer de thème',
    openNotifications: 'Ouvrir les paramètres de notification',

    // Login
    smartAssistant: 'Votre assistant étudiant intelligent.',
    emailAddress: 'Adresse e-mail',
    password: 'Mot de passe',
    logIn: 'Se connecter',

    // Chat
    chatSubheader: 'Comment puis-je vous aider à organiser votre journée ?',
    disableSpeech: 'Désactiver la parole automatique',
    enableSpeech: 'Activer la parole automatique',
    readAloud: 'Lire le message à haute voix',
    useMic: 'Utiliser le microphone',
    listening: 'Écoute...',
    askPlaceholder: 'Demandez-moi d\'ajouter un devoir...',
    
    // Assignments
    myTasks: 'Mes Tâches',
    all: 'Toutes',
    notificationUnit: 'avant la date d\'échéance.',
    emptyAssignmentsAll: 'Aucun devoir pour le moment. Demandez à l\'assistant d\'en ajouter un !',
    emptyAssignmentsMy: 'Vous n\'avez aucune tâche individuelle.',
    emptyAssignmentsGroup: 'Il n\'y a pas encore de devoirs de groupe.',
    due: 'Échéance :',
    editAssignment: 'Modifier le Devoir',
    deleteAssignment: 'Supprimer le Devoir',
    addNewAssignment: 'Ajouter un nouveau devoir',

    // Schedule
    notificationUnitEvent: 'avant l\'événement.',
    emptySchedule: 'Votre emploi du temps est vide. Demandez à l\'assistant d\'ajouter un événement.',
    editEvent: 'Modifier l\'événement',
    deleteEvent: 'Supprimer l\'événement',
    addNewEvent: 'Ajouter un nouvel événement',

    // Group
    addNewMember: 'Ajouter un nouveau membre...',
    removeMember: 'Retirer',

    // Profile
    myProfile: 'Mon Profil',
    changeProfilePic: 'Changer la photo de profil',
    name: 'Nom',
    saveChanges: 'Enregistrer les modifications',
    language: 'Langue',
    
    // Modals
    cancel: 'Annuler',
    // Notification Modal
    notificationSettings: 'Paramètres de Notification',
    closeSettings: 'Fermer les paramètres',
    assignmentDeadlines: 'Échéances des Devoirs',
    assignmentDeadlinesDesc: 'Définissez quand être rappelé pour les échéances des devoirs.',
    scheduleEvents: 'Événements de l\'Emploi du Temps',
    scheduleEventsDesc: 'Définissez quand être rappelé pour les événements à venir.',
    days: 'Jours',
    hours: 'Heures',
    minutes: 'Minutes',
    saveSettings: 'Enregistrer les Paramètres',
    // Assignment Modal
    addAssignment: 'Ajouter un Devoir',
    assignmentName: 'Nom du Devoir',
    dueDate: 'Date d\'Échéance',
    assignTo: 'Assigner À',
    addAssignmentBtn: 'Ajouter un Devoir',
    saveChangesBtn: 'Enregistrer les modifications',
    // Schedule Modal
    addEvent: 'Ajouter un Événement',
    editEventTitle: 'Modifier l\'Événement',
    eventTitle: 'Titre de l\'Événement',
    date: 'Date',
    time: 'Heure',
    attendees: 'Participants',
    addEventBtn: 'Ajouter un Événement',
  },
};
