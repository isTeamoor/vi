<template>
    <div>
      <input type="file" id="docxFileInput" @change="extractInfo" />

      <div id="BS">
        <h1>Определение номера и параметров БС:</h1>
        <div id="BScell"></div>
        <div id="BSnumber"></div>
        <div>Выбранное значение: {{ bs }}</div>
      </div>

      <div id="Works">
        <h1>Определение номера и параметров Работ:</h1>
        <div id="rawWorksTable"></div>
      </div>

      <div>
        <h1>Сформировать отчёт</h1>
        <button @click="makeReport">Go</button>
        <div id="report"></div>
      </div>

      <div id="output"></div>
    </div>
</template>
  
<script>
import {openWord} from '../JS/fileReader.js'
import {getBSnumber} from '../JS/docxData.js'
import {createBSform } from '../JS/docxData.js';
import {getWorksTable} from '../JS/docxData.js';
import {deleteTotal} from '../JS/docxData.js';
import {remakeTable} from '../JS/docxData.js';
import {mergeWorkTypes} from '../JS/docxData.js';
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
      //Чтение файла
      document.querySelector('#output').innerHTML = await openWord(event);

      //Получение сырой строки с данными о БС
      let BSprops = getBSnumber('#output');
      document.querySelector('#BScell').textContent = BSprops['BScell'];

      //Создание формы с радиокнопками для выбора верного номера БС
      let targetElement = document.querySelector('#BSnumber');
      targetElement.innerHTML = createBSform(BSprops);

      const form = document.getElementById('bsForm');
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
      document.getElementById('rawWorksTable').innerHTML = getWorksTable('#output')
      document.getElementById('rawWorksTable').innerHTML = deleteTotal('#rawWorksTable table')
      document.getElementById('rawWorksTable').innerHTML = remakeTable('#rawWorksTable table tr')
      document.getElementById('rawWorksTable').innerHTML = mergeWorkTypes('#rawWorksTable table tr')
      document.getElementById('rawWorksTable').innerHTML = addDeleteButton('#rawWorksTable table tr')
      addEventListenersToDeleteButtons('#rawWorksTable');     
    },
    makeReport(){
      document.getElementById('report').innerHTML = getReport(this.bs, '#rawWorksTable table tr')
    }

  }
};
</script>
  


<style >
  #BS, #Works {
    border: 2px solid black;
  }

  table td {
    border: 2px solid black
  }
</style>
  