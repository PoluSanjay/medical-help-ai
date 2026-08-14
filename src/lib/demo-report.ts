import type { AnalysisResult, ExtractionResult } from "./report-types";

export const demoExtraction: ExtractionResult = {
  readable: true,
  confidence: "high",
  document_type: "Routine blood panel (sample data)",
  extraction_notes: [
    "This is sample demo data used to preview the interface. It is not a real medical report.",
  ],
  tests: [
    { name: "Haemoglobin", value: "11.2", unit: "g/dL", reference_range: "13.0 - 17.0", status: "low", flag_in_report: "L" },
    { name: "Total Cholesterol", value: "232", unit: "mg/dL", reference_range: "< 200", status: "high", flag_in_report: "H" },
    { name: "HDL Cholesterol", value: "38", unit: "mg/dL", reference_range: "> 40", status: "low", flag_in_report: "L" },
    { name: "Fasting Glucose", value: "104", unit: "mg/dL", reference_range: "70 - 99", status: "high", flag_in_report: "H" },
    { name: "Serum Creatinine", value: "0.9", unit: "mg/dL", reference_range: "0.7 - 1.3", status: "normal", flag_in_report: "" },
    { name: "TSH", value: "2.4", unit: "µIU/mL", reference_range: "0.4 - 4.0", status: "normal", flag_in_report: "" },
    { name: "Vitamin D (25-OH)", value: "18", unit: "ng/mL", reference_range: "30 - 100", status: "low", flag_in_report: "L" },
    { name: "Serum Ferritin", value: "", unit: "", reference_range: "", status: "not_available", flag_in_report: "" },
  ],
  medications: [
    { name: "Atorvastatin", dosage: "10 mg", frequency: "Once daily at night", instructions: "As advised by treating physician" },
  ],
  doctor_notes: ["Review lipid profile and haemoglobin after 8 weeks.", "Advised dietary modification and regular walking."],
  abnormal_findings: [
    "Haemoglobin below the stated reference range",
    "Total cholesterol above the stated reference range",
    "HDL cholesterol below the stated reference range",
    "Fasting glucose slightly above the stated reference range",
    "Vitamin D below the stated reference range",
  ],
};

export const demoAnalysis: AnalysisResult = {
  summary:
    "This sample report contains several values that fall outside the laboratory's reference ranges. The most notable are a lower-than-expected haemoglobin level, a raised total cholesterol with a low HDL (often called the 'good' cholesterol), a fasting glucose slightly above range, and a low vitamin D level. Kidney function and thyroid values in this sample are within range. Values outside a range are not a diagnosis on their own — they are signals that are worth discussing with a doctor, who can interpret them alongside your symptoms and history.",
  overall_status: "needs_review",
  overall_status_reason:
    "Several values sit outside the reference ranges printed on the report, which generally warrants an unhurried review with a healthcare professional rather than emergency care.",
  key_findings: {
    normal: ["Serum Creatinine 0.9 mg/dL", "TSH 2.4 µIU/mL"],
    high: ["Total Cholesterol 232 mg/dL", "Fasting Glucose 104 mg/dL"],
    low: ["Haemoglobin 11.2 g/dL", "HDL Cholesterol 38 mg/dL", "Vitamin D 18 ng/mL"],
  },
  test_explanations: [
    {
      test_name: "Haemoglobin",
      what_it_measures:
        "Haemoglobin is the protein inside red blood cells that carries oxygen around the body.",
      what_result_generally_means:
        "A value below the reference range generally suggests fewer oxygen-carrying cells than expected, which is often described as anaemia. It has many possible causes and needs a doctor to interpret.",
      factors_that_can_affect_it: [
        "Iron, vitamin B12 or folate intake",
        "Recent or ongoing blood loss",
        "Hydration status at the time of the test",
        "Pregnancy and menstruation",
        "Long-term illness",
      ],
      when_to_discuss_with_doctor:
        "Worth discussing at a routine visit, and sooner if you feel unusually tired, breathless, dizzy or notice a fast heartbeat.",
    },
    {
      test_name: "Total Cholesterol",
      what_it_measures: "The total amount of cholesterol, a fatty substance, circulating in the blood.",
      what_result_generally_means:
        "A value above range is generally considered one of several factors linked with longer-term heart and blood-vessel risk. It is interpreted together with HDL, LDL, triglycerides and your overall risk profile.",
      factors_that_can_affect_it: [
        "Dietary pattern, especially saturated fat intake",
        "Physical activity levels",
        "Body weight",
        "Genetics and family history",
        "Whether the sample was taken fasting",
      ],
      when_to_discuss_with_doctor:
        "Reasonable to raise at a routine appointment so the full lipid picture can be reviewed.",
    },
    {
      test_name: "Fasting Glucose",
      what_it_measures: "The amount of sugar in the blood after a period without eating.",
      what_result_generally_means:
        "A slightly raised fasting glucose generally indicates the body may be handling sugar less efficiently than expected. A single reading is not a diagnosis and is usually repeated or paired with other tests.",
      factors_that_can_affect_it: [
        "How long you actually fasted before the test",
        "Illness or stress on the day",
        "Sleep quality",
        "Physical activity",
        "Certain medicines",
      ],
      when_to_discuss_with_doctor:
        "Worth mentioning at a routine visit so your doctor can decide whether repeat or additional testing is appropriate.",
    },
    {
      test_name: "Vitamin D (25-OH)",
      what_it_measures: "The body's stored form of vitamin D, which supports bone and muscle health.",
      what_result_generally_means:
        "A value below range generally suggests low vitamin D stores, which is common and usually addressed through sunlight exposure, diet and, where a clinician advises it, supplementation.",
      factors_that_can_affect_it: ["Sun exposure", "Season and latitude", "Skin tone", "Diet", "Absorption issues"],
      when_to_discuss_with_doctor: "Suitable for a routine discussion with a general physician.",
    },
  ],
  nutrition: {
    include: [
      { item: "Iron-rich foods such as lentils, beans, dark leafy greens, and lean meat or fish if you eat them", reason: "Supports the body's production of haemoglobin, which is low in this sample report." },
      { item: "Vitamin C sources such as citrus, guava, tomato or bell pepper alongside iron-rich meals", reason: "Vitamin C generally helps the body absorb iron from plant foods." },
      { item: "Soluble-fibre foods such as oats, barley, beans and apples", reason: "Fibre-rich patterns are generally associated with better cholesterol profiles." },
      { item: "Unsaturated fat sources such as nuts, seeds, olive oil and oily fish", reason: "Often used in place of saturated fats when cholesterol is above range." },
      { item: "Whole grains in place of refined grains", reason: "Generally leads to steadier blood sugar than refined carbohydrates." },
      { item: "Vitamin D sources such as fortified milk, eggs and oily fish, plus safe daylight exposure", reason: "Vitamin D is below range in this sample report." },
    ],
    limit: [
      { item: "Deep-fried foods and foods high in saturated or trans fats", reason: "Commonly linked with higher total cholesterol." },
      { item: "Sugary drinks, sweets and desserts", reason: "Can contribute to higher blood glucose readings." },
      { item: "Highly processed and salty snack foods", reason: "Generally offer little nutritional value and are associated with poorer heart health markers." },
      { item: "Alcohol", reason: "Can affect blood sugar, blood fats and general nutrition." },
    ],
    hydration:
      "Aim for regular water intake spread through the day, adjusting for climate and activity. If a doctor has advised you to limit fluids for any reason, follow their instruction instead.",
    notes: [
      "These are general food ideas, not a prescribed diet plan.",
      "If you have kidney disease, diabetes, food allergies, or are pregnant, individualised advice from a doctor or registered dietitian is appropriate.",
    ],
  },
  activity: {
    guidance: [
      "Regular moderate movement, such as walking most days, is generally beneficial for cholesterol and blood-sugar markers.",
      "Build activity up gradually rather than suddenly, and stop if you feel unwell.",
      "If you feel breathless, dizzy or unusually tired during activity, pause and consider medical evaluation.",
      "Prioritise consistent sleep, which supports both energy levels and metabolic markers.",
    ],
    notes: [
      "Discuss your activity level with your doctor before making significant changes.",
      "Follow any activity restrictions given by your treating doctor — this analysis does not set recovery or rest periods.",
    ],
  },
  specialists: [
    { specialist: "General Physician", reason: "Can review the whole report together, confirm findings and decide whether repeat or further testing is appropriate.", urgency: "soon" },
    { specialist: "Hematologist", reason: "May be considered if the low haemoglobin persists or its cause is unclear after initial evaluation.", urgency: "routine" },
    { specialist: "Endocrinologist", reason: "May be relevant if repeat testing continues to show raised fasting glucose.", urgency: "routine" },
  ],
  warning_signs: {
    level: "needs_review",
    items: [
      "Chest pain or pressure, severe breathlessness, fainting, or one-sided weakness are emergency symptoms — seek emergency medical care immediately rather than relying on this analysis.",
      "Worsening fatigue, dizziness on standing, or visible blood loss would be reasons to seek prompt medical review.",
      "Otherwise, these results are generally suitable for an unhurried appointment with a healthcare professional.",
    ],
  },
};
