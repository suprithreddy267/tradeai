import React from 'react'
import Top from "./Top"
import Top2 from "./Top2"
import {useParams,useLocation} from "react-router"


function Hscountry(){
    const params = useParams()
    let country = params.country
    let hscode = params.hscode
    console.log(country,"country params")
    console.log("hscountry entered")


    return (
        <div>

            
        <h2>Country : {country}</h2>
        <h2>Hscode : {hscode}</h2>

            <Top country={country}/>
            <Top2 hscode={hscode}/>

        </div>
    )
}


export default Hscountry