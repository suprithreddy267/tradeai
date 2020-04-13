import React from 'react'
import Top2 from "./Top2"
import {useParams,useLocation} from "react-router"


function Hscodename(){
    const params = useParams()
    let hscode = params.hscode
    console.log("hscountry entered")


    return (
        <div>

            
        <h2>Hscode : {hscode}</h2>
        <Top2 hscode={hscode}/>

        </div>
    )
}


export default Hscodename