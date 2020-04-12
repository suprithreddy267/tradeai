import React from 'react';
import Select from 'react-select'; 
import axios from 'axios'

const query = {"aggs": {"country_name": {"terms": {"field": "Country.keyword"}}},"size": "0"}
var url ='http://159.65.150.184:9200/trade_trail/_search';


var countryName;
    var query2 = {
	  "aggs": {
		"one_country": {
		  "filter":{
			"term": {
        "Country.keyword":'China'//country name
			}
		  },
		  "aggs": {
			"Country_hs_code": {
			  "terms": {
				"field": "HSCode.keyword"
			  }
			},
			"Country_hs_name": {
			  "terms": {
				"field": "HSName.keyword"
			  }
			},
			"Country_hs_code_level": {
			  "terms": {
				"field": "HS Code Level.keyword"
			  }
			}
		  }
		}
	  }
	  ,
	  "size": 0
  }
  
  
  var hscodeselected;
	
	const query3 = {
		  "query": {
			"bool": {
				"must":[
					{"match": {"Country.keyword":"China"}},//country name
					{
						"query_string" :{
						"fields": ["HSCode","HSName"],
						"query": "05",//hs code or hsname
						"minimum_should_match": 1
						}
					}
				]
			}
		  },
		  "aggs": {
					"Country_hs_name": {
					  "terms": {
						"field": "HSName.keyword"
					  }
					},
					"Country_hs_code": {
					  "terms": {
						"field": "HSCode.keyword"
					  }
					}
			},
			"size":0
	}
	


class testsearch extends React.Component {
 

  state = {
    selectedcountry: "Select Country",
    selectedhscode:"Select HS CODE",
    selectedhsname:"Select HS Name",
    countryName:"",
    hscodeselected:"",
    apidata:[],
    hscodedata:[],
    hsnamedata:[]
  }

  componentDidMount() {
    axios.post(url, query)
		.then( d => {
      console.log(d)
			if(d.status === 200 ){
				
				let countries = d.data.aggregations.country_name.buckets ;
				
				let apidata = countries.map(c => {return {"label" : c.key ,"value" : c.key}})
        this.setState({apidata})
        console.log("Apidata",apidata)
			}
			else{
				console.log("err")
			}
    })
    
    axios.post(url, query2)
		.then( d => {
			if(d.status === 200 ){
				
				let hscode = d.data.aggregations.one_country.Country_hs_code.buckets ;
				// hscodelevel = d.data.aggregations.one_country.Country_hs_code_level.buckets ;
				// hsname = d.data.aggregations.one_country.Country_hs_name.buckets ;
				
				hscode.forEach(function(v){ delete v.doc_count });
				// hsname.forEach(function(v){ delete v.doc_count });
        // hscodelevel.forEach(function(v){ delete v.doc_count });
        
        let hscodedata = hscode.map(c => {return {"label" : c.key ,"value" : c.key}})
        this.setState({hscodedata})
        console.log(hscodedata)
      }
			else{
				
				console.log("err")
			}
		})
		.catch( error => {
			if (error.response.status === 404) {
			  console.log(error.response.data);
			}
			
  });
  
  axios.post(url, query3)
  .then( d => {
    if(d.status === 200 ){
      //console.log(d.data.aggregations)
      //hscode = d.data.aggregations.Country_hs_code.buckets ;
      //hscodelevel = d.data.aggregations.one_country.Country_hs_code_level.buckets ;
      let hsname = d.data.aggregations.Country_hs_name.buckets ;
      
      //hscode.forEach(function(v){ delete v.doc_count });
      hsname.forEach(function(v){ delete v.doc_count });
      //hscodelevel.forEach(function(v){ delete v.doc_count });
      let hsnamedata= hsname.map(c => {return {"label" : c.key ,"value" : c.key}})
      this.setState({hsnamedata})
      console.log(hsname,"hsnameee")
      
    }
    else{
      console.log("err")
    }
  })
  .catch( error => {
    if (error.response.status === 404) {
      console.log(error.response.data);
      
    }
    else{
      
    }
});

  }
  countryChange = selectedcountry => {
    this.setState(
      { selectedcountry },
      () => {console.log('Selected country:', this.state.selectedcountry)
      countryName=this.state.selectedcountry.value;
      console.log(countryName)}
    );
    
  }
  hscodeChange = selectedhscode => {
    this.setState(
      { selectedhscode },
      () => {console.log('Selected hscode:', this.state.selectedhscode)
      hscodeselected=this.state.selectedhscode.value;
      console.log(hscodeselected);
      
    }
    );
  }
    hsnameChange = selectedhsname => {
      this.setState(
        { selectedhsname },
        () => console.log('Selected Hsname:', this.state.selectedhsname)
      );
    }
  render() {
    
    this.apidata=this.state.apidata;
    this.hscodedata=this.state.hscodedata;
    this.hsnamedata=this.state.hsnamedata;
    console.log("hsnameadata",this.hsnamedata)
    const { selectedcountry } = this.state;
    const { selectedhscode } = this.state;
    const { selectedhsname } = this.state;
    

    return (
      
       <div> 
      <div style={{display:"flex",flexDirection:"row"}}>  

      <div style={{width:'20%'}}>
        <Select
        
        placeholder={"Select Country"}
        value={selectedcountry}
        onChange={this.countryChange}
        options={this.apidata}
      />
      </div>

 
      <div style={{width:'20%'}}>
      <Select
        placeholder={"Select Hscode"}
        value={selectedhscode}
        onChange={this.hscodeChange}
        options={this.hscodedata}
       />
      </div>

      <div style={{width:'20%'}} >
      <Select
        
        placeholder={"Select Hsname"}
        value={selectedhsname}
        onChange={this.hsnameChange}
        options={this.hsnamedata}
       
      />
    </div>
    </div>
    <div>
    <div>Country : {JSON.stringify(selectedcountry)}</div>
    <div>HSCode : {JSON.stringify(selectedhscode)}</div>
    <div>HSCode : {JSON.stringify(selectedhsname)}</div>
    </div>
    </div>
    
    );
  }
}export default Tradeaisearch
