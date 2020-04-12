import React,{useEffect,useState} from 'react';
import Select from 'react-select'; 
import axios from 'axios'
import {BrowserRouter as Switch} from "react-router-dom";



const query = {"aggs": {"country_name": {"terms": {"field": "Country"}}},"size": "0"}

var url ='http://159.65.150.184:9200/hello_trade_analytica/_search';

function Tradeaisearch () {
 

    const [countryname,setcountry]=useState()
    var [path,setpath]=useState()
    var [hscodenameselected,sethscodename]=useState()
    const [selectedcountry]=useState()
    const [value]=useState()
    // const [selectedhsname]=useState()
    const [selectedhscodename]=useState()
    const [apidata,setdata]=useState([])
    // const [hscodedata,sethscodedata]=useState([])
    var [condition,setcondition]=useState([])
    var [hscodenamedata,sethscodenamedata]=useState([])


  

 useEffect(() => { 
  var allhscodenamequery={
    "query": {
      "match_all": {}
    },
    "aggs": {
      "hs_code_name": {
        "terms": {
          "field": "HSCodeName",
          "size": 1500
        }
      }
    },
    "size": 0
  }
    axios.post(url, query)
		.then( d => {
      // console.log(d)
			if(d.status === 200 ){
				
				let countries = d.data.aggregations.country_name.buckets ;
				
				let apidata = countries.map(c => {return {"label" : c.key ,"value" : c.key}})
            setdata(apidata)
            
			}
			else{
				console.log("err")
			}
    })
    axios.post(url, allhscodenamequery)
  .then( d => {
    if(d.status === 200 ){
      
      let hscodename = d.data.aggregations.hs_code_name.buckets ;
      hscodename.forEach(function(v){ delete v.doc_count });
      hscodenamedata=hscodename.map(c=>{return{"label":c.key.split("_").join("\t"),"value":c.key}})
      //console.log("abc",hscodenamedata)
      sethscodenamedata(hscodenamedata)
      
    }
    else{
      console.log("err")
    }
  })
  .catch( error => {
    if (error.response.status === 404) {
      console.log(error.response.data);}
    else{}
});
}, [])
function handlecountry(k){
  setcountry(k)
  var query3={
    "query": {
      "bool": {
        "must": [
          {"match": {"Country": k}}
        ]
      }
    },
    "aggs": {
      "hs_code_name": {
        "terms": {
          "field": "HSCodeName"
        }
      }
    },
    "size": 0
  }
  axios.post(url, query3)
  .then( d => {
    if(d.status === 200 ){
      
      let hscodename = d.data.aggregations.hs_code_name.buckets ;
      hscodename.forEach(function(v){ delete v.doc_count });
      hscodenamedata=hscodename.map(c=>{return{"label":c.key.split("_").join("\t"),"value":c.key}})
      //console.log("abc",hscodenamedata)
      sethscodenamedata(hscodenamedata)
      
    }
    else{
      console.log("err")
    }
  })
  .catch( error => {
    if (error.response.status === 404) {
      console.log(error.response.data);}
    else{}
});
}

    return (
      <div>
        <div style={{display:"flex",flexDirection:"row"}}>  
        <div style={{width:'15%'}}>
          <Select
          placeholder="Import or Exports"
          value={value}
          onChange={(e)=>{setcondition(e.value);console.log(e.value)}}
          options={[
            { value: 'import', label: 'Import' },
            { value: 'export', label: 'Export' },
          ]}
        />
        </div>
      <div style={{width:'15%'}}>
        <Select
        placeholder={"Select Country"}
        value={value}
        onChange={(e) => {handlecountry(e.label);console.log("selected country",e.label)}}
        options={apidata}
      />
      </div>
      <div style={{width:'50%'}}>
      <Select
        size={10}
        placeholder="Select hscodename"
        value={selectedhscodename}
        onChange={(e) => {console.log(e.label);sethscodename(e.value)}}
        options={hscodenamedata}
       /> 
      </div>
      <div style={{width:'10%'}}>
      <Select
          placeholder="Currency"
          value={value}
          onChange={(e)=>{setcondition(e.value);console.log(e.value)}}
          options={[
            { value: 'rupee', label: '₹(Indian rupee' },
            { value:'dollar' , label: '$(USDollar'},
          ]}
        />
      </div>
      <div><Switch>
      <button onClick={()=>{
            
            if(hscodenameselected!==undefined)
            hscodenameselected=hscodenameselected.split('_')[0]; 
            
            if(countryname!==undefined&&hscodenameselected!==undefined)
            path="trade/"+countryname+"/"+hscodenameselected;
            else if(countryname!==undefined&&hscodenameselected===undefined)
            path="country/"+countryname
            else if(countryname===undefined&&hscodenameselected!==undefined)
            path="hscode/"+hscodenameselected;
            else
            alert("Select any option")
            
            if(path!==undefined)
           { console.log(path,"path")
            setpath(path)
            window.location.pathname=path}
          }}
            >Search</button>
              
              </Switch>
      </div>
      
      </div>
      </div>
    
    )
}
export default Tradeaisearch
