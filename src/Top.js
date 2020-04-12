import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {useParams,useLocation} from "react-router"

function Top({country}){
    // const params = useParams()
    // let country = params.country
    // let mode = params.mode

    const [import_list,setImportList] = useState([])
    const [export_list,setExportList] = useState([])
    const [loading,setloading] = useState(false)
    const [error,seterror] = useState(false)



    // var url = 'http://159.65.150.184:9200/trade_analytica_march/_search'
    var url = 'http://159.65.150.184:9200/hello_trade_analytica/_search'


    let query = get_query(country)
    // let query = get_query2(country)
    




    useEffect(() => {
      setloading(true)
      axios.post(url, query)
        .then( d => {
          if(d.status === 200 ){
            // let data = d.data.hits.hits._source.data
            // let data = d.data.aggregations
            let import_data = d.data.aggregations.import.import_data.buckets
            let export_data = d.data.aggregations.export.export_data.buckets


            console.log("import data ----- ",import_data)
            console.log("export data ----- ",export_data)
            

            let list = get_list_from_buckets(import_data)
            let list2 = get_list_from_buckets(export_data)
            setImportList(list)
            setExportList(list2)
            
            console.log("list ---",list,"\nlist ----2",list2)
          }
          else{
            console.log("err")
          }
          setloading(false)
        })
        .catch( error => {
            console.log(error)
            setloading(false)
            seterror(true)
        });
        if(loading){
          seterror(true)
        }

    },[])



    if (loading) return <p>Loading...</p>
    if (error) return <p>Error!</p>

    return (
        <div>
            {/* <h2>{country}</h2> */}
            

            
    <h4>Import Commodities in {country}</h4>

            <table>
              <tr>
                <th>hscode</th>
                <th>Value - 2018</th>
              </tr>
              {
              import_list.map(element => {
                return (
                  <tr>
                    <td>{element.hs_code}</td>
                    <td>{element.value}</td>
                  </tr>
                )
              })
              }
            </table>



            

            <h4>Export Commodities in {country}</h4>
            {<table>
              <tr>
                <th>hscode</th>
                <th>Value - 2018</th>
              </tr>
              {
              export_list.map(element => {
                return (
                  <tr>
                    <td>{element.hs_code}</td>
                    <td>{element.value}</td>
                  </tr>
                )
              })
              }
            </table>
            }
            <br />
            <br />
            <br />
            <br />
            <h5>Import data</h5>
            <p>{JSON.stringify(import_list)}</p>

            <h5>Export data</h5>
            <p>{JSON.stringify(export_list)}</p>
            <br />
            <br />
            <br />
            <br />
        </div>
    )
}




function get_list_from_buckets(bucket){
    let list_bucket = bucket.map(item => {
        let value = item.key
        let data = item.details.hits.hits[0]._source
        let hscode = data.HSCode

        return {hs_code:hscode,value : value}
    })

    return list_bucket
}

function get_query(country){
    let query = {
        "query": {
          "bool": {
            "must": [
              {"match": {"Country": country}}
            ]
          }
        },
        "aggs": {
          "import": {
            "filter": {
              "term": {
              "Mode": "Import"
            }
          },
          "aggs": {
            "import_data": {
              "terms": {
                "field": "data.2018",
                "order": {
                  "_key": "desc"
                }
              },
              "aggs": {
                "details": {"top_hits": {"size": 1, "_source": {"includes": ["Country","HSCode","HSCodeName"]}}}
                }
              }
            }
          },
          "export": {
            "filter": {
              "term": {
              "Mode": "Export"
            }
          },
          "aggs": {
            "export_data": {
              "terms": {
                "field": "data.2018",
                "order": {
                  "_key": "desc"
                }
              },
              "aggs": {
                "details": {"top_hits": {"size": 1, "_source": {"includes": ["Country","HSCode","HSCodeName"]}}}
                }
              }
            }
          }
        }
        ,
        "size": 0
      }

    return query
}


function get_query2(country){
    let query = {
        "query": {
          "bool": {
            "must": [
              {"match": {"Country": country}}
            ]
          }
        },
        "aggs": {
          "import": {
            "filter": {
              "term": {
              "Mode.keyword": "Import"
            }
          },
          "aggs": {
            "import_data": {
              "terms": {
                "field": "data.2018.keyword",
                "order": {
                  "_key": "desc"
                }
              },
              "aggs": {
                "details": {"top_hits": {"size": 1, "_source": {"includes": ["Country","HSCode","HSCodeName"]}}}
                }
              }
            }
          },
          "export": {
            "filter": {
              "term": {
              "Mode.keyword": "Export"
            }
          },
          "aggs": {
            "export_data": {
              "terms": {
                "field": "data.2018.keyword",
                "order": {
                  "_key": "desc"
                }
              },
              "aggs": {
                "details": {"top_hits": {"size": 1, "_source": {"includes": ["Country","HSCode","HSCodeName"]}}}
                }
              }
            }
          }
        },
        "size": 0
      }

      return query
}




export default Top