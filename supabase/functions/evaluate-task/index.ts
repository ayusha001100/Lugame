import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EvaluationRequest {
  levelId: number;
  levelTitle: string;
  taskPrompt: string;
  submission: string;
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
    const { levelId, levelTitle, taskPrompt, submission, rubric }: EvaluationRequest = await req.json();
    const AI_GATEWAY_KEY = Deno.env.get("AI_GATEWAY_KEY") || Deno.env.get("LOVABLE_API_KEY");

    if (!AI_GATEWAY_KEY) {
      throw new Error("AI_GATEWAY_KEY is not configured");
    }

    console.log(`Evaluating submission for Level ${levelId}: ${levelTitle}`);

    const criteriaDescription = rubric.criteria
      .map(c => `- ${c.name} (${c.weight}%): ${c.description}`)
      .join("\n");

    const systemPrompt = `You are a strict but fair digital marketing mentor at a prestigious tech company called NovaTech. Your role is to evaluate marketing task submissions from interns.

EVALUATION GUIDELINES:
- Be professional, constructive, and specific
- Score each criterion on a 0-100 scale
- Provide actionable feedback, not vague praise
- Be strict but encouraging - real learning happens through honest feedback
- Focus on practical marketing skills and industry best practices

RESPONSE FORMAT (JSON only, no markdown):
{
  "overallScore": <number 0-100>,
  "passed": <boolean>,
  "feedback": "<2-3 sentences of overall assessment>",
  "criteriaScores": [
    {
      "name": "<criterion name>",
      "score": <number 0-100>,
      "feedback": "<specific feedback for this criterion>"
    }
  ],
  "improvement": "<one specific, actionable suggestion for improvement>"
}`;

    const userPrompt = `TASK: ${taskPrompt}

EVALUATION CRITERIA:
${criteriaDescription}

PASSING SCORE: ${rubric.passingScore}/100

INTERN'S SUBMISSION:
"""
${submission}
"""

Evaluate this submission strictly but fairly. Return ONLY valid JSON, no other text.`;

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
      // Remove any markdown code blocks if present
      const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
      evaluation = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Fallback evaluation
      evaluation = {
        overallScore: 65,
        passed: false,
        feedback: "Your submission shows promise but needs refinement. Focus on clarity and impact.",
        criteriaScores: rubric.criteria.map(c => ({
          name: c.name,
          score: 60,
          feedback: `Review the ${c.name.toLowerCase()} aspect of your submission.`
        })),
        improvement: "Be more specific and action-oriented in your marketing copy."
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
