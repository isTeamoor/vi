import { siteList } from "../sites";

export function bsDataExplorer(bsRow, callback){ 
    let bsInfo = bsRow.cells[2].textContent;

    let probableSitesList = extractBSnumbers(bsInfo);

    let bsForm = createBSform(probableSitesList, callback)

    let output = {
        'bsInfo':bsInfo,
        'bsForm':bsForm
    };
    return output
}
function extractBSnumbers(bsInfo){
    let matches = bsInfo.match(/\d{3,}/g);
    let numbers = matches ? matches.map(Number) : [];

    let probableSites = [];

    numbers.forEach(number => {
        let matchedSites = siteList.filter(item => item.ID === String(number));
    
        if (matchedSites.length > 0) {
            matchedSites.forEach(site => {
                probableSites.push(site)
            });
        }
    });

    return probableSites
}
function createBSform(probableSitesList, callback) {
    let form = document.createElement('div');
    form.innerHTML = '<form id="bsForm">';

    for (let site of probableSitesList) {
        const owner = site['Owner'];
        const bsID = site['ID'];
        const bsName = site['Name'];

        form.innerHTML += `
        <div>
            <input type="radio" name="bsOptions" owner="${owner}" bsID="${bsID}" bsname="${bsName}">
            <label for="${bsID}">${bsID} - ${bsName}</label>
        </div>`;
    }

    form.innerHTML += '</form>';

    // Добавляем обработчик события change на форму
    form.addEventListener('change', event => {
        if (event.target.name === 'bsOptions') {
            let output = {
                Owner: event.target.getAttribute('owner'),
                ID: event.target.getAttribute('bsID'),
                Name: event.target.getAttribute('bsname')
            };
            callback(output);
        }
    });

    return form;
}
