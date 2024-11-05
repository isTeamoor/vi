export const bsRowCriteria = ['название бс', 'регион и адрес']

export const worksTableCriteria = [
    'общая стоимость','общая сумма',
    'цена за единицу','цена за ед',
    '№ пункта по тцп','пункт в тцп',]

export function getBStable(rawData){
    let targetRow = null;

    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawData;
    let rows = tempDiv.querySelectorAll('tr');

    rows.forEach( row => {
        let cells = row.querySelectorAll('td');
        
        cells.forEach( cell => {
            cell.textContent = cell.textContent.replace(/['"«»]/g, '')
            if (bsRowCriteria.some(criteria => cell.textContent.toLowerCase().includes(criteria))) {
                targetRow = row;
            }
        })
    });

    return targetRow
}
export function getWorksTable(rawData){
    let targetTable = document.createElement('table')

    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawData;

    let isTargetTable = false;

    tempDiv.querySelectorAll('tr').forEach( row => {

        let rowValues =[];

        Array.from(row.cells).forEach((cell,i)=>{

            if (worksTableCriteria.some(criteria => cell.textContent.toLowerCase().includes(criteria))) {
                isTargetTable = true;
            }

            if (cell.textContent.toLocaleLowerCase().includes('итого')
             || cell.textContent.toLocaleLowerCase().includes('всего')){
                isTargetTable = false;
            }

            if (i<=5){
                let val = document.createElement('td');
                val.textContent = cell.textContent;
                rowValues.push(val)
            }
        });

        if (isTargetTable){
            let newRow = document.createElement('tr');
            rowValues.forEach( val => {
                newRow.appendChild(val)
            })
            targetTable.appendChild(newRow)
        }
    })

    return targetTable.outerHTML
}