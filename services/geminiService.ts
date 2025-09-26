import { GoogleGenAI, Type, FunctionDeclaration, GenerateContentResponse, Content } from "@google/genai";
import { ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const functionDeclarations: FunctionDeclaration[] = [
  {
    name: "addAssignment",
    parameters: {
      type: Type.OBJECT,
      description: "Adds a new assignment to the user's list. Can be assigned to one or more group members.",
      properties: {
        name: {
          type: Type.STRING,
          description: "The name or title of the assignment, e.g., 'History Essay'.",
        },
        dueDate: {
          type: Type.STRING,
          description: "The due date of the assignment, e.g., '2024-12-01'.",
        },
        assignees: {
          type: Type.ARRAY,
          description: "An array of names of the members this assignment is for. E.g., ['Sarah', 'Me']. Optional.",
          items: { type: Type.STRING }
        }
      },
      required: ["name", "dueDate"],
    },
  },
  {
    name: "completeAssignment",
    parameters: {
      type: Type.OBJECT,
      description: "Marks an existing assignment as completed based on its name.",
      properties: {
        name: {
          type: Type.STRING,
          description: "The name of the assignment to mark as complete.",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "listAssignments",
    parameters: {
      type: Type.OBJECT,
      description: "Lists current assignments. Can be filtered to show all, only the user's, or only group assignments.",
      properties: {
        filter: {
            type: Type.STRING,
            description: "The filter to apply. Can be 'my', 'group', or 'all'. Defaults to 'all'."
        }
      },
    },
  },
  {
    name: "addScheduleEvent",
    parameters: {
      type: Type.OBJECT,
      description: "Adds a new event to the user's schedule. Can be for one or more group members.",
      properties: {
        title: {
          type: Type.STRING,
          description: "The title of the event, e.g., 'Study Group'.",
        },
        date: {
          type: Type.STRING,
          description: "The date of the event, e.g., '2024-11-20'.",
        },
        time: {
          type: Type.STRING,
          description: "The time of the event, e.g., '14:30'.",
        },
        attendees: {
          type: Type.ARRAY,
          description: "An array of names of the members attending this event. E.g., ['John', 'Me']. Optional.",
          items: { type: Type.STRING }
        }
      },
      required: ["title", "date", "time"],
    },
  },
  {
    name: "listScheduleEvents",
    parameters: {
      type: Type.OBJECT,
      description: "Lists all events in the user's schedule.",
      properties: {},
    },
  },
    {
    name: "addMember",
    parameters: {
      type: Type.OBJECT,
      description: "Adds a new member to the project group.",
      properties: {
        name: {
          type: Type.STRING,
          description: "The name of the member to add, e.g., 'Alex'.",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "removeMember",
    parameters: {
      type: Type.OBJECT,
      description: "Removes a member from the project group.",
      properties: {
        name: {
          type: Type.STRING,
          description: "The name of the member to remove, e.g., 'Alex'.",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "getStudyTips",
    parameters: {
      type: Type.OBJECT,
      description: "Provides the user with general study tips or advice.",
      properties: {},
    },
  },
  {
    name: "addNotificationPreference",
    parameters: {
      type: Type.OBJECT,
      description: "Sets the user's preference for when to be notified about an approaching deadline.",
      properties: {
        timeValue: {
          type: Type.NUMBER,
          description: "The numeric value for the time before a deadline, e.g., 2.",
        },
        timeUnit: {
          type: Type.STRING,
          description: "The unit of time. Can be 'days' or 'hours'.",
        },
      },
      required: ["timeValue", "timeUnit"],
    },
  }
];

const systemInstruction = `You are a helpful student organizer assistant for a group of students. 
Your role is to help university students manage their schedules, assignments, and study habits collaboratively.
You are friendly, encouraging, and provide clear, concise information.
You will have access to tools to manage assignments, schedules, group members, and notification preferences.
When a user asks to add an assignment or schedule event, they may specify assignees or attendees. If they don't, assume it's for the user who is talking ('Me').
The group member 'Me' refers to the current user interacting with you.
When a user asks to add, remove, complete, or list items, use the provided functions.
When listing assignments, you can filter by 'my', 'group', or 'all'.
Do not make up information; use the tools to get the real data.
After performing a function call, confirm the action in a friendly message.
For general chat or study advice, respond conversationally.`;

export const sendMessageToGemini = async (history: Content[]): Promise<GenerateContentResponse> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: history,
    // Fix: `tools` and `systemInstruction` must be within a `config` object.
    config: {
      tools: [{ functionDeclarations }],
      systemInstruction,
    },
  });
  return response;
};