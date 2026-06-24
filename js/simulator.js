// ============================================
// Excel Simulator Module
// ============================================

const Simulator = {
    selectedCell: null,
    
    render(tableData, options = {}) {
        if (!tableData) return '';
        
        const cols = options.columns || ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const rows = tableData.length;
        const showFormulaBar = options.formulaBar !== false;
        
        let html = '<div class="excel-simulator">';
        
        // Formula Bar
        if (showFormulaBar) {
            html += `
                <div class="excel-formula-bar">
                    <div class="formula-cell-ref" id="sim-cell-ref">A1</div>
                    <div class="formula-fx">fx</div>
                    <input type="text" class="formula-input" id="sim-formula-input" readonly placeholder="${I18n.t('formula_example')}">
                </div>
            `;
        }
        
        // Grid
        html += '<div class="excel-grid"><table class="excel-table">';
        
        // Header row
        html += '<tr><th class="row-header"></th>';
        cols.forEach(col => {
            html += `<th>${col}</th>`;
        });
        html += '</tr>';
        
        // Data rows
        tableData.forEach((row, rowIdx) => {
            html += `<tr><th class="row-header">${rowIdx + 1}</th>`;
            row.forEach((cell, colIdx) => {
                const col = cols[colIdx] || '';
                const cellRef = `${col}${rowIdx + 1}`;
                let cellClass = '';
                let cellValue = cell.value || cell || '';
                let formula = cell.formula || '';
                
                if (cell.type === 'header') cellClass = 'header-cell';
                else if (cell.type === 'number') cellClass = 'number-cell';
                else if (cell.type === 'formula') cellClass = 'formula-cell';
                
                html += `<td class="${cellClass}" data-cell="${cellRef}" data-formula="${formula}" 
                         onclick="Simulator.selectCell(this)">${cellValue}</td>`;
            });
            html += '</tr>';
        });
        
        html += '</table></div></div>';
        
        return html;
    },
    
    selectCell(td) {
        // Remove previous selection
        document.querySelectorAll('.excel-table td.selected').forEach(c => c.classList.remove('selected'));
        
        td.classList.add('selected');
        this.selectedCell = td;
        
        const cellRef = td.dataset.cell;
        const formula = td.dataset.formula;
        
        const refEl = document.getElementById('sim-cell-ref');
        const formulaEl = document.getElementById('sim-formula-input');
        
        if (refEl) refEl.textContent = cellRef;
        if (formulaEl) formulaEl.value = formula || td.textContent;
    },
    
    createSampleTable(type) {
        switch (type) {
            case 'basic':
                return [
                    [{ value: 'Mahsulot', type: 'header' }, { value: 'Narxi', type: 'header' }, { value: 'Soni', type: 'header' }, { value: 'Jami', type: 'header' }],
                    [{ value: 'Olma' }, { value: '5000', type: 'number' }, { value: '10', type: 'number' }, { value: '50,000', type: 'number', formula: '=B2*C2' }],
                    [{ value: 'Nok' }, { value: '8000', type: 'number' }, { value: '5', type: 'number' }, { value: '40,000', type: 'number', formula: '=B3*C3' }],
                    [{ value: 'Banan' }, { value: '12000', type: 'number' }, { value: '8', type: 'number' }, { value: '96,000', type: 'number', formula: '=B4*C4' }],
                    [{ value: 'JAMI', type: 'header' }, { value: '' }, { value: '' }, { value: '186,000', type: 'formula', formula: '=SUM(D2:D4)' }]
                ];
            
            case 'if_formula':
                return [
                    [{ value: 'Talaba', type: 'header' }, { value: 'Ball', type: 'header' }, { value: 'Natija', type: 'header' }],
                    [{ value: 'Ali' }, { value: '85', type: 'number' }, { value: "O'tdi", type: 'formula', formula: '=IF(B2>=60,"O\'tdi","Yiqildi")' }],
                    [{ value: 'Vali' }, { value: '45', type: 'number' }, { value: 'Yiqildi', type: 'formula', formula: '=IF(B3>=60,"O\'tdi","Yiqildi")' }],
                    [{ value: 'Guli' }, { value: '92', type: 'number' }, { value: "O'tdi", type: 'formula', formula: '=IF(B4>=60,"O\'tdi","Yiqildi")' }]
                ];
            
            case 'vlookup':
                return [
                    [{ value: 'ID', type: 'header' }, { value: 'Ism', type: 'header' }, { value: 'Bo\'lim', type: 'header' }, { value: 'Maosh', type: 'header' }],
                    [{ value: '101' }, { value: 'Ahmad' }, { value: 'IT' }, { value: '5,000,000', type: 'number' }],
                    [{ value: '102' }, { value: 'Sarvar' }, { value: 'HR' }, { value: '4,500,000', type: 'number' }],
                    [{ value: '103' }, { value: 'Nodira' }, { value: 'Finance' }, { value: '6,000,000', type: 'number' }],
                    [{ value: '' }, { value: '' }, { value: '' }, { value: '' }],
                    [{ value: 'Qidiruv:', type: 'header' }, { value: '102' }, { value: 'Natija:', type: 'header' }, { value: 'Sarvar', type: 'formula', formula: '=VLOOKUP(B6,A2:D4,2,FALSE)' }]
                ];
            
            case 'countif':
                return [
                    [{ value: 'Xodim', type: 'header' }, { value: 'Bo\'lim', type: 'header' }, { value: 'Maosh', type: 'header' }],
                    [{ value: 'Ali' }, { value: 'IT' }, { value: '5,000,000', type: 'number' }],
                    [{ value: 'Vali' }, { value: 'HR' }, { value: '4,000,000', type: 'number' }],
                    [{ value: 'Guli' }, { value: 'IT' }, { value: '5,500,000', type: 'number' }],
                    [{ value: 'Nora' }, { value: 'HR' }, { value: '4,200,000', type: 'number' }],
                    [{ value: '' }, { value: '' }, { value: '' }],
                    [{ value: 'IT soni:', type: 'header' }, { value: '2', type: 'formula', formula: '=COUNTIF(B2:B5,"IT")' }, { value: '' }],
                    [{ value: 'IT Jami:', type: 'header' }, { value: '10,500,000', type: 'formula', formula: '=SUMIF(B2:B5,"IT",C2:C5)' }, { value: '' }]
                ];
            
            default:
                return [
                    [{ value: 'A1' }, { value: 'B1' }, { value: 'C1' }],
                    [{ value: 'A2' }, { value: 'B2' }, { value: 'C2' }],
                    [{ value: 'A3' }, { value: 'B3' }, { value: 'C3' }]
                ];
        }
    }
};