# Health Report Assistant

https://mediai-health.vercel.app/
If you're using an AI coding tool like Cursor, Lovable, Bolt, or Claude Code, use this prompt:

I want to upgrade my existing MediaI Health website:
https://mediai-health.vercel.app/

Keep the existing website's overall branding, design language, navigation, and existing features unless changes are necessary. Add a new major feature called "AI Medical Report Analyzer".

GOAL:
Users should be able to upload a medical report as a PDF or image (JPG, JPEG, PNG). The system should analyze the report, extract important medical values, explain the results in simple language, and provide safe general health guidance.

IMPORTANT MEDICAL SAFETY:
This is an AI health-information and decision-support feature, NOT a diagnostic or prescribing system.
- Never diagnose a disease with certainty.
- Never tell users to start, stop, or change prescription medicines.
- Never prescribe medication or dosage.
- Do not generate an exact number of recovery/rest days unless that information is explicitly present in the doctor's report.
- Clearly distinguish between normal, abnormal, and potentially concerning findings.
- Always recommend consultation with a qualified healthcare professional when appropriate.
- For potentially urgent findings, clearly tell the user to seek prompt medical attention.
- Include a visible disclaimer that AI analysis does not replace professional medical advice.
- Do not invent values, reference ranges, diagnoses, medications, or doctor instructions that are not present in the uploaded report.

FEATURE 1 — REPORT UPLOAD:
Create a beautiful drag-and-drop upload area.

Supported files:
- PDF
- JPG
- JPEG
- PNG

Show:
"Upload your medical report"
"PDF, JPG, JPEG or PNG"

Include:
- Upload button
- Drag and drop
- File preview
- File name
- File size
- Remove file
- Analyze Report button
- Loading/progress state
- Error handling

FEATURE 2 — REPORT EXTRACTION:
After upload:
1. Extract text from PDF when possible.
2. For scanned PDFs/images, use OCR.
3. Identify:
   - Test name
   - Result/value
   - Unit
   - Reference range
   - High/low indicators
   - Patient information only when necessary
   - Doctor comments
   - Existing medication information
4. Preserve the original values exactly.
5. Never guess missing values.

Display an "Extracted Results" section before the final AI analysis.

FEATURE 3 — AI REPORT SUMMARY:
Create a clean dashboard containing:

"Report Summary"

Give a simple explanation of the report in understandable language.

Example:
"Your report contains several values that are outside the reference range. The most notable findings are..."

Avoid complicated medical terminology. If medical terminology is necessary, explain it.

FEATURE 4 — TEST RESULTS:
Create a table/card layout:

Test | Result | Reference Range | Status

Use statuses:
- Normal
- High
- Low
- Not available

Clearly explain that reference ranges can vary between laboratories.

Allow users to click a result to see:
- What the test generally measures
- What the result means in general
- Possible factors that can affect it
- When discussing it with a doctor may be appropriate

Do NOT automatically conclude that an abnormal value means the user has a disease.

FEATURE 5 — FOOD & NUTRITION GUIDANCE:
Create a section called:

"Nutrition Guidance"

Based only on relevant report findings, provide general food guidance.

Divide into:
- Foods you may consider including
- Foods to limit
- General hydration guidance
- Important nutrition notes

For every recommendation, explain the reason.

Do not create dangerous restrictive diets.
Do not recommend supplements or medications as treatment.
If a condition requires individualized nutrition advice, recommend consulting a doctor or registered dietitian.

FEATURE 6 — REST & ACTIVITY:
Create:

"Rest & Activity Guidance"

Provide general lifestyle guidance related to the report when appropriate.

Do NOT prescribe an exact recovery period unless it is explicitly stated in the uploaded doctor's report.

Instead use wording such as:
- "Discuss your activity level with your doctor."
- "If you have significant symptoms, consider medical evaluation."
- "Follow the activity restrictions given by your treating doctor."

FEATURE 7 — DOCTOR RECOMMENDATION:
Create:

"Who Should I Consult?"

Based on the report findings, suggest an appropriate type of healthcare professional when reasonable.

Examples:
- General Physician
- Cardiologist
- Endocrinologist
- Gastroenterologist
- Nephrologist
- Hematologist
- Dermatologist
- Gynecologist
- Urologist

For each recommendation show:

Specialist:
Reason:
Suggested urgency:
Routine / Soon / Urgent

Do not claim that a particular specialist is definitely required. Phrase it as general guidance.

FEATURE 8 — MEDICATION INFORMATION:
Create:

"Medication Information"

If medications are explicitly present in the uploaded report, display them.

For each medication show:
- Medication name
- Dosage if explicitly stated
- Frequency if explicitly stated
- Instructions if explicitly stated

Do NOT invent medication information.

Add:
"Do not start, stop, or change prescription medication based solely on this AI analysis. Confirm medication decisions with your doctor or pharmacist."

If the report contains no medication information, display:
"No medications were identified in this report."

FEATURE 9 — RED FLAGS:
Create a prominent:

"Important Warning Signs"

If the report contains findings that may warrant urgent medical attention, clearly advise the user to seek prompt professional care.

Do not create emergency conclusions from uncertain information.

Use clear visual hierarchy:
- Routine
- Needs medical review
- Seek prompt medical attention

If there is an immediate emergency symptom mentioned by the user, advise emergency medical care rather than trying to solve it through the AI.

FEATURE 10 — REPORT HISTORY:
Create a "My Reports" section where users can see previously analyzed reports.

Each report should show:
- Date
- Report name
- Analysis status
- Short summary

Allow:
- View report
- Delete report
- Download analysis if technically possible

Protect sensitive medical information and do not expose reports publicly.

FEATURE 11 — FOLLOW-UP QUESTIONS:
After analysis, add:

"Ask about your report"

Users can ask questions such as:
- "What does this result mean?"
- "Why is this value high?"
- "What foods can I include?"
- "Which doctor should I consult?"

The AI should answer using the uploaded report as context.

It must not turn into a prescribing/diagnostic system.

FEATURE 12 — UI/UX:
Make the interface modern, professional, trustworthy, and suitable for a healthcare application.

Use:
- Clean cards
- Rounded corners
- Good spacing
- Responsive design
- Mobile-first layout
- Clear typography
- Accessible contrast
- Icons
- Progress indicators
- Skeleton loading states
- Empty states
- Error states

The analysis dashboard should feel similar to a professional medical report dashboard, not a generic chatbot.

Suggested dashboard:

[ Report Summary ]

[ Overall Status ]

[ Key Findings ]
  ├── Normal
  ├── High
  └── Low

[ Detailed Test Results ]

[ Nutrition Guidance ]

[ Rest & Activity ]

[ Who Should I Consult? ]

[ Medication Information ]

[ Important Warning Signs ]

[ Ask About Your Report ]

[ Medical Disclaimer ]

FEATURE 13 — TECHNICAL ARCHITECTURE:
Use a structured pipeline:

Upload
→ File validation
→ PDF/image processing
→ OCR/text extraction
→ Structured medical data extraction
→ Validation
→ AI analysis
→ Safety checks
→ User-friendly results

Do not send the raw document blindly to an LLM and allow it to generate arbitrary medical instructions.

Create a structured internal representation such as:

{
  "tests": [
    {
      "name": "",
      "value": "",
      "unit": "",
      "reference_range": "",
      "status": ""
    }
  ],
  "medications": [],
  "doctor_notes": [],
  "abnormal_findings": []
}

Use the extracted structured information as the source of truth.

FEATURE 14 — SECURITY & PRIVACY:
Medical reports contain sensitive personal information.

Implement:
- Secure file handling
- File type validation
- File size limits
- No public file URLs
- Secure storage
- Delete uploaded reports option
- Avoid unnecessary storage of personal information
- Do not expose reports through client-side public paths
- Do not log complete medical reports unnecessarily

FEATURE 15 — ERROR HANDLING:
Handle:
- Invalid file
- Unsupported file type
- File too large
- Empty report
- Poor image quality
- OCR failure
- Unreadable report
- AI/API failure
- Network failure
- Missing reference ranges
- Partially extracted reports

If extraction is uncertain, tell the user that the report could not be reliably interpreted instead of guessing.

FEATURE 16 — DEMO MODE:
If no AI/OCR API is configured yet, create a clearly labeled DEMO MODE using sample medical report data so I can test the complete UI.

Do not pretend demo results are real medical analysis.

IMPLEMENTATION REQUIREMENT:
First inspect the existing MediaI Health website/project structure and reuse the existing components, styles, routing, authentication, and backend architecture where possible.

Do not unnecessarily rebuild the entire website.

Before changing existing functionality, understand how the current application works.

Create reusable components for:
- ReportUploader
- ReportPreview
- ExtractionResults
- ReportSummary
- TestResults
- NutritionGuidance
- ActivityGuidance
- DoctorRecommendation
- MedicationInformation
- RedFlags
- FollowUpChat
- MedicalDisclaimer

Make the implementation production-quality, responsive, accessible, modular, and easy to extend.

The final result should feel like a major new feature of MediaI Health rather than a separate application.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://medical-help-ai.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e15c18c8-3102-443b-85a7-dd046eb74b8d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
