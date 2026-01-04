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
    title: "First Impressions",
    subtitle: "Landing Page Headlines",
    description: "Your first day at NovaTech. The Marketing Manager needs a compelling headline and CTA for the new product launch.",
    room: 'marketing',
    npcName: "Sarah Chen",
    npcRole: "Marketing Manager",
    npcDialogue: [
      "Welcome to NovaTech! I'm Sarah, your Marketing Manager.",
      "We're launching a new AI productivity tool next week, and I need your help.",
      "Your task: Write a headline that grabs attention and a CTA that drives action.",
      "Remember — you have 10 words or less for the headline. Make every word count."
    ],
    taskType: 'text',
    taskPrompt: "Write a landing page headline (max 10 words) and a call-to-action button text (max 5 words) for NovaTech's AI productivity tool.",
    taskHints: [
      "Focus on the benefit, not the feature",
      "Use action verbs in your CTA",
      "Create urgency without being pushy"
    ],
    rubric: {
      criteria: [
        {
          name: "Clarity",
          description: "Is the value proposition immediately clear?",
          weight: 30,
          examples: {
            good: "Work Smarter, Not Harder — AI That Learns You",
            bad: "Revolutionary Next-Gen Synergistic Solutions"
          }
        },
        {
          name: "Persuasion",
          description: "Does it compel action?",
          weight: 35,
          examples: {
            good: "Start Free Today",
            bad: "Click Here"
          }
        },
        {
          name: "Brevity",
          description: "Is it concise and punchy?",
          weight: 20,
          examples: {
            good: "10x Your Productivity",
            bad: "Our tool will help you become more productive"
          }
        },
        {
          name: "Brand Fit",
          description: "Does it feel premium and professional?",
          weight: 15,
          examples: {
            good: "Unlock Your Potential",
            bad: "AMAZING DEAL!!!"
          }
        }
      ],
      passingScore: 70,
      maxAttempts: 3
    },
    xpReward: 100,
    isPremium: false,
    artifactType: "Landing Page Copy"
  },
  {
    id: 2,
    title: "Ad Copy Mastery",
    subtitle: "Google & Meta Ads",
    description: "The Ads team needs compelling copy for a multi-platform campaign. Time to prove your worth.",
    room: 'ads',
    npcName: "Marcus Rivera",
    npcRole: "Paid Media Lead",
    npcDialogue: [
      "Hey there, new talent! I'm Marcus from Paid Media.",
      "We've got a tight deadline — need 3 ad variations for Google and 2 for Meta.",
      "Google headlines: 30 characters max. Descriptions: 90 characters.",
      "Meta primary text: Keep it under 125 characters for best performance.",
      "Show me what you've got!"
    ],
    taskType: 'multiText',
    taskPrompt: "Write 3 Google Search ad headlines (max 30 chars each) and 2 Meta ad primary texts (max 125 chars each) for NovaTech's AI tool.",
    taskHints: [
      "Google ads: Include keywords naturally",
      "Meta ads: Speak to the user's pain points",
      "Test different angles — benefit, feature, social proof"
    ],
    rubric: {
      criteria: [
        {
          name: "Character Limits",
          description: "Are all character limits respected?",
          weight: 20,
          examples: {
            good: "AI That Works For You (24 chars)",
            bad: "The Most Revolutionary AI Productivity Tool Ever (50 chars)"
          }
        },
        {
          name: "Relevance",
          description: "Does the copy match user search intent?",
          weight: 30,
          examples: {
            good: "Save 10 Hours Weekly",
            bad: "Best Software 2024"
          }
        },
        {
          name: "Variety",
          description: "Do variations test different angles?",
          weight: 25,
          examples: {
            good: "Feature, Benefit, Social Proof angles",
            bad: "Same message reworded 3 times"
          }
        },
        {
          name: "Platform Fit",
          description: "Does tone match platform expectations?",
          weight: 25,
          examples: {
            good: "Google: Direct. Meta: Conversational",
            bad: "Same copy for both platforms"
          }
        }
      ],
      passingScore: 70,
      maxAttempts: 3
    },
    xpReward: 150,
    isPremium: false,
    artifactType: "Ad Campaign Copy"
  },
  {
    id: 3,
    title: "SEO Foundations",
    subtitle: "Blog Strategy",
    description: "The Content team needs an SEO-optimized blog outline. Time to think like a search engine.",
    room: 'content',
    npcName: "Elena Vasquez",
    npcRole: "Content Strategist",
    npcDialogue: [
      "Hi! I'm Elena, Content Strategy lead.",
      "We're targeting the keyword 'AI productivity tools for teams'.",
      "I need a blog outline that ranks — title, meta description, and H2 headings.",
      "Think about search intent. What does someone searching this actually want?",
      "Make it comprehensive but scannable."
    ],
    taskType: 'text',
    taskPrompt: "Create an SEO blog outline: 1 title (50-60 chars), 1 meta description (150-160 chars), and 5 H2 subheadings for 'AI productivity tools for teams'.",
    taskHints: [
      "Include the primary keyword in title and meta",
      "H2s should cover user questions and pain points",
      "Meta description should entice clicks"
    ],
    rubric: {
      criteria: [
        {
          name: "Keyword Integration",
          description: "Is the primary keyword naturally included?",
          weight: 25,
          examples: {
            good: "Title includes keyword in first 5 words",
            bad: "Keyword stuffed or absent"
          }
        },
        {
          name: "Search Intent",
          description: "Does content match what users want to find?",
          weight: 30,
          examples: {
            good: "Covers comparisons, benefits, how-to",
            bad: "Only promotional content"
          }
        },
        {
          name: "Structure",
          description: "Is the outline logical and comprehensive?",
          weight: 25,
          examples: {
            good: "Progressive flow from problem to solution",
            bad: "Random or repetitive headings"
          }
        },
        {
          name: "Click-Worthiness",
          description: "Would you click this in search results?",
          weight: 20,
          examples: {
            good: "Specific, value-focused, intriguing",
            bad: "Generic or vague"
          }
        }
      ],
      passingScore: 70,
      maxAttempts: 3
    },
    xpReward: 200,
    isPremium: false,
    artifactType: "SEO Blog Outline"
  },
  {
    id: 4,
    title: "Content Calendar",
    subtitle: "30-Day Plan",
    description: "Build a comprehensive content calendar for NovaTech's social media presence.",
    room: 'content',
    npcName: "Elena Vasquez",
    npcRole: "Content Strategist",
    npcDialogue: [
      "Great work on the blog! Now let's scale it.",
      "I need a 30-day content calendar for LinkedIn and Twitter.",
      "Mix content types: educational, promotional, engagement.",
      "Include post ideas and optimal posting times."
    ],
    taskType: 'builder',
    taskPrompt: "Create a 30-day social media content calendar with 2 posts per day across LinkedIn and Twitter.",
    taskHints: [
      "80/20 rule: 80% value, 20% promotional",
      "Vary content formats: text, carousel, video ideas",
      "Include trending topic opportunities"
    ],
    rubric: {
      criteria: [
        { name: "Content Mix", description: "Good balance of content types", weight: 30, examples: { good: "Educational, engagement, promotional mix", bad: "All promotional" } },
        { name: "Platform Optimization", description: "Content fits platform norms", weight: 30, examples: { good: "LinkedIn professional, Twitter punchy", bad: "Same content everywhere" } },
        { name: "Consistency", description: "Regular posting schedule", weight: 20, examples: { good: "Daily consistent posts", bad: "Random scheduling" } },
        { name: "Strategy", description: "Clear goals for each post", weight: 20, examples: { good: "Each post has a purpose", bad: "Posting for the sake of it" } }
      ],
      passingScore: 75,
      maxAttempts: 2
    },
    xpReward: 300,
    isPremium: false,
    artifactType: "Content Calendar"
  },
  {
    id: 5,
    title: "Instagram Engagement",
    subtitle: "Caption Writing",
    description: "Write scroll-stopping Instagram captions that drive engagement.",
    room: 'content',
    npcName: "Elena Vasquez",
    npcRole: "Content Strategist",
    npcDialogue: [
      "Instagram is all about connection and story.",
      "I need 5 captions that stop the scroll.",
      "Hook them in the first line — that's all they'll see.",
      "End with a clear CTA. What action do you want them to take?"
    ],
    taskType: 'multiText',
    taskPrompt: "Write 5 Instagram captions (each under 150 characters for the hook, full caption under 500 characters) for NovaTech's product launch.",
    taskHints: [
      "First line is everything — make it count",
      "Use line breaks for readability",
      "End with engagement-driving CTA"
    ],
    rubric: {
      criteria: [
        { name: "Hook Strength", description: "First line grabs attention", weight: 35, examples: { good: "Controversial or curiosity-driven opener", bad: "Bland or generic start" } },
        { name: "Engagement CTA", description: "Clear call-to-action", weight: 25, examples: { good: "Question or clear next step", bad: "No CTA or vague ask" } },
        { name: "Voice", description: "Authentic and relatable", weight: 25, examples: { good: "Human, conversational tone", bad: "Corporate speak" } },
        { name: "Value", description: "Provides something useful", weight: 15, examples: { good: "Tip, insight, or entertainment", bad: "Pure promotion" } }
      ],
      passingScore: 70,
      maxAttempts: 3
    },
    xpReward: 250,
    isPremium: false,
    artifactType: "Instagram Captions"
  },
  {
    id: 6,
    title: "Funnel Architecture",
    subtitle: "Customer Journey",
    description: "Design a complete marketing funnel from awareness to conversion.",
    room: 'marketing',
    npcName: "Sarah Chen",
    npcRole: "Marketing Manager",
    npcDialogue: [
      "You've proven yourself on individual tasks.",
      "Now I need strategic thinking.",
      "Design a full funnel: TOFU, MOFU, BOFU.",
      "Include touchpoints, content types, and conversion goals for each stage."
    ],
    taskType: 'builder',
    taskPrompt: "Design a marketing funnel with 3 stages. For each stage: define the goal, list 3 content types, and specify 2 key metrics to track.",
    taskHints: [
      "TOFU: Awareness — cast a wide net",
      "MOFU: Consideration — nurture and educate",
      "BOFU: Decision — convert and close"
    ],
    rubric: {
      criteria: [
        { name: "Funnel Logic", description: "Stages flow logically", weight: 30, examples: { good: "Progressive commitment increase", bad: "Jumping to sales too fast" } },
        { name: "Content Relevance", description: "Content matches stage intent", weight: 30, examples: { good: "Blog for TOFU, case study for BOFU", bad: "Pricing page for awareness" } },
        { name: "Metric Selection", description: "Right metrics for each stage", weight: 25, examples: { good: "Impressions for TOFU, conversions for BOFU", bad: "Revenue for awareness" } },
        { name: "Completeness", description: "All requirements addressed", weight: 15, examples: { good: "All stages fully defined", bad: "Missing elements" } }
      ],
      passingScore: 75,
      maxAttempts: 2
    },
    xpReward: 400,
    isPremium: false,
    artifactType: "Marketing Funnel"
  },
  {
    id: 7,
    title: "Budget Allocation",
    subtitle: "Campaign Planning",
    description: "You've been given $50,000. Allocate it across channels for maximum ROI.",
    room: 'ads',
    npcName: "Marcus Rivera",
    npcRole: "Paid Media Lead",
    npcDialogue: [
      "Here's a real test of strategic thinking.",
      "You have $50K for Q1. Allocate across Google, Meta, LinkedIn, and content.",
      "Justify every dollar. I'll push back if it doesn't make sense.",
      "Consider CAC, audience, and our B2B SaaS model."
    ],
    taskType: 'builder',
    taskPrompt: "Allocate $50,000 across Google Ads, Meta Ads, LinkedIn Ads, and Content Marketing. Provide percentage split and justification for each channel.",
    taskHints: [
      "Consider B2B audience behavior",
      "Balance brand and performance",
      "Account for testing budgets"
    ],
    rubric: {
      criteria: [
        { name: "Strategic Rationale", description: "Decisions backed by logic", weight: 35, examples: { good: "LinkedIn heavy for B2B decision-makers", bad: "Random allocation" } },
        { name: "Channel Understanding", description: "Knows channel strengths", weight: 30, examples: { good: "Google for intent, Meta for awareness", bad: "All channels treated same" } },
        { name: "Balance", description: "Not over-indexed on one channel", weight: 20, examples: { good: "Diversified with focus", bad: "90% in one channel" } },
        { name: "Math Accuracy", description: "Numbers add up correctly", weight: 15, examples: { good: "Totals exactly $50K", bad: "Math errors" } }
      ],
      passingScore: 75,
      maxAttempts: 2
    },
    xpReward: 450,
    isPremium: false,
    artifactType: "Budget Allocation Plan"
  },
  {
    id: 8,
    title: "Analytics Deep Dive",
    subtitle: "Data Interpretation",
    description: "Something's wrong with the campaign. Find the problem in the data.",
    room: 'analytics',
    npcName: "David Park",
    npcRole: "Analytics Lead",
    npcDialogue: [
      "Hey, I'm David. Welcome to the analytics cave.",
      "Our Google Ads campaign is underperforming. CTR is down 40%.",
      "I'll show you the data. Tell me what's wrong and how to fix it.",
      "Don't just identify — recommend actionable solutions."
    ],
    taskType: 'text',
    taskPrompt: "Given: CTR dropped 40%, CPC increased 25%, impressions stable, conversions down 60%. Diagnose the issue and provide 3 specific recommendations.",
    taskHints: [
      "Look at the relationship between metrics",
      "Consider ad relevance and quality score",
      "Think about competitive landscape"
    ],
    rubric: {
      criteria: [
        { name: "Diagnosis Accuracy", description: "Correctly identifies root cause", weight: 35, examples: { good: "Ad fatigue or quality score drop", bad: "Unrelated guess" } },
        { name: "Recommendation Quality", description: "Actionable and specific fixes", weight: 35, examples: { good: "Refresh ad creative, test new audiences", bad: "Just spend more money" } },
        { name: "Data Literacy", description: "Understands metric relationships", weight: 20, examples: { good: "Connects CTR to quality score to CPC", bad: "Treats metrics in isolation" } },
        { name: "Prioritization", description: "Most impactful fix first", weight: 10, examples: { good: "Ordered by impact", bad: "Random order" } }
      ],
      passingScore: 75,
      maxAttempts: 2
    },
    xpReward: 400,
    isPremium: false,
    artifactType: "Analytics Report"
  },
  {
    id: 9,
    title: "A/B Testing Lab",
    subtitle: "Experiment Design",
    description: "Design and interpret an A/B test for the landing page.",
    room: 'analytics',
    npcName: "David Park",
    npcRole: "Analytics Lead",
    npcDialogue: [
      "Data-driven marketing is our superpower.",
      "The landing page conversion rate is 2.3%. We want 4%.",
      "Design an A/B test. What will you change? How will you measure success?",
      "I need hypothesis, variants, sample size thinking, and success criteria."
    ],
    taskType: 'text',
    taskPrompt: "Design an A/B test to improve landing page conversion from 2.3% to 4%. Include: hypothesis, what you'll change, success metrics, and how long to run the test.",
    taskHints: [
      "One variable at a time for clean results",
      "Consider statistical significance",
      "Think about minimum detectable effect"
    ],
    rubric: {
      criteria: [
        { name: "Hypothesis Clarity", description: "Clear, testable hypothesis", weight: 30, examples: { good: "Changing CTA color to orange will increase clicks by 20%", bad: "Making it better" } },
        { name: "Test Design", description: "Proper scientific approach", weight: 30, examples: { good: "One variable, control group, random assignment", bad: "Changing everything at once" } },
        { name: "Success Criteria", description: "Clear definition of winning", weight: 25, examples: { good: "95% confidence, 10% MDE", bad: "If it looks better" } },
        { name: "Practicality", description: "Feasible to implement", weight: 15, examples: { good: "Realistic timeline and scope", bad: "Would need 1M visitors" } }
      ],
      passingScore: 75,
      maxAttempts: 2
    },
    xpReward: 400,
    isPremium: false,
    artifactType: "A/B Test Plan"
  },
  {
    id: 10,
    title: "Launch Day",
    subtitle: "Capstone Campaign",
    description: "The Founder is watching. This is your moment to prove everything you've learned.",
    room: 'manager',
    npcName: "Alexandra Wright",
    npcRole: "Founder & CEO",
    npcDialogue: [
      "I've been watching your progress. Impressive.",
      "Tomorrow we launch NovaTech 2.0. I'm putting you in charge of the campaign.",
      "I need the complete launch plan: messaging, channels, budget, metrics, timeline.",
      "This is real. Make it count.",
      "Welcome to the team — permanently."
    ],
    taskType: 'builder',
    taskPrompt: "Create a complete product launch campaign: key messaging (headline + 3 value props), channel strategy with budget allocation ($25K), success metrics, and 2-week timeline.",
    taskHints: [
      "Integrate everything you've learned",
      "Show strategic thinking",
      "Be comprehensive but focused"
    ],
    rubric: {
      criteria: [
        { name: "Strategic Coherence", description: "All elements work together", weight: 30, examples: { good: "Messaging matches channel strategy", bad: "Disconnected pieces" } },
        { name: "Completeness", description: "All requirements addressed", weight: 25, examples: { good: "Nothing missing", bad: "Forgot metrics" } },
        { name: "Creativity", description: "Original and memorable approach", weight: 20, examples: { good: "Unique angle or tactic", bad: "Generic playbook" } },
        { name: "Practicality", description: "Could actually execute this", weight: 15, examples: { good: "Realistic timeline and scope", bad: "Would need 50 people" } },
        { name: "Data Focus", description: "Metrics guide decisions", weight: 10, examples: { good: "Clear success criteria", bad: "No measurement plan" } }
      ],
      passingScore: 80,
      maxAttempts: 2
    },
    xpReward: 1000,
    isPremium: false,
    artifactType: "Launch Campaign"
  },
  // ============= CREATIVE STUDIO LEVELS =============
  {
    id: 11,
    title: "Social Media Banner",
    subtitle: "Easy Challenge",
    description: "Design an eye-catching social media banner for NovaTech's product launch announcement.",
    room: 'creative',
    npcName: "Maya Chen",
    npcRole: "Creative Director",
    npcDialogue: [
      "Hey there, creative mind! I'm Maya, your Creative Director.",
      "Welcome to the Creative Studio — where pixels become persuasion.",
      "Let's start simple. We need a social media banner for our product launch.",
      "Use the canvas tools to create something that catches the eye!",
      "Remember: Clear headline, brand colors, and a strong call-to-action."
    ],
    taskType: 'canvas',
    difficulty: 'easy',
    taskPrompt: "Design a social media banner (800x450) for NovaTech's AI productivity tool launch. Include: A clear headline, supporting text, and a CTA button. Use contrasting colors and ensure text is readable.",
    taskHints: [
      "Start with a gradient background to set the mood",
      "Make your headline the largest text element",
      "Use the CTA button preset for professional results"
    ],
    rubric: {
      criteria: [
        { name: "Visual Hierarchy", description: "Is there a clear order of importance?", weight: 30, examples: { good: "Headline dominates, CTA is prominent", bad: "All elements same size" } },
        { name: "Color Usage", description: "Are colors harmonious and purposeful?", weight: 25, examples: { good: "Contrasting CTA, cohesive palette", bad: "Clashing colors, hard to read" } },
        { name: "Message Clarity", description: "Is the purpose immediately clear?", weight: 25, examples: { good: "Instantly understand the offer", bad: "Confusing or cluttered" } },
        { name: "Composition", description: "Is the layout balanced and professional?", weight: 20, examples: { good: "Elements well-spaced, aligned", bad: "Chaotic placement" } }
      ],
      passingScore: 65,
      maxAttempts: 3
    },
    xpReward: 200,
    isPremium: false,
    artifactType: "Social Media Banner"
  },
  {
    id: 12,
    title: "Product Feature Card",
    subtitle: "Medium Challenge",
    description: "Create a visually compelling feature showcase card highlighting a key product benefit.",
    room: 'creative',
    npcName: "Maya Chen",
    npcRole: "Creative Director",
    npcDialogue: [
      "Nice work on that banner! Ready for something more challenging?",
      "We need a feature card that really sells our AI automation capability.",
      "This needs to work as a standalone piece — think website hero section.",
      "Focus on creating emotional impact through design.",
      "You've got less time, so plan before you create!"
    ],
    taskType: 'canvas',
    difficulty: 'medium',
    taskPrompt: "Design a product feature card showcasing NovaTech's AI automation feature. Include: A powerful headline about saving time, visual elements suggesting automation/technology, supporting stats or benefits, and a learn more CTA. Create visual depth with layered elements.",
    taskHints: [
      "Use shapes to create depth and visual interest",
      "Include a statistic like '10x faster' or 'Save 5 hours/week'",
      "Layer elements to create a premium feel"
    ],
    rubric: {
      criteria: [
        { name: "Emotional Impact", description: "Does it create desire?", weight: 30, examples: { good: "Makes you want the product", bad: "Feels generic" } },
        { name: "Visual Sophistication", description: "Does it look premium?", weight: 25, examples: { good: "Layered, polished design", bad: "Flat, basic layout" } },
        { name: "Information Architecture", description: "Is content well-organized?", weight: 25, examples: { good: "Logical flow, scannable", bad: "Information overload" } },
        { name: "Brand Alignment", description: "Does it feel like NovaTech?", weight: 20, examples: { good: "Tech-forward, professional", bad: "Off-brand aesthetic" } }
      ],
      passingScore: 70,
      maxAttempts: 3
    },
    xpReward: 350,
    isPremium: false,
    artifactType: "Feature Card"
  },
  {
    id: 13,
    title: "Campaign Hero Banner",
    subtitle: "Hard Challenge",
    description: "Design a high-stakes hero banner for NovaTech's biggest campaign of the year.",
    room: 'creative',
    npcName: "Maya Chen",
    npcRole: "Creative Director",
    npcDialogue: [
      "Alright, this is the big one. Are you ready?",
      "The CEO personally requested our best work for the Q4 campaign.",
      "This hero banner will be on our homepage, ads, and investor deck.",
      "It needs to be absolutely stunning. No pressure, right?",
      "Show me what a true creative professional can do!"
    ],
    taskType: 'canvas',
    difficulty: 'hard',
    taskPrompt: "Design a premium hero banner for NovaTech's 'Future of Work' Q4 campaign. This must include: A compelling headline (max 8 words), 2-3 supporting value propositions, a primary CTA and secondary CTA, visual elements that convey innovation and the future, and professional typography hierarchy. The design should be memorable enough to win creative awards.",
    taskHints: [
      "Think about the story you're telling visually",
      "Use advanced layering for depth",
      "Every pixel should have purpose"
    ],
    rubric: {
      criteria: [
        { name: "Creative Excellence", description: "Is this award-worthy?", weight: 30, examples: { good: "Innovative, memorable design", bad: "Safe, forgettable work" } },
        { name: "Strategic Clarity", description: "Does it drive the campaign goal?", weight: 25, examples: { good: "Clear value prop and action", bad: "Looks nice but unclear purpose" } },
        { name: "Technical Execution", description: "Is the craft impeccable?", weight: 25, examples: { good: "Perfect alignment, spacing, polish", bad: "Amateur mistakes visible" } },
        { name: "Brand Elevation", description: "Does it elevate NovaTech's brand?", weight: 20, examples: { good: "Makes brand feel premium", bad: "Diminishes brand perception" } }
      ],
      passingScore: 75,
      maxAttempts: 2
    },
    xpReward: 500,
    isPremium: false,
    artifactType: "Hero Banner"
  }
];

export const OFFICE_ROOMS: Room[] = [
  {
    id: 'marketing',
    name: 'Marketing HQ',
    description: 'Strategy and campaign planning happens here',
    icon: '📊',
    levels: [1, 6],
    unlocked: true,
    image: roomMarketingImg
  },
  {
    id: 'content',
    name: 'Content Studio',
    description: 'Where stories come to life',
    icon: '✍️',
    levels: [3, 4, 5],
    unlocked: true,
    image: roomContentImg
  },
  {
    id: 'creative',
    name: 'Creative Lab',
    description: 'Banner & visual design workshop',
    icon: '🎨',
    levels: [11, 12, 13],
    unlocked: true,
    image: roomContentImg // Using content image for now
  },
  {
    id: 'ads',
    name: 'Ads Lab',
    description: 'Paid media command center',
    icon: '🎯',
    levels: [2, 7],
    unlocked: true,
    image: roomAdsImg
  },
  {
    id: 'analytics',
    name: 'Analytics Deck',
    description: 'Data-driven decision making',
    icon: '📈',
    levels: [8, 9],
    unlocked: true,
    image: roomAnalyticsImg
  },
  {
    id: 'manager',
    name: "Founder's Office",
    description: 'Where big decisions are made',
    icon: '👔',
    levels: [10],
    unlocked: true,
    image: roomManagerImg
  }
];

export const OFFICE_HUB_IMAGE = officeHubImg;

export const AVATAR_STYLES = {
  male: [
    { id: 1, label: 'Professional', colors: ['#1a1a2e', '#16213e'] },
    { id: 2, label: 'Creative', colors: ['#2d3436', '#636e72'] },
    { id: 3, label: 'Executive', colors: ['#0c0c0c', '#1a1a1a'] },
    { id: 4, label: 'Tech Lead', colors: ['#1e3a5f', '#2d5f8b'] },
  ],
  female: [
    { id: 1, label: 'Professional', colors: ['#1a1a2e', '#16213e'] },
    { id: 2, label: 'Creative', colors: ['#2d3436', '#636e72'] },
    { id: 3, label: 'Executive', colors: ['#0c0c0c', '#1a1a1a'] },
    { id: 4, label: 'Tech Lead', colors: ['#1e3a5f', '#2d5f8b'] },
  ],
  neutral: [
    { id: 1, label: 'Professional', colors: ['#1a1a2e', '#16213e'] },
    { id: 2, label: 'Creative', colors: ['#2d3436', '#636e72'] },
    { id: 3, label: 'Executive', colors: ['#0c0c0c', '#1a1a1a'] },
    { id: 4, label: 'Tech Lead', colors: ['#1e3a5f', '#2d5f8b'] },
  ],
};
