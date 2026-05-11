// ============================================
//  NUTRICAL — CLINICAL NUTRITION CALCULATOR
//  app.js — All Logic & Calculations
// ============================================

// ===== STATE =====
const state = {
  age: null,
  heightCm: null,
  weightKg: null,
  heightUnit: 'cm',
  weightUnit: 'kg',
};

// ===== PAGES =====
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

// ===== UNIT TOGGLES =====
document.querySelectorAll('.unit-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const field = btn.dataset.field;
    document.querySelectorAll(`[data-field="${field}"]`).forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (field === 'height') state.heightUnit = btn.dataset.unit;
    if (field === 'weight') state.weightUnit = btn.dataset.unit;
  });
});

// ===== PROCEED BUTTON =====
document.getElementById('proceedBtn').addEventListener('click', () => {
  const age    = parseFloat(document.getElementById('age').value);
  const height = parseFloat(document.getElementById('height').value);
  const weight = parseFloat(document.getElementById('weight').value);

  if (!age || !height || !weight || age < 1 || age > 120) {
    alert('Please enter valid Age, Height, and Weight.');
    return;
  }

  state.age = age;
  // Convert to metric
  state.heightCm = state.heightUnit === 'ft' ? height * 30.48 : height;
  state.weightKg = state.weightUnit === 'lbs' ? weight * 0.453592 : weight;

  const htDisp = state.heightUnit === 'ft'
    ? `${height} ft (${state.heightCm.toFixed(1)} cm)`
    : `${height} cm`;
  const wtDisp = state.weightUnit === 'lbs'
    ? `${weight} lbs (${state.weightKg.toFixed(1)} kg)`
    : `${weight} kg`;

  document.getElementById('patientSummary').textContent =
    `Age ${age} yrs · Height ${htDisp} · Weight ${wtDisp}`;

  showPage('page-dashboard');
});

// ===== BACK BUTTONS =====
document.getElementById('backToLanding').addEventListener('click', () => showPage('page-landing'));
document.getElementById('backToDash').addEventListener('click', () => showPage('page-dashboard'));

// ===== FORMULA CARDS =====
document.querySelectorAll('.formula-card').forEach(card => {
  card.addEventListener('click', () => {
    const key = card.dataset.formula;
    loadFormulaPage(key);
    showPage('page-formula');
  });
});

// ===== FORMULA DEFINITIONS =====
const formulas = {

  bmi: {
    title: 'BMI — Body Mass Index',
    desc: 'BMI is calculated as weight (kg) divided by the square of height (m²). It provides a rough estimate of body fatness and is used to screen for weight categories.',
    extraFields: '',
    calculate() {
      const h = state.heightCm / 100;
      const bmi = state.weightKg / (h * h);
      let cat = '';
      if (bmi < 18.5) cat = 'Underweight (< 18.5)';
      else if (bmi < 25) cat = 'Normal weight (18.5 – 24.9)';
      else if (bmi < 30) cat = 'Overweight (25.0 – 29.9)';
      else if (bmi < 35) cat = 'Obese Class I (30.0 – 34.9)';
      else if (bmi < 40) cat = 'Obese Class II (35.0 – 39.9)';
      else cat = 'Obese Class III (≥ 40.0)';

      return {
        value: bmi.toFixed(2),
        unit: 'kg/m²',
        interp: `<strong>Category:</strong> ${cat}<br><br>
          BMI = Weight (kg) ÷ Height² (m)<br>
          = ${state.weightKg.toFixed(2)} ÷ ${(h*h).toFixed(4)}<br>
          = <strong>${bmi.toFixed(2)} kg/m²</strong>`
      };
    }
  },

  curreri: {
    title: 'Curreri Formula',
    desc: 'The Curreri formula estimates daily caloric requirements for burn patients. It accounts for the dramatically increased metabolic demands of burn injuries.',
    extraFields: `
      <div class="tbsa-info-box">
        <div class="tbsa-info-header">
          <span class="tbsa-info-icon">🔥</span>
          <strong>What is Total Body Surface Area (%TBSA)?</strong>
        </div>
        <p class="tbsa-info-text">
          <strong>%TBSA</strong> refers to the percentage of the body's skin surface that has been affected by a burn injury.
          It is a critical measurement used in burn care to assess injury severity, fluid requirements, and caloric needs.
        </p>

        <div class="tbsa-rule-title">📏 The Rule of Nines — How to Estimate %TBSA</div>
        <p class="tbsa-info-text">The most widely used method is the <strong>Rule of Nines</strong>, which divides the adult body into regions, each representing 9% (or a multiple of 9%) of the total body surface:</p>

        <div class="tbsa-grid">
          <div class="tbsa-region"><span class="tbsa-region-name">Head &amp; Neck</span><span class="tbsa-region-pct">9%</span></div>
          <div class="tbsa-region"><span class="tbsa-region-name">Each Arm (×2)</span><span class="tbsa-region-pct">9% each</span></div>
          <div class="tbsa-region"><span class="tbsa-region-name">Chest (front trunk)</span><span class="tbsa-region-pct">9%</span></div>
          <div class="tbsa-region"><span class="tbsa-region-name">Abdomen (front trunk)</span><span class="tbsa-region-pct">9%</span></div>
          <div class="tbsa-region"><span class="tbsa-region-name">Upper Back</span><span class="tbsa-region-pct">9%</span></div>
          <div class="tbsa-region"><span class="tbsa-region-name">Lower Back</span><span class="tbsa-region-pct">9%</span></div>
          <div class="tbsa-region"><span class="tbsa-region-name">Each Thigh (×2)</span><span class="tbsa-region-pct">9% each</span></div>
          <div class="tbsa-region"><span class="tbsa-region-name">Each Lower Leg (×2)</span><span class="tbsa-region-pct">9% each</span></div>
          <div class="tbsa-region"><span class="tbsa-region-name">Genitalia / Perineum</span><span class="tbsa-region-pct">1%</span></div>
        </div>

        <div class="tbsa-note">
          <strong>⚠️ Note:</strong> Only <strong>2nd degree (partial thickness)</strong> and <strong>3rd degree (full thickness)</strong> burns are counted in %TBSA.
          Superficial (1st degree) burns like sunburn are <em>not</em> included.
          For children, the <strong>Lund-Browder Chart</strong> is preferred as head and leg proportions differ.
        </div>
      </div>

      <div class="extra-field" style="margin-top:20px">
        <label>Total Body Surface Area Burned <span style="font-weight:400;color:var(--text-muted)">(%TBSA)</span></label>
        <input type="number" id="tbsa" placeholder="e.g. 20" min="0" max="100" step="0.1" />
      </div>`,
    calculate() {
      const tbsa = parseFloat(document.getElementById('tbsa')?.value);
      if (isNaN(tbsa) || tbsa < 0 || tbsa > 100) return null;
      // Curreri: 25 × weight(kg) + 40 × %TBSA
      const kcal = 25 * state.weightKg + 40 * tbsa;
      return {
        value: Math.round(kcal),
        unit: 'kcal/day',
        interp: `<strong>Formula:</strong> 25 × Weight (kg) + 40 × %TBSA<br><br>
          = 25 × ${state.weightKg.toFixed(2)} + 40 × ${tbsa}<br>
          = ${(25*state.weightKg).toFixed(0)} + ${(40*tbsa).toFixed(0)}<br>
          = <strong>${Math.round(kcal)} kcal/day</strong><br><br>
          Burn area entered: ${tbsa}% TBSA`
      };
    }
  },

  ibw: {
    title: 'Ideal Body Weight (IBW)',
    desc: 'The Devine formula estimates Ideal Body Weight based on gender and height. It is widely used as a reference in drug dosing and nutritional assessment.',
    extraFields: `
      <div class="extra-field">
        <label>Gender</label>
        <div class="gender-toggle">
          <button class="gender-btn active" data-gender="male" onclick="selectGender(this)">♂ Male</button>
          <button class="gender-btn" data-gender="female" onclick="selectGender(this)">♀ Female</button>
        </div>
      </div>`,
    calculate() {
      const gender = document.querySelector('.gender-btn.active')?.dataset.gender || 'male';
      const inches = state.heightCm / 2.54;
      const extra = inches > 60 ? (inches - 60) * 2.3 : 0;
      const ibw = gender === 'male' ? 50 + extra : 45.5 + extra;
      return {
        value: ibw.toFixed(1),
        unit: 'kg',
        interp: `<strong>Devine Formula (${gender}):</strong><br>
          ${gender === 'male' ? '50' : '45.5'} + 2.3 × (Height in inches − 60)<br><br>
          Height: ${state.heightCm.toFixed(1)} cm = ${inches.toFixed(1)} inches<br>
          Extra: 2.3 × (${inches.toFixed(1)} − 60) = ${extra.toFixed(2)} kg<br>
          IBW = <strong>${ibw.toFixed(1)} kg</strong>`
      };
    }
  },

  ajbw: {
    title: 'Adjusted Body Weight (AjBW)',
    desc: 'Adjusted Body Weight is used when a patient\'s actual weight exceeds their IBW. It accounts for the metabolically active portion of excess fat mass (correction factor: 0.25).',
    extraFields: `
      <div class="extra-field">
        <label>Gender</label>
        <div class="gender-toggle">
          <button class="gender-btn active" data-gender="male" onclick="selectGender(this)">♂ Male</button>
          <button class="gender-btn" data-gender="female" onclick="selectGender(this)">♀ Female</button>
        </div>
      </div>`,
    calculate() {
      const gender = document.querySelector('.gender-btn.active')?.dataset.gender || 'male';
      const inches = state.heightCm / 2.54;
      const extra = inches > 60 ? (inches - 60) * 2.3 : 0;
      const ibw = gender === 'male' ? 50 + extra : 45.5 + extra;
      const actual = state.weightKg;
      if (actual <= ibw) {
        return {
          value: actual.toFixed(1),
          unit: 'kg',
          interp: `Patient's actual weight (${actual.toFixed(1)} kg) ≤ IBW (${ibw.toFixed(1)} kg).<br>
            <strong>Adjusted Body Weight = Actual Weight = ${actual.toFixed(1)} kg</strong><br><br>
            AjBW is only applied when actual weight > IBW.`
        };
      }
      const ajbw = ibw + 0.25 * (actual - ibw);
      return {
        value: ajbw.toFixed(1),
        unit: 'kg',
        interp: `<strong>Formula:</strong> IBW + 0.25 × (Actual Weight − IBW)<br><br>
          IBW (${gender}) = ${ibw.toFixed(1)} kg<br>
          Actual = ${actual.toFixed(1)} kg<br>
          = ${ibw.toFixed(1)} + 0.25 × (${actual.toFixed(1)} − ${ibw.toFixed(1)})<br>
          = ${ibw.toFixed(1)} + ${(0.25*(actual-ibw)).toFixed(2)}<br>
          AjBW = <strong>${ajbw.toFixed(1)} kg</strong>`
      };
    }
  },

  injury: {
    title: 'Injury Factor (Stress Factor)',
    desc: 'Injury factors are metabolic stress multipliers applied to Basal Metabolic Rate to estimate actual caloric needs in the presence of illness, injury, or surgery.',
    extraFields: `
      <div class="extra-field">
        <label>Select Injury / Stress Category</label>
        <div class="category-grid" id="injuryGrid">
          ${[
            { id:'minor',   factor:1.0,  label:'Minor Surgery / Uncomplicated',      sub:'e.g. elective surgery, minor infection' },
            { id:'skeletal',factor:1.2,  label:'Skeletal Trauma',                    sub:'fractures, orthopedic injury' },
            { id:'major',   factor:1.25, label:'Major Surgery',                      sub:'abdominal, thoracic procedures' },
            { id:'sepsis',  factor:1.4,  label:'Sepsis / Peritonitis',               sub:'systemic infection, multi-organ' },
            { id:'burn20',  factor:1.5,  label:'Burns < 20% TBSA',                  sub:'minor to moderate burns' },
            { id:'burn40',  factor:1.75, label:'Burns 20–40% TBSA',                 sub:'moderate to severe burns' },
            { id:'burn40p', factor:2.0,  label:'Burns > 40% TBSA',                  sub:'critical / major burns' },
            { id:'head',    factor:1.6,  label:'Severe Head Injury',                 sub:'closed head injury, TBI' },
          ].map((o, i) => `
          <label class="category-option${i===0?' selected':''}" data-factor="${o.factor}">
            <input type="radio" name="injury" value="${o.factor}" ${i===0?'checked':''} />
            <div class="cat-dot"></div>
            <div>
              <div class="cat-label">${o.label} — <strong>×${o.factor}</strong></div>
              <div class="cat-sub">${o.sub}</div>
            </div>
          </label>`).join('')}
        </div>
      </div>`,
    calculate() {
      const checked = document.querySelector('input[name="injury"]:checked');
      const factor = checked ? parseFloat(checked.value) : 1.0;
      // Base: use Mifflin for BMR
      const g = state.weightKg, h = state.heightCm, a = state.age;
      const bmrM = 10*g + 6.25*h - 5*a + 5;
      const bmrF = 10*g + 6.25*h - 5*a - 161;
      const bmrAvg = (bmrM + bmrF) / 2;
      const adjusted = bmrAvg * factor;
      return {
        value: factor.toFixed(2),
        unit: '× factor',
        interp: `<strong>Injury Factor Selected:</strong> ${factor}<br><br>
          Estimated BMR (avg Mifflin): ${Math.round(bmrAvg)} kcal/day<br>
          Adjusted Caloric Need = BMR × Factor<br>
          = ${Math.round(bmrAvg)} × ${factor}<br>
          = <strong>${Math.round(adjusted)} kcal/day</strong><br><br>
          <em>Note: Gender-specific BMR will give a more precise result when combined with Harris-Benedict or Mifflin formulas.</em>`
      };
    }
  },

  pal: {
    title: 'Physical Activity Level (PAL)',
    desc: 'PAL is the ratio of total daily energy expenditure (TDEE) to BMR. It is used to estimate caloric needs based on activity level, combined with BMR.',
    extraFields: `
      <div class="extra-field">
        <label>Gender</label>
        <div class="gender-toggle" style="margin-bottom:20px">
          <button class="gender-btn active" data-gender="male" onclick="selectGender(this)">♂ Male</button>
          <button class="gender-btn" data-gender="female" onclick="selectGender(this)">♀ Female</button>
        </div>
        <label>Activity Level</label>
        <div class="category-grid" id="palGrid">
          ${[
            { id:'sed',   pal:1.2,  label:'Sedentary',          sub:'little or no exercise, desk job' },
            { id:'light', pal:1.375,label:'Lightly Active',      sub:'light exercise 1–3 days/week' },
            { id:'mod',   pal:1.55, label:'Moderately Active',   sub:'moderate exercise 3–5 days/week' },
            { id:'very',  pal:1.725,label:'Very Active',         sub:'hard exercise 6–7 days/week' },
            { id:'extra', pal:1.9,  label:'Extra Active',        sub:'very hard exercise, physical job' },
          ].map((o, i) => `
          <label class="category-option${i===0?' selected':''}" data-pal="${o.pal}">
            <input type="radio" name="pal" value="${o.pal}" ${i===0?'checked':''} />
            <div class="cat-dot"></div>
            <div>
              <div class="cat-label">${o.label} — <strong>PAL ${o.pal}</strong></div>
              <div class="cat-sub">${o.sub}</div>
            </div>
          </label>`).join('')}
        </div>
      </div>`,
    calculate() {
      const palChecked = document.querySelector('input[name="pal"]:checked');
      const pal = palChecked ? parseFloat(palChecked.value) : 1.2;
      const gender = document.querySelector('.gender-btn.active')?.dataset.gender || 'male';
      const g = state.weightKg, h = state.heightCm, a = state.age;
      const bmr = gender === 'male'
        ? 10*g + 6.25*h - 5*a + 5
        : 10*g + 6.25*h - 5*a - 161;
      const tdee = bmr * pal;
      return {
        value: pal.toFixed(3),
        unit: 'PAL multiplier',
        interp: `<strong>PAL Selected:</strong> ${pal}<br><br>
          BMR (Mifflin, ${gender}): <strong>${Math.round(bmr)} kcal/day</strong><br>
          TDEE = BMR × PAL<br>
          = ${Math.round(bmr)} × ${pal}<br>
          = <strong>${Math.round(tdee)} kcal/day</strong>`
      };
    }
  },

  harris: {
    title: 'Harris-Benedict Formula',
    desc: 'The Harris-Benedict equation (1919, revised 1984) estimates Basal Metabolic Rate (BMR) — the minimum calories needed at complete rest. It uses weight, height, and age with gender-specific coefficients.',
    extraFields: `
      <div class="extra-field">
        <label>Gender</label>
        <div class="gender-toggle">
          <button class="gender-btn active" data-gender="male" onclick="selectGender(this)">♂ Male</button>
          <button class="gender-btn" data-gender="female" onclick="selectGender(this)">♀ Female</button>
        </div>
      </div>`,
    calculate() {
      const gender = document.querySelector('.gender-btn.active')?.dataset.gender || 'male';
      const g = state.weightKg, h = state.heightCm, a = state.age;
      let bmr;
      let formula;
      if (gender === 'male') {
        bmr = 88.362 + 13.397*g + 4.799*h - 5.677*a;
        formula = `88.362 + (13.397 × ${g.toFixed(2)}) + (4.799 × ${h.toFixed(2)}) − (5.677 × ${a})`;
      } else {
        bmr = 447.593 + 9.247*g + 3.098*h - 4.330*a;
        formula = `447.593 + (9.247 × ${g.toFixed(2)}) + (3.098 × ${h.toFixed(2)}) − (4.330 × ${a})`;
      }
      return {
        value: Math.round(bmr),
        unit: 'kcal/day (BMR)',
        interp: `<strong>Harris-Benedict (${gender}, revised 1984):</strong><br><br>
          ${formula}<br>
          BMR = <strong>${Math.round(bmr)} kcal/day</strong><br><br>
          This is the resting metabolic rate. Multiply by an activity factor (PAL) to get total daily energy needs.`
      };
    }
  },

  mifflin: {
    title: 'Mifflin St. Jeor Formula',
    desc: 'The Mifflin-St Jeor equation (1990) is considered more accurate than Harris-Benedict for modern populations. It estimates Basal Metabolic Rate using the same variables with updated coefficients.',
    extraFields: `
      <div class="extra-field">
        <label>Gender</label>
        <div class="gender-toggle">
          <button class="gender-btn active" data-gender="male" onclick="selectGender(this)">♂ Male</button>
          <button class="gender-btn" data-gender="female" onclick="selectGender(this)">♀ Female</button>
        </div>
      </div>`,
    calculate() {
      const gender = document.querySelector('.gender-btn.active')?.dataset.gender || 'male';
      const g = state.weightKg, h = state.heightCm, a = state.age;
      const s = gender === 'male' ? 5 : -161;
      const bmr = 10*g + 6.25*h - 5*a + s;
      return {
        value: Math.round(bmr),
        unit: 'kcal/day (BMR)',
        interp: `<strong>Mifflin-St Jeor (${gender}):</strong><br><br>
          (10 × ${g.toFixed(2)}) + (6.25 × ${h.toFixed(2)}) − (5 × ${a}) + ${s}<br>
          = ${(10*g).toFixed(0)} + ${(6.25*h).toFixed(0)} − ${5*a} + ${s}<br>
          BMR = <strong>${Math.round(bmr)} kcal/day</strong><br><br>
          This equation is the current standard recommended by the Academy of Nutrition and Dietetics.`
      };
    }
  },

};

// ===== LOAD FORMULA PAGE =====
function loadFormulaPage(key) {
  const f = formulas[key];
  if (!f) return;

  document.getElementById('formulaTitle').textContent = f.title;

  document.getElementById('formulaContent').innerHTML = `
    <div class="formula-desc"><p>${f.desc}</p></div>
    ${f.extraFields ? `
    <div class="extra-inputs">
      <h4>Additional Information Needed</h4>
      ${f.extraFields}
    </div>` : ''}
    <button class="calc-btn" onclick="runCalc('${key}')">Calculate →</button>
    <div class="result-card" id="resultCard">
      <div class="result-label" id="resultLabel">Result</div>
      <div class="result-value" id="resultValue">—</div>
      <div class="result-unit" id="resultUnit"></div>
      <div class="result-interpretation" id="resultInterp"></div>
    </div>
  `;

  // Bind category radio options
  bindCategoryOptions();
}

// ===== RUN CALCULATION =====
function runCalc(key) {
  const f = formulas[key];
  const result = f.calculate();
  if (!result) {
    alert('Please fill in all required fields with valid values.');
    return;
  }
  const card = document.getElementById('resultCard');
  document.getElementById('resultValue').textContent = result.value;
  document.getElementById('resultUnit').textContent = result.unit;
  document.getElementById('resultLabel').textContent = 'Result';
  document.getElementById('resultInterp').innerHTML = result.interp;
  card.classList.add('show');
  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===== GENDER TOGGLE (global for inline onclick) =====
function selectGender(btn) {
  btn.closest('.gender-toggle').querySelectorAll('.gender-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// ===== BIND CATEGORY RADIO OPTIONS =====
function bindCategoryOptions() {
  document.querySelectorAll('.category-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const grid = opt.closest('.category-grid');
      grid.querySelectorAll('.category-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      opt.querySelector('input[type="radio"]').checked = true;
    });
  });
}

// ===== PWA INSTALL PROMPT =====
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('installBanner').classList.remove('hidden');
});

document.getElementById('installBtn').addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  document.getElementById('installBanner').classList.add('hidden');
});

document.getElementById('dismissBtn').addEventListener('click', () => {
  document.getElementById('installBanner').classList.add('hidden');
});

window.addEventListener('appinstalled', () => {
  document.getElementById('installBanner').classList.add('hidden');
});

// ===== SERVICE WORKER =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
