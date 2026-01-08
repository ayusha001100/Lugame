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
        title: "Mission 01: Value Extraction",
        description: "Spot the core value proposition.",
        taskType: 'mcq',
        evaluationMode: 'exact_match',
        taskData: {
          options: [
            "Welcome to NovaMind",
            "NovaMind: The Future Is Here",
            "Finish 3x More Work With AI Assistance",
            "An AI Platform for Everyone"
          ],
          correct: "Finish 3x More Work With AI Assistance"
        },
        taskPrompt: "Which headline best communicates tangible value to our target users?",
        stipendReward: 100,
      },
      {
        id: 'phase-1-b',
        type: 'build',
        title: "Mission 02: Audience Resonator",
        description: "Draft a headline for a specific segment.",
        taskType: 'short-answer',
        evaluationMode: 'ai_semantic',
        taskData: {
          criteria: ["clarity", "audience_fit", "simplicity"]
        },
        taskPrompt: "Write a simple, 1-sentence headline for NovaMind specifically targeting 'Overwhelmed College Students' before finals week.",
        stipendReward: 150,
      },
      {
        id: 'phase-1-c',
        type: 'diagnose',
        title: "Mission 03: Intent Mapping",
        description: "Match headlines to user intent.",
        taskType: 'match-following',
        evaluationMode: 'pair_match',
        taskData: {
          pairs: [
            { left: "How AI Automates Your Filing", right: "Educational/Awareness" },
            { left: "Get Started Free Today", right: "Action/Conversion" },
            { left: "Why NovaMind Beats Manual Entry", right: "Comparison/Interest" }
          ]
        },
        taskPrompt: "Match the following headlines to their appropriate stage in the customer journey.",
        stipendReward: 200,
      }
    ],
    difficulty: 'easy',
    competencies: ["Copywriting", "Messaging", "Consumer Psychology"],
    rubric: {
      criteria: [
        { name: "Clarity", description: "Clear communication of value", weight: 40, examples: { good: "Direct benefit", bad: "Vague features" } },
        { name: "Audience Fit", description: "Relevance to the target segment", weight: 30, examples: { good: "Student-focused", bad: "Corporate jargon" } },
        { name: "Simplicity", description: "Concise and impact-driven", weight: 30, examples: { good: "Under 10 words", bad: "Run-on sentences" } }
      ],
      passingScore: 70,
      maxAttempts: 3,
      feedbackDialogues: {
        high: "Strong clarity. You’re thinking in outcomes, not words. That’s how strategists operate. Proceed.",
        medium: "Decent work. Your thinking is right, but your execution needs tightening. Refine your messaging and move forward.",
        low: "This doesn’t communicate value clearly. Rethink the user’s problem first — then write."
      }
    },
    xpReward: 300,
    stipendReward: 500,
    isPremium: false,
    simulationImpact: { conversionRate: 1.5 },
  },
  {
    id: 2,
    title: "STRATEGY CALIBRATION",
    subtitle: "Strategic Frameworks",
    description: "Align your tactical decisions with high-level business goals.",
    room: 'marketing',
    npcName: "Sarah Chen",
    npcRole: "Marketing Manager",
    npcDialogue: [
      {
        id: 'start',
        text: "Strategy comes before execution. Let's see if you can handle the complexity of a multi-variable launch.",
        emotion: 'thinking'
      }
    ],
    phases: [
      {
        id: 'phase-2-a',
        type: 'diagnose',
        title: "Directional Audit",
        description: "Identify the strategic missing link.",
        taskType: 'mcq',
        evaluationMode: 'exact_match',
        taskData: {
          options: ["Budget Constraints", "Competitive Tools", "North Star Direction", "Creative Assets"],
          correct: "North Star Direction"
        },
        taskPrompt: "A campaign is failing despite high clicks and low CPC. What is most likely missing from the original strategy?",
        stipendReward: 100
      },
      {
        id: 'phase-2-b',
        type: 'build',
        title: "Variable Positioning",
        description: "Create a positioning statement under constraints.",
        taskType: 'variable-writing',
        evaluationMode: 'ai_contextual',
        taskData: {
          variables: {
            competitor: "Zapier",
            audience: "Startup Founders",
            pain_point: "Tool Overload"
          },
          criteria: ["positioning", "differentiation", "clarity"]
        },
        taskPrompt: "Based on the variables provided, draft a 1-sentence value proposition that separates NovaMind from the competitor while solving the specific pain point.",
        stipendReward: 200
      }
    ],
    difficulty: 'medium',
    competencies: ["Strategic Thinking", "Positioning", "Competitive Analysis"],
    rubric: {
      criteria: [
        { name: "Positioning", description: "Unique angle against competitors", weight: 40, examples: { good: "Better than X because Y", bad: "We are good" } },
        { name: "Differentiation", description: "Clear unique selling point", weight: 30, examples: { good: "All-in-one vs modular", bad: "Just like them" } },
        { name: "Clarity", description: "Ability to explain complex strategy simply", weight: 30, examples: { good: "Simple solution", bad: "Word salad" } }
      ],
      passingScore: 75,
      maxAttempts: 3,
      feedbackDialogues: {
        high: "You're thinking beyond campaigns — you're thinking business. This is high-level stuff.",
        medium: "Logical approach, but watch your margins. The differentiation could be sharper.",
        low: "This feels tactical. Come back when your thinking scales to the entire business model."
      }
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
    description: "Identify high-performing hooks that stop the scroll.",
    room: 'ads',
    npcName: "Marcus Rivera",
    npcRole: "Paid Media Lead",
    npcDialogue: [
      {
        id: 'start',
        text: "In ads, the hook is everything. You have 3 seconds to catch them or you're burning my budget.",
        emotion: 'excited'
      }
    ],
    phases: [
      {
        id: 'phase-3-a',
        type: 'diagnose',
        title: "Stop the Scroll",
        description: "Identify the strongest pattern interrupt.",
        taskType: 'mcq',
        evaluationMode: 'exact_match',
        taskData: {
          options: [
            "Meet NovaMind: The AI tool",
            "Stop wasting 4 hours a week on filing",
            "We are the #1 rated AI app",
            "Get the trial version now"
          ],
          correct: "Stop wasting 4 hours a week on filing"
        },
        taskPrompt: "Which of these hooks uses a 'Pattern Interrupt' based on a specific user pain point?",
        stipendReward: 100
      },
      {
        id: 'phase-3-b',
        type: 'improve',
        title: "A/B Hook Calibration",
        description: "Predict the winning hook variation.",
        taskType: 'ab-test',
        evaluationMode: 'exact_match',
        taskData: {
          variationA: "Tired of manual data entry?",
          variationB: "How I automated my entire startup in 10 minutes",
          correct: "How I automated my entire startup in 10 minutes",
          winningReason: "B uses curiosity and a personal transformation narrative, which typically out-performs standard pain-point questions in cold traffic."
        },
        taskPrompt: "Between these two variations for a TikTok ad, which one is likely to have a higher CTR for cold traffic?",
        stipendReward: 150
      }
    ],
    difficulty: 'easy',
    competencies: ["Ad Creative", "Consumer Psychology", "Data Interpretation"],
    rubric: {
      criteria: [{ name: "Accuracy", description: "Correct identification of winners", weight: 100, examples: { good: "100%", bad: "0%" } }],
      passingScore: 70,
      maxAttempts: 3,
      feedbackDialogues: {
        high: "That hook would stop a scroll. You’re learning how money actually moves in ads. Great eye.",
        medium: "The idea is there, but it’s not sharp enough. Ads punish hesitation. Be bolder with your creative swings.",
        low: "This wouldn’t survive a real ad account. Test again — data doesn’t forgive guesses."
      }
    },
    xpReward: 250,
    stipendReward: 250,
    isPremium: false,
    simulationImpact: { roas: 0.2 },
  },
  {
    id: 4,
    title: "BUDGET BATTLEFIELD",
    subtitle: "Performance Scaling",
    description: "Make profit-driven decisions under extreme constraints.",
    room: 'ads',
    npcName: "Marcus Rivera",
    npcRole: "Paid Media Lead",
    npcDialogue: [
      {
        id: 'start',
        text: "Money talks. Let's see if you can scale without breaking the algorithm's learning phase.",
        emotion: 'serious'
      }
    ],
    phases: [
      {
        id: 'phase-4-a',
        type: 'assessment',
        title: "Scaling Logic",
        description: "Match the metric to the action.",
        taskType: 'match-following',
        evaluationMode: 'pair_match',
        taskData: {
          pairs: [
            { left: "ROAS > 4.0", right: "Increase Budget by 20%" },
            { left: "Frequency > 3.0", right: "Refresh Creative Assets" },
            { left: "CTR < 0.5%", right: "Kill Ad Set Immediately" }
          ]
        },
        taskPrompt: "Match the ad performance data points on the left with the correct strategic action on the right.",
        stipendReward: 200
      }
    ],
    difficulty: 'hard',
    competencies: ["Media Planning", "Budget Allocation", "Data Analysis"],
    rubric: {
      criteria: [{ name: "Decision Logic", description: "Profit-driven choices", weight: 100, examples: { good: "Scaling ROAS", bad: "Spending on ego" } }],
      passingScore: 80,
      maxAttempts: 2,
      feedbackDialogues: {
        high: "Excellent. You handled the scaling without triggering the 'auction overlap' warning. You're ready for bigger budgets.",
        medium: "You escaped with a profit, but you left money on the table. Watch those frequency metrics closer.",
        low: "You just burned $500 in 30 minutes. Rethink your scaling logic before touching a real account."
      }
    },
    xpReward: 500,
    stipendReward: 500,
    isPremium: true,
    simulationImpact: { roas: 0.5, budgetSpent: 5000 },
  },
  {
    id: 5,
    title: "CONTENT GENESIS",
    subtitle: "Storytelling Architecture",
    description: "Structure narratives that drive conversion.",
    room: 'content',
    npcName: "Leo Vane",
    npcRole: "Creative Director",
    npcDialogue: [
      {
        id: 'start',
        text: "Data tells you what happened. Stories make things happen. Let's see if you can write something humans actually want to read.",
        emotion: 'excited'
      }
    ],
    phases: [
      {
        id: 'phase-5-a',
        type: 'diagnose',
        title: "Narrative Arc",
        description: "Identify the most compelling story structure.",
        taskType: 'mcq',
        evaluationMode: 'exact_match',
        taskData: {
          options: [
            "Features -> Benefits -> Price",
            "Problem -> Agitation -> Solution",
            "History -> Mission -> Product",
            "Team -> Technology -> Vision"
          ],
          correct: "Problem -> Agitation -> Solution"
        },
        taskPrompt: "Which narrative structure is most effective for a high-conversion landing page?",
        stipendReward: 300
      }
    ],
    difficulty: 'medium',
    competencies: ["Storytelling", "Copywriting", "Creative Strategy"],
    rubric: {
      criteria: [{ name: "Structure", description: "Logical flow", weight: 100, examples: { good: "PAS Framework", bad: "Random facts" } }],
      passingScore: 80,
      maxAttempts: 3,
      feedbackDialogues: {
        high: "Spot on. The PAS framework is a classic for a reason. It maps directly to human psychology.",
        medium: "Acceptable, but don't just memorize frameworks. Understand WHY they work.",
        low: "You're boring me. And if you bore me, you lose the customer. Try again."
      }
    },
    xpReward: 350,
    stipendReward: 400,
    isPremium: false,
    simulationImpact: { leads: 100, conversionRate: 0.5 },
  },
  {
    id: 6,
    title: "VIRAL MECHANICS",
    subtitle: "Engagement Engineering",
    description: "Design content loops that trigger organic sharing.",
    room: 'content',
    npcName: "Leo Vane",
    npcRole: "Creative Director",
    npcDialogue: [
      {
        id: 'start',
        text: "Virality isn't luck. It's engineering. Show me you understand the psychology of sharing.",
        emotion: 'thinking'
      }
    ],
    phases: [
      {
        id: 'phase-6-a',
        type: 'build',
        title: "Share Trigger",
        description: "Draft a tweet optimized for retweets.",
        taskType: 'short-answer',
        evaluationMode: 'ai_semantic',
        taskData: {
          criteria: ["polarization", "conciseness", "relevance"]
        },
        taskPrompt: "Write a controversial yet professional tweet about 'AI replacing Junior Marketers' designed to spark debate.",
        stipendReward: 500
      }
    ],
    difficulty: 'hard',
    competencies: ["Viral Marketing", "Social Psychology", "Trend Analysis"],
    rubric: {
      criteria: [
        { name: "Polarization", description: "Takes a strong stance", weight: 40, examples: { good: "Definitive opinion", bad: "Neutral statement" } },
        { name: "Conciseness", description: "Punchy and readable", weight: 30, examples: { good: "Under 280 chars", bad: "Essay" } },
        { name: "Relevance", description: "Topical and timely", weight: 30, examples: { good: "Industry debate", bad: "Obscure topic" } }
      ],
      passingScore: 75,
      maxAttempts: 3,
      feedbackDialogues: {
        high: "That's going to burn down the timeline. Perfect. Engagement is engagement.",
        medium: "Safe. Too safe. You want to be a thought leader? Have a thought.",
        low: "This reads like a press release. Nobody retweets press releases."
      }
    },
    xpReward: 500,
    stipendReward: 600,
    isPremium: true,
    simulationImpact: { leads: 500, reputation: 5 },
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
