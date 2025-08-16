
import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// =========== I18N (TRANSLATIONS) SETUP ===========
const translations = {
  en: {
    header: {
      title: 'Deep Rinse Companion',
      subtitle: 'Cleanse Steps & Log (v2.0)',
      checklist: 'Checklist',
      log: 'Log',
      history: 'History',
    },
    checklist: {
      safetyTitle: 'Important Safety Notice',
      safetyContent: 'Performing any form of enema at home, especially deep cleansing, carries potential health risks, including but not limited to intestinal mucosal injury, electrolyte imbalance, and even bowel perforation. This document is for personal practice optimization reference only and <strong>does not constitute medical advice</strong>. Procedures should be done with caution and not frequently. If you have any history of intestinal diseases (e.g., IBD, diverticulitis), cardiovascular issues, or any health concerns, <strong>please consult a physician first</strong>.',
      step0_title: 'Preparation (T – 4-6h)',
      step0_l1: '<strong>Diet:</strong> Follow a low-residue diet (white rice, white bread/toast, eggs, fish, soft tofu, etc.) to minimize solid waste in the intestines.',
      step0_l2: '<strong>Hydration:</strong> Stay normally hydrated throughout the day, but <strong>avoid drinking large amounts of water 1-2 hours before the procedure</strong> to prevent discomfort from a full bladder and intestinal pressure.',
      step0_l3: '<strong>Equipment:</strong>',
      step0_l3_1: 'Water temperature should be <strong>37–39°C</strong> (close to body temperature).',
      step0_l3_2: 'Maintain <strong>low water pressure and a slow flow rate</strong>. It is recommended to use a measuring cup to precisely control the water volume for each round (200–300 ml).',
      step0_l3_3: 'The tip of the tool (hose) must be <strong>well-lubricated</strong>.',
      step0_l3_4: '<strong>Expel air from the tube:</strong> Before insertion, let a small amount of water flow out to purge air from the tube, preventing gas from being introduced into the intestine, which can cause cramping.',
      step0_l4: '<strong>Mind & Body:</strong> Perform 2-3 sets of Reverse Kegels (pelvic floor relaxation exercises) to relax the muscles around the entrance.',
      step1_title: 'Shallow Rinse (Rectal Section)',
      step1_l1: '<strong>Procedure:</strong> 2-3 rounds of 200–250 ml; hold each for 20–30 seconds before expelling.',
      step1_l2: '<strong>Posture:</strong> It is recommended to do this directly on the toilet in a <strong>sitting or semi-squatting position</strong> for quick expulsion.',
      step1_l3: '<strong>Purpose:</strong> To clear superficial waste from the end of the rectum, preparing for the deep infusion and preventing contamination of the deeper water.',
      step2_title: 'Entry Posture for Bypassing the Junction (Choose one)',
      step2_l1: '<strong>Posture Options:</strong>',
      step2_l1_1: '<strong>Left side-lying + knees to chest (Recommended):</strong> This posture is based on human anatomy and best utilizes gravity to help water flow smoothly from the rectum into the sigmoid colon.',
      step2_l1_2: 'Kneeling + chest to bed (Doggy-style variation).',
      step2_l2: '<strong>Technique:</strong> While exhaling slowly, perform a Reverse Kegel to aid relaxation. If you feel the water flow is obstructed at the entrance, you can first instill a small amount of 100–150 ml as "guide water," and after it is expelled, proceed with the formal round.',
      step3_title: 'Deep Infusion (Sigmoid Colon Section)',
      step3_l1: '<strong>Insertion Depth:</strong> To ensure the water flows directly into the sigmoid colon instead of staying in the rectum, an <strong>insertion depth of about 15–25 cm is recommended</strong>.',
      step3_l2: '<strong>Infusion:</strong> Use 250–300 ml of water, maintaining a low-pressure, slow flow. Once you feel the water has entered deeply, you can remove the tool.',
      step3_l3: '<strong>Timing & Sensation:</strong> Start timing for <strong>2–3 minutes</strong> (retention time). <strong>Body sensation is more important than time</strong>: If you experience significant abdominal pain, strong cramping, or discomfort, immediately slow down or stop the flow and relax with deep breaths. Do not force yourself to reach the target time.',
      step3_l4: '<strong>Posture:</strong> Maintain the entry posture from the previous step throughout (left side-lying or kneeling).',
      step4_title: 'Flow Guidance & Expulsion',
      step4_l1: '<strong>Lying Down Flow Guidance (Optional):</strong> To distribute the water more widely, after holding for 1-2 minutes, you can change positions to <strong>lying on your back (1 minute)</strong> → <strong>lying on your right side (1 minute)</strong> to help the water pass through the transverse colon.',
      step4_l2: '<strong>Standing Flow Guidance:</strong> Stand up, gently <strong>twist your waist left and right for 30–60 seconds</strong>, then <strong>lean forward for 20–30 seconds</strong>, and finally, you can <strong>massage your abdomen clockwise</strong> to help the water wash the intestinal walls.',
      step4_l3: '<strong>Expulsion:</strong> Sit on the toilet in a <strong>deep squat position</strong> (with a stool under your feet) or a <strong>sitting position with a deep forward lean</strong> to use posture and abdominal pressure for a thorough expulsion. If you feel you haven\'t emptied completely, you can repeat the deep rinse step once if necessary.',
      step5_title: 'Finishing (Polishing)',
      step5_l1: '<strong>Procedure:</strong> 1-2 rounds of 150–200 ml; a shallow insertion is sufficient at this stage, hold for only 30–60 seconds before expelling.',
      step5_l2: '<strong>Purpose:</strong> This step helps to expel any fine debris that may have been loosened during the deep cleanse but not fully expelled, improving the final cleanliness.',
      step5_l3: '<strong>Standard:</strong> Stop when the expelled water is <strong>mostly clear</strong>. It is unnecessary and not recommended to aim for "completely transparent like tap water." Over-cleansing is harmful.',
      step6_title: 'Recovery (Avoiding Post-Rinse Discomfort)',
      step6_l1: '<strong>Relaxation:</strong> Perform 3 sets of the <strong>4-7-8 breathing technique</strong>; continue doing Reverse Kegels to relax the pelvic floor muscles.',
      step6_l2: '<strong>Warmth:</strong> Apply a warm towel or hot water bottle to the <strong>perineum/lower abdomen for 2–3 minutes</strong> to soothe the muscles.',
      step6_l3: '<strong>Rehydration:</strong> After the procedure, drink a moderate amount of <strong>warm water or a diluted electrolyte drink</strong> to replenish lost fluids.',
      step6_l4: '<strong>Activity:</strong> Do 8–10 gentle deep squats to help expel any remaining small amounts of water.',
      step6_l5: '<strong>Environment:</strong> Change the lighting, play music to help your mind and body switch from "procedure mode" back to "relaxation mode".'
    },
    log: {
      save: 'Save to History',
      reset: 'Reset',
      export: 'Export PDF',
      exporting: 'Exporting...',
      resetConfirm: 'Are you sure you want to reset the form?',
      saveSuccess: 'Log saved to history!',
      exportError: 'Sorry, there was an error exporting the PDF.',
      date: 'Date',
      lastBMHours: 'Hours Since Last BM',
      lastBMType: 'Last BM Type',
      lowResidue: 'Low-Residue Diet',
      totalTime: 'Total Time',
      unitHours: 'hours',
      unitMinutes: 'min',
      timerSet: 'Set Total Time',
      timerStart: 'Start',
      timerPause: 'Pause',
      roundsTitle: 'Rounds Record',
      addRound: '+ Add Round',
      roundNum: 'Round #{order}',
      roundType: 'Type',
      depth: 'Depth',
      unitCm: 'cm',
      volume: 'Volume',
      unitMl: 'ml',
      hold: 'Hold',
      unitMin: 'min',
      posture: 'Posture',
      clarity: 'Clarity',
      unit1to5: '1-5',
      feel: 'Feel',
      discomfort: 'Discomfort',
      remove: 'Remove',
      finalClarity: 'Final Clarity (1–5)',
      residualWater: 'Residual Water Feel',
      libido: 'Libido Aftereffect',
      overallFeel: 'Overall Feel',
      notes: 'Notes / Special Circumstances',
      notesPlaceholder: 'e.g., stuck at the junction, did Reverse Kegels help, use of guide water, cramping occurred, effect of flow guidance postures',
      footer: '"Save to History" saves the current log to this device. "Export PDF" generates a PDF of the white log card above.'
    },
    history: {
      noHistory: 'No History Yet',
      noHistorySub: "Go to the 'Log' tab to record your first session.",
      deleteConfirm: 'Are you sure you want to delete this log?',
      id: 'ID',
      rounds: 'Rounds',
      totalTime: 'Total Time',
      finalClarity: 'Final Clarity',
      overallFeel: 'Overall Feel',
      bmType: 'BM Type',
      residualWater: 'Residual Water',
      preview: 'Preview',
      hidePreview: 'Hide Preview',
      jsonPreview: 'JSON Preview',
      delete: 'Delete',
    },
    options: {
      yes: 'Yes',
      no: 'No',
      pleaseSelect: '—',
      roundTypes: { Shallow: 'Shallow', Deep: 'Deep', Finisher: 'Finisher' },
      lastBMTypes: { "": '—', "不成形": 'Loose', "正常": 'Normal', "偏硬": 'Hard' },
      postures: { "": '—', "坐/半蹲": 'Sitting/Squatting', "左側躺抱膝": 'Left side-lying, knees to chest', "跪姿胸貼床": 'Kneeling, chest to bed', "仰臥": 'Supine (on back)', "右側躺": 'Right side-lying', "站立扭腰前傾": 'Standing, waist-twisting, leaning forward', "深蹲排出": 'Deep squat expulsion' },
      feels: { "": '—', "舒": 'Comfortable', "滿": 'Full', "壓": 'Pressure' },
      discomforts: { "": '—', "無": 'None', "輕微便意": 'Slight Urge', "腹部絞痛": 'Cramping', "噁心": 'Nausea' },
      residualWaterFeels: { "": '—', "無": 'None', "輕微": 'Slight', "明顯": 'Obvious' },
      libidos: { "": '—', "↑": '↑ Increased', "→": '→ Unchanged', "↓": '↓ Decreased' },
      overallFeels: { "": '—', "神清氣爽": 'Refreshed', "乾淨舒適": 'Clean & Comfortable', "輕微疲勞": 'Slightly Tired', "明顯耗盡": 'Exhausted' },
    }
  },
  zh: {
    header: {
      title: '深層灌腸教學與實踐日誌',
      subtitle: '清潔流程與記錄 (v2.0)',
      checklist: '教學',
      log: '日誌',
      history: '歷史紀錄',
    },
    checklist: {
      safetyTitle: '重要安全聲明',
      safetyContent: '自行在家進行任何形式的灌腸，特別是深層清潔，均存在潛在健康風險，包括但不限於腸道黏膜損傷、電解質失衡、甚至腸穿孔。本文件僅為個人實踐的流程優化參考，<strong>不構成醫療建議</strong>。操作應謹慎為之，不應頻繁進行。若您有任何腸道疾病史（如：IBD、憩室炎）、心血管問題或任何健康疑慮，<strong>請務必先諮詢醫師</strong>。',
      step0_title: '準備（T – 4～6h）',
      step0_l1: '<strong>飲食：</strong> 執行低渣飲食（白飯、白麵包/吐司、雞蛋、魚肉、嫩豆腐等），確保腸道內固體殘渣降至最少。',
      step0_l2: '<strong>水分：</strong> 全天保持正常補水，但在<strong>操作前 1-2 小時應避免大量飲水</strong>，以免過程中膀胱飽脹感與腸道壓力感疊加，造成不適。',
      step0_l3: '<strong>設備：</strong>',
      step0_l3_1: '水溫控制在 <strong>37–39°C</strong>（接近體溫）。',
      step0_l3_2: '保持<strong>低水壓、慢流速</strong>。建議使用量杯分裝，精確控制每輪水量（200–300 ml）。',
      step0_l3_3: '工具（軟管前端）需<strong>充足潤滑</strong>。',
      step0_l3_4: '<strong>排出管內空氣：</strong> 插入前，先讓少量水流出，排空管路中的空氣，避免將氣體灌入腸道引發絞痛。',
      step0_l4: '<strong>身心：</strong> 進行 2-3 組 Reverse Kegel（反向骨盆底肌放鬆練習），讓入口周圍肌肉放鬆。',
      step1_title: '淺洗（直腸段）',
      step1_l1: '<strong>操作：</strong> 200–250 ml × 2–3 輪；每輪停留 20–30 秒後排出。',
      step1_l2: '<strong>姿勢：</strong> 建議直接在馬桶上採<strong>坐姿或半蹲姿</strong>進行，方便快速排出。',
      step1_l3: '<strong>目的：</strong> 清理直腸末端的表層殘渣，為深層注水做準備，避免深層的水被輕易污染。',
      step2_title: '跨過交界的進入姿勢（擇一）',
      step2_l1: '<strong>姿勢選項：</strong>',
      step2_l1_1: '<strong>左側躺 + 膝蓋抱胸（推薦）：</strong> 此姿勢基於人體解剖學，最能利用重力讓水流順利從直腸進入乙狀結腸。',
      step2_l1_2: '跪姿 + 胸貼床（Doggy 式變體）。',
      step2_l2: '<strong>操作技巧：</strong> 在緩慢呼氣時，同時做 Reverse Kegel 輔助放鬆。若感覺水流在入口處受阻，可先注入 100–150 ml 的少量水作為「引導水」，待其排出後再正式進行。',
      step3_title: '深洗注水（乙狀結腸段）',
      step3_l1: '<strong>插入深度：</strong> 為確保水流能直接進入乙狀結腸而非停留在直腸，<strong>建議插入深度約 15–25 公分</strong>。',
      step3_l2: '<strong>注水：</strong> 使用 250–300 ml 水，維持低壓慢流。當感覺水已順利進入深處後，即可拔出工具。',
      step3_l3: '<strong>計時與感受：</strong> 從此刻開始計時 <strong>2–3 分鐘</strong>（保留時間）。<strong>身體感受比時間更重要</strong>：若過程中出現明顯腹痛、強烈絞痛感或不適，應立即減慢流速或暫停，並用深呼吸放鬆。不必強求達到目標時間。',
      step3_l4: '<strong>姿勢：</strong> 全程保持上一步的進入姿勢（左側躺或跪姿）。',
      step4_title: '導流與排出',
      step4_l1: '<strong>臥姿導流（可選）：</strong> 想讓水流分布更廣時，可在保留 1-2 分鐘後，依次變換為<strong>仰臥（1分鐘）</strong> → <strong>右側躺（1分鐘）</strong>，幫助水流通過橫結腸。',
      step4_l2: '<strong>站姿導流：</strong> 起身站立，輕柔地<strong>左右扭腰 30–60 秒</strong>，接著<strong>身體前傾 20–30 秒</strong>，最後可<strong>順時針按摩腹部</strong>，幫助水流沖刷腸壁。',
      step4_l3: '<strong>排出：</strong> 坐上馬桶，採<strong>深蹲姿勢</strong>（腳踩小凳）或<strong>坐姿大幅前傾</strong>，利用姿勢和腹壓幫助徹底排出。若感覺排不乾淨，必要時可重複一次深洗步驟。',
      step5_title: '收尾（拋光）',
      step5_l1: '<strong>操作：</strong> 150–200 ml × 1–2 輪；此時只需淺插，停 30–60 秒即可排出。',
      step5_l2: '<strong>目的：</strong> 此步驟能幫助排出先前深層清洗時可能鬆動、但未完全排出的細微殘渣，提高最終的潔淨度。',
      step5_l3: '<strong>標準：</strong> 當排出的水色<strong>大致清澈</strong>即可停止，無需、也不應追求「完全透明如自來水」。過度清洗有害無益。',
      step6_title: '恢復（避免洗後不適）',
      step6_l1: '<strong>放鬆：</strong> 進行 3 組 <strong>4-7-8 呼吸法</strong>；持續做 Reverse Kegel 放鬆骨盆底肌。',
      step6_l2: '<strong>保暖：</strong> 用溫熱毛巾或熱水袋<strong>熱敷會陰部/下腹部 2–3 分鐘</strong>，舒緩肌肉。',
      step6_l3: '<strong>補水：</strong> 操作結束後，適量飲用<strong>溫水或稀釋的電解質飲料</strong>，補充流失的水分。',
      step6_l4: '<strong>活動：</strong> 做 8–10 次輕度的深蹲，幫助排出可能殘留的少量水分。',
      step6_l5: '<strong>環境：</strong> 切換燈光、播放音樂，幫助身心從「操作模式」切換回「放鬆模式」。'
    },
    log: {
      save: '儲存至歷史紀錄',
      reset: '重設',
      export: '匯出 PDF',
      exporting: '匯出中...',
      resetConfirm: '確定要重設表單嗎？',
      saveSuccess: '日誌已儲存！',
      exportError: '抱歉，匯出 PDF 時發生錯誤。',
      date: '日期',
      lastBMHours: '上次排便至今',
      lastBMType: '上次排便型態',
      lowResidue: '低渣飲食',
      totalTime: '總耗時',
      unitHours: '小時',
      unitMinutes: '分鐘',
      timerSet: '設定總時間',
      timerStart: '開始',
      timerPause: '暫停',
      roundsTitle: '每輪紀錄',
      addRound: '+ 加一輪',
      roundNum: '#{order} 類型',
      roundType: '類型',
      depth: '深度',
      unitCm: 'cm',
      volume: '水量',
      unitMl: 'ml',
      hold: '保留',
      unitMin: '分',
      posture: '姿勢',
      clarity: '清澈度',
      unit1to5: '1-5',
      feel: '感覺',
      discomfort: '不適感',
      remove: '刪除',
      finalClarity: '末次水色 (1–5)',
      residualWater: '腹部殘水感',
      libido: '性慾後效',
      overallFeel: '整體感受',
      notes: '備註 / 特殊情況',
      notesPlaceholder: '例如：卡在交界處、Reverse Kegel 是否幫助、是否先小量引導水、是否出現絞痛、導流姿勢的效果',
      footer: '「儲存至歷史紀錄」會將目前日誌儲存於此裝置。「匯出 PDF」會產生上方白色日誌卡的 PDF 檔案。'
    },
    history: {
      noHistory: '尚無歷史紀錄',
      noHistorySub: '前往「日誌」頁面來記錄您的第一次操作。',
      deleteConfirm: '確定要刪除這筆紀錄嗎？',
      id: 'ID',
      rounds: '輪數',
      totalTime: '總耗時',
      finalClarity: '末次水色',
      overallFeel: '整體感受',
      bmType: '排便型態',
      residualWater: '殘水感',
      preview: '預覽',
      hidePreview: '隱藏預覽',
      jsonPreview: 'JSON 預覽',
      delete: '刪除',
    },
    options: {
      yes: '是',
      no: '否',
      pleaseSelect: '—',
      roundTypes: { Shallow: 'Shallow', Deep: 'Deep', Finisher: 'Finisher' },
      lastBMTypes: { "": '—', "不成形": '不成形', "正常": '正常', "偏硬": '偏硬' },
      postures: { "": '—', "坐/半蹲": '坐/半蹲', "左側躺抱膝": '左側躺抱膝', "跪姿胸貼床": '跪姿胸貼床', "仰臥": '仰臥', "右側躺": '右側躺', "站立扭腰前傾": '站立扭腰前傾', "深蹲排出": '深蹲排出' },
      feels: { "": '—', "舒": '舒', "滿": '滿', "壓": '壓' },
      discomforts: { "": '—', "無": '無', "輕微便意": '輕微便意', "腹部絞痛": '腹部絞痛', "噁心": '噁心' },
      residualWaterFeels: { "": '—', "無": '無', "輕微": '輕微', "明顯": '明顯' },
      libidos: { "": '—', "↑": '↑', "→": '→', "↓": '↓' },
      overallFeels: { "": '—', "神清氣爽": '神清氣爽', "乾淨舒適": '乾淨舒適', "輕微疲勞": '輕微疲勞', "明顯耗盡": '明顯耗盡' },
    }
  }
};

type Language = 'en' | 'zh';
const LanguageContext = createContext<{ language: Language; setLanguage: (lang: Language) => void; t: (key: string, replacements?: {[key: string]: string}) => any; } | null>(null);

const useTranslation = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
};

const getTranslation = (lang: Language, key: string, replacements?: {[key: string]: string}): any => {
    const keys = key.split('.');
    let result: any = translations[lang];
    for (const k of keys) {
        result = result?.[k];
        if (result === undefined) {
            // Fallback to English if translation is missing
            let fallbackResult: any = translations.en;
            for (const fk of keys) {
                fallbackResult = fallbackResult?.[fk];
                if(fallbackResult === undefined) return key;
            }
            result = fallbackResult;
            break;
        }
    }

    if (typeof result === 'string' && replacements) {
        Object.keys(replacements).forEach(rKey => {
            result = result.replace(`{${rKey}}`, replacements[rKey]);
        });
    }

    return result || key;
};

const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguage] = useState<Language>('zh');
    const t = (key: string, replacements?: {[key: string]: string}) => getTranslation(language, key, replacements);
    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};


// =========== TYPES V2 ===========
type RoundType = "Shallow" | "Deep" | "Finisher";
type PostureType = "" | "坐/半蹲" | "左側躺抱膝" | "跪姿胸貼床" | "仰臥" | "右側躺" | "站立扭腰前傾" | "深蹲排出";
type FeelType = "" | "舒" | "滿" | "壓";
type LastBMType = "" | "不成形" | "正常" | "偏硬";
type DiscomfortType = "" | "無" | "輕微便意" | "腹部絞痛" | "噁心";
type ResidualWaterFeelType = "" | "無" | "輕微" | "明顯";
type OverallFeelType = "" | "神清氣爽" | "乾淨舒適" | "輕微疲勞" | "明顯耗盡";

interface Round {
  order: number;
  type: RoundType;
  depthCm: string;
  volumeMl: string;
  holdMin: string;
  posture: PostureType;
  clarity: string;
  feel: FeelType;
  discomfort: DiscomfortType;
}

interface LogData {
  date: string;
  lastBMHours: string;
  lastBMType: LastBMType;
  lowResidue: boolean;
  totalTimeMin: string;
  finalClarity: string;
  residualWaterFeel: ResidualWaterFeelType;
  libidoAfter: "" | "↑" | "→" | "↓";
  overallFeel: OverallFeelType;
  notes: string;
  rounds: Round[];
}

interface HistoryEntry {
  id: number;
  data: LogData;
}

type ActiveView = 'checklist' | 'log' | 'history';

// =========== DEFAULTS & CONSTANTS V2 ===========
const getDefaultRounds = (): Round[] => ([
  { order: 1, type: "Shallow", depthCm: '', volumeMl: '', holdMin: '', posture: "", clarity: '', feel: "", discomfort: "" },
  { order: 2, type: "Shallow", depthCm: '', volumeMl: '', holdMin: '', posture: "", clarity: '', feel: "", discomfort: "" },
  { order: 3, type: "Shallow", depthCm: '', volumeMl: '', holdMin: '', posture: "", clarity: '', feel: "", discomfort: "" },
]);

const getDefaultLogState = (): LogData => ({
  date: new Date().toISOString().split('T')[0],
  lastBMHours: '',
  lastBMType: "",
  lowResidue: true,
  totalTimeMin: '',
  finalClarity: '',
  residualWaterFeel: "",
  libidoAfter: "",
  overallFeel: "",
  notes: '',
  rounds: getDefaultRounds(),
});

const LOCAL_STORAGE_KEY = 'deepRinseLogs_v1';

// =========== CUSTOM HOOK for LocalStorage ===========
const useLocalLogs = (): [HistoryEntry[], (value: HistoryEntry[] | ((val: HistoryEntry[]) => HistoryEntry[])) => void] => {
  const [storedValue, setStoredValue] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      setStoredValue(item ? JSON.parse(item) : []);
    } catch (error) {
      console.warn('Error reading from localStorage:', error);
      setStoredValue([]);
    }
  }, []);

  const setValue = (value: HistoryEntry[] | ((val: HistoryEntry[]) => HistoryEntry[])) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn('Error writing to localStorage:', error);
    }
  };

  return [storedValue, setValue];
};

// =========== UI COMPONENTS ===========

const Header = ({ active, setActive }: { active: ActiveView, setActive: (view: ActiveView) => void }) => {
  const { language, setLanguage, t } = useTranslation();

  const NavButton = ({ view, children }: { view: ActiveView, children: React.ReactNode }) => (
    <button
      onClick={() => setActive(view)}
      className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${
        active === view
          ? 'bg-slate-800 text-white shadow-md'
          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
      }`}
    >
      {children}
    </button>
  );
  
  const LangButton = ({ lang }: {lang: Language}) => (
      <button onClick={() => setLanguage(lang)} className={`px-2 py-1 text-xs font-bold ${language === lang ? 'text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}>
        {lang.toUpperCase()}
      </button>
  );

  return (
    <header className="sticky top-0 z-50 bg-slate-50/80 backdrop-blur-lg shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="bg-slate-800 text-white font-bold text-xl w-10 h-10 flex items-center justify-center rounded-full">DR</span>
            <div>
              <h1 className="text-lg font-bold text-slate-900">{t('header.title')}</h1>
              <p className="text-xs text-slate-500">{t('header.subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <nav className="flex items-center space-x-2">
              <NavButton view="checklist">{t('header.checklist')}</NavButton>
              <NavButton view="log">{t('header.log')}</NavButton>
              <NavButton view="history">{t('header.history')}</NavButton>
            </nav>
            <div className="border-l border-slate-300 h-6 ml-2 pl-2 flex items-center">
                <LangButton lang='en' />
                <span className="text-slate-300">/</span>
                <LangButton lang='zh' />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const StepCard = ({ number, title, children }: { number: string, title: string, children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 flex items-start space-x-6">
    <div className="flex-shrink-0 bg-slate-100 text-slate-700 font-bold text-2xl w-14 h-14 flex items-center justify-center rounded-full border border-slate-200">
      {number}
    </div>
    <div>
      <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-2">
        {children}
      </div>
    </div>
  </div>
);

const ChecklistPage = () => {
    const { t } = useTranslation();
    const steps = [0, 1, 2, 3, 4, 5, 6];

    const renderStepContent = (step: number) => {
        switch(step) {
            case 0: return <ul className="list-disc pl-5 space-y-2">
                <li dangerouslySetInnerHTML={{__html: t('checklist.step0_l1')}}/>
                <li dangerouslySetInnerHTML={{__html: t('checklist.step0_l2')}}/>
                <li><span dangerouslySetInnerHTML={{__html: t('checklist.step0_l3')}}/>
                    <ul className="list-circle pl-5 mt-1">
                        <li dangerouslySetInnerHTML={{__html: t('checklist.step0_l3_1')}}/>
                        <li dangerouslySetInnerHTML={{__html: t('checklist.step0_l3_2')}}/>
                        <li dangerouslySetInnerHTML={{__html: t('checklist.step0_l3_3')}}/>
                        <li dangerouslySetInnerHTML={{__html: t('checklist.step0_l3_4')}}/>
                    </ul>
                </li>
                <li dangerouslySetInnerHTML={{__html: t('checklist.step0_l4')}}/>
            </ul>
            case 1: return <ul className="list-disc pl-5 space-y-2">
                <li dangerouslySetInnerHTML={{__html: t('checklist.step1_l1')}}/>
                <li dangerouslySetInnerHTML={{__html: t('checklist.step1_l2')}}/>
                <li dangerouslySetInnerHTML={{__html: t('checklist.step1_l3')}}/>
            </ul>
            case 2: return <ul className="list-disc pl-5 space-y-2">
                <li><span dangerouslySetInnerHTML={{__html: t('checklist.step2_l1')}}/>
                    <ul className="list-circle pl-5 mt-1">
                        <li dangerouslySetInnerHTML={{__html: t('checklist.step2_l1_1')}}/>
                        <li dangerouslySetInnerHTML={{__html: t('checklist.step2_l1_2')}}/>
                    </ul>
                </li>
                <li dangerouslySetInnerHTML={{__html: t('checklist.step2_l2')}}/>
            </ul>
            case 3: return <ul className="list-disc pl-5 space-y-2">
                <li dangerouslySetInnerHTML={{__html: t('checklist.step3_l1')}}/>
                <li dangerouslySetInnerHTML={{__html: t('checklist.step3_l2')}}/>
                <li dangerouslySetInnerHTML={{__html: t('checklist.step3_l3')}}/>
                <li dangerouslySetInnerHTML={{__html: t('checklist.step3_l4')}}/>
            </ul>
            case 4: return <ul className="list-disc pl-5 space-y-2">
                <li dangerouslySetInnerHTML={{__html: t('checklist.step4_l1')}}/>
                <li dangerouslySetInnerHTML={{__html: t('checklist.step4_l2')}}/>
                <li dangerouslySetInnerHTML={{__html: t('checklist.step4_l3')}}/>
            </ul>
            case 5: return <ul className="list-disc pl-5 space-y-2">
                <li dangerouslySetInnerHTML={{__html: t('checklist.step5_l1')}}/>
                <li dangerouslySetInnerHTML={{__html: t('checklist.step5_l2')}}/>
                <li dangerouslySetInnerHTML={{__html: t('checklist.step5_l3')}}/>
            </ul>
            case 6: return <ul className="list-disc pl-5 space-y-2">
                <li dangerouslySetInnerHTML={{__html: t('checklist.step6_l1')}}/>
                <li dangerouslySetInnerHTML={{__html: t('checklist.step6_l2')}}/>
                <li dangerouslySetInnerHTML={{__html: t('checklist.step6_l3')}}/>
                <li dangerouslySetInnerHTML={{__html: t('checklist.step6_l4')}}/>
                <li dangerouslySetInnerHTML={{__html: t('checklist.step6_l5')}}/>
            </ul>
            default: return null;
        }
    };
    
    return (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
            <div className="space-y-6">
            <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded-r-lg mb-8" role="alert">
                <h4 className="font-bold text-lg">{t('checklist.safetyTitle')}</h4>
                <p className="mt-2 text-sm" dangerouslySetInnerHTML={{__html: t('checklist.safetyContent')}} />
            </div>

            {steps.map(step => (
                <StepCard key={step} number={String(step)} title={t(`checklist.step${step}_title`)}>
                    {renderStepContent(step)}
                </StepCard>
            ))}
            </div>
        </main>
    );
};

const Timer = ({ onTimeUpdate }: { onTimeUpdate: (minutes: string) => void }) => {
    const { t } = useTranslation();
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = window.setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning]);

    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const handleSetTotalTime = () => {
        const minutes = (time / 60).toFixed(1);
        onTimeUpdate(minutes);
    };

    return (
        <div className="flex items-center gap-2 p-2 bg-slate-100 rounded-lg">
            <span className="text-sm font-mono text-slate-800 font-semibold w-12 text-center">{formatTime(time)}</span>
            <button type="button" onClick={() => setIsRunning(!isRunning)} className="px-2 py-1 text-xs font-semibold rounded bg-white border border-slate-300 hover:bg-slate-50">{isRunning ? t('log.timerPause') : t('log.timerStart')}</button>
            <button type="button" onClick={() => { setTime(0); setIsRunning(false); }} className="px-2 py-1 text-xs font-semibold rounded bg-white border border-slate-300 hover:bg-slate-50">{t('log.reset')}</button>
            <button type="button" onClick={handleSetTotalTime} className="px-2 py-1 text-xs font-semibold rounded bg-slate-600 text-white hover:bg-slate-700">{t('log.timerSet')}</button>
        </div>
    );
};

// ===================================
//   PDF EXPORT FIX: PRINT COMPONENT
// ===================================
const LogCardForPrint = React.forwardRef<HTMLDivElement, { logData: LogData, t: (key: string) => string }>(({ logData, t }, ref) => {
    const PrintField = ({ label, value }: { label: string, value: React.ReactNode }) => (
        <div>
            <p className="text-xs font-bold text-gray-600 mb-1">{label}</p>
            <p className="text-sm text-black">{value || 'N/A'}</p>
        </div>
    );
    
    return (
        <div ref={ref} className="bg-white p-8" style={{ width: '800px', fontFamily: 'sans-serif' }}>
            <div className="grid grid-cols-5 gap-x-6 gap-y-4 mb-8">
                <PrintField label={t('log.date')} value={logData.date} />
                <PrintField label={t('log.lastBMHours')} value={`${logData.lastBMHours} ${t('log.unitHours')}`} />
                <PrintField label={t('log.lastBMType')} value={t(`options.lastBMTypes.${logData.lastBMType}`)} />
                <PrintField label={t('log.lowResidue')} value={logData.lowResidue ? t('options.yes') : t('options.no')} />
                <PrintField label={t('log.totalTime')} value={`${logData.totalTimeMin} ${t('log.unitMinutes')}`} />
            </div>

            <h3 className="font-bold text-lg text-black mb-4">{t('log.roundsTitle')}</h3>
            <div className="space-y-2 mb-8">
                {logData.rounds.map((round) => (
                    <div key={round.order} className="grid grid-cols-8 gap-x-3 items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <PrintField label={`#${round.order} ${t('log.roundType')}`} value={t(`options.roundTypes.${round.type}`)} />
                        <PrintField label={t('log.depth')} value={`${round.depthCm} ${t('log.unitCm')}`} />
                        <PrintField label={t('log.volume')} value={`${round.volumeMl} ${t('log.unitMl')}`} />
                        <PrintField label={t('log.hold')} value={`${round.holdMin} ${t('log.unitMin')}`} />
                        <div className="col-span-2"><PrintField label={t('log.posture')} value={t(`options.postures.${round.posture}`)} /></div>
                        <PrintField label={t('log.clarity')} value={`${round.clarity}`} />
                        <PrintField label={t('log.feel')} value={t(`options.feels.${round.feel}`)} />
                        <div className="col-span-2"><PrintField label={t('log.discomfort')} value={t(`options.discomforts.${round.discomfort}`)} /></div>
                    </div>
                ))}
            </div>
            
            <div className="grid grid-cols-4 gap-6 mb-6">
                <PrintField label={t('log.finalClarity')} value={logData.finalClarity} />
                <PrintField label={t('log.residualWater')} value={t(`options.residualWaterFeels.${logData.residualWaterFeel}`)} />
                <PrintField label={t('log.libido')} value={t(`options.libidos.${logData.libidoAfter}`)} />
                <PrintField label={t('log.overallFeel')} value={t(`options.overallFeels.${logData.overallFeel}`)} />
            </div>

            <div>
                <p className="text-xs font-bold text-gray-600 mb-1">{t('log.notes')}</p>
                <p className="text-sm text-black whitespace-pre-wrap">{logData.notes || 'N/A'}</p>
            </div>
        </div>
    );
});


const LogPage = () => {
  const [logData, setLogData] = useState<LogData>(getDefaultLogState);
  const [, setLogs] = useLocalLogs();
  const printRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const { t } = useTranslation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLogData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLowResidueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLogData(p => ({...p, lowResidue: e.target.value === 'true'}));
  };

  const handleRoundChange = (index: number, field: keyof Round, value: string) => {
    const newRounds = [...logData.rounds];
    (newRounds[index] as any)[field] = value;
    setLogData(prev => ({ ...prev, rounds: newRounds }));
  };
  
  const reorderRounds = (rounds: Round[]): Round[] => {
    return rounds.map((round, index) => ({ ...round, order: index + 1 }));
  };

  const addRound = (type: RoundType) => {
    const newRound: Round = { order: 0, type, depthCm: '', volumeMl: '', holdMin: '', posture: "", clarity: '', feel: "", discomfort: "" };
    setLogData(prev => ({...prev, rounds: reorderRounds([...prev.rounds, newRound])}));
  };

  const removeRound = (index: number) => {
    const newRounds = logData.rounds.filter((_, i) => i !== index);
    setLogData(prev => ({ ...prev, rounds: reorderRounds(newRounds) }));
  };

  const handleReset = () => {
    if (window.confirm(t('log.resetConfirm'))) {
      setLogData(getDefaultLogState());
    }
  };

  const handleSave = () => {
    const newEntry: HistoryEntry = { id: Date.now(), data: logData };
    setLogs(prevLogs => [newEntry, ...prevLogs]);
    alert(t('log.saveSuccess'));
  };

  const handleExport = useCallback(async () => {
    const element = printRef.current;
    if (!element) return;
    setIsExporting(true);

    try {
        const canvas = await html2canvas(element, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
        const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
        
        const margin = 20;
        const pdfWidth = pdf.internal.pageSize.getWidth() - margin * 2;
        const pdfHeight = pdf.internal.pageSize.getHeight() - margin * 2;
        
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgHeight / imgWidth;
        
        const imgHeightInPdf = pdfWidth * ratio;
        let heightLeft = imgHeightInPdf;
        let position = margin;
        
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', margin, position, pdfWidth, imgHeightInPdf);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
            position = heightLeft - imgHeightInPdf + margin;
            pdf.addPage();
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', margin, position, pdfWidth, imgHeightInPdf);
            heightLeft -= pdfHeight;
        }

        pdf.save(`rinse-log_${logData.date}.pdf`);
    } catch (error) {
        console.error("Failed to export PDF", error);
        alert(t('log.exportError'));
    } finally {
        setIsExporting(false);
    }
  }, [logData, t]);


  const ControlButton = ({ onClick, children, disabled=false }: { onClick: () => void, children: React.ReactNode, disabled?: boolean}) => (
      <button
        onClick={onClick}
        disabled={disabled}
        className="px-3 py-1.5 text-xs font-semibold rounded-md transition-colors duration-200 bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >{children}</button>
  );

  const AddRoundButton = ({ type }: {type: RoundType}) => (
      <button
        onClick={() => addRound(type)}
        className="px-3 py-1 text-xs font-semibold rounded-md transition-colors duration-200 bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
      >{`${t('log.addRound')} ${t(`options.roundTypes.${type}`)}`}</button>
  );

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
        <div className="flex justify-end items-center mb-4 space-x-2">
            <ControlButton onClick={handleSave}>{t('log.save')}</ControlButton>
            <ControlButton onClick={handleReset}>{t('log.reset')}</ControlButton>
            <ControlButton onClick={handleExport} disabled={isExporting}>{isExporting ? t('log.exporting') : t('log.export')}</ControlButton>
        </div>

        {/* Interactive form for user */}
        <div id="log-card-interactive" className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-4 mb-8">
                <Input label={t('log.date')} type="date" name="date" value={logData.date} onChange={handleInputChange} />
                <Input label={t('log.lastBMHours')} type="number" name="lastBMHours" value={logData.lastBMHours} onChange={handleInputChange} unit={t('log.unitHours')} />
                <Select label={t('log.lastBMType')} name="lastBMType" value={logData.lastBMType} onChange={handleInputChange}>
                    {Object.entries(t('options.lastBMTypes', {}) as Record<string, string>).map(([key, value]) => <option key={key} value={key}>{value}</option>)}
                </Select>
                <Select label={t('log.lowResidue')} name="lowResidue" value={logData.lowResidue ? 'true' : 'false'} onChange={handleLowResidueChange}>
                    <option value="true">{t('options.yes')}</option>
                    <option value="false">{t('options.no')}</option>
                </Select>
                <div className="md:col-span-3 lg:col-span-1">
                    <Input label={t('log.totalTime')} type="number" name="totalTimeMin" value={logData.totalTimeMin} onChange={handleInputChange} unit={t('log.unitMinutes')}/>
                </div>
            </div>

            <div className="flex justify-end mb-6">
                <Timer onTimeUpdate={(minutes) => setLogData(p => ({...p, totalTimeMin: minutes }))} />
            </div>

            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-slate-800">{t('log.roundsTitle')}</h3>
                    <div className="flex space-x-2">
                       <AddRoundButton type="Shallow" />
                       <AddRoundButton type="Deep" />
                       <AddRoundButton type="Finisher" />
                    </div>
                </div>
                <div className="space-y-2">
                    {logData.rounds.map((round, index) => (
                        <RoundRow key={index} round={round} index={index} onchange={handleRoundChange} onRemove={removeRound} />
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <Input label={t('log.finalClarity')} type="number" name="finalClarity" min="1" max="5" value={logData.finalClarity} onChange={handleInputChange} />
                <Select label={t('log.residualWater')} name="residualWaterFeel" value={logData.residualWaterFeel} onChange={handleInputChange}>
                    {Object.entries(t('options.residualWaterFeels', {}) as Record<string, string>).map(([key, value]) => <option key={key} value={key}>{value}</option>)}
                </Select>
                <Select label={t('log.libido')} name="libidoAfter" value={logData.libidoAfter} onChange={handleInputChange}>
                    {Object.entries(t('options.libidos', {}) as Record<string, string>).map(([key, value]) => <option key={key} value={key}>{value}</option>)}
                </Select>
                <Select label={t('log.overallFeel')} name="overallFeel" value={logData.overallFeel} onChange={handleInputChange}>
                    {Object.entries(t('options.overallFeels', {}) as Record<string, string>).map(([key, value]) => <option key={key} value={key}>{value}</option>)}
                </Select>
            </div>

            <div>
                <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">{t('log.notes')}</label>
                <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    value={logData.notes}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500 text-sm"
                    placeholder={t('log.notesPlaceholder')}
                />
            </div>
        </div>
        <p className="text-xs text-slate-500 mt-4 text-center">{t('log.footer')}</p>
        
        {/* Hidden component for printing */}
        <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
            <LogCardForPrint ref={printRef} logData={logData} t={(key) => t(key, {})} />
        </div>
    </main>
  );
};


const RoundRow = ({ round, index, onchange, onRemove }: {round: Round, index: number, onchange: (index: number, field: keyof Round, value: any) => void, onRemove: (index: number) => void}) => {
    const { t } = useTranslation();
    const handleChange = (field: keyof Round) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        onchange(index, field, e.target.value);
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-9 gap-x-3 gap-y-2 items-end p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-600 mb-1">{t('log.roundNum', {order: String(round.order)})}</label>
                <select value={round.type} onChange={handleChange('type')} className="w-full p-1.5 bg-white border border-slate-300 rounded-md shadow-sm text-sm">
                    {Object.entries(t('options.roundTypes', {}) as Record<string, string>).map(([key, value]) => <option key={key} value={key}>{value}</option>)}
                </select>
            </div>
            <InputSm label={t('log.depth')} type="number" value={round.depthCm} onChange={handleChange('depthCm')} unit={t('log.unitCm')} />
            <InputSm label={t('log.volume')} type="number" value={round.volumeMl} onChange={handleChange('volumeMl')} unit={t('log.unitMl')} />
            <InputSm label={t('log.hold')} type="number" step="0.5" value={round.holdMin} onChange={handleChange('holdMin')} unit={t('log.unitMin')} />
            <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">{t('log.posture')}</label>
                <select value={round.posture} onChange={handleChange('posture')} className="w-full p-1.5 bg-white border border-slate-300 rounded-md shadow-sm text-sm">
                    {Object.entries(t('options.postures', {}) as Record<string, string>).map(([key, value]) => <option key={key} value={key}>{value}</option>)}
                </select>
            </div>
            <InputSm label={t('log.clarity')} type="number" min="1" max="5" value={round.clarity} onChange={handleChange('clarity')} unit={t('log.unit1to5')} />
             <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">{t('log.feel')}</label>
                <select value={round.feel} onChange={handleChange('feel')} className="w-full p-1.5 bg-white border border-slate-300 rounded-md shadow-sm text-sm">
                    {Object.entries(t('options.feels', {}) as Record<string, string>).map(([key, value]) => <option key={key} value={key}>{value}</option>)}
                </select>
            </div>
            <div className="col-span-2 sm:col-span-5 lg:col-span-2 grid grid-cols-3 gap-x-3 items-end">
                <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">{t('log.discomfort')}</label>
                    <select value={round.discomfort} onChange={handleChange('discomfort')} className="w-full p-1.5 bg-white border border-slate-300 rounded-md shadow-sm text-sm">
                        {Object.entries(t('options.discomforts', {}) as Record<string, string>).map(([key, value]) => <option key={key} value={key}>{value}</option>)}
                    </select>
                </div>
                <div className="flex items-end justify-center h-full">
                    <button onClick={() => onRemove(index)} className="text-red-500 hover:text-red-700 text-xs font-semibold pb-1">{t('log.remove')}</button>
                </div>
            </div>
        </div>
    );
};

const Input = ({ label, unit, ...props }: {label: string, unit?: string} & React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
        <label htmlFor={props.name} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <div className="relative">
            <input {...props} id={props.name} className={`block w-full p-2 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500 text-sm ${unit ? 'pr-12' : ''}`} />
            {unit && <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-500">{unit}</span>}
        </div>
    </div>
);

const InputSm = ({ label, unit, ...props }: {label: string, unit?: string} & React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
        <div className="relative">
            <input {...props} className={`w-full p-1.5 bg-white border border-slate-300 rounded-md shadow-sm text-sm ${unit ? 'pr-10' : ''}`} />
            {unit && <span className="absolute inset-y-0 right-0 pr-2 flex items-center text-xs text-slate-400">{unit}</span>}
        </div>
    </div>
);


const Select = ({ label, children, ...props }: {label: string, children: React.ReactNode} & React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <div>
        <label htmlFor={props.name} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <select {...props} id={props.name} className="block w-full p-2 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500 text-sm">
            {children}
        </select>
    </div>
);


const HistoryPage = () => {
    const [logs, setLogs] = useLocalLogs();
    const [previewId, setPreviewId] = useState<number | null>(null);
    const { t } = useTranslation();

    const handleDelete = (id: number) => {
        if (window.confirm(t('history.deleteConfirm'))) {
            setLogs(prev => prev.filter(log => log.id !== id));
        }
    };
    
    const togglePreview = (id: number) => {
        setPreviewId(prev => (prev === id ? null : id));
    };

    if (logs.length === 0) {
        return (
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center fade-in">
                <div className="bg-white rounded-2xl p-12 border border-slate-200">
                    <h2 className="text-xl font-semibold text-slate-700">{t('history.noHistory')}</h2>
                    <p className="text-slate-500 mt-2">{t('history.noHistorySub')}</p>
                </div>
            </main>
        );
    }
    
    return (
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {logs.map(log => (
                    <div key={log.id} className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden flex flex-col">
                        <div className="p-5 flex-grow">
                            <p className="text-xs text-slate-400">{t('history.id')}: {log.id}</p>
                            <h3 className="font-bold text-lg text-slate-800 mb-3">{log.data.date}</h3>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                <InfoItem label={t('history.rounds')} value={log.data.rounds.length} />
                                <InfoItem label={t('history.totalTime')} value={`${log.data.totalTimeMin || 'N/A'} ${t('log.unitMinutes')}`} />
                                <InfoItem label={t('history.finalClarity')} value={log.data.finalClarity || 'N/A'} />
                                <InfoItem label={t('history.overallFeel')} value={t(`options.overallFeels.${log.data.overallFeel}`) || 'N/A'} />
                                <InfoItem label={t('history.bmType')} value={t(`options.lastBMTypes.${log.data.lastBMType}`) || 'N/A'} />
                                <InfoItem label={t('history.residualWater')} value={t(`options.residualWaterFeels.${log.data.residualWaterFeel}`) || 'N/A'} />
                            </div>
                        </div>
                        {previewId === log.id && (
                            <div className="bg-slate-50 p-4 border-t border-b border-slate-200">
                                <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">{t('history.jsonPreview')}</h4>
                                <pre className="text-xs bg-slate-100 p-3 rounded-md overflow-x-auto max-h-60 text-slate-700">{JSON.stringify(log.data, null, 2)}</pre>
                            </div>
                        )}
                        <div className="bg-slate-50/70 p-3 flex justify-end space-x-2 border-t border-slate-200">
                            <button onClick={() => togglePreview(log.id)} className="px-3 py-1 text-xs font-semibold rounded-md transition-colors duration-200 bg-white text-slate-600 border border-slate-300 hover:bg-slate-100">
                                {previewId === log.id ? t('history.hidePreview') : t('history.preview')}
                            </button>
                            <button onClick={() => handleDelete(log.id)} className="px-3 py-1 text-xs font-semibold rounded-md transition-colors duration-200 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100">
                                {t('history.delete')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

const InfoItem = ({ label, value }: { label: string, value: React.ReactNode }) => (
    <>
        <div className="font-semibold text-slate-500">{label}</div>
        <div className="text-slate-800 truncate">{String(value)}</div>
    </>
);

// =========== MAIN APP COMPONENT ===========
const App = () => {
  const [activeView, setActiveView] = useState<ActiveView>('checklist');

  useEffect(() => {
    document.title = 'Deep Rinse Companion — Cleanse Steps & Log';
  }, []);

  const renderView = () => {
    switch (activeView) {
      case 'checklist':
        return <ChecklistPage />;
      case 'log':
        return <LogPage />;
      case 'history':
        return <HistoryPage />;
      default:
        return <ChecklistPage />;
    }
  };

  return (
    <LanguageProvider>
        <div className="bg-slate-50 min-h-screen">
        <Header active={activeView} setActive={setActiveView} />
        {renderView()}
        </div>
    </LanguageProvider>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

export default App;
