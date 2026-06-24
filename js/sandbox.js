// ==========================================
// SANDBOX.JS - Excel Practice Arena
// ==========================================

window.Sandbox = {
  cellData: {},
  selectedCell: 'A1',

  async render(container) {
    this.cellData = {};
    
    container.innerHTML = `
      <div class="page-header">
        <div class="container">
          <div class="breadcrumb">
            <a href="#home" data-page="home"><i class="fas fa-home"></i> ${I18n.t('nav_home')}</a>
            <i class="fas fa-chevron-right"></i>
            <span>Excel Sandbox</span>
          </div>
          <div class="page-header-content">
            <div>
              <h1><i class="fas fa-flask"></i> Excel Sandbox (Practice Arena)</h1>
              <p>Mustaqil ravishda formulalar yozing va tahlil qiling. Darsga bog'liq emas.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="container" style="padding: 32px 0;">
        <div class="lesson-detail">
          <article class="lesson-content-area">
            
            <div class="excel-sim">
              <div class="excel-sim-toolbar">
                <i class="fas fa-save"></i>
                <span>Practice Mode</span>
              </div>
              <div class="excel-fbar">
                <div class="excel-fbar-name" id="sb-fbar-name">A1</div>
                <div class="excel-fbar-fx">fx</div>
                <input type="text" class="excel-fbar-input" id="sb-fbar-input" placeholder="Formula yoki qiymat..." oninput="Sandbox.updateFromFbar(this.value)" onkeydown="if(event.key==='Enter'){this.blur();Sandbox.applyFormula();}">
              </div>
              <div class="excel-grid">
                <table class="excel-table">
                  <thead>
                    <tr>
                      <th class="excel-corner"></th>
                      ${['A','B','C','D','E','F','G','H'].map(c => `<th class="excel-col">${c}</th>`).join('')}
                    </tr>
                  </thead>
                  <tbody id="sb-tbody"></tbody>
                </table>
              </div>
              <div class="excel-sim-sheets">
                <div class="excel-sheet-tab active">Sheet1</div>
              </div>
            </div>

            <!-- AI Inspector -->
            <div class="card mt-3" id="sb-inspector-card" style="display:none;">
              <div class="card-header">
                <h3><i class="fas fa-search"></i> AI Formula Inspector</h3>
              </div>
              <div class="card-body" id="sb-inspector-body"></div>
            </div>

          </article>
          
          <aside class="lesson-sidebar">
            <h3 class="lesson-sidebar-title">Tezkor yordam</h3>
            <div style="padding: 0 12px;">
              <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px;">
                <code>=SUM(A1:A5)</code><br>
                <code>=IF(A1>10,"Ko'p","Kam")</code><br>
                <code>=VLOOKUP("A001",A:C,2,0)</code>
              </p>
              <button class="btn btn-outline btn-block btn-sm" onclick="Sandbox.clearAll()">
                <i class="fas fa-broom"></i> Tozalash
              </button>
            </div>
          </aside>
        </div>
      </div>
    `;

    this._renderGrid();
    this.selectCell('A1');
  },

  _renderGrid() {
    const tbody = document.getElementById('sb-tbody');
    if (!tbody) return;
    
    let html = '';
    for (let r = 1; r <= 15; r++) {
      html += `<tr><td class="excel-row">${r}</td>`;
      ['A','B','C','D','E','F','G','H'].forEach(col => {
        const cellId = `${col}${r}`;
        html += `
          <td>
            <div class="excel-cell" id="sb-cell-${cellId}" data-cell="${cellId}" onclick="Sandbox.selectCell('${cellId}')" contenteditable="true" oninput="Sandbox.updateCell('${cellId}', this.innerText)" onkeydown="Sandbox.handleCellKey(event, '${cellId}')"></div>
          </td>
        `;
      });
      html += `</tr>`;
    }
    tbody.innerHTML = html;
  },

  selectCell(cellId) {
    document.querySelectorAll('#sb-tbody .excel-cell.active').forEach(c => c.classList.remove('active'));
    const cell = document.getElementById(`sb-cell-${cellId}`);
    if (cell) {
      cell.classList.add('active');
      this.selectedCell = cellId;
      document.getElementById('sb-fbar-name').textContent = cellId;
      document.getElementById('sb-fbar-input').value = this.cellData[cellId]?.formula || cell.innerText || '';
    }
  },

  updateCell(cellId, value) {
    if (!this.cellData[cellId]) this.cellData[cellId] = {};
    
    if (value.startsWith('=')) {
      this.cellData[cellId].formula = value;
      const result = this._evaluate(value);
      this.cellData[cellId].value = result;
      
      // Inspector ga yuborish
      this._inspectFormula(value, result);
    } else {
      this.cellData[cellId].formula = null;
      this.cellData[cellId].value = value;
    }
  },

  updateFromFbar(value) {
    const cell = document.getElementById(`sb-cell-${this.selectedCell}`);
    if (cell) {
      cell.innerText = value;
      this.updateCell(this.selectedCell, value);
    }
  },

  applyFormula() {
    const data = this.cellData[this.selectedCell];
    if (data?.formula) {
      const cell = document.getElementById(`sb-cell-${this.selectedCell}`);
      if (cell) {
        cell.innerText = data.value;
        cell.classList.add('has-formula');
        if (String(data.value).startsWith('#')) cell.classList.add('has-error');
      }
    }
  },

  handleCellKey(event, cellId) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.applyFormula();
      const row = parseInt(cellId.match(/\d+/)[0]);
      const col = cellId.match(/[A-H]/)[0];
      const nextCell = document.getElementById(`sb-cell-${col}${row + 1}`);
      if (nextCell) { nextCell.focus(); this.selectCell(`${col}${row + 1}`); }
    }
  },

  _evaluate(formula) {
    try {
      // Excel Language Engine dan foydalanamiz (RU -> EN)
      const expr = I18n.untranslateFormula(formula).substring(1);
      
      // SUM, AVERAGE, MIN, MAX, COUNT
      const fnMatch = expr.match(/^(SUM|AVERAGE|MIN|MAX|COUNT)\(([A-H])(\d+):([A-H])(\d+)\)$/i);
      if (fnMatch) {
        const fn = fnMatch[1].toUpperCase();
        const [, c1, r1, c2, r2] = fnMatch;
        const vals = [];
        const cols = ['A','B','C','D','E','F','G','H'];
        const startCol = cols.indexOf(c1.toUpperCase()), endCol = cols.indexOf(c2.toUpperCase());
        for (let r = parseInt(r1); r <= parseInt(r2); r++) {
          for (let c = startCol; c <= endCol; c++) {
            const v = parseFloat(this.cellData[`${cols[c]}${r}`]?.value || 0);
            if (!isNaN(v)) vals.push(v);
          }
        }
        if (fn === 'SUM') return vals.reduce((a, b) => a + b, 0);
        if (fn === 'AVERAGE') return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) : 0;
        if (fn === 'MIN') return vals.length ? Math.min(...vals) : 0;
        if (fn === 'MAX') return vals.length ? Math.max(...vals) : 0;
        if (fn === 'COUNT') return vals.length;
      }

      // IF
      const ifMatch = expr.match(/^IF\((.+?)([><=]+)(.+?),(.+?),(.+?)\)$/);
      if (ifMatch) {
        const [, left, op, right, t, f] = ifMatch;
        const lVal = this._resolveVal(left.trim()), rVal = this._resolveVal(right.trim());
        let res = false;
        if (op === '>') res = lVal > rVal;
        if (op === '<') res = lVal < rVal;
        if (op === '=' || op === '==') res = lVal == rVal;
        if (op === '>=') res = lVal >= rVal;
        if (op === '<=') res = lVal <= rVal;
        return (res ? t : f).trim().replace(/^["']|["']$/g, '');
      }

      // Math
      let mathExpr = expr.replace(/([A-H]\d+)/g, m => parseFloat(this.cellData[m]?.value || 0) || 0);
      if (/^[\d+\-*/().\s]+$/.test(mathExpr)) return Function('"use strict"; return (' + mathExpr + ')')();

      return '#NAME?';
    } catch (e) {
      return '#ERROR';
    }
  },

  _resolveVal(str) {
    if (/^[A-H]\d+$/.test(str.trim())) return parseFloat(this.cellData[str.trim()]?.value || 0);
    return parseFloat(str);
  },

  _inspectFormula(formula, result) {
    const card = document.getElementById('sb-inspector-card');
    const body = document.getElementById('sb-inspector-body');
    if (!card || !body) return;

    card.style.display = 'block';
    let html = `<div style="font-family: 'JetBrains Mono', monospace; background: var(--bg-elevated); padding: 12px; border-radius: 6px; margin-bottom: 12px;">${formula}</div>`;
    
    // Error check
    if (String(result).startsWith('#')) {
      const errDesc = I18n.getErrorExplanation(result);
      html += `<div style="background: rgba(216,59,1,0.1); color: var(--danger); padding: 12px; border-radius: 6px; margin-bottom: 12px;">
        <strong>${result}</strong>: ${errDesc}
      </div>`;
    } else {
      html += `<div style="background: rgba(16,124,16,0.1); color: var(--success); padding: 12px; border-radius: 6px; margin-bottom: 12px;">
        <strong>Natija:</strong> ${result}
      </div>`;
    }

    // Parse tree (oddiy)
    const expr = I18n.untranslateFormula(formula).substring(1);
    html += '<div style="font-size: 13px; color: var(--text-secondary);"><strong>Tahlil:</strong><ul style="margin-top:8px; padding-left: 20px;">';
    
    if (expr.startsWith('SUM')) html += '<li>SUM — diapazondagi sonlarni qo\'shadi</li>';
    if (expr.startsWith('AVERAGE')) html += '<li>AVERAGE — diapazondagi o\'rtacha qiymatni topadi</li>';
    if (expr.startsWith('IF')) html += '<li>IF — shartni tekshiradi va 2 xil natija qaytaradi</li>';
    
    html += '</ul></div>';
    body.innerHTML = html;
  },

  clearAll() {
    this.cellData = {};
    document.querySelectorAll('#sb-tbody .excel-cell').forEach(c => {
      c.innerText = '';
      c.classList.remove('has-formula', 'has-error', 'active');
    });
    document.getElementById('sb-inspector-card').style.display = 'none';
    this.selectCell('A1');
    App.showToast('Sandbox tozalandi', 'info');
  }
};

console.log('🧪 Sandbox modul yuklandi');