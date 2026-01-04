import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CanvasElement {
  type: string;
  properties: {
    fill?: string;
    width?: number;
    height?: number;
    left?: number;
    top?: number;
    text?: string;
    fontSize?: number;
    fontWeight?: string;
  };
}

interface EvaluationRequest {
  levelId: number;
  levelTitle: string;
  taskPrompt: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeSpent: number;
  elements: CanvasElement[];
  rubric: {
    criteria: Array<{
      name: string;
      description: string;
      weight: number;
    }>;
    passingScore: number;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { levelId, levelTitle, taskPrompt, difficulty, timeSpent, elements, rubric }: EvaluationRequest = await req.json();
    const AI_GATEWAY_KEY = Deno.env.get("AI_GATEWAY_KEY") || Deno.env.get("LOVABLE_API_KEY");

    if (!AI_GATEWAY_KEY) {
      throw new Error("AI_GATEWAY_KEY is not configured");
    }

    console.log(`Evaluating creative submission for Level ${levelId}: ${levelTitle}`);
    console.log(`Difficulty: ${difficulty}, Time spent: ${timeSpent}s, Elements: ${elements.length}`);

    // Analyze the canvas elements
    const elementAnalysis = analyzeElements(elements);

    const criteriaDescription = rubric.criteria
      .map(c => `- ${c.name} (${c.weight}%): ${c.description}`)
      .join("\n");

    const systemPrompt = `You are a senior Creative Director at a prestigious digital marketing agency. Your role is to evaluate banner and creative designs from junior designers.

EVALUATION GUIDELINES:
- Be professional, constructive, and specific about design choices
- Score each criterion on a 0-100 scale
- Consider visual hierarchy, color harmony, composition, and message clarity
- Be strict but encouraging - real learning happens through honest feedback
- Evaluate based on whether the design meets the brief requirements

DESIGN CONTEXT:
- Difficulty Level: ${difficulty.toUpperCase()}
- Time Spent: ${Math.floor(timeSpent / 60)}m ${timeSpent % 60}s
- Total Elements Used: ${elements.length}

RESPONSE FORMAT (JSON only, no markdown):
{
  "overallScore": <number 0-100>,
  "passed": <boolean>,
  "feedback": "<2-3 sentences of overall creative assessment>",
  "criteriaScores": [
    {
      "name": "<criterion name>",
      "score": <number 0-100>,
      "feedback": "<specific feedback for this criterion>"
    }
  ],
  "improvement": "<one specific, actionable design suggestion>"
}`;

    const userPrompt = `DESIGN BRIEF: ${taskPrompt}

EVALUATION CRITERIA:
${criteriaDescription}

PASSING SCORE: ${rubric.passingScore}/100

DESIGN ANALYSIS:
${elementAnalysis}

ELEMENTS BREAKDOWN:
${JSON.stringify(elements.map(e => ({
      type: e.type,
      text: e.properties.text || null,
      position: { left: e.properties.left, top: e.properties.top },
      size: { width: e.properties.width, height: e.properties.height },
      color: e.properties.fill
    })), null, 2)}

Evaluate this creative design based on:
1. Does it address the design brief effectively?
2. Is the visual hierarchy clear?
3. Are colors used effectively?
4. Is text readable and impactful?
5. Is the overall composition balanced?

Return ONLY valid JSON, no other text.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AI_GATEWAY_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    console.log("AI Response:", content);

    // Parse the JSON response
    let evaluation;
    try {
      const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
      evaluation = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Fallback evaluation based on element count
      const baseScore = calculateFallbackScore(elements, difficulty);
      evaluation = {
        overallScore: baseScore,
        passed: baseScore >= rubric.passingScore,
        feedback: "Your design shows effort. Focus on creating a clear visual hierarchy and ensuring your message is immediately understandable.",
        criteriaScores: rubric.criteria.map(c => ({
          name: c.name,
          score: baseScore,
          feedback: `Consider how you can improve the ${c.name.toLowerCase()} aspect of your design.`
        })),
        improvement: "Add more contrast between elements and ensure your call-to-action stands out."
      };
    }

    // Ensure passed is correctly calculated
    evaluation.passed = evaluation.overallScore >= rubric.passingScore;

    return new Response(JSON.stringify(evaluation), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Evaluation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Evaluation failed";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function analyzeElements(elements: CanvasElement[]): string {
  const textElements = elements.filter(e => e.type === 'textbox' || e.type === 'i-text');
  const shapeElements = elements.filter(e => ['rect', 'circle', 'triangle'].includes(e.type || ''));

  const hasHeadline = textElements.some(e => (e.properties.fontSize || 0) >= 40);
  const hasSubtext = textElements.some(e => (e.properties.fontSize || 0) >= 20 && (e.properties.fontSize || 0) < 40);
  const hasCTA = textElements.some(e => {
    const text = (e.properties.text || '').toLowerCase();
    return text.includes('get') || text.includes('start') || text.includes('try') || text.includes('learn') || text.includes('buy') || text.includes('shop');
  });

  const colors = new Set(elements.map(e => e.properties.fill).filter(Boolean));

  return `
Design Composition Analysis:
- Total Elements: ${elements.length}
- Text Elements: ${textElements.length}
- Shape Elements: ${shapeElements.length}
- Has Headline (large text): ${hasHeadline ? 'Yes' : 'No'}
- Has Supporting Text: ${hasSubtext ? 'Yes' : 'No'}
- Has Call-to-Action: ${hasCTA ? 'Yes' : 'No'}
- Color Variety: ${colors.size} unique colors
- Text Content: ${textElements.map(e => `"${e.properties.text}"`).join(', ') || 'None'}
`;
}

function calculateFallbackScore(elements: CanvasElement[], difficulty: string): number {
  let score = 40; // Base score

  // Award points for having elements
  if (elements.length >= 3) score += 10;
  if (elements.length >= 5) score += 10;

  // Award points for text elements
  const textElements = elements.filter(e => e.type === 'textbox' || e.type === 'i-text');
  if (textElements.length >= 1) score += 10;
  if (textElements.length >= 2) score += 5;

  // Award points for shapes
  const shapeElements = elements.filter(e => ['rect', 'circle', 'triangle'].includes(e.type || ''));
  if (shapeElements.length >= 1) score += 5;

  // Difficulty modifier
  if (difficulty === 'easy') score += 5;
  if (difficulty === 'hard') score -= 5;

  return Math.min(Math.max(score, 30), 85);
}
