<template>
    <div>
      <div id="inputData">
        <input type="file" id="insertDocx" @change="input" />
      </div>

      <div id="bsData">
        <h1 style="text-align: center;">Определение номера и параметров БС:</h1>
        <div id="bsInfo" style="margin-bottom: 5px;font-weight: bold;text-align: center;"></div>
        <div id="bsForm" style="margin:20px 600px;"></div>
        <div>Выбранное значение: {{ site }}</div>
      </div>

      <div id="worksData">
        <h1 style="text-align: center;">Определение номера и параметров Работ:</h1>
        <div id="rawTable"></div>
      </div>
     
      <div id="reportData" style="text-align: center;">
        <h1 style="text-align: center;">Сформировать отчёт</h1>
        <button @click="makeReport" >Go</button>
        <div id="report"></div>
      </div>

    </div>
</template>
  
<script>
import { readDocx } from '../JS/docx/docxReader.js';
import { getBStable,getWorksTable } from '@/JS/docx/srcTables.js';
import { bsDataExplorer } from '@/JS/docx/bsData.js';
import { worksDataExplorer } from '@/JS/docx/worksData.js';
import { getReport } from '../JS/docxData.js';

export default {
  data(){
    return{
      rawData:'',
      bsData:'',
      worksData:'',
      site:{},
    }
  },
  methods: {
    async input(event){
      this.rawData = await readDocx(event)
    },
    makeReport(){
      document.getElementById('reportData').innerHTML = getReport(this.site, '#worksData tr')
    },
    changeSite(val){
      this.site = val
    }    
  },
  watch:{
    rawData(newVal){
      this.bsData = getBStable(newVal);
      this.worksData = getWorksTable(newVal);
    },
    bsData(newVal){
      let bsCalculations = bsDataExplorer(newVal, this.changeSite)
      document.querySelector('#bsInfo').textContent = bsCalculations['bsInfo'];
      document.querySelector('#bsForm').appendChild (bsCalculations['bsForm']);
    },
    worksData(newVal){
      document.querySelector('#worksData').appendChild(worksDataExplorer(newVal))
    }
  }
};
</script>
  


<style >
  #bsData, #worksData, #reportData {
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
  