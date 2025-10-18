"use client"

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { getActiveAACBoard, updateCardUsage, toggleCardFavorite } from "@/app/actions/aac"
import type { AACBoardWithData } from "@/types/aac.types"
import {
  Volume2,
  Settings,
  Star,
  Clock,
  Zap,
  Heart,
  User,
  MapPin,
  Package,
  MessageSquare,
  Trash2,
  Play,
  Eye,
  Brain,
  Sparkles,
  AlertTriangle,
  Search,
  Grid,
  List,
  HelpCircle,
  X,
  ChevronRight,
  Lightbulb,
} from "lucide-react"

import AppHeader from "@/components/app-header"

// Define SpeechRecognition and webkitSpeechRecognition types if they are not globally available
// Ensure these are properly typed. If they are not globally available, they need to be imported or declared.
// For demonstration purposes, we'll assume they might be available on `window`.
interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string
      }
      isFinal: boolean
    }
    length: number
  }
  resultIndex: number
}

interface SpeechRecognitionType {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: Event) => void) | null
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionType
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

interface CommunicationItem {
  id: string
  text: string
  category: "needs" | "emotions" | "actions" | "people" | "places" | "objects"
  grammarType?: "subject" | "verb" | "object" | "adjective" | "preposition" | "complete"
  icon?: string
  image?: string // Added image property
  frequency: number
  lastUsed: Date
  isFavorite: boolean
  customVoice?: string
  difficulty: 1 | 2 | 3
  tags: string[]
}

interface PhraseTemplate {
  id: string
  template: string
  structure: string[]
  example: string
  difficulty: 1 | 2 | 3
}

interface UserProfile {
  id: string
  name: string
  age: number
  preferences: {
    theme: "light" | "dark" | "high-contrast"
    fontSize: "normal" | "large" | "extra-large"
    voiceSpeed: number
    voicePitch: number
    autoSpeak: boolean
    showImages: boolean
    showText: boolean
    gridSize: 2 | 3 | 4 | 6
    categories: string[]
    language: string
  }
  stats: {
    totalWords: number
    dailyStreak: number
    favoriteCategory: string
    averageSessionTime: number
    wordsThisWeek: number
    improvementScore: number
  }
}

interface AIContext {
  timeOfDay: "morning" | "afternoon" | "evening" | "night"
  location?: string
  recentWords: string[]
  emotionalState?: "happy" | "sad" | "frustrated" | "excited" | "calm"
  sessionDuration: number
  difficulty: number
}


interface GamificationStats {
  totalPoints: number
  level: number
  experiencePoints: number
  experienceToNextLevel: number
  dailyStreak: number
  longestStreak: number
  wordsSpokenToday: number
  wordsSpokenTotal: number
  sentencesBuilt: number
  categoriesExplored: number
  gardenLevel: number
  companionLevel: number
  themesUnlocked: string[]
  voicesUnlocked: string[]
}

interface Reward {
  id: string
  title: string
  description: string
  type: "theme" | "voice" | "avatar" | "sticker" | "tool" | "category"
  cost: number
  unlocked: boolean
  icon: string
  preview?: string
}

interface GPTSuggestion {
  text: string
  category: "needs" | "emotions" | "actions" | "people" | "places" | "objects"
  grammarType?: "subject" | "verb" | "object" | "adjective" | "preposition" | "complete"
  icon?: string
  difficulty: 1 | 2 | 3
}

export function AACBoard() {
  // Helper function to handle image fallbacks
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.src = '/images/aac/default/placeholder.svg'
  }

  // GPT suggestions API call
  const getGPTSuggestions = async (context: AIContext): Promise<CommunicationItem[]> => {
    const currentSentenceText = context.recentWords.join(" ")

    const prompt = `You are an AAC (Augmentative and Alternative Communication) assistant helping a Portuguese-speaking user communicate effectively.

Context:
- Current sentence: "${currentSentenceText || "empty"}"
- Time of day: ${context.timeOfDay}
- Session duration: ${context.sessionDuration} minutes
- User difficulty level: ${context.difficulty} (1=beginner, 2=intermediate, 3=advanced)

Suggest 3-6 relevant AAC words/phrases that would help complete or enhance this communication. Focus on:
1. Logical next words that make grammatical sense
2. Common communication needs
3. Appropriate for Portuguese language
4. Suitable for difficulty level ${context.difficulty}

For each suggestion, provide:
- text: The Portuguese word/phrase
- category: One of "needs", "emotions", "actions", "people", "places", "objects"
- grammarType: One of "subject", "verb", "object", "adjective", "preposition", "complete"
- icon: A single relevant emoji
- difficulty: 1, 2, or 3

Respond ONLY with valid JSON array, no markdown formatting. Example format:
[
  {
    "text": "água",
    "category": "needs",
    "grammarType": "object",
    "icon": "💧",
    "difficulty": 1
  }
]

Keep suggestions practical and commonly used. Limit to 6 suggestions maximum. Return only the JSON array, nothing else.`

    try {
      const response = await fetch('/api/gpt-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data: GPTSuggestion[] = await response.json()

      // Transform GPT response to CommunicationItem format
      return data.map((item: GPTSuggestion, index: number) => ({
        id: `gpt-${Date.now()}-${index}`,
        text: item.text,
        category: item.category,
        grammarType: item.grammarType,
        icon: item.icon,
        frequency: 0,
        lastUsed: new Date(),
        isFavorite: false,
        difficulty: item.difficulty,
        tags: ["ai-generated"],
      }))
    } catch (error) {
      console.error("Error getting GPT suggestions:", error)
      throw error
    }
  }

  const [currentUser, _setCurrentUser] = useState<UserProfile>({
    id: "1",
    name: "Sofia Mendes",
    age: 8,
    preferences: {
      theme: "dark",
      fontSize: "large",
      voiceSpeed: 1,
      voicePitch: 1,
      autoSpeak: true,
      showImages: true,
      showText: true,
      gridSize: 3,
      categories: ["needs", "emotions", "actions", "people"],
      language: "pt-PT",
    },
    stats: {
      totalWords: 247,
      dailyStreak: 12,
      favoriteCategory: "emotions",
      averageSessionTime: 18,
      wordsThisWeek: 45,
      improvementScore: 78,
    },
  })

  // Database state
  const [_aacBoard, setAacBoard] = useState<AACBoardWithData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [communicationItems, setCommunicationItems] = useState<CommunicationItem[]>([])

  // Load AAC board from database
  useEffect(() => {
    const loadAACBoard = async () => {
      setIsLoading(true)
      try {
        const result = await getActiveAACBoard()
        if (result.success && result.data) {
          setAacBoard(result.data)
          // Transform database cards to CommunicationItem format
          const items: CommunicationItem[] = []
          result.data.categories.forEach(category => {
            category.cards.forEach(card => {
              items.push({
                id: card.id,
                text: card.text,
                category: category.name as "needs" | "emotions" | "actions" | "people" | "places" | "objects",
                grammarType: card.grammar_type as "subject" | "verb" | "object" | "adjective" | "preposition" | "complete",
                icon: card.icon || "📝",
                image: card.image_url,
                frequency: card.frequency,
                lastUsed: card.last_used ? new Date(card.last_used) : new Date(),
                isFavorite: card.is_favorite,
                difficulty: card.difficulty,
                tags: card.tags,
              })
            })
          })
          setCommunicationItems(items)
        }
      } catch (error) {
        console.error("Error loading AAC board:", error)
        // Fallback to static data if database fails
        setCommunicationItems([
          {
            id: "1",
            text: "Tenho fome",
            category: "needs",
            grammarType: "complete",
            icon: "🍎",
            image: "/images/aac/hungry.jpg",
            frequency: 25,
            lastUsed: new Date(),
            isFavorite: true,
            difficulty: 1,
            tags: ["básico", "comida"],
          },
    {
      id: "2",
      text: "Tenho sede",
      category: "needs",
      grammarType: "complete",
      icon: "💧",
      image: "/images/aac/thirsty.jpg", // Added sample image
      frequency: 20,
      lastUsed: new Date(),
      isFavorite: true,
      difficulty: 1,
      tags: ["básico", "bebida"],
    },
    {
      id: "3",
      text: "Preciso de ajuda",
      category: "needs",
      grammarType: "complete",
      icon: "🆘",
      image: "/images/aac/help.jpg", // Added sample image
      frequency: 15,
      lastUsed: new Date(),
      isFavorite: true,
      difficulty: 1,
      tags: ["emergência", "ajuda"],
    },
    {
      id: "4",
      text: "Quero ir à casa de banho",
      category: "needs",
      grammarType: "complete",
      icon: "🚽",
      frequency: 18,
      lastUsed: new Date(),
      isFavorite: false,
      difficulty: 1,
      tags: ["básico", "higiene"],
    },
    {
      id: "5",
      text: "Estou cansado",
      category: "needs",
      grammarType: "complete",
      icon: "😴",
      frequency: 12,
      lastUsed: new Date(),
      isFavorite: false,
      difficulty: 1,
      tags: ["descanso", "sono"],
    },

    // Emotions
    {
      id: "6",
      text: "Estou feliz",
      category: "emotions",
      grammarType: "complete",
      icon: "😊",
      image: "/images/aac/happy.jpg", // Added sample image
      frequency: 22,
      lastUsed: new Date(),
      isFavorite: true,
      difficulty: 1,
      tags: ["sentimento", "positivo"],
    },
    {
      id: "7",
      text: "Estou triste",
      category: "emotions",
      grammarType: "complete",
      icon: "😢",
      image: "/images/aac/sad.jpg", // Added sample image
      frequency: 8,
      lastUsed: new Date(),
      isFavorite: false,
      difficulty: 1,
      tags: ["sentimento", "negativo"],
    },
    {
      id: "8",
      text: "Tenho medo",
      category: "emotions",
      grammarType: "complete",
      icon: "😨",
      frequency: 5,
      lastUsed: new Date(),
      isFavorite: false,
      difficulty: 2,
      tags: ["sentimento", "medo"],
    },
    {
      id: "9",
      text: "Estou zangado",
      category: "emotions",
      grammarType: "complete",
      icon: "😠",
      frequency: 10,
      lastUsed: new Date(),
      isFavorite: false,
      difficulty: 2,
      tags: ["sentimento", "raiva"],
    },
    {
      id: "10",
      text: "Amo-te",
      category: "emotions",
      grammarType: "complete",
      icon: "❤️",
      frequency: 30,
      lastUsed: new Date(),
      isFavorite: true,
      difficulty: 1,
      tags: ["amor", "família"],
    },

    // Actions
    {
      id: "11",
      text: "Quero brincar",
      category: "actions",
      grammarType: "complete",
      icon: "🎮",
      image: "/images/aac/play.jpg", // Added sample image
      frequency: 28,
      lastUsed: new Date(),
      isFavorite: true,
      difficulty: 1,
      tags: ["atividade", "diversão"],
    },
    {
      id: "12",
      text: "Vamos comer",
      category: "actions",
      grammarType: "complete",
      icon: "🍽️",
      image: "/images/aac/eat.jpg", // Added sample image
      frequency: 20,
      lastUsed: new Date(),
      isFavorite: true,
      difficulty: 1,
      tags: ["ação", "comida"],
    },
    {
      id: "13",
      text: "Quero ver televisão",
      category: "actions",
      grammarType: "complete",
      icon: "📺",
      frequency: 15,
      lastUsed: new Date(),
      isFavorite: false,
      difficulty: 2,
      tags: ["entretenimento", "tv"],
    },
    {
      id: "14",
      text: "Vamos passear",
      category: "actions",
      grammarType: "complete",
      icon: "🚶",
      frequency: 12,
      lastUsed: new Date(),
      isFavorite: false,
      difficulty: 2,
      tags: ["atividade", "exterior"],
    },
    {
      id: "15",
      text: "Quero desenhar",
      category: "actions",
      grammarType: "complete",
      icon: "🎨",
      frequency: 18,
      lastUsed: new Date(),
      isFavorite: true,
      difficulty: 1,
      tags: ["criatividade", "arte"],
    },

    // People
    {
      id: "16",
      text: "Mamã",
      category: "people",
      grammarType: "subject",
      icon: "👩",
      image: "/images/aac/mom.jpg", // Added sample image
      frequency: 35,
      lastUsed: new Date(),
      isFavorite: true,
      difficulty: 1,
      tags: ["família", "mãe"],
    },
    {
      id: "17",
      text: "Papá",
      category: "people",
      grammarType: "subject",
      icon: "👨",
      image: "/images/aac/dad.jpg", // Added sample image
      frequency: 32,
      lastUsed: new Date(),
      isFavorite: true,
      difficulty: 1,
      tags: ["família", "pai"],
    },
    {
      id: "18",
      text: "Avó",
      category: "people",
      grammarType: "subject",
      icon: "👵",
      frequency: 15,
      lastUsed: new Date(),
      isFavorite: true,
      difficulty: 1,
      tags: ["família", "avó"],
    },
    {
      id: "19",
      text: "Amigo",
      category: "people",
      grammarType: "subject",
      icon: "👦",
      frequency: 20,
      lastUsed: new Date(),
      isFavorite: false,
      difficulty: 2,
      tags: ["social", "amizade"],
    },
    {
      id: "20",
      text: "Professor",
      category: "people",
      grammarType: "subject",
      icon: "👨‍🏫",
      frequency: 10,
      lastUsed: new Date(),
      isFavorite: false,
      difficulty: 2,
      tags: ["escola", "educação"],
    },

    // Places
    {
      id: "21",
      text: "Casa",
      category: "places",
      grammarType: "object",
      icon: "🏠",
      image: "/images/aac/home.jpg", // Added sample image
      frequency: 25,
      lastUsed: new Date(),
      isFavorite: true,
      difficulty: 1,
      tags: ["local", "lar"],
    },
    {
      id: "22",
      text: "Escola",
      category: "places",
      grammarType: "object",
      icon: "🏫",
      image: "/images/aac/school.jpg", // Added sample image
      frequency: 18,
      lastUsed: new Date(),
      isFavorite: false,
      difficulty: 1,
      tags: ["educação", "aprendizagem"],
    },
    {
      id: "23",
      text: "Parque",
      category: "places",
      grammarType: "object",
      icon: "🌳",
      frequency: 12,
      lastUsed: new Date(),
      isFavorite: true,
      difficulty: 2,
      tags: ["exterior", "diversão"],
    },
    {
      id: "24",
      text: "Hospital",
      category: "places",
      grammarType: "object",
      icon: "🏥",
      frequency: 3,
      lastUsed: new Date(),
      isFavorite: false,
      difficulty: 3,
      tags: ["saúde", "médico"],
    },
    {
      id: "25",
      text: "Loja",
      category: "places",
      grammarType: "object",
      icon: "🏪",
      frequency: 8,
      lastUsed: new Date(),
      isFavorite: false,
      difficulty: 2,
      tags: ["compras", "comércio"],
    },

    // Objects
    {
      id: "26",
      text: "Brinquedo",
      category: "objects",
      grammarType: "object",
      icon: "🧸",
      image: "/images/aac/toy.jpg", // Added sample image
      frequency: 22,
      lastUsed: new Date(),
      isFavorite: true,
      difficulty: 1,
      tags: ["objeto", "diversão"],
    },
    {
      id: "27",
      text: "Livro",
      category: "objects",
      grammarType: "object",
      icon: "📚",
      frequency: 15,
      lastUsed: new Date(),
      isFavorite: false,
      difficulty: 2,
      tags: ["leitura", "educação"],
    },
    {
      id: "28",
      text: "Tablet",
      category: "objects",
      grammarType: "object",
      icon: "📱",
      frequency: 20,
      lastUsed: new Date(),
      isFavorite: true,
      difficulty: 2,
      tags: ["tecnologia", "entretenimento"],
    },
    {
      id: "29",
      text: "Carro",
      category: "objects",
      grammarType: "object",
      icon: "🚗",
      frequency: 10,
      lastUsed: new Date(),
      isFavorite: false,
      difficulty: 2,
      tags: ["transporte", "veículo"],
    },
    {
      id: "30",
      text: "Comida",
      category: "objects",
      grammarType: "object",
      icon: "🍕",
      frequency: 25,
      lastUsed: new Date(),
      isFavorite: true,
      difficulty: 1,
      tags: ["alimento", "nutrição"],
    },

    // Verbs
    {
      id: "31",
      text: "quero",
      category: "actions",
      grammarType: "verb",
      icon: "👆",
      frequency: 40,
      lastUsed: new Date(),
      isFavorite: true,
      difficulty: 1,
      tags: ["verbo", "desejo"],
    },
    {
      id: "32",
      text: "gosto",
      category: "emotions",
      grammarType: "verb",
      icon: "👍",
      frequency: 25,
      lastUsed: new Date(),
      isFavorite: true,
      difficulty: 1,
      tags: ["verbo", "gostar"],
    },
    {
      id: "33",
      text: "preciso",
      category: "needs",
      grammarType: "verb",
      icon: "🙏",
      frequency: 30,
      lastUsed: new Date(),
      isFavorite: true,
      difficulty: 1,
      tags: ["verbo", "necessidade"],
    },
    {
      id: "34",
      text: "vou",
      category: "actions",
      grammarType: "verb",
      icon: "🚶‍♂️",
      frequency: 20,
      lastUsed: new Date(),
      isFavorite: false,
      difficulty: 2,
      tags: ["verbo", "movimento"],
    },
    {
      id: "35",
      text: "estou",
      category: "emotions",
      grammarType: "verb",
      icon: "🧍",
      frequency: 35,
      lastUsed: new Date(),
      isFavorite: true,
      difficulty: 1,
      tags: ["verbo", "estado"],
    },

    // Subjects
    {
      id: "36",
      text: "eu",
      category: "people",
      grammarType: "subject",
      icon: "👤",
      frequency: 50,
      lastUsed: new Date(),
      isFavorite: true,
      difficulty: 1,
      tags: ["pronome", "pessoa"],
    },
    {
      id: "37",
      text: "tu",
      category: "people",
      grammarType: "subject",
      icon: "👥",
      frequency: 25,
      lastUsed: new Date(),
      isFavorite: false,
      difficulty: 2,
      tags: ["pronome", "pessoa"],
    },
    {
      id: "38",
      text: "nós",
      category: "people",
      grammarType: "subject",
      icon: "👫",
      frequency: 15,
      lastUsed: new Date(),
      isFavorite: false,
      difficulty: 2,
      tags: ["pronome", "grupo"],
    },

    // Adjectives
    {
      id: "39",
      text: "grande",
      category: "objects",
      grammarType: "adjective",
      icon: "📏",
      frequency: 12,
      lastUsed: new Date(),
      isFavorite: false,
      difficulty: 2,
      tags: ["adjetivo", "tamanho"],
    },
    {
      id: "40",
      text: "pequeno",
      category: "objects",
      grammarType: "adjective",
      icon: "🤏",
      frequency: 10,
      lastUsed: new Date(),
      isFavorite: false,
      difficulty: 2,
      tags: ["adjetivo", "tamanho"],
    },
    {
      id: "41",
      text: "bonito",
      category: "emotions",
      grammarType: "adjective",
      icon: "✨",
      frequency: 8,
      lastUsed: new Date(),
      isFavorite: false,
      difficulty: 2,
      tags: ["adjetivo", "aparência"],
    },

    // Prepositions
    {
      id: "42",
      text: "para",
      category: "actions",
      grammarType: "preposition",
      icon: "➡️",
      frequency: 18,
      lastUsed: new Date(),
      isFavorite: false,
      difficulty: 2,
      tags: ["preposição", "direção"],
    },
    {
      id: "43",
      text: "com",
      category: "people",
      grammarType: "preposition",
      icon: "🤝",
      frequency: 22,
      lastUsed: new Date(),
      isFavorite: false,
      difficulty: 2,
      tags: ["preposição", "companhia"],
    },
    {
      id: "44",
      text: "em",
      category: "places",
      grammarType: "preposition",
      icon: "📍",
      frequency: 15,
      lastUsed: new Date(),
      isFavorite: false,
            difficulty: 2,
            tags: ["preposição", "localização"],
          }
        ])
      } finally {
        setIsLoading(false)
      }
    }

    loadAACBoard()
  }, [])

  const [phraseTemplates] = useState<PhraseTemplate[]>([
    {
      id: "template-1",
      template: "Eu quero ___",
      structure: ["subject", "verb", "object"],
      example: "Eu quero água",
      difficulty: 1,
    },
    {
      id: "template-2",
      template: "Eu estou ___",
      structure: ["subject", "verb", "adjective"],
      example: "Eu estou feliz",
      difficulty: 1,
    },
    {
      id: "template-3",
      template: "Eu gosto de ___",
      structure: ["subject", "verb", "preposition", "object"],
      example: "Eu gosto de brincar",
      difficulty: 2,
    },
    {
      id: "template-4",
      template: "___ está ___",
      structure: ["subject", "verb", "adjective"],
      example: "Mamã está feliz",
      difficulty: 2,
    },
    {
      id: "template-5",
      template: "Vou para ___",
      structure: ["verb", "preposition", "object"],
      example: "Vou para casa",
      difficulty: 2,
    },
    {
      id: "template-6",
      template: "Quero ___ com ___",
      structure: ["verb", "object", "preposition", "subject"],
      example: "Quero brincar com papá",
      difficulty: 3,
    },
  ])

  const [currentSentence, setCurrentSentence] = useState<CommunicationItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showSettings, setShowSettings] = useState(false)
  const [isVoiceEnabled, _setIsVoiceEnabled] = useState(true)
  const [_isRecording, setIsRecording] = useState(false)
  const [showEmergency, setShowEmergency] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<CommunicationItem[]>([])
  const [showAISuggestions, setShowAISuggestions] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [sessionStartTime] = useState(new Date())

  const [showImages, setShowImages] = useState(true) // Toggle between icons and generated images
  const [showMostUsed, setShowMostUsed] = useState(true)

  const [showSentenceBuilder, setShowSentenceBuilder] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<PhraseTemplate | null>(null)
  const [wordPredictions, setWordPredictions] = useState<CommunicationItem[]>([])
  const [grammarFilter, setGrammarFilter] = useState<string>("all")

  const [showCustomization, setShowCustomization] = useState(false)
  const [showAIGenerator, setShowAIGenerator] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [draggedItem, setDraggedItem] = useState<CommunicationItem | null>(null)
  const [_customCategories, setCustomCategories] = useState<string[]>([])
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCardData, setNewCardData] = useState<{
    text: string
    category: "needs" | "emotions" | "actions" | "people" | "places" | "objects"
    grammarType: "subject" | "verb" | "object" | "adjective" | "preposition" | "complete"
    icon: string
    difficulty: 1 | 2 | 3
    tags: string[]
  }>({
    text: "",
    category: "needs",
    grammarType: "complete",
    icon: "🔤",
    difficulty: 1,
    tags: [],
  })

  const [gamificationStats, setGamificationStats] = useState<GamificationStats>({
    totalPoints: 1250,
    level: 8,
    experiencePoints: 320,
    experienceToNextLevel: 180,
    dailyStreak: 12,
    longestStreak: 18,
    wordsSpokenToday: 24,
    wordsSpokenTotal: 847,
    sentencesBuilt: 156,
    categoriesExplored: 6,
    gardenLevel: 3,
    companionLevel: 2,
    themesUnlocked: ["default", "ocean", "forest"],
    voicesUnlocked: ["default", "friendly", "calm"],
  })


  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: "theme_ocean",
      title: "Tema Oceano",
      description: "Tema azul inspirado no oceano",
      type: "theme",
      cost: 200,
      unlocked: true,
      icon: "🌊",
    },
    {
      id: "theme_forest",
      title: "Tema Floresta",
      description: "Tema verde inspirado na natureza",
      type: "theme",
      cost: 200,
      unlocked: true,
      icon: "🌲",
    },
    {
      id: "theme_sunset",
      title: "Tema Pôr do Sol",
      description: "Tema laranja e rosa do pôr do sol",
      type: "theme",
      cost: 300,
      unlocked: false,
      icon: "🌅",
    },
    {
      id: "voice_friendly",
      title: "Voz Amigável",
      description: "Voz mais calorosa e amigável",
      type: "voice",
      cost: 150,
      unlocked: true,
      icon: "😊",
    },
    {
      id: "voice_calm",
      title: "Voz Calma",
      description: "Voz mais suave e relaxante",
      type: "voice",
      cost: 150,
      unlocked: true,
      icon: "😌",
    },
    {
      id: "voice_energetic",
      title: "Voz Energética",
      description: "Voz mais animada e entusiasmada",
      type: "voice",
      cost: 200,
      unlocked: false,
      icon: "⚡",
    },
    {
      id: "avatar_robot",
      title: "Avatar Robô",
      description: "Companheiro robô amigável",
      type: "avatar",
      cost: 400,
      unlocked: false,
      icon: "🤖",
    },
    {
      id: "avatar_cat",
      title: "Avatar Gato",
      description: "Companheiro gatinho fofo",
      type: "avatar",
      cost: 350,
      unlocked: false,
      icon: "🐱",
    },
  ])

  const [showGamification, setShowGamification] = useState(false)
  const [showRewards, setShowRewards] = useState(false)
  const [_selectedTheme, _setSelectedTheme] = useState("default")
  const [_selectedVoice, _setSelectedVoice] = useState("default")
  const [_selectedAvatar, _setSelectedAvatar] = useState("default")
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false)

  const speechSynthesis = useRef<SpeechSynthesis | null>(null)
  const recognition = useRef<SpeechRecognitionType | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      speechSynthesis.current = window.speechSynthesis

      // Initialize speech recognition if available
      if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (SpeechRecognition) {
          recognition.current = new SpeechRecognition()
          recognition.current.continuous = false
          recognition.current.interimResults = false
          recognition.current.lang = currentUser.preferences.language
        }
      }
    }

    // Generate AI suggestions based on context
    generateAISuggestions().catch(error => {
      console.error('Error generating AI suggestions:', error)
    })
  }, [])

  useEffect(() => {
    generateWordPredictions()
  }, [currentSentence])

  const generateAISuggestions = async () => {
    const context: AIContext = {
      timeOfDay: getTimeOfDay(),
      recentWords: currentSentence.map((item) => item.text),
      sessionDuration: (new Date().getTime() - sessionStartTime.getTime()) / 1000 / 60,
      difficulty: 1,
    }

    try {
      // Try to get GPT suggestions first
      const gptSuggestions = await getGPTSuggestions(context)
      if (gptSuggestions.length > 0) {
        setAiSuggestions(gptSuggestions)
        return
      }
    } catch (error) {
      console.warn("GPT suggestions failed, falling back to rule-based:", error)
    }

    // Fallback to rule-based suggestions if GPT fails
    let suggestions: CommunicationItem[] = []

    // Time-based suggestions
    if (context.timeOfDay === "morning") {
      suggestions = communicationItems
        .filter((item) => item.text.includes("Bom dia") || item.text.includes("fome") || item.category === "needs")
        .slice(0, 3)
    } else if (context.timeOfDay === "evening") {
      suggestions = communicationItems
        .filter(
          (item) => item.text.includes("Boa noite") || item.text.includes("cansado") || item.category === "emotions",
        )
        .slice(0, 3)
    }

    // Frequency-based suggestions
    const frequentItems = communicationItems.sort((a, b) => b.frequency - a.frequency).slice(0, 4)

    // Combine and deduplicate
    const allSuggestions = [...suggestions, ...frequentItems]
    const uniqueSuggestions = allSuggestions
      .filter((item, index, self) => index === self.findIndex((t) => t.id === item.id))
      .slice(0, 6)

    setAiSuggestions(uniqueSuggestions)
  }

  const generateWordPredictions = () => {
    if (currentSentence.length === 0) {
      // Start with common subjects and complete phrases
      const predictions = communicationItems
        .filter((item) => item.grammarType === "subject" || item.grammarType === "complete")
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 6)
      setWordPredictions(predictions)
      return
    }

    const lastWord = currentSentence[currentSentence.length - 1]
    let predictions: CommunicationItem[] = []

    // Predict based on grammar patterns
    if (lastWord.grammarType === "subject") {
      // After subject, suggest verbs
      predictions = communicationItems
        .filter((item) => item.grammarType === "verb")
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 6)
    } else if (lastWord.grammarType === "verb") {
      // After verb, suggest objects or adjectives
      predictions = communicationItems
        .filter((item) => item.grammarType === "object" || item.grammarType === "adjective")
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 6)
    } else if (lastWord.grammarType === "preposition") {
      // After preposition, suggest objects or subjects
      predictions = communicationItems
        .filter((item) => item.grammarType === "object" || item.grammarType === "subject")
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 6)
    } else {
      // Default to most frequent words if no specific pattern
      predictions = communicationItems.sort((a, b) => b.frequency - a.frequency).slice(0, 6)
    }

    setWordPredictions(predictions)
  }

  const getTimeOfDay = (): "morning" | "afternoon" | "evening" | "night" => {
    const hour = new Date().getHours()
    if (hour < 6) return "night"
    if (hour < 12) return "morning"
    if (hour < 18) return "afternoon"
    if (hour < 22) return "evening"
    return "night"
  }

  const speakText = (text: string) => {
    if (!isVoiceEnabled || !speechSynthesis.current) return

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = currentUser.preferences.language
    utterance.rate = currentUser.preferences.voiceSpeed
    utterance.pitch = currentUser.preferences.voicePitch

    speechSynthesis.current.speak(utterance)
  }

  const addToSentence = (item: CommunicationItem) => {
    setCurrentSentence([...currentSentence, item])

    if (currentUser.preferences.autoSpeak) {
      speakText(item.text)
    }

    // Update card usage in database
    updateCardUsage(item.id).catch(error => {
      console.error('Error updating card usage:', error)
    })

    // Update usage statistics


    // Regenerate AI suggestions based on new context
    setTimeout(() => {
      generateAISuggestions().catch(error => {
        console.error('Error generating AI suggestions:', error)
      })
    }, 500)
  }

  const applyTemplate = (template: PhraseTemplate) => {
    setSelectedTemplate(template)
    setCurrentSentence([]) // Clear current sentence when applying a template

    // Auto-fill template with common words if possible
    const templateWords: CommunicationItem[] = []

    template.structure.forEach((grammarType) => {
      const matchingWords = communicationItems
        .filter((item) => item.grammarType === grammarType)
        .sort((a, b) => b.frequency - a.frequency)

      // Special handling for "Eu" if the template starts with it
      if (grammarType === "subject" && template.template.startsWith("Eu")) {
        const euWord = communicationItems.find((item) => item.text === "eu")
        if (euWord) {
          templateWords.push(euWord)
        }
      } else if (matchingWords.length > 0) {
        // Add the most frequent word for the current grammar type if not already added
        if (!templateWords.some((word) => word.grammarType === grammarType)) {
          templateWords.push(matchingWords[0])
        }
      }
    })

    setCurrentSentence(templateWords)
  }

  const speakSentence = () => {
    const fullSentence = currentSentence.map((item) => item.text).join(" ")
    speakText(fullSentence)
  }

  const clearSentence = () => {
    setCurrentSentence([])
    setSelectedTemplate(null) // Clear selected template as well
  }

  const removeFromSentence = (index: number) => {
    const newSentence = currentSentence.filter((_, i) => i !== index)
    setCurrentSentence(newSentence)
  }

  const addPoints = (points: number, reason: string) => {
    setGamificationStats((prev) => {
      const newTotalPoints = prev.totalPoints + points
      const newExperiencePoints = prev.experiencePoints + points
      let newLevel = prev.level
      let newExperienceToNextLevel = prev.experienceToNextLevel - points

      // Level up logic
      if (newExperienceToNextLevel <= 0) {
        newLevel += 1
        newExperienceToNextLevel = newLevel * 100 // Each level requires more XP
        setShowLevelUpAnimation(true)
        setTimeout(() => setShowLevelUpAnimation(false), 3000)
      }

      return {
        ...prev,
        totalPoints: newTotalPoints,
        level: newLevel,
        experiencePoints: newExperiencePoints,
        experienceToNextLevel: newExperienceToNextLevel,
      }
    })

    // Show points animation
    console.log(`[v0] Gained ${points} points for: ${reason}`)
  }


  const purchaseReward = (rewardId: string) => {
    const reward = rewards.find((r) => r.id === rewardId)
    if (!reward || reward.unlocked || gamificationStats.totalPoints < reward.cost) return

    setGamificationStats((prev) => ({
      ...prev,
      totalPoints: prev.totalPoints - reward.cost,
    }))

    setRewards((prev) => prev.map((r) => (r.id === rewardId ? { ...r, unlocked: true } : r)))

    // Apply the reward
    if (reward.type === "theme") {
      setGamificationStats((prev) => ({
        ...prev,
        themesUnlocked: [...prev.themesUnlocked, reward.id.replace("theme_", "")],
      }))
    } else if (reward.type === "voice") {
      setGamificationStats((prev) => ({
        ...prev,
        voicesUnlocked: [...prev.voicesUnlocked, reward.id.replace("voice_", "")],
      }))
    }
  }

  const getThemeClasses = (theme: string) => {
    switch (theme) {
      case "ocean":
        return "from-blue-50 via-cyan-50 to-blue-100"
      case "forest":
        return "from-green-50 via-emerald-50 to-green-100"
      case "sunset":
        return "from-orange-50 via-pink-50 to-red-100"
      default:
        return "from-purple-50 via-white to-blue-50"
    }
  }

  const toggleFavorite = async (itemId: string) => {
    // Find the current item to get its favorite status
    const currentItem = communicationItems.find(item => item.id === itemId)
    if (!currentItem) return

    try {
      // Update in database
      await toggleCardFavorite(itemId, !currentItem.isFavorite)

      // Update local state
      setCommunicationItems(prev =>
        prev.map(item =>
          item.id === itemId
            ? { ...item, isFavorite: !item.isFavorite }
            : item
        )
      )
    } catch (error) {
      console.error('Error toggling card favorite:', error)
    }
  }

  const _startVoiceRecognition = () => {
    if (!recognition.current) return

    setIsRecording(true)
    recognition.current.start()

    recognition.current.onresult = (event: SpeechRecognitionEvent) => {
      const _transcript = event.results[0][0].transcript
      // Process voice input and convert to communication items
      setIsRecording(false)
    }

    recognition.current.onerror = () => {
      setIsRecording(false)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "needs":
        return "bg-red-600 hover:bg-red-700"
      case "emotions":
        return "bg-yellow-600 hover:bg-yellow-700"
      case "actions":
        return "bg-purple-600 hover:bg-purple-700"
      case "people":
        return "bg-cyan-600 hover:bg-cyan-700"
      case "places":
        return "bg-green-600 hover:bg-green-700"
      case "objects":
        return "bg-pink-600 hover:bg-pink-700"
      default:
        return "bg-gray-600 hover:bg-gray-700"
    }
  }

  const _getCategoryIcon = (category: string) => {
    switch (category) {
      case "needs":
        return <Heart className="w-5 h-5" />
      case "emotions":
        return <Star className="w-5 h-5" />
      case "actions":
        return <Zap className="w-5 h-5" />
      case "people":
        return <User className="w-5 h-5" />
      case "places":
        return <MapPin className="w-5 h-5" />
      case "objects":
        return <Package className="w-5 h-5" />
      default:
        return <MessageSquare className="w-5 h-5" />
    }
  }

  const filteredItems = communicationItems.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesGrammar = grammarFilter === "all" || item.grammarType === grammarFilter
    const matchesSearch =
      item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesFavorites = !showFavoritesOnly || item.isFavorite

    return matchesCategory && matchesGrammar && matchesSearch && matchesFavorites
  })

  const categories = [
    { id: "all", label: "Todos", icon: <Grid className="w-4 h-4" /> },
    { id: "needs", label: "Necessidades", icon: <Heart className="w-4 h-4" /> },
    { id: "emotions", label: "Emoções", icon: <Star className="w-4 h-4" /> },
    { id: "actions", label: "Ações", icon: <Zap className="w-4 h-4" /> },
    { id: "people", label: "Pessoas", icon: <User className="w-4 h-4" /> },
    { id: "places", label: "Lugares", icon: <MapPin className="w-4 h-4" /> },
    { id: "objects", label: "Objetos", icon: <Package className="w-4 h-4" /> },
  ]

  const grammarCategories = [
    { id: "all", label: "Todas as Palavras", icon: <Grid className="w-4 h-4" /> },
    { id: "complete", label: "Frases Completas", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "subject", label: "Sujeitos", icon: <User className="w-4 h-4" /> },
    { id: "verb", label: "Verbos", icon: <Zap className="w-4 h-4" /> },
    { id: "object", label: "Objetos", icon: <Package className="w-4 h-4" /> },
    { id: "adjective", label: "Adjetivos", icon: <Star className="w-4 h-4" /> },
    { id: "preposition", label: "Preposições", icon: <ChevronRight className="w-4 h-4" /> },
  ]

  const emergencyItems = [
    { id: "emergency-1", text: "Socorro! Preciso de ajuda!", icon: "🆘", category: "needs" as const },
    { id: "emergency-2", text: "Chama os meus pais", icon: "📞", category: "people" as const },
    { id: "emergency-3", text: "Estou perdido", icon: "🗺️", category: "needs" as const },
    { id: "emergency-4", text: "Não me sinto bem", icon: "🤒", category: "needs" as const },
    { id: "emergency-5", text: "Tenho dores", icon: "😣", category: "needs" as const },
  ]

  const mostUsedItems = communicationItems.sort((a, b) => b.frequency - a.frequency).slice(0, 8)

  const generateAICategory = async (description: string) => {
    setIsGenerating(true)
    try {
      // Simulate AI generation - in real app, this would call an AI API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newCategory = {
        id: `ai-category-${Date.now()}`,
        name: description.toLowerCase().replace(/\s+/g, "_"),
        label: description,
        description: `Categoria gerada por IA: ${description}`,
        items: [],
      }

      setCustomCategories((prev) => [...prev, newCategory.name])

      // Generate sample cards for the new category
      const sampleCards = await generateAICards(description, 6)

      // Add cards to the communication items
      setCommunicationItems((prev) => [...prev, ...sampleCards])
    } catch (error) {
      console.error("Error generating AI category:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateAICards = async (categoryDescription: string, count = 6) => {
    setIsGenerating(true)
    try {
      // Simulate AI card generation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const generatedCards = Array.from({ length: count }, (_, i) => ({
        id: `ai-card-${Date.now()}-${i}`,
        text: `Palavra ${i + 1} para ${categoryDescription}`,
        category: "needs" as const, // Default category, can be refined
        grammarType: "complete" as const, // Default grammar type, can be refined
        icon: "🤖", // Default icon
        frequency: 0,
        lastUsed: new Date(),
        isFavorite: false,
        difficulty: 1 as const, // Default difficulty, can be refined
        tags: ["ai-generated", categoryDescription.toLowerCase()],
      }))

      return generatedCards
    } catch (error) {
      console.error("Error generating AI cards:", error)
      return []
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDragStart = (item: CommunicationItem) => {
    if (editMode) {
      setDraggedItem(item)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    if (draggedItem && editMode) {
      const currentIndex = communicationItems.findIndex((item) => item.id === draggedItem.id)
      if (currentIndex === -1) return

      const newItems = [...communicationItems]
      newItems.splice(currentIndex, 1)
      newItems.splice(targetIndex, 0, draggedItem)
      setCommunicationItems(newItems)
      setDraggedItem(null)
    }
  }

  const addCustomCard = () => {
    if (newCardData.text.trim()) {
      const customCard: CommunicationItem = {
        id: `custom-${Date.now()}`,
        text: newCardData.text,
        category: newCardData.category,
        grammarType: newCardData.grammarType,
        icon: newCardData.icon,
        frequency: 0,
        lastUsed: new Date(),
        isFavorite: false,
        difficulty: newCardData.difficulty,
        tags: [...newCardData.tags, "custom"],
      }

      setCommunicationItems((prev) => [...prev, customCard])

      // Reset form
      setNewCardData({
        text: "",
        category: "needs",
        grammarType: "complete",
        icon: "🔤",
        difficulty: 1,
        tags: [],
      })
    }
  }

  const handleItemClick = (item: CommunicationItem) => {
    setCurrentSentence([...currentSentence, item])

    if (currentUser.preferences.autoSpeak) {
      speakText(item.text)
    }

    // Track word usage for gamification
    setGamificationStats((prev) => ({
      ...prev,
      wordsSpokenToday: prev.wordsSpokenToday + 1,
      wordsSpokenTotal: prev.wordsSpokenTotal + 1,
    }))

    // Add points for communication
    if (item.grammarType === "complete") {
      addPoints(10, "Complete phrase")
    } else {
      addPoints(5, "Word usage")
    }


    // Update usage statistics


    // Regenerate AI suggestions based on new context
    setTimeout(() => {
      generateAISuggestions().catch(error => {
        console.error('Error generating AI suggestions:', error)
      })
    }, 500)
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getThemeClasses(_selectedTheme)}`}>
      <AppHeader
        title="Comunicador AAC"
        subtitle={currentUser.name}
        showMascot={true}
        showGamification={true}
        gamificationStats={gamificationStats}
        onGamificationClick={() => setShowGamification(true)}
        onRewardsClick={() => setShowRewards(true)}
        onSettingsClick={() => setShowSettings(true)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {showSentenceBuilder && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Construir Frase
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={speakSentence}
                  disabled={currentSentence.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Falar
                </button>
                <button
                  onClick={clearSentence}
                  disabled={currentSentence.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Limpar
                </button>
                <button
                  onClick={() => setShowSentenceBuilder(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Phrase Templates */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Modelos de Frases
              </h3>
              <div className="flex flex-wrap gap-2">
                {phraseTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => applyTemplate(template)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedTemplate?.id === template.id
                        ? "bg-purple-600 text-white"
                        : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                    }`}
                  >
                    {template.template}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Sentence */}
            <div className="min-h-[80px] bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
              {currentSentence.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  {selectedTemplate
                    ? `Completa a frase: "${selectedTemplate.template}"`
                    : "Toca nas palavras para construir uma frase ou escolhe um modelo..."}
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {currentSentence.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="flex items-center gap-2 bg-purple-600 text-white px-3 py-2 rounded-lg"
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.text}</span>
                      <button
                        onClick={() => removeFromSentence(index)}
                        className="ml-1 hover:bg-purple-700 rounded p-1 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Word Predictions */}
            {wordPredictions.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Sugestões Inteligentes
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                  {wordPredictions.map((item) => (
                    <button
                      key={`prediction-${item.id}`}
                      onClick={() => addToSentence(item)}
                      className="flex items-center gap-2 p-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-colors text-sm"
                    >
                      <span>{item.icon}</span>
                      <span className="truncate">{item.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {showMostUsed && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                Mais Usadas
              </h2>
              <button
                onClick={() => setShowMostUsed(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {mostUsedItems.map((item) => (
                <div key={`most-used-${item.id}`} className="group relative aspect-square">
                  <button
                    onClick={() => addToSentence(item)}
                    className={`aac-button w-full h-full ${getCategoryColor(item.category)} text-white rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 relative overflow-hidden`}
                  >
                    {showImages && item.image ? (
                      // Full-size image with overlay
                      <>
                        <img
                          src={item.image || "/images/aac/default/placeholder.svg"}
                          alt={item.text}
                          onError={handleImageError}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute bottom-1 left-1 right-1 bg-black/70 backdrop-blur-sm text-white px-1.5 py-1 rounded-md">
                          <div className="text-xs font-medium text-center leading-tight">{item.text}</div>
                          <div className="text-xs opacity-75 text-center">{item.frequency}x</div>
                        </div>
                      </>
                    ) : showImages ? (
                      // Generated placeholder with overlay
                      <>
                        <img
                          src="/images/aac/default/placeholder.svg"
                          alt={item.text}
                          onError={handleImageError}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute bottom-1 left-1 right-1 bg-black/70 backdrop-blur-sm text-white px-1.5 py-1 rounded-md">
                          <div className="text-xs font-medium text-center leading-tight">{item.text}</div>
                          <div className="text-xs opacity-75 text-center">{item.frequency}x</div>
                        </div>
                      </>
                    ) : (
                      // Icon mode with centered layout
                      <div className="flex flex-col items-center justify-center p-2">
                        <div className="text-2xl mb-1">{item.icon}</div>
                        <div className="text-xs font-medium text-center leading-tight">{item.text}</div>
                        <div className="text-xs opacity-75 mt-1">{item.frequency}x</div>
                      </div>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Suggestions */}
        {showAISuggestions && aiSuggestions.length > 0 && (
          <div className="bg-gradient-to-r from-purple-100 to-cyan-100 rounded-xl p-6 border border-purple-200 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Sugestões IA
              </h2>
              <button
                onClick={() => setShowAISuggestions(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {aiSuggestions.map((item) => (
                <div key={`ai-${item.id}`} className="group relative aspect-square">
                  <button
                    onClick={() => addToSentence(item)}
                    className="aac-button w-full h-full bg-gradient-to-br from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 relative overflow-hidden"
                  >
                    {showImages && item.image ? (
                      // Full-size image with overlay
                      <>
                        <img
                          src={item.image || "/images/aac/default/placeholder.svg"}
                          alt={item.text}
                          onError={handleImageError}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/40 to-cyan-500/40" />
                        <div className="absolute bottom-1 left-1 right-1 bg-black/70 backdrop-blur-sm text-white px-1.5 py-1 rounded-md">
                          <div className="text-xs font-medium text-center leading-tight">{item.text}</div>
                        </div>
                      </>
                    ) : showImages ? (
                      // Generated placeholder with overlay
                      <>
                        <img
                          src="/images/aac/default/placeholder.svg"
                          alt={item.text}
                          onError={handleImageError}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/40 to-cyan-500/40" />
                        <div className="absolute bottom-1 left-1 right-1 bg-black/70 backdrop-blur-sm text-white px-1.5 py-1 rounded-md">
                          <div className="text-xs font-medium text-center leading-tight">{item.text}</div>
                        </div>
                      </>
                    ) : (
                      // Icon mode with centered layout
                      <div className="flex flex-col items-center justify-center p-2">
                        <div className="text-xl mb-1">{item.icon}</div>
                        <div className="text-xs font-medium text-center leading-tight">{item.text}</div>
                      </div>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Procurar palavras..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>

          {/* View Mode */}
          <div className="flex bg-white rounded-lg p-1 border border-gray-300">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded transition-colors ${
                viewMode === "grid" ? "bg-purple-600 text-white" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded transition-colors ${
                viewMode === "list" ? "bg-purple-600 text-white" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Favorites Filter */}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
              showFavoritesOnly
                ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            <Star className="w-4 h-4" />
            Favoritos
          </button>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {category.icon}
              <span className="hidden sm:inline">{category.label}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {grammarCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setGrammarFilter(category.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                grammarFilter === category.id
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200"
              }`}
            >
              {category.icon}
              <span className="hidden sm:inline">{category.label}</span>
            </button>
          ))}
        </div>

        {/* Communication Items */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="text-gray-600">A carregar comunicador...</p>
            </div>
          </div>
        ) : (
          <>
            <div
              className={`grid gap-4 ${
                viewMode === "grid"
                  ? `grid-cols-2 md:grid-cols-${currentUser.preferences.gridSize} lg:grid-cols-${currentUser.preferences.gridSize + 2}`
                  : "grid-cols-1"
              }`}
            >
            {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className={`group relative ${viewMode === "list" ? "flex items-center gap-4 p-4" : "aspect-square"}`}
              onDragStart={() => handleDragStart(item)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              draggable={editMode}
            >
              <button
                onClick={() => handleItemClick(item)}
                className={`aac-button w-full h-full ${getCategoryColor(item.category)} text-white rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 relative overflow-hidden ${
                  viewMode === "list"
                    ? "flex items-center justify-start gap-4 p-4"
                    : "flex items-center justify-center p-0"
                }`}
              >
                {viewMode === "grid" ? (
                  <>
                    {showImages && item.image ? (
                      // Full-size image with overlay
                      <>
                        <img
                          src={item.image || "/images/aac/default/placeholder.svg"}
                          alt={item.text}
                          onError={handleImageError}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg">
                          <div className="text-xs font-medium text-center leading-tight">{item.text}</div>
                        </div>
                      </>
                    ) : showImages ? (
                      // Generated placeholder with overlay
                      <>
                        <img
                          src="/images/aac/default/placeholder.svg"
                          alt={item.text}
                          onError={handleImageError}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg">
                          <div className="text-xs font-medium text-center leading-tight">{item.text}</div>
                        </div>
                      </>
                    ) : (
                      // Icon mode with centered layout
                      <div className="flex flex-col items-center justify-center p-4">
                        <div className="text-4xl mb-2">{item.icon}</div>
                        <div className="text-sm font-medium text-center leading-tight">{item.text}</div>
                      </div>
                    )}
                  </>
                ) : (
                  // List view remains unchanged
                  <>
                    {showImages && item.image ? (
                      <img
                        src={item.image || "/images/aac/default/placeholder.svg"}
                        alt={item.text}
                        onError={handleImageError}
                        className="w-8 h-8 rounded object-cover"
                      />
                    ) : showImages ? (
                      <img
                        src="/images/aac/default/placeholder.svg"
                        alt={item.text}
                        onError={handleImageError}
                        className="w-8 h-8 rounded"
                      />
                    ) : (
                      <div className="text-2xl">{item.icon}</div>
                    )}
                    <div className="font-medium text-lg">{item.text}</div>
                    <div className="flex items-center gap-2 text-sm opacity-75">
                      <Clock className="w-3 h-3" />
                      {item.frequency}x
                    </div>
                    {item.grammarType && item.grammarType !== "complete" && (
                      <div className="text-xs bg-white/20 px-2 py-1 rounded">{item.grammarType}</div>
                    )}
                  </>
                )}
              </button>

              {/* Favorite Toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFavorite(item.id)
                }}
                className={`absolute top-2 right-2 p-1 rounded-full transition-all z-10 ${
                  item.isFavorite
                    ? "bg-yellow-500 text-white"
                    : "bg-black/20 text-white/60 hover:bg-black/40 hover:text-white"
                } opacity-0 group-hover:opacity-100`}
              >
                <Star className="w-3 h-3" />
              </button>

              {/* Difficulty Indicator */}
              <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                {Array.from({ length: item.difficulty }).map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-white/60 rounded-full" />
                ))}
              </div>
            </div>
            ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma palavra encontrada</h3>
                <p className="text-gray-600">Tenta ajustar os filtros ou termo de pesquisa.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Emergency Modal */}
      {showEmergency && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 border border-red-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-red-600 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6" />
                Emergência
              </h3>
              <button
                onClick={() => setShowEmergency(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emergencyItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    addToSentence(item as CommunicationItem)
                    speakText(item.text)
                    setShowEmergency(false)
                  }}
                  className="aac-button bg-red-600 hover:bg-red-700 text-white p-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="text-lg font-medium">{item.text}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Definições</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Visualização
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Modo de Visualização</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-gray-700">
                        <input
                          type="radio"
                          name="displayMode"
                          checked={showImages}
                          onChange={() => setShowImages(true)}
                          className="text-purple-600 focus:ring-purple-500"
                        />
                        Imagens geradas
                      </label>
                      <label className="flex items-center gap-2 text-gray-700">
                        <input
                          type="radio"
                          name="displayMode"
                          checked={!showImages}
                          onChange={() => setShowImages(false)}
                          className="text-purple-600 focus:ring-purple-500"
                        />
                        Ícones emoji
                      </label>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-gray-700">
                    <input type="checkbox" defaultChecked className="rounded text-purple-600 focus:ring-purple-500" />
                    Mostrar texto
                  </label>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tamanho da Grelha</label>
                    <select className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500">
                      <option value="2">2 colunas</option>
                      <option value="3">3 colunas</option>
                      <option value="4">4 colunas</option>
                      <option value="6">6 colunas</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Voice Settings */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Volume2 className="w-5 h-5" />
                  Voz
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Velocidade</label>
                    <input type="range" min="0.5" max="2" step="0.1" defaultValue="1" className="w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tom</label>
                    <input type="range" min="0.5" max="2" step="0.1" defaultValue="1" className="w-full" />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="flex items-center gap-2 text-gray-700">
                    <input type="checkbox" defaultChecked className="rounded text-purple-600 focus:ring-purple-500" />
                    Falar automaticamente ao tocar nas palavras
                  </label>
                </div>
              </div>

              {/* Accessibility */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Acessibilidade
                </h4>
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-gray-700">
                    <input type="checkbox" className="rounded text-purple-600 focus:ring-purple-500" />
                    Controlo por olhar (Eye-tracking)
                  </label>
                  <label className="flex items-center gap-2 text-gray-700">
                    <input type="checkbox" className="rounded text-purple-600 focus:ring-purple-500" />
                    Controlo por sopro
                  </label>
                  <label className="flex items-center gap-2 text-gray-700">
                    <input type="checkbox" className="rounded text-purple-600 focus:ring-purple-500" />
                    Feedback tátil (vibração)
                  </label>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-4">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}


      {showCustomization && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Settings className="w-6 h-6 text-purple-600" />
                Personalizar Comunicador
              </h3>
              <button
                onClick={() => setShowCustomization(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Add New Card Section */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Adicionar Nova Palavra
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Texto</label>
                      <input
                        type="text"
                        value={newCardData.text}
                        onChange={(e) => setNewCardData((prev) => ({ ...prev, text: e.target.value }))}
                        placeholder="Ex: Quero brincar"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ícone</label>
                      <input
                        type="text"
                        value={newCardData.icon}
                        onChange={(e) => setNewCardData((prev) => ({ ...prev, icon: e.target.value }))}
                        placeholder="🎮"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                      <select
                        value={newCardData.category}
                        onChange={(e) => setNewCardData((prev) => ({ ...prev, category: e.target.value as "needs" | "emotions" | "actions" | "people" | "places" | "objects" }))}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="needs">Necessidades</option>
                        <option value="emotions">Emoções</option>
                        <option value="actions">Ações</option>
                        <option value="people">Pessoas</option>
                        <option value="places">Lugares</option>
                        <option value="objects">Objetos</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tipo Gramatical</label>
                      <select
                        value={newCardData.grammarType}
                        onChange={(e) => setNewCardData((prev) => ({ ...prev, grammarType: e.target.value as "subject" | "verb" | "object" | "adjective" | "preposition" | "complete" }))}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="complete">Frase Completa</option>
                        <option value="subject">Sujeito</option>
                        <option value="verb">Verbo</option>
                        <option value="object">Objeto</option>
                        <option value="adjective">Adjetivo</option>
                        <option value="preposition">Preposição</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Dificuldade</label>
                      <select
                        value={newCardData.difficulty}
                        onChange={(e) =>
                          setNewCardData((prev) => ({ ...prev, difficulty: Number.parseInt(e.target.value) as 1 | 2 | 3 }))
                        }
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      >
                        <option value={1}>Fácil</option>
                        <option value={2}>Médio</option>
                        <option value={3}>Difícil</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={addCustomCard}
                    disabled={!newCardData.text.trim()}
                    className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Adicionar Palavra
                  </button>
                </div>
              </div>

              {/* Add New Category Section */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Adicionar Nova Categoria
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Categoria</label>
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Ex: Desportos, Animais, Comida..."
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (newCategoryName.trim()) {
                        setCustomCategories((prev) => [...prev, newCategoryName.toLowerCase().replace(/\s+/g, "_")])
                        setNewCategoryName("")
                      }
                    }}
                    disabled={!newCategoryName.trim()}
                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Package className="w-4 h-4" />
                    Adicionar Categoria
                  </button>
                </div>
              </div>

              {/* Board Layout Section */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Grid className="w-5 h-5" />
                  Layout do Tabuleiro
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Modo de Edição</span>
                    <button
                      onClick={() => setEditMode(!editMode)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        editMode ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {editMode ? "Ativo" : "Inativo"}
                    </button>
                  </div>

                  {editMode && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <p className="text-sm text-orange-800">
                        <strong>Modo de Edição Ativo:</strong> Arrasta as palavras para reorganizar a posição no
                        tabuleiro.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-4">
              <button
                onClick={() => setShowCustomization(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {showAIGenerator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                Gerador IA
              </h3>
              <button
                onClick={() => setShowAIGenerator(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Generate Category Section */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Gerar Nova Categoria
                </h4>
                <div className="bg-gradient-to-r from-purple-50 to-cyan-50 rounded-lg p-4 border border-purple-200 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descreve a categoria que queres criar
                    </label>
                    <textarea
                      placeholder="Ex: Palavras sobre animais domésticos, atividades de verão, comida italiana..."
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>

                  <button
                    onClick={() => generateAICategory("Animais domésticos")}
                    disabled={isGenerating}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        A gerar categoria...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Gerar Categoria com IA
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Generate Cards Section */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Gerar Novas Palavras
                </h4>
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border border-blue-200 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tema ou contexto</label>
                      <input
                        type="text"
                        placeholder="Ex: escola, família, hobbies..."
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Número de palavras</label>
                      <select className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value={6}>6 palavras</option>
                        <option value={12}>12 palavras</option>
                        <option value={18}>18 palavras</option>
                        <option value={24}>24 palavras</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nível de dificuldade</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="difficulty" value="1" defaultChecked className="text-blue-600" />
                        <span className="text-gray-700">Fácil</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="difficulty" value="2" className="text-blue-600" />
                        <span className="text-gray-700">Médio</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="difficulty" value="3" className="text-blue-600" />
                        <span className="text-gray-700">Difícil</span>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={() => generateAICards("escola", 6)}
                    disabled={isGenerating}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        A gerar palavras...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4" />
                        Gerar Palavras com IA
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* AI Suggestions for Improvement */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Sugestões de Melhoria
                </h4>
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-gray-700">
                      <strong>Palavras em falta:</strong> Baseado no uso, sugiro adicionar palavras sobre "tempo" e
                      "sentimentos complexos".
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-gray-700">
                      <strong>Organização:</strong> Considera criar uma categoria "Rotina Diária" para palavras mais
                      usadas de manhã.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-gray-700">
                      <strong>Progressão:</strong> Adiciona mais verbos para construir frases mais complexas.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-4">
              <button
                onClick={() => setShowAIGenerator(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {showGamification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Progresso e Conquistas</h3>
              <button onClick={() => setShowGamification(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Stats Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl">
                  <div className="text-2xl font-bold">{gamificationStats.level}</div>
                  <div className="text-sm opacity-90">Nível</div>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-xl">
                  <div className="text-2xl font-bold">{gamificationStats.totalPoints}</div>
                  <div className="text-sm opacity-90">Pontos</div>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl">
                  <div className="text-2xl font-bold">{gamificationStats.dailyStreak}</div>
                  <div className="text-sm opacity-90">Dias Seguidos</div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl">
                  <div className="text-2xl font-bold">{gamificationStats.wordsSpokenTotal}</div>
                  <div className="text-sm opacity-90">Palavras Faladas</div>
                </div>
              </div>

              {/* Progress to Next Level */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">Progresso para Nível {gamificationStats.level + 1}</h4>
                  <span className="text-sm text-gray-600">
                    {gamificationStats.experiencePoints} /{" "}
                    {gamificationStats.experiencePoints + gamificationStats.experienceToNextLevel} XP
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                    style={{
                      width: `${(gamificationStats.experiencePoints / (gamificationStats.experiencePoints + gamificationStats.experienceToNextLevel)) * 100}%`,
                    }}
                  />
                </div>
              </div>


              {/* Virtual Garden */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                <h4 className="text-xl font-semibold text-green-800 mb-4">🌱 Jardim Virtual</h4>
                <p className="text-green-700 mb-4">
                  O seu jardim cresce com a sua comunicação! Nível atual: {gamificationStats.gardenLevel}
                </p>
                <div className="flex items-center gap-2 text-2xl">
                  {Array.from({ length: gamificationStats.gardenLevel }, (_, i) => (
                    <span key={i}>🌸</span>
                  ))}
                  {Array.from({ length: Math.max(0, 5 - gamificationStats.gardenLevel) }, (_, i) => (
                    <span key={i} className="opacity-30">
                      🌱
                    </span>
                  ))}
                </div>
              </div>

              {/* Virtual Companion */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                <h4 className="text-xl font-semibold text-blue-800 mb-4">🐾 Companheiro Virtual</h4>
                <p className="text-blue-700 mb-4">
                  O seu companheiro fica mais feliz quando comunica! Nível atual: {gamificationStats.companionLevel}
                </p>
                <div className="text-4xl">
                  {gamificationStats.companionLevel >= 3 ? "😸" : gamificationStats.companionLevel >= 2 ? "😊" : "🙂"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRewards && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Loja de Recompensas</h3>
                <p className="text-gray-600">Pontos disponíveis: {gamificationStats.totalPoints}</p>
              </div>
              <button onClick={() => setShowRewards(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rewards.map((reward) => (
                  <div
                    key={reward.id}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      reward.unlocked
                        ? "bg-green-50 border-green-200"
                        : gamificationStats.totalPoints >= reward.cost
                          ? "bg-white border-purple-200 hover:border-purple-300"
                          : "bg-gray-50 border-gray-200 opacity-60"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{reward.icon}</div>
                      <h5 className="font-semibold text-gray-900 mb-1">{reward.title}</h5>
                      <p className="text-sm text-gray-600 mb-3">{reward.description}</p>

                      {reward.unlocked ? (
                        <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm font-medium">
                          ✓ Desbloqueado
                        </div>
                      ) : (
                        <button
                          onClick={() => purchaseReward(reward.id)}
                          disabled={gamificationStats.totalPoints < reward.cost}
                          className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            gamificationStats.totalPoints >= reward.cost
                              ? "bg-purple-600 text-white hover:bg-purple-700"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          {reward.cost} pontos
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showLevelUpAnimation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8 rounded-2xl text-center animate-bounce">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-2xl font-bold mb-2">Nível {gamificationStats.level}!</h3>
            <p className="text-lg">Parabéns! Subiu de nível!</p>
          </div>
        </div>
      )}


      {/* ... existing modals and content ... */}
    </div>
  )
}
