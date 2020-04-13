import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {useParams} from "react-router"

function Gst({hscode}){
    const [gst,setGst] = useState()


    const [loading,setloading] = useState(false)
    const [error,seterror] = useState(false)

    var url = 'http://159.65.150.184:9200/hello_trade_analytica/_search'

    let query = get_query(hscode)
    
    useEffect(() => {
      setloading(true)
      axios.post(url, query)
        .then( d => {
          if(d.status === 200 ){
            let data = d.data.aggregations.Gst.buckets
            let gst = data[0].key
            console.log("data ----",data)

            setGst(gst)
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
        Gst - {gst}%
        </div>
    )
}


function get_query(hscode){

    let query = {
        "query": {
          "bool": {
            "must": [
              {"match": {
                "HsCode.keyword": hscode
              }}
            ]
          }
        },
        "aggs": {
          "Gst": {
            "terms": {
              "field": "GstRate.keyword"
            }
          }
        },
        "size": 0
      }

    return query
}




export default Gst