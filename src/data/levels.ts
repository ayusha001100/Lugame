import { GameLevel, Room } from '@/types/game';
import officeHubImg from '@/assets/office-hub.png';
import roomMarketingImg from '@/assets/room-marketing.png';
import roomContentImg from '@/assets/room-content.png';
import roomAdsImg from '@/assets/room-ads.png';
import roomAnalyticsImg from '@/assets/room-analytics.png';
import roomManagerImg from '@/assets/room-manager.png';

export const GAME_LEVELS: GameLevel[] = [
  {
    id: 1,
    title: "The NovaMind Launch",
    subtitle: "Copywriting & Messaging",
    description: "Phase 1 of your internship. Transform NovaMind's weak landing page into a high-converting machine.",
    room: 'marketing',
    npcName: "Sarah Chen",
    npcRole: "Marketing Manager",
    npcDialogue: [
      {
        id: 'start',
        text: "Welcome to the pressure cooker! NovaMind launches in 48 hours. Our current headline is generic trash. Let's fix it.",
        options: [
          { text: "I'm ready. Show me the current data.", nextId: 'mission', impact: { trust: 5 } },
          { text: "48 hours? That's tight.", nextId: 'mission', impact: { trust: -2 } }
        ]
      },
      {
        id: 'mission',
        text: "We're running a 3-phase sprint: Diagnose the weakness, Build the solution, and Improve based on my feedback. Go!",
        emotion: 'serious'
      }
    ],
    phases: [
      {
        id: 'phase-1-a',
        type: 'diagnose',
        title: "Phase A: Recognition",
        description: "Identify the strongest headline among the options.",
        taskType: 'mcq',
        taskData: {
          options: [
            "NovaMind: The Best AI for Work",
            "Stop Wasting 5 Hours Every Day with NovaMind",
            "Automate Your Future Today",
            "A New Way to Handle Tasks"
          ],
          correct: "Stop Wasting 5 Hours Every Day with NovaMind"
        },
        taskPrompt: "Sarah wants a 'pain-focused' headline. Which one hits hardest?",
        stipendReward: 500,
      },
      {
        id: 'phase-1-b',
        type: 'build',
        title: "Phase B: Construction",
        description: "Assemble the CTA using the chip-bank.",
        taskType: 'fill-blanks',
        taskData: {
          text: "{0} Your {1} Productivity {2}",
          chips: ["Unlock", "Instant", "Today", "Now", "Workflow", "10x", "Boost"],
          correct: ["Unlock", "Workflow", "Today"]
        },
        taskPrompt: "Build a high-impact CTA for the 'Sign Up' button.",
        stipendReward: 700,
      },
      {
        id: 'phase-1-c',
        type: 'improve',
        title: "Phase C: Optimization",
        description: " Sarah says the headline is 'good but needs more proof'. Patch it.",
        taskType: 'short-answer',
        taskPrompt: "Rewrite 'Stop Wasting 5 Hours Every Day' to include a specific ROI metric.",
        taskData: { expectedKeywords: ["%", "$", "increase", "save", "ROI"] },
        taskHints: ["Mention $ savings or % growth", "Keep it punchy"],
        stipendReward: 800,
      }
    ],
    difficulty: 'easy',
    competencies: ["Copywriting", "Pain-Agitate-Solve"],
    rubric: {
      criteria: [
        { name: "Metric Focus", description: "Includes quantitative proof", weight: 50, examples: { good: "Save $500/mo", bad: "Work faster" } },
        { name: "Psychological Trigger", description: "Uses Fear of Loss or Gain", weight: 50, examples: { good: "Don't get left behind", bad: "It's a nice tool" } }
      ],
      passingScore: 70,
      maxAttempts: 3
    },
    xpReward: 300,
    stipendReward: 2000,
    isPremium: false,
    simulationImpact: { conversionRate: 2.5, leads: 100 },
  },
  {
    id: 2,
    title: "The Hook Arena",
    subtitle: "Ad Creative Swipe",
    description: "Rapid-fire decision making. Marcus needs to know which hooks are scroll-stoppers.",
    room: 'ads',
    npcName: "Marcus Rivera",
    npcRole: "Paid Media Lead",
    npcDialogue: [
      {
        id: 'start',
        text: "I don't have time for essays. I need to know if you can spot a winning hook in 2 seconds. Swipe right for Approve, Left for Reject.",
        emotion: 'excited'
      }
    ],
    taskType: 'swipe',
    taskData: {
      items: [
        { id: '1', text: "The secret AI hack nobody told you...", label: 'Good', type: 'approve' },
        { id: '2', text: "NovaMind is a very cool software for everyone.", label: 'Bad', type: 'reject' },
        { id: '3', text: "Stop doing your own admin work.", label: 'Good', type: 'approve' },
        { id: '4', text: "Our pricing is very competitive and fair.", label: 'Bad', type: 'reject' },
        { id: '5', text: "Your competitors are already using this.", label: 'Good', type: 'approve' }
      ]
    },
    taskPrompt: "Swipe RIGHT if the hook uses a psychological trigger (Curiosity, Pain, Status). Swipe LEFT if it's generic.",
    difficulty: 'easy',
    competencies: ["Ad Creative", "Consumer Psychology"],
    rubric: {
      criteria: [{ name: "Accuracy", description: "Correct swiping", weight: 100, examples: { good: "5/5", bad: "0/5" } }],
      passingScore: 80,
      maxAttempts: 2
    },
    xpReward: 250,
    stipendReward: 1000,
    isPremium: false,
    simulationImpact: { roas: 0.8, cac: -15 },
  },
  {
    id: 3,
    title: "SEO Detective",
    subtitle: "Keyword & Intent Analysis",
    description: "Elena needs you to audit a competitor's blog post. Spot the weak intent and fix the structure.",
    room: 'content',
    npcName: "Elena Vasquez",
    npcRole: "Content Strategist",
    npcDialogue: [
      {
        id: 'start',
        text: "The CMO wants us to outrank 'NovaMind' for 'AI Productivity'. But first, you need to spot where our competitors are failing.",
        emotion: 'thinking'
      }
    ],
    phases: [
      {
        id: 'phase-a',
        type: 'diagnose',
        title: "Phase A: Markup",
        description: "Highlight the weak, 'generic' phrases in this competitor's intro.",
        taskType: 'markup',
        taskData: {
          text: "Artificial Intelligence is very important for the future of modern business and work environments today.",
          targets: ["very important", "future of modern business", "work environments today"]
        },
        taskPrompt: "Highlight 2-3 phrases that lack specific meaning (fluff).",
        stipendReward: 700,
      },
      {
        id: 'phase-b',
        type: 'build',
        title: "Phase B: Construction",
        description: "Arrange the H2 headings for a 'Topic Cluster' strategy.",
        taskType: 'rank-order',
        taskData: {
          items: [
            "1. What is AI?",
            "2. Top 5 AI Productivity Hacks",
            "3. NovaMind vs Competitors",
            "4. Case Study: 200% Growth with AI"
          ]
        },
        taskPrompt: "Order these headings to follow a logical reader journey (Awareness → Interest → Intent).",
        stipendReward: 800,
      }
    ],
    difficulty: 'medium',
    competencies: ["SEO", "Content Strategy"],
    rubric: {
      criteria: [
        { name: "Strategic Intent", description: "Correct flow of information", weight: 60, examples: { good: "Case study last", bad: "Case study first" } },
        { name: "Critical Thinking", description: "Identifying weak copy", weight: 40, examples: { good: "Spotting fluff", bad: "Ignoring generic text" } }
      ],
      passingScore: 75,
      maxAttempts: 2
    },
    xpReward: 400,
    stipendReward: 1500,
    isPremium: false,
    simulationImpact: { conversionRate: 1.2, leads: 80 }
  },
  {
    id: 4,
    title: "Strategy Calibration",
    subtitle: "MCQ Assessment",
    description: "The team wants to see if you understand the core funnel mechanics before we let you handle the big bucks.",
    room: 'marketing',
    npcName: "Sarah Chen",
    npcRole: "Marketing Manager",
    npcDialogue: [
      {
        id: 'start',
        text: "Quick pulse check. How do we handle low BOFU conversion with high TOFU traffic?",
        emotion: 'thinking'
      }
    ],
    taskType: 'mcq',
    taskData: {
      options: [
        "Increase awareness spend",
        "Retarget with social proof",
        "Change the product logo",
        "Run an SEO audit"
      ],
      correct: "Retarget with social proof"
    },
    taskPrompt: "Select the most effective tactic to improve Bottom-of-Funnel (BOFU) conversion when Top-of-Funnel traffic is already high.",
    taskHints: ["Think about Trust vs Awareness", "What moves someone from 'considering' to 'buying'?"],
    rubric: {
      criteria: [{ name: "Accuracy", description: "Correct selection", weight: 100, examples: { good: "Correct", bad: "Incorrect" } }],
      passingScore: 100,
      maxAttempts: 1
    },
    xpReward: 150,
    stipendReward: 500,
    isPremium: false,
    competencies: ["Funnel Strategy"],
    simulationImpact: { conversionRate: 2.0 },
    difficulty: 'easy'
  },
  {
    id: 5,
    title: "SEO Tectonics",
    subtitle: "Semantic Keyword Mapping",
    description: "Elena needs a content map. This isn't just about keywords; it's about semantic authority.",
    room: 'content',
    npcName: "Elena Vasquez",
    npcRole: "Content Strategist",
    npcDialogue: [
      {
        id: 'start',
        text: "Content is royalty here. But only if it ranks. I need a content plan for our AI pillar page.",
        options: [
          { text: "Let's build a topic cluster that Google can't ignore.", nextId: 'mission', impact: { trust: 8 } },
          { text: "Can we just use AI to write it?", nextId: 'mission', impact: { trust: -10 } }
        ]
      },
      {
        id: 'mission',
        text: "Authority is earned, not generated. I need a primary keyword and 3 supporting LSI keywords for NovaMind.",
        emotion: 'serious'
      }
    ],
    taskType: 'short-answer',
    taskPrompt: "Identify 1 primary keyword and 3 long-tail LSI keywords for a blog post about 'AI workflow automation for small businesses'.",
    taskHints: ["Look for high intent, low difficulty", "Supporting keywords should answer 'How' or 'Why'"],
    rubric: {
      criteria: [
        { name: "Search Intent", description: "Do these keywords match buyers?", weight: 50, examples: { good: "AI for agency owners", bad: "What is AI?" } },
        { name: "Semantic Coverage", description: "How well do they cover the topic?", weight: 50, examples: { good: "Topic clustering", bad: "Repetitive keywords" } }
      ],
      passingScore: 75,
      maxAttempts: 2
    },
    xpReward: 400,
    stipendReward: 2000,
    isPremium: false,
    competencies: ["SEO", "Content Strategy"],
    simulationImpact: { conversionRate: 0.5, leads: 100 },
    difficulty: 'hard'
  },
  {
    id: 6,
    title: "Budget Battlefield",
    subtitle: "Budget Allocation Sim",
    description: "You have $10,000. Allocate it across channels to maximize ROI.",
    room: 'ads',
    npcName: "Marcus Rivera",
    npcRole: "Paid Media Lead",
    npcDialogue: [
      {
        id: 'start',
        text: "The CMO just handed us a 10k test budget. Don't blow it.",
        emotion: 'serious'
      }
    ],
    taskType: 'rank-order',
    taskData: {
      items: ["Google Search (High Intent)", "Meta Ads (Retargeting)", "LinkedIn (B2B)", "TikTok (Awareness)"]
    },
    taskPrompt: "Rank these channels in order of highest expected ROI for a B2B SaaS product like NovaMind.",
    taskHints: ["High intent search usually wins for ROI", "Retargeting is efficient but limited", "B2B belongs on LinkedIn"],
    rubric: {
      criteria: [{ name: "Prioritization", description: "Logical ranking", weight: 100, examples: { good: "Search first", bad: "TikTok first for B2B" } }],
      passingScore: 80,
      maxAttempts: 2
    },
    xpReward: 500,
    stipendReward: 3000,
    isPremium: true,
    competencies: ["Media Planning", "Budget Allocation"],
    simulationImpact: { roas: 1.2, budgetSpent: 10000 },
    difficulty: 'hard'
  }
];

export const OFFICE_ROOMS: Room[] = [
  {
    id: 'marketing',
    name: 'Marketing HQ',
    description: 'Strategy and campaign planning happens here',
    icon: '📊',
    levels: [1, 4],
    unlocked: true,
    image: roomMarketingImg
  },
  {
    id: 'ads',
    name: 'Ads Lab',
    description: 'Paid media command center',
    icon: '🎯',
    levels: [2, 6],
    unlocked: true,
    image: roomAdsImg
  },
  {
    id: 'content',
    name: 'Content Studio',
    description: 'Where stories come to life',
    icon: '✍️',
    levels: [3, 5],
    unlocked: true,
    image: roomContentImg
  },
  {
    id: 'analytics',
    name: 'Analytics War Room',
    description: 'Data-driven decision making',
    icon: '📈',
    levels: [9, 10],
    unlocked: true,
    image: roomAnalyticsImg
  },
  {
    id: 'manager',
    name: 'Executive Suite',
    description: 'Meet the founders and lead management',
    icon: '🏢',
    levels: [],
    unlocked: true,
    image: roomManagerImg
  }
];

export const OFFICE_HUB_IMAGE = officeHubImg;

export const AVATAR_STYLES = {
  male: [
    { id: 1, label: 'Professional', colors: ['#D4AF37', '#111111'] },
    { id: 2, label: 'Creative', colors: ['#FFD700', '#1A1A1A'] },
    { id: 3, label: 'Executive', colors: ['#B8860B', '#000000'] },
  ],
  female: [
    { id: 1, label: 'Professional', colors: ['#D4AF37', '#111111'] },
    { id: 2, label: 'Creative', colors: ['#FFD700', '#1A1A1A'] },
    { id: 3, label: 'Executive', colors: ['#B8860B', '#000000'] },
  ],
  neutral: [
    { id: 1, label: 'Professional', colors: ['#D4AF37', '#111111'] },
    { id: 2, label: 'Creative', colors: ['#FFD700', '#1A1A1A'] },
    { id: 3, label: 'Executive', colors: ['#B8860B', '#000000'] },
  ],
};
