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
    title: "THE NOVAMIND LAUNCH",
    subtitle: "Copywriting & Messaging",
    description: "Validate messaging fundamentals before strategy access.",
    room: 'marketing',
    npcName: "Sarah Chen",
    npcRole: "Marketing Manager",
    npcDialogue: [
      {
        id: 'start',
        text: "Welcome to the pressure cooker! NovaMind launches in 48 hours. Our current headline is generic trash. Let's fix it.",
        emotion: 'serious'
      }
    ],
    phases: [
      {
        id: 'phase-1-a',
        type: 'diagnose',
        title: "Mission 01: MCQ 1",
        description: "Primary goal of launch messaging",
        taskType: 'mcq',
        taskData: {
          options: [
            "Sound creative",
            "Explain every feature",
            "Communicate core value clearly",
            "Match competitor tone"
          ],
          correct: "Communicate core value clearly"
        },
        taskPrompt: "What is the PRIMARY goal of launch messaging?",
        stipendReward: 100,
      },
      {
        id: 'phase-1-b',
        type: 'diagnose',
        title: "Mission 01: MCQ 2",
        description: "Strong headline focus",
        taskType: 'mcq',
        taskData: {
          options: [
            "Brand history",
            "User benefit",
            "Internal vision",
            "Pricing"
          ],
          correct: "User benefit"
        },
        taskPrompt: "A strong headline should focus on:",
        stipendReward: 100,
      },
      {
        id: 'phase-1-c',
        type: 'diagnose',
        title: "Mission 01: MCQ 3",
        description: "Audience insight",
        taskType: 'mcq',
        taskData: {
          options: [
            "Age only",
            "Job title",
            "Pain point",
            "Location"
          ],
          correct: "Pain point"
        },
        taskPrompt: "Which audience insight matters MOST for copy?",
        stipendReward: 100,
      },
      {
        id: 'phase-1-d',
        type: 'build',
        title: "Mission 01: Fill 1",
        description: "Messaging criteria",
        taskType: 'fill-blanks',
        taskData: {
          text: "Messaging should be clear, concise, and {0}.",
          chips: ["Relevant", "Abstract", "Technical", "Long"],
          correct: ["Relevant"]
        },
        taskPrompt: "Complete the statement about effective messaging.",
        stipendReward: 100,
      },
      {
        id: 'phase-1-e',
        type: 'build',
        title: "Mission 01: Fill 2",
        description: "CTA purpose",
        taskType: 'fill-blanks',
        taskData: {
          text: "A CTA tells the user what to do {0}.",
          chips: ["Next", "Yesterday", "Never", "Randomly"],
          correct: ["Next"]
        },
        taskPrompt: "What does a CTA tell the user?",
        stipendReward: 100,
      }
    ],
    difficulty: 'easy',
    competencies: ["Copywriting", "Messaging"],
    rubric: {
      criteria: [
        { name: "Clarity", description: "Clear communication of value", weight: 50, examples: { good: "Direct benefit", bad: "Vague features" } },
        { name: "Engagement", description: "Hooking the audience", weight: 50, examples: { good: "Pain point focus", bad: "Generic tone" } }
      ],
      passingScore: 70,
      maxAttempts: 3
    },
    xpReward: 300,
    stipendReward: 500,
    isPremium: false,
    simulationImpact: { conversionRate: 1.5 },
  },
  {
    id: 2,
    title: "STRATEGY CALIBRATION",
    subtitle: "MCQ Assessment",
    description: "Ensure intern understands strategic thinking.",
    room: 'marketing',
    npcName: "Sarah Chen",
    npcRole: "Marketing Manager",
    npcDialogue: [
      {
        id: 'start',
        text: "Strategy comes before execution. Let's see if you've got the mindset.",
        emotion: 'thinking'
      }
    ],
    phases: [
      {
        id: 'phase-4-a',
        type: 'diagnose',
        title: "Strategy Choice",
        description: "Why strategy first?",
        taskType: 'mcq',
        taskData: {
          options: ["Budget", "Tools", "Direction", "Creatives"],
          correct: "Direction"
        },
        taskPrompt: "Strategy comes BEFORE execution because it defines:",
        stipendReward: 100
      },
      {
        id: 'phase-4-b',
        type: 'diagnose',
        title: "KPI Importance",
        description: "Campaign without KPIs",
        taskType: 'mcq',
        taskData: {
          options: ["Flexible", "Creative", "Unmeasurable", "Agile"],
          correct: "Unmeasurable"
        },
        taskPrompt: "A campaign without KPIs is:",
        stipendReward: 100
      },
      {
        id: 'phase-4-c',
        type: 'diagnose',
        title: "Audience Definition",
        description: "Reducing noise",
        taskType: 'mcq',
        taskData: {
          options: ["Reach", "Cost", "Confusion", "Creativity"],
          correct: "Confusion"
        },
        taskPrompt: "Target audience definition helps reduce:",
        stipendReward: 100
      }
    ],
    difficulty: 'easy',
    competencies: ["Strategic Thinking", "Funnel Strategy"],
    rubric: {
      criteria: [{ name: "Accuracy", description: "Correct selection", weight: 100, examples: { good: "Correct", bad: "Incorrect" } }],
      passingScore: 70,
      maxAttempts: 3
    },
    xpReward: 150,
    stipendReward: 300,
    isPremium: false,
    simulationImpact: { conversionRate: 1.0 },
  },
  {
    id: 3,
    title: "THE HOOK ARENA",
    subtitle: "Ad Creative Swipe",
    description: "Identify high-performing hooks.",
    room: 'ads',
    npcName: "Marcus Rivera",
    npcRole: "Paid Media Lead",
    npcDialogue: [
      {
        id: 'start',
        text: "In ads, the hook is everything. You have 3 seconds to catch them.",
        emotion: 'excited'
      }
    ],
    phases: [
      {
        id: 'phase-2-a',
        type: 'diagnose',
        title: "Hook Purpose",
        description: "What is a hook?",
        taskType: 'mcq',
        taskData: {
          options: ["Explain product", "Capture attention instantly", "Show branding", "Add creativity"],
          correct: "Capture attention instantly"
        },
        taskPrompt: "A “hook” in ads is meant to:",
        stipendReward: 50
      },
      {
        id: 'phase-2-b',
        type: 'diagnose',
        title: "Cold Audiences",
        description: "Best style for cold traffic",
        taskType: 'mcq',
        taskData: {
          options: ["Feature list", "Problem-based opening", "Long storytelling", "Testimonials"],
          correct: "Problem-based opening"
        },
        taskPrompt: "Best hook style for cold audiences:",
        stipendReward: 50
      },
      {
        id: 'phase-2-c',
        type: 'diagnose',
        title: "Scroll Stopping",
        description: "Ad focus",
        taskType: 'mcq',
        taskData: {
          options: ["Logo", "Headline", "Hook", "CTA"],
          correct: "Hook"
        },
        taskPrompt: "Scroll-stopping ads focus MOST on:",
        stipendReward: 50
      },
      {
        id: 'phase-2-d',
        type: 'build',
        title: "Performance Window",
        description: "Time to decide",
        taskType: 'fill-blanks',
        taskData: {
          text: "The first {0} seconds decide ad performance.",
          chips: ["3", "10", "30", "60"],
          correct: ["3"]
        },
        taskPrompt: "How long do you have to hook a user?",
        stipendReward: 50
      },
      {
        id: 'phase-2-e',
        type: 'build',
        title: "Testing Hooks",
        description: "Methodology",
        taskType: 'fill-blanks',
        taskData: {
          text: "Hooks are tested using {0} testing.",
          chips: ["A/B", "Beta", "Gamma", "Unit"],
          correct: ["A/B"]
        },
        taskPrompt: "Select the testing method for hooks.",
        stipendReward: 50
      }
    ],
    difficulty: 'easy',
    competencies: ["Ad Creative", "Consumer Psychology"],
    rubric: {
      criteria: [{ name: "Accuracy", description: "Correct identification", weight: 100, examples: { good: "5/5", bad: "0/5" } }],
      passingScore: 70,
      maxAttempts: 3
    },
    xpReward: 250,
    stipendReward: 250,
    isPremium: false,
    simulationImpact: { roas: 0.2 },
  },
  {
    id: 4,
    title: "BUDGET BATTLEFIELD",
    subtitle: "Budget Allocation Simulation",
    description: "Make profit-driven decisions under constraints.",
    room: 'ads',
    npcName: "Marcus Rivera",
    npcRole: "Paid Media Lead",
    npcDialogue: [
      {
        id: 'start',
        text: "Money talks. Let's see if you can scale without breaking the bank.",
        emotion: 'serious'
      }
    ],
    phases: [
      {
        id: 'phase-6-a',
        type: 'diagnose',
        title: "Scaling Budget",
        description: "When to increase spend",
        taskType: 'mcq',
        taskData: {
          options: ["CTR is high", "CPM is low", "ROAS is profitable", "Frequency increases"],
          correct: "ROAS is profitable"
        },
        taskPrompt: "Budget should be increased when:",
        stipendReward: 100
      },
      {
        id: 'phase-6-b',
        type: 'diagnose',
        title: "Killing Ad Sets",
        description: "Termination criteria",
        taskType: 'mcq',
        taskData: {
          options: ["It’s new", "It has low impressions", "It consistently loses money", "It has low likes"],
          correct: "It consistently loses money"
        },
        taskPrompt: "Killing an ad set is justified when:",
        stipendReward: 100
      },
      {
        id: 'phase-6-c',
        type: 'diagnose',
        title: "Risk Reduction",
        description: "Diversifying spend",
        taskType: 'mcq',
        taskData: {
          options: ["Creativity", "Risk", "Reach", "Control"],
          correct: "Risk"
        },
        taskPrompt: "Diversifying spend helps reduce:",
        stipendReward: 100
      },
      {
        id: 'phase-6-d',
        type: 'build',
        title: "Data vs Emotions",
        description: "Decision making",
        taskType: 'fill-blanks',
        taskData: {
          text: "Budget decisions should be based on {0} not emotions.",
          chips: ["Data", "Hype", "Opinion", "Hope"],
          correct: ["Data"]
        },
        taskPrompt: "What should guide budget decisions?",
        stipendReward: 100
      },
      {
        id: 'phase-6-e',
        type: 'build',
        title: "Scaling Hazards",
        description: "Potential breakage",
        taskType: 'fill-blanks',
        taskData: {
          text: "Scaling too fast can break ad {0}.",
          chips: ["Performance", "Layout", "Logo", "Servers"],
          correct: ["Performance"]
        },
        taskPrompt: "What can break if you scale too fast?",
        stipendReward: 100
      }
    ],
    difficulty: 'hard',
    competencies: ["Media Planning", "Budget Allocation", "Performance Marketing"],
    rubric: {
      criteria: [{ name: "Decision Logic", description: "Profit-driven choices", weight: 100, examples: { good: "Scaling ROAS", bad: "Spending on ego" } }],
      passingScore: 70,
      maxAttempts: 2
    },
    xpReward: 500,
    stipendReward: 500,
    isPremium: true,
    simulationImpact: { roas: 0.5, budgetSpent: 5000 },
  },
  {
    id: 5,
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
    id: 6,
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
  }
];

export const OFFICE_ROOMS: Room[] = [
  {
    id: 'marketing',
    name: 'Marketing HQ',
    description: 'Strategy and campaign planning happens here',
    icon: '📊',
    levels: [1, 2],
    unlocked: true,
    image: roomMarketingImg
  },
  {
    id: 'ads',
    name: 'Ads Lab',
    description: 'Paid media command center',
    icon: '🎯',
    levels: [3, 4],
    unlocked: true,
    image: roomAdsImg
  },
  {
    id: 'content',
    name: 'Content Studio',
    description: 'Where stories come to life',
    icon: '✍️',
    levels: [5, 6],
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
