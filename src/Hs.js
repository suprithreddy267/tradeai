import React, {useState, useEffect} from 'react'
import axios from 'axios'
// import useAxios from 'axios-hooks'
// import Tab from "./Tab"
import {useParams} from "react-router"
import Test_Zoom from './test_zoom'


function Hs(){
    const params = useParams()
    let country = params.country
    let hscode = params.hscode

    const [list,setList] = useState([])
    const [loading,setloading] = useState(false)
    const [error,seterror] = useState(false)

    useEffect(() => {
      var url = 'http://159.65.150.184:9200/hello_trade_analytica/_search'
      let query = get_query(country,hscode)
      setloading(true)
      axios.post(url, query)
        .then( d => {
          if(d.status === 200 ){
            // let data = d.data.hits.hits._source.data
            let data = d.data.hits.hits[0]._source.data
            console.log("data ----- ",data)


            let list = []
            for(let i in data)
            {
                list.push({ "year":i , "value":data[i] })      
            }

            console.log("list ----",list)

            setList(list)
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
            <Test_Zoom data={list} width={2000} height={100}/>
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

function get_query(country,hscode){
    let query = {
        "query": {
          "bool": {
            "must": [
              {"match": {"Country": country}},
              {"match": {"HSCode": hscode }}
            ]
          }
        }
      }

    return query
}




export default Hs
