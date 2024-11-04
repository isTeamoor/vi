<template>
    <div>
      <div id="inputData">
        <input type="file" id="insertDocx" @change="input" />
      </div>

      <div id="bsData">
        <h1>Определение номера и параметров БС:</h1>
        <div id="bsInfo"></div>
        <div id="bsForm"></div>
        <div>Выбранное значение: {{ site }}</div>
      </div>

      <div id="worksData">
        <h1>Определение номера и параметров Работ:</h1>
        <div id="rawTable"></div>
      </div>
     
      <div id="reportData">
        <h1>Сформировать отчёт</h1>
        <button @click="makeReport" >Go</button>
        <div id="report"></div>
      </div>

    </div>
</template>
  
<script>
import { readDocx } from '../JS/fileReader.js';
import { getBStable,getWorksTable } from '@/JS/docx/srcTables.js';
import { bsDataExplorer } from '@/JS/docx/bsData.js';
import { worksDataExplorer } from '@/JS/worksData.js';
import { getReport } from '../JS/report.js';

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

  td, th {
    border: 2px solid black
  }

  .inputData{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
  }

  h1 {
    text-align: center;
  }
  #bsInfo{
    margin-bottom: 5px;
    font-weight: bold;
    text-align: center;
  }
  #bsForm {
    margin:20px 600px;
  }
  #reportData{
    text-align: center;
  }
</style>
  