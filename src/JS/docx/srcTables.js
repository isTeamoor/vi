export const bsRowCriteria = ['название бс', 'регион и адрес']
export const worksTableCriteria = ['общая стоимость', 'цена за единицу','№ пункта по тцп','ед.\nизм.','итого']

export function getBStable(rawData){
    let targetTable = null;

    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawData;
    let tables = tempDiv.querySelectorAll('table');

    tables.forEach(table => {
        let cells = table.querySelectorAll('td');

        cells.forEach(cell=>{
            if (bsRowCriteria.some(criteria => cell.textContent.toLowerCase().includes(criteria))) {
                targetTable = table;
            }
        })
    });

    return targetTable.outerHTML
}
export function getWorksTable(rawData){
    let targetTable = null;

    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawData;
    let tables = tempDiv.querySelectorAll('table');

    tables.forEach(table => {
        let cells = table.querySelectorAll('td');

        cells.forEach(cell=>{
            if (worksTableCriteria.some(criteria => cell.textContent.toLowerCase().includes(criteria))) {
                targetTable = table;
            }
        })
    });

    return targetTable.outerHTML
}