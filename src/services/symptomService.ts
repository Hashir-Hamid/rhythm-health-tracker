
import axios from 'axios';

export interface Symptom {
  id: string;
  name: string;
  common_name?: string;
}

export interface SymptomCheckRequest {
  symptoms: string[];
  age: number;
  gender: 'male' | 'female';
}

export interface ConditionResult {
  id: string;
  name: string;
  common_name: string;
  probability: number;
  description: string;
  recommendedAction: string;
}

export interface SymptomCheckResponse {
  conditions: ConditionResult[];
  message?: string;
}

// In a real app, you'd use an actual API endpoint
const API_URL = 'https://api.infermedica.com/v3';
const API_KEY = 'fake-key'; // Replace with actual key
const API_ID = 'fake-id'; // Replace with actual app ID

export const searchSymptoms = async (query: string): Promise<Symptom[]> => {
  try {
    // In a real app, you would use your actual API credentials
    // For demo, return mock data
    if (query) {
      return mockSymptoms.filter(s => 
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        (s.common_name && s.common_name.toLowerCase().includes(query.toLowerCase()))
      );
    }
    return mockSymptoms;
  } catch (error) {
    console.error('Error searching symptoms:', error);
    return [];
  }
};

export const checkSymptoms = async (request: SymptomCheckRequest): Promise<SymptomCheckResponse> => {
  try {
    // In a real app, you would use your actual API key
    // For demo purposes, return mock data
    
    // Simple mock logic to return different conditions based on symptoms
    const conditions = mockConditions.filter(condition => {
      // Check if any of the symptoms match the condition
      return request.symptoms.some(symptom => 
        condition.relatedSymptoms.some(s => 
          s.toLowerCase().includes(symptom.toLowerCase())
        )
      );
    });
    
    if (conditions.length === 0) {
      return {
        conditions: [],
        message: "No specific conditions matched your symptoms. Please consult with a healthcare professional for proper diagnosis."
      };
    }
    
    return {
      conditions: conditions.map(c => ({
        id: c.id,
        name: c.name,
        common_name: c.common_name,
        probability: Math.round(Math.random() * 70 + 30), // Random probability between 30-100%
        description: c.description,
        recommendedAction: c.recommendedAction
      }))
    };
  } catch (error) {
    console.error('Error checking symptoms:', error);
    return {
      conditions: [],
      message: "An error occurred while processing your symptoms. Please try again later."
    };
  }
};

// Mock data for development/demo
export const mockSymptoms: Symptom[] = [
  { id: 's_1', name: 'headache', common_name: 'Headache' },
  { id: 's_2', name: 'fever', common_name: 'Fever' },
  { id: 's_3', name: 'cough', common_name: 'Cough' },
  { id: 's_4', name: 'fatigue', common_name: 'Fatigue' },
  { id: 's_5', name: 'sore throat', common_name: 'Sore throat' },
  { id: 's_6', name: 'muscle pain', common_name: 'Muscle pain' },
  { id: 's_7', name: 'shortness of breath', common_name: 'Shortness of breath' },
  { id: 's_8', name: 'nausea', common_name: 'Nausea' },
  { id: 's_9', name: 'vomiting', common_name: 'Vomiting' },
  { id: 's_10', name: 'diarrhea', common_name: 'Diarrhea' },
  { id: 's_11', name: 'runny nose', common_name: 'Runny nose' },
  { id: 's_12', name: 'chest pain', common_name: 'Chest pain' },
  { id: 's_13', name: 'dizziness', common_name: 'Dizziness' },
  { id: 's_14', name: 'abdominal pain', common_name: 'Abdominal pain' },
  { id: 's_15', name: 'joint pain', common_name: 'Joint pain' }
];

interface MockCondition {
  id: string;
  name: string;
  common_name: string;
  description: string;
  recommendedAction: string;
  relatedSymptoms: string[];
}

export const mockConditions: MockCondition[] = [
  {
    id: 'c_1',
    name: 'Common cold',
    common_name: 'Cold',
    description: 'The common cold is a viral infection of the upper respiratory tract, primarily caused by rhinoviruses. It generally resolves within 7-10 days with rest and hydration.',
    recommendedAction: 'Rest, stay hydrated, and take over-the-counter cold medications if needed. Consult a doctor if symptoms persist beyond 10 days.',
    relatedSymptoms: ['cough', 'runny nose', 'sore throat', 'fever', 'headache']
  },
  {
    id: 'c_2',
    name: 'Influenza',
    common_name: 'Flu',
    description: 'Influenza is a contagious respiratory illness caused by influenza viruses. It can cause mild to severe illness and can sometimes lead to hospitalization or death.',
    recommendedAction: 'Rest, stay hydrated, and take fever-reducing medications. If symptoms are severe or you're in a high-risk group, consult a healthcare provider promptly.',
    relatedSymptoms: ['fever', 'cough', 'fatigue', 'muscle pain', 'headache', 'sore throat']
  },
  {
    id: 'c_3',
    name: 'Migraine',
    common_name: 'Migraine',
    description: 'Migraine is a neurological condition characterized by recurring headaches that can cause throbbing pain, often on one side of the head. It may be accompanied by other symptoms.',
    recommendedAction: 'Rest in a quiet, dark room, apply cold compresses, and take pain relievers. If migraines are frequent, consult a doctor about preventive treatments.',
    relatedSymptoms: ['headache', 'nausea', 'dizziness', 'fatigue']
  },
  {
    id: 'c_4',
    name: 'Gastroenteritis',
    common_name: 'Stomach flu',
    description: 'Gastroenteritis is an inflammation of the digestive tract, typically caused by a viral infection. It can lead to diarrhea, vomiting, and abdominal cramps.',
    recommendedAction: 'Stay hydrated, eat bland foods when able, and rest. Seek medical attention if symptoms are severe or persistent, or if there are signs of dehydration.',
    relatedSymptoms: ['nausea', 'vomiting', 'diarrhea', 'abdominal pain', 'fever']
  },
  {
    id: 'c_5',
    name: 'Pneumonia',
    common_name: 'Pneumonia',
    description: 'Pneumonia is an infection that inflames the air sacs in one or both lungs, which may fill with fluid. It can be caused by bacteria, viruses, or fungi.',
    recommendedAction: 'Seek medical attention immediately. Pneumonia often requires antibiotics if bacterial, and may require hospitalization in severe cases.',
    relatedSymptoms: ['cough', 'fever', 'shortness of breath', 'chest pain', 'fatigue']
  }
];
