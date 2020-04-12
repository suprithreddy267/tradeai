import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {useParams} from "react-router"

function Top2({hscode}){
    // const params = useParams()
    // let hscode = params.hscode
    // let mode = params.mode

    const [import_list,setImportList] = useState([])
    const [export_list,setExportList] = useState([])
    const [loading,setloading] = useState(false)
    const [error,seterror] = useState(false)



    // var url = 'http://159.65.150.184:9200/trade_analytica_march/_search'
    var url = 'http://159.65.150.184:9200/hello_trade_analytica/_search'


    let query = get_query(hscode)
    // let query = get_query2(country)
    




    useEffect(() => {
      setloading(true)
      axios.post(url, query)
        .then( d => {
          if(d.status === 200 ){
            // let data = d.data.hits.hits._source.data
            // let data = d.data.aggregations
            console.log("data ----",d.data)
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
            {/* <h2>{hscode}</h2> */}
            

            
    <h4>Top Import countries for hscode{hscode}</h4>

            <table>
                <thead>
              <tr>
                <th>country</th>
                <th>Value - 2018</th>
              </tr>
              </thead>
              <tbody>
              {
              import_list.map((element,j) => {
                return (
                  <tr key={j}>
                    <td>{element.country}</td>
                    <td>{element.value}</td>
                  </tr>
                )
              })
              }
              </tbody>
            </table>



            

<h4>Top Export Country for hscode{hscode}</h4>
            <table>
                <thead>
              <tr>
                <th>country</th>
                <th>Value - 2018</th>
              </tr>
              </thead>
              <tbody>
              {
              export_list.map((element,j) => {
                return (
                  <tr key={j}>
                    <td>{element.country}</td>
                    <td>{element.value}</td>
                  </tr>
                )
              })
              }
              </tbody>
            </table>

            {/* <h3>Import data</h3>
            <h4>{JSON.stringify(import_list)}</h4>

            <h3>Export data</h3>
            <h4>{JSON.stringify(export_list)}</h4> */}
        </div>
    )
}




function get_list_from_buckets(bucket){
    let list_bucket = bucket.map(item => {
        let value = item.key
        let data = item.details.hits.hits[0]._source
        let hscode = data.HSCode
        let country = data.Country

        return {country:country,value : value}
    })

    return list_bucket
}

function get_query(hscode){
    let query = {
        "query": {
          "bool": {
            "must": [
              {"match": {"HSCode": `${hscode}`}}
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




export default Top2