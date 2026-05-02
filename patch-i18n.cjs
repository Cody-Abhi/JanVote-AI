const fs = require('fs');
let code = fs.readFileSync('src/lib/i18n.ts', 'utf8');

const newKeys = {
  en:  { nav_simulation:'Simulation', nav_readiness:'Am I Ready?', nav_news:'Live Context', nav_laws:'Laws & Rules', nav_profile:'My Profile', navigation:'Navigation', empower_nation:'Empower Your Nation', ai_powered_badge:'AI-POWERED VOTER EDUCATION' },
  hi:  { nav_simulation:'सिमुलेशन', nav_readiness:'क्या मैं तैयार हूँ?', nav_news:'लाइव संदर्भ', nav_laws:'कानून और नियम', nav_profile:'मेरी प्रोफ़ाइल', navigation:'नेविगेशन', empower_nation:'अपने राष्ट्र को सशक्त करें', ai_powered_badge:'एआई-संचालित मतदाता शिक्षा' },
  bn:  { nav_simulation:'সিমুলেশন', nav_readiness:'আমি কি প্রস্তুত?', nav_news:'লাইভ প্রসঙ্গ', nav_laws:'আইন ও বিধি', nav_profile:'আমার প্রোফাইল', navigation:'নেভিগেশন', empower_nation:'আপনার জাতিকে সক্ষম করুন', ai_powered_badge:'এআই-চালিত ভোটার শিক্ষা' },
  te:  { nav_simulation:'సిమ్యులేషన్', nav_readiness:'నేను సిద్ధంగా ఉన్నానా?', nav_news:'లైవ్ సందర్భం', nav_laws:'చట్టాలు & నిబంధనలు', nav_profile:'నా ప్రొఫైల్', navigation:'నావిగేషన్', empower_nation:'మీ దేశాన్ని సశక్తం చేయండి', ai_powered_badge:'ఏఐ-శక్తివంతమైన ఓటరు విద్య' },
  ta:  { nav_simulation:'உருவகப்படுத்தல்', nav_readiness:'நான் தயாரா?', nav_news:'நேரடி சூழல்', nav_laws:'சட்டங்கள் & விதிகள்', nav_profile:'என் சுயவிவரம்', navigation:'வழிசெலுத்தல்', empower_nation:'உங்கள் நாட்டை வலுப்படுத்துங்கள்', ai_powered_badge:'ஏஐ-இயங்கும் வாக்காளர் கல்வி' },
  mr:  { nav_simulation:'सिम्युलेशन', nav_readiness:'मी तयार आहे का?', nav_news:'थेट संदर्भ', nav_laws:'कायदे आणि नियम', nav_profile:'माझी प्रोफाइल', navigation:'नेव्हिगेशन', empower_nation:'तुमच्या राष्ट्राला सशक्त करा', ai_powered_badge:'एआय-चालित मतदार शिक्षण' }
};

Object.keys(newKeys).forEach(lang => {
  const obj = newKeys[lang];
  Object.keys(obj).forEach(key => {
    const langRegex = new RegExp(`(${lang}:\\s*\\{\\s*translation:\\s*\\{)([\\s\\S]*?)(\\}\\s*\\})`);
    code = code.replace(langRegex, (match, p1, p2, p3) => {
      const newKeyVal = `,\n          ${key}: ${JSON.stringify(obj[key])}`;
      let inner = p2.replace(/\s+$/, '');
      return p1 + inner + newKeyVal + '\n        ' + p3;
    });
  });
});

fs.writeFileSync('src/lib/i18n.ts', code);
console.log("Done!");
