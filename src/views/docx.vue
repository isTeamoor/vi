<template>
    <div>

      <div class="input-container">
        <input type="file" id="docxFileInput" @change="extractInfo" />
      </div>

      <div id="BS">
        <h1 style="text-align: center;">Определение номера и параметров БС:</h1>
        <div id="BSrow" style="margin-bottom: 5px;font-weight: bold;text-align: center;"></div>
        <div id="BSnumber" style="margin:20px 600px;"></div>
        <div>Выбранное значение: {{ bs }}</div>
      </div>

      <div id="Works">
        <h1 style="text-align: center;">Определение номера и параметров Работ:</h1>
        <div id="rawTable"></div>
      </div>

      <div id="Result" style="text-align: center;">
        <h1 style="text-align: center;">Сформировать отчёт</h1>
        <button @click="makeReport" >Go</button>
        <div id="report"></div>
      </div>

      <div id="output"></div>
      
    </div>
</template>
  
<script>
import {openWord} from '../JS/fileReader.js'
import {getBSnumber} from '../JS/docxData.js'
import {createBSform } from '../JS/docxData.js';
import {modTable} from '../JS/docxData.js';
import {addDeleteButton} from '../JS/docxData.js';
import {addEventListenersToDeleteButtons} from '../JS/docxData.js';
import {getReport} from '../JS/docxData.js';


export default {
  data(){
    return{
      bs:{}
    }
  },
  methods: {
    async extractInfo(event){

      // Контейнер для загрузки всей информации из файла
      let fileData = document.querySelector('#output')
      fileData.innerHTML = await openWord(event);


      //Поиск строки с данными о БС
      let bsData = getBSnumber();
      document.querySelector('#BSrow').textContent = bsData['BSrow'];


      //Создание формы с радиокнопками для выбора верного номера БС
      document.querySelector('#BSnumber').innerHTML = createBSform(bsData);

      let form = document.getElementById('bsForm');
      form.addEventListener('change', event=> {
        if (event.target.name === 'bsOptions') {
          this.bs = {
            Owner: event.target.getAttribute('owner'),
            ID: event.target.getAttribute('bsID'),
            Name: event.target.getAttribute('bsname')
          };
        }
      });





      ///////////////Таблица работ//////////////
      rawTable.innerHTML = modTable()
      document.getElementById('rawTable').innerHTML = addDeleteButton('#rawTable table tr')
      addEventListenersToDeleteButtons('#rawTable');     
    },
    /////////////////Отчёт///////////////////////
    makeReport(){
      document.getElementById('report').innerHTML = getReport(this.bs, '#rawTable table tr')
    }

  }
};
</script>
  


<style >
  #BS, #Works, #Result {
    border: 2px solid black;
  }

  table td {
    border: 2px solid black
  }

  .input-container{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
  }
</style>
  