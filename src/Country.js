import React from 'react'
import Top from "./Top"
import {useParams,useLocation} from "react-router"


function Country(){
    const params = useParams()
    let country = params.country
    console.log(country,"country params")


    return (
        <div>

            
        <h2>Country : {country}</h2>
        

            <Top country={country}/>

        </div>
    )
}


export default Country