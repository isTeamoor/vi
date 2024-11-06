export const bsRowCriteria = ['название бс', 'регион и адрес'];

export const worksTableCriteria = [
    'наименование работ',
    'общая стоимость', 'цена за единицу',
    'пункта по тцп',
    'ед.\nизм.','ед.изм'];




export function getBSrow(rawData){
    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawData;
    

    let targetRow = null;
    let tables = tempDiv.querySelectorAll('table');
    
    
    tables.forEach(table => {
        table.querySelectorAll('tr').forEach( row => {
            row.querySelectorAll('td').forEach( cell => {
                if (bsRowCriteria.some(criteria => cell.textContent.toLowerCase().includes(criteria))) {
                    targetRow = row;
                }
            })
        });
    });

    return targetRow
}
export function getWorksTable(rawData){
    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawData;

    let targetTable = document.createElement('table');
    

    tempDiv.querySelectorAll('table').forEach(table => {

        let isTargeTable = false;

        table.querySelectorAll('tr').forEach( row => {
            row.querySelectorAll('td').forEach( cell=>{
                if (worksTableCriteria.some(criteria => cell.textContent.toLowerCase().includes(criteria))) {
                    isTargeTable = true;
                }
            })
        })

        if (isTargeTable){
            table.querySelectorAll('tr').forEach( row=> {
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
    return targetTable
}