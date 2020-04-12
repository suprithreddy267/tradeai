import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {useParams,useLocation} from "react-router"


function Items(){
    const params = useParams()

    const [bucket4,setBucket4] = useState([])
    const [bucket6,setBucket6] = useState([])
    const [bucket8,setBucket8] = useState([])
    const [loading,setloading] = useState(false)
    const [error,seterror] = useState(false)

    let hscode = params.hscode

    // var url = 'http://159.65.150.184:9200/trade_analytica_march/_search'
    var url = 'http://159.65.150.184:9200/hello_trade_analytica/_search'

    // let query = get_query(hscode)
    let query = get_query2(hscode)

    useEffect(() => {
      setloading(true)
      axios.post(url, query)
        .then( d => {
          if(d.status === 200 ){
            let aggs = d.data.aggregations
            let bucket_4 = aggs.hs_code_lvl_4.hs_code.buckets
            let bucket_6 = aggs.hs_code_lvl_6.hs_code.buckets
            let bucket_8 = aggs.hs_code_lvl_8.hs_code.buckets
      
            var list_bucket_4 = get_list_from_buckets(bucket_4)
            var list_bucket_6 = get_list_from_buckets(bucket_6)
            var list_bucket_8 = get_list_from_buckets(bucket_8)
      
            console.log("bucket 6 ------",list_bucket_4)
            console.log("bucket 6 ------",list_bucket_6)
            console.log("bucket 8 ------",list_bucket_8)

            setBucket4(list_bucket_4)
            setBucket6(list_bucket_6)
            setBucket8(list_bucket_8)
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
            <h2>{hscode}</h2>

            <h3>Hs code level 4</h3>
            <h4>{JSON.stringify(bucket4)}</h4>

            <h3>Hs code level 6</h3>
            <h4>{JSON.stringify(bucket6)}</h4>

            <h3>Hs code level 8</h3>
            <h4>{JSON.stringify(bucket8)}</h4>
        </div>
    )
}




function get_list_from_buckets(bucket){
    let list_bucket = bucket.map(item => {
        let hscode = item.key
        let d = item.Country_name.hits.hits[0]._source

        let Description = d.Description
        let HSName = d.HSName
        let HS_Code_Name = d["HS Code Name"]

        return {
            hs_code:hscode,
            Description:Description,
            HSName:HSName,
            HS_Code_Name:HS_Code_Name
        }
    })

    return list_bucket
}


    function get_query2(hscode){

  let query = {
    "query": {
      "wildcard": {
        "HSCode": {
          "value": hscode+"*"
        }
      }
    },
    "aggs": {
      "hs_code_lvl_4": {
        "filter": {
          "term": {
            "HSCodeLevel": "4"
          }
        },
        "aggs": {
          "hs_code": {
            "terms": {
              "field": "HSCode",
              "size": 2
            },
            "aggs": {
              "Country_name": {"top_hits": {"size": 1, "_source": {"includes": ["HSName","HS Code Name","Description"]}}}
            }
          }
        }
      },
      "hs_code_lvl_6": {
        "filter": {
          "term": {
            "HSCodeLevel": "6"
          }
        },
        "aggs" : {
          "hs_code": {
            "terms": {
              "field": "HSCode",
              "size": 2
            },
            "aggs": {
              "Country_name": {"top_hits": {"size": 1, "_source": {"includes": ["HSName","HS Code Name","Description"]}}}
            }
          }
        }
      },
      "hs_code_lvl_8": {
        "filter": {
          "term": {
            "HSCodeLevel": "8"
          }
        },
        "aggs" : {
          "hs_code": {
            "terms": {
              "field": "HSCode",
              "size": 2
            },
            "aggs": {
              "Country_name": {"top_hits": {"size": 1, "_source": {"includes": ["HSName","HS Code Name","Description"]}}}
            }
          }
        }
      }
    },
    "size": 0
  }

  return query 
}

export default Items