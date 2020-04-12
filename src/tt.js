import React, { useEffect, useState } from "react";
import axios from "axios";
var url ='http://159.65.150.184:9200/top_trade/_search';

function Tables() {
  const [importsdata, setimportsData] = useState([]);
  const [exportsdata, setexportsData] = useState([]);
  const [trade_baldata, settrade_balData] = useState([]);


  useEffect(() => {
    var query={
      "query": {
        "match_all": {}
      },
      "aggs": {
        "exports": {
          "composite": {
            "size":30,
            "sources": [
              {
                "value" :{
                  "terms": {
                    "field": "Export.keyword",
                    "order": "desc"
                  }
                }
              },
              {
                "Country": {
                  "terms": {
                    "field": "Country.keyword"
                  }
                }
              }
            ]
          }
        },
        "imports": {
          "composite": {
            "size":5,
            "sources": [
              {
                "value" :{
                  "terms": {
                    "field": "Import.keyword",
                    "order": "desc"
                  }
                }
              },
              {
                "Country": {
                  "terms": {
                    "field": "Country.keyword"
                  }
                }
              }
            ]
          }
        },
        "trade_bal": {
          "composite": {
            "size":5,
            "sources": [
              {
                "value" :{
                  "terms": {
                    "field": "Trade Balance.keyword",
                    "order": "desc"
                  }
                }
              },
              {
                "Country": {
                  "terms": {
                    "field": "Country.keyword"
                  }
                }
              }
            ]
          }
        }
      },
      "size": 0
    }
    axios.post(url,query)
  .then( d => {
    if(d.status === 200 ){
      // var x=d.data.aggregations
      // console.log(x,"x")
      // for(let i in x)
      // console.log(i)



      let imports=d.data.aggregations.imports.buckets
      imports.forEach(function(v){ delete v.doc_count });
      let importsdata=imports.map(s=>{return{"country":s.key.Country,"value":s.key.value}})
      //console.log(importsdata)
      setimportsData(importsdata)

      let exports=d.data.aggregations.exports.buckets
      exports.forEach(function(v){ delete v.doc_count });
      let exportsdata=exports.map(s=>{return{"country":s.key.Country,"value":s.key.value}})
      //console.log(exportsdata)
      setexportsData(exportsdata)

      let trade_bal=d.data.aggregations.trade_bal.buckets
      trade_bal.forEach(function(v){ delete v.doc_count });
      let trade_baldata=trade_bal.map(s=>{return{"country":s.key.Country,"value":s.key.value}})
      //console.log(trade_baldata)
      settrade_balData(trade_baldata)
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

},[])

  return (
    <div style={{display:"flex",flexDirection:"row"}}>
      
      <div style={{width:'30%'}}>
      <h1>Top Importing Partners</h1>
        <table>
        <tr>
          <th>Countries</th>
          <th>Value</th>
        </tr>
        {importsdata.map(item => (
          <tr>
            <td key={item.country}>
              {item.country}
            </td>
            <td key={item.value}>
              {item.value}
            </td>
          </tr>))}


      </table>
      </div>

    <div style={{width:'40%'}}>
    <h1>Top Exporting Partners</h1>
        <table>
        <tr>
          <th>Countries</th>
          <th>Value</th>
        </tr>
        {exportsdata.map(item => (
          <tr>
            <td key={item.country}>
              {item.country}
            </td>
            <td key={item.value}>
              {item.value}
            </td>
          </tr>))}


      </table>
      </div>
    
    <div style={{width:'30%'}}>
    <h1>Trade Balance</h1>
        <table>
        <tr>
          <th>Countries</th>
          <th>Value</th>
        </tr>
        {trade_baldata.map(item => (
          <tr>
            <td key={item.country}>
              {item.country}
            </td>
            <td key={item.value}>
              {item.value}
            </td>
          </tr>))}


      </table>
      </div>
    </div>
    );
}
export default Tables