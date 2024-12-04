export const bsRowCriteria = ['название бс', 'регион и адрес']

export const worksTableCriteria = [
    'пункта по тцп', 'наименование работ',
    'общая стоимость','общая сумма',
    'цена за единицу','цена за ед',
    '№ пункта по тцп','пункт в тцп',]





export function getBSrow(rawData){
    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawData;

    let targetRow = null;

    tempDiv.querySelectorAll('tr').forEach( row => {
        
        row.querySelectorAll('td').forEach( cell => {
            cell.textContent = cell.textContent.replace(/['"«»]/g, '')
            if (bsRowCriteria.some(criteria => cell.textContent.toLowerCase().includes(criteria))) {
                targetRow = row;
            }
        })
    });

    return targetRow
}
export function getWorksTable(rawData){
    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawData;

    let targetTable = document.createElement('table')

    
    let isTargetTable = false;

    tempDiv.querySelectorAll('tr').forEach( row => {

        let rowValues = [];


        Array.from(row.cells).forEach( (cell,i) => {

            if (worksTableCriteria.some(criteria => cell.textContent.toLowerCase().includes(criteria))) {  //условие для начала таблицы
                isTargetTable = true;                                        
            }

            if (cell.textContent.toLocaleLowerCase().includes('итого')                                     //условие для завершения таблицы
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

    return targetTable
}