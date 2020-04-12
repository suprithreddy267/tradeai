import React, { useState } from "react";
import Autocomplete from 'react-autocomplete';
import axios from 'axios'
// import { useHistory } from 'react-router-dom';
import {BrowserRouter as Router,Switch,Route,Link} from "react-router-dom";

function AutoComo() {

  // const history = useHistory();
  // const goLogin = () => history.push('login');
    
    const [value,setVal] = useState()
    const [items,setItems] = useState([])

    
    // var value = ""

    function handleChange(VariableName){
      var url = 'http://159.65.150.184:9200/ai_economics_v1_1/_search'
      var query = {
        "query": {
          "bool": {
            "must": [
              {"fuzzy": {"VariablePath": VariableName}}
            ]
          }
        },
        "aggs": {
          "varpath" : {
            "terms": {
              "field": "VariablePath.keyword"
            }
          }
        },
        "size": 0
      }

      
        
        
        axios.post(url, query)
          .then( d => {
            if(d.status === 200 ){
              //console.log(d.data);
              let data_list = d.data.aggregations.varpath.buckets
              let list = data_list.map(s => {
              return {'label' :s.key.split("/").join(" > "),'path':"chart/"+s.key.substring(s.key.indexOf('/')+1)}
              })
              console.log(list)
              setItems(list)
            }
            else{
              console.log("err")
            }
          })
          .catch( error => {
            if (error) {
              console.log(error)
            }
            else{
              console.log("Error!");
            }
          });
    }

    return (
        <div className="App">
          <Autocomplete
            getItemValue={(item) => item.path}
            items={items}
            renderItem={(item, isHighlighted) =>
              <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
               <Link to={`/${item.path}`}>
                {item.label}
                </Link>
              </div>
            }
            value={value}
            onChange={(e) => {setVal(e.target.value);handleChange(e.target.value)}}
            // onSelect={(val) => {setVal(val);console.log("val",val)}}
          />
        </div>
      );

}





export default AutoComo;