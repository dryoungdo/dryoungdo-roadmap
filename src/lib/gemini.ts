import type { RoadmapItem, DepartmentConfig, AnalysisType } from '../types';

export interface GeminiAnalysisRequest {
  goals: any[];
  roadmapItems: any[];
  departments: any[];
}

export interface GeminiItemAnalysisRequest {
  item: RoadmapItem;
  promptType: AnalysisType;
  items: RoadmapItem[];
  departments: DepartmentConfig[];
}

export interface GeminiAnalysisResponse {
  analysis: string;
  error?: string;
}

interface GeminiAPIRequest {
  contents: Array<{
    parts: Array<{
      text: string;
    }>;
  }>;
  generationConfig: {
    temperature: number;
    maxOutputTokens: number;
  };
}

interface GeminiAPIResponse {
  candidates?: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
  error?: {
    message: string;
  };
}

function buildPrompt(request: GeminiAnalysisRequest): string {
  const { goals, roadmapItems, departments } = request;

  const goalsText = goals
    .map(
      (g) =>
        `- ${g.title} (${g.titleEn}): เป้าหมาย ${g.target}, สถานะ ${g.status}, แผนกที่เกี่ยวข้อง: ${g.relatedDepartments?.join(", ") || "ไม่ระบุ"}`
    )
    .join("\n");

  const itemsText = roadmapItems
    .map((item) => {
      const start = item.startDate || "ไม่ระบุ";
      const end = item.endDate || "ไม่ระบุ";
      const priority = item.priority || "Medium";
      return `- ${item.title} (${item.department}): ${item.status}, ความคืบหน้า ${item.progress}%, ${start} - ${end}, Priority: ${priority}`;
    })
    .join("\n");

  const deptsText = departments.map((d) => `- ${d}`).join("\n");

  return `คุณเป็นที่ปรึกษาเชิงกลยุทธ์สำหรับเป้าหมายและแผนงานส่วนตัว

วิเคราะห์ข้อมูล Roadmap ต่อไปนี้และให้คำแนะนำเชิงกลยุทธ์:

## เป้าหมายองค์กร (Goals)
${goalsText}

## โครงการใน Roadmap
${itemsText}

## แผนกทั้งหมด
${deptsText}

---

กรุณาวิเคราะห์และตอบเป็นภาษาไทยด้วย Markdown formatting ในหัวข้อต่อไปนี้:

### 1. Gap Analysis (ช่องว่างระหว่างเป้าหมายกับโครงการ)
- เป้าหมายใดบ้างที่ยังขาดโครงการสนับสนุน
- เป้าหมายใดที่มีโครงการรองรับไม่เพียงพอ
- แนะนำโครงการที่ควรเพิ่มเติม

### 2. Risk Areas (พื้นที่เสี่ยง)
- แผนกใดมีภาระงานมากเกินไป (overloaded)
- โครงการใดที่มีความเสี่ยงสูง (ล่าช้า, ติดขัด, ความคืบหน้าต่ำ)
- ข้อกังวลด้าน resource allocation

### 3. Priority Recommendations (คำแนะนำการจัดลำดับความสำคัญ)
- โครงการใดควรเร่งดำเนินการก่อน
- โครงการใดควรชะลอหรือพิจารณาใหม่
- เหตุผลเชิงกลยุทธ์

### 4. Timeline Concerns (ข้อกังวลด้านเวลา)
- โครงการที่มี timeline ไม่สมเหตุสมผล
- ความขัดแย้งของ timeline ระหว่างโครงการ
- แนะนำการปรับ timeline

### 5. Strategic Insights (ข้อมูลเชิงลึกเชิงกลยุทธ์)
- แนวโน้มที่สังเกตเห็นจากข้อมูล
- โอกาสทางธุรกิจที่อาจพลาด
- ข้อเสนอแนะเพิ่มเติมสำหรับผู้บริหาร

---

ตอบด้วยน้ำเสียงที่เป็นมืออาชีพ กระชับ ตรงประเด็น และให้คำแนะนำที่นำไปปฏิบัติได้จริง`;
}

export async function analyzeWithGemini(
  request: GeminiAnalysisRequest
): Promise<GeminiAnalysisResponse> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return {
      analysis: "",
      error: "Missing VITE_GEMINI_API_KEY in environment variables",
    };
  }

  const prompt = buildPrompt(request);
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const requestBody: GeminiAPIRequest = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        analysis: "",
        error: `Gemini API error (${response.status}): ${errorText}`,
      };
    }

    const data: GeminiAPIResponse = await response.json();

    if (data.error) {
      return {
        analysis: "",
        error: `Gemini API error: ${data.error.message}`,
      };
    }

    if (!data.candidates || data.candidates.length === 0) {
      return {
        analysis: "",
        error: "No response from Gemini API",
      };
    }

    const analysisText = data.candidates[0].content.parts[0].text;

    return {
      analysis: analysisText,
      error: undefined,
    };
  } catch (err) {
    return {
      analysis: "",
      error: `Failed to call Gemini API: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

function buildItemPrompt(request: GeminiItemAnalysisRequest): string {
  const { item, promptType, items, departments } = request;
  const deptName = departments.find(d => d.key === item.department)?.nameTh || item.department;
  const milestonesText = item.milestones.length > 0
    ? item.milestones.map(m => `${m.title} (${m.date}) [${m.completed ? 'done' : 'pending'}]`).join(', ')
    : 'none';
  const relatedItems = items
    .filter(i => i.department === item.department && i.id !== item.id)
    .map(i => `- ${i.title} (${i.status}, ${i.progress}%, ${i.startDate} - ${i.endDate})`)
    .join('\n') || 'none';

  const itemContext = `## Project Data
- Name: ${item.title}
- Detail: ${item.subtitle || 'N/A'}
- Department: ${deptName}
- Priority: ${item.priority}
- Status: ${item.status}
- Owner: ${item.owner}
- Start: ${item.startDate}
- End: ${item.endDate}
- Progress: ${item.progress}%
- Milestones: ${milestonesText}
- Dependencies: ${item.dependencies.length > 0 ? item.dependencies.join(', ') : 'N/A'}
- Notes: ${item.notes || 'N/A'}

## Related Projects (same department)
${relatedItems}`;

  const prompts: Record<string, string> = {
    roadmap: `You are a strategic advisor for personal goals and roadmap planning.

${itemContext}

Analyze this project strategically. Answer in Thai with Markdown:

### 1. Strategic Positioning
- How does this align with company goals
- Is the priority level appropriate

### 2. Timeline Analysis
- Is the timeline realistic
- Time-related risks

### 3. Impact on Other Projects
- Cross-project effects
- Dependencies to watch

### 4. Strategic Recommendations
- 3-5 actionable recommendations

Be concise, max 800 words.`,

    milestone: `You are a project management expert for personal goals and roadmap planning.

${itemContext}

Analyze and recommend milestones. Answer in Thai with Markdown:

### 1. Current Milestones Assessment
- Are current milestones sufficient
- Are dates realistic

### 2. Recommended Additional Milestones
- Suggest new milestones with target dates and rationale

### 3. Dependencies & Critical Path
- Task sequencing requirements
- Critical path to watch

### 4. Deliverables per Milestone
- Expected output for each milestone

Be concise, max 800 words.`,

    kpi: `You are a KPI and measurement expert for personal goals and roadmap planning.

${itemContext}

Design KPIs for this project. Answer in Thai with Markdown:

### 1. Lead KPIs (3-5)
- Name, target, frequency, data source

### 2. Lag KPIs (2-3)
- Name, target, measurement method

### 3. Dashboard Metrics
- 3-5 metrics to display on dashboard

### 4. Warning Thresholds
- Red/Yellow/Green thresholds

Be concise, max 800 words.`,

    process: `You are a process design expert for personal goals and roadmap planning.

${itemContext}

Design workflow for this project. Answer in Thai with Markdown:

### 1. Workflow Overview
- Step-by-step numbered process
- Who is responsible for each step

### 2. Standard Operating Procedures (SOPs)
- SOPs for 2-3 critical steps

### 3. Tools & Resources Required
- Software, equipment, people

### 4. Check Points & Quality Gates
- Quality checks before proceeding

Be concise, max 800 words.`,

    critique: `You are a Devil's Advocate advisor for personal goals and roadmap planning.
Your job is to identify weaknesses and risks bluntly.

${itemContext}

Provide blunt risk analysis. Answer in Thai with Markdown:

### 1. Plan Weaknesses
- What is missing from the current plan
- Assumptions that could be wrong

### 2. Key Risks (3-5)
- Risk, severity (High/Medium/Low), likelihood vs impact

### 3. Blind Spots
- What the team might overlook
- What-if scenarios

### 4. Mitigation Plan
- How to reduce each risk
- Plan B for worst case

### 5. Improvement Suggestions
- 3-5 things to do now to increase success chance

Be direct and honest, max 800 words.`,
  };

  return prompts[promptType] || prompts.roadmap;
}

export async function analyzeItemWithGemini(
  request: GeminiItemAnalysisRequest
): Promise<GeminiAnalysisResponse> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return { analysis: '', error: 'Missing VITE_GEMINI_API_KEY' };
  }

  const prompt = buildItemPrompt(request);
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const requestBody: GeminiAPIRequest = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { analysis: '', error: `Gemini API error (${response.status}): ${errorText}` };
    }

    const data: GeminiAPIResponse = await response.json();

    if (data.error) {
      return { analysis: '', error: `Gemini API error: ${data.error.message}` };
    }

    if (!data.candidates || data.candidates.length === 0) {
      return { analysis: '', error: 'No response from Gemini API' };
    }

    return { analysis: data.candidates[0].content.parts[0].text, error: undefined };
  } catch (err) {
    return { analysis: '', error: `Failed to call Gemini API: ${err instanceof Error ? err.message : String(err)}` };
  }
}
