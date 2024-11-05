export const bsRowCriteria = ['название бс', 'регион и адрес']
export const worksTableCriteria = [
    'наименование работ',
    'общая стоимость', 'цена за единицу',
    'пункта по тцп',
    'ед.\nизм.','ед.изм']

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
    let targetTable = document.createElement('table');
    

    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawData;
    let tables = tempDiv.querySelectorAll('table');



    tables.forEach(table => {

        let isTargeTable = false;

        let rows = table.querySelectorAll('tr');


        rows.forEach( row => {
            row.querySelectorAll('td').forEach( cell=>{
                if (worksTableCriteria.some(criteria => cell.textContent.toLowerCase().includes(criteria))) {
                    isTargeTable = true;
                }
            })
        })

        if (isTargeTable){
            rows.forEach( row=> {
                let newRow = document.createElement('tr');

                row.querySelectorAll('td').forEach( cell => {
                    let td = document.createElement('td');
                    td.textContent = cell.textContent
                    newRow.appendChild(td)
                })
                
                targetTable.appendChild(newRow)
            })
        }
    });
    return targetTable.outerHTML
}