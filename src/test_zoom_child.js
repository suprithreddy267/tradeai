import React, { useRef, useEffect, useState } from "react";
import { select , line, curveCardinal, scaleLinear, axisBottom, axisRight, scaleBand, values, utcYears, scaleTime, extent, axisLeft, brushX, event, invert, zoom, zoomTransform } from "d3";
import usePrevious from "./usePrevious";
import * as d3 from "d3"

function Test_Zoom_Child(props) {
  const data = props.data;
  const svgRef = useRef();
  const svg = select(svgRef.current);
  const svgContent = svg.select(".content")
  const [currentZoomState, setCurrentZoomState] = useState();
  
  useEffect(() => {

   const yextent = extent(data, d=>d.value)
   const xextent = extent(data, d=>d.year)
	
	
   console.log(props.selection)
   console.log(Math.floor(props.selection[0]))
   //const xscale =scaleLinear().domain(data.map((x) => x.year)).range([0,2000])
   var xscale =scaleTime().domain([new Date(Math.floor(props.selection[0]),0,0),new Date(Math.ceil(props.selection[1]),0,0)]).range([0, props.width])
   var yscale =scaleLinear().domain(yextent).range([props.height,0])

  

   if (currentZoomState) {
    const newxscale = currentZoomState.rescaleX(xscale);
    xscale.domain(newxscale.domain())
  }
  
   
  //  if (!currentZoomState) {
  //   if (!idleTimeout) 
  //     return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
  //     xscale =scaleLinear().domain(xextent).range([0,2000])
  //  }
  //   else {
  //   xscale.domain([selection[0], selection[1]])
  //   console.log("New X Scale",xscale.domain())
  //   }
  	

	svg.style("border","1px solid red")

   const xaxis = axisBottom(xscale).ticks(data.length)

   svg
   .select(".x-axis")
   .style("transform", `translateY(500px)`)
   .call(xaxis)

   const yaxis = axisRight(yscale);
   svg
   .select(".y-axis")
   .style("transform", `translateX(2000px)`)
   .call(yaxis)

  
    const myLine = line()
      .x(d => xscale(new Date(Math.floor(d.year),0,0)))
      .y(d => props.height - yscale(d.value))
    .curve(curveCardinal);
      
    svg
      .selectAll("path")
      .data([data])
      .join("path")
      .style("transform", "scale(1, -1)")
      .attr("d", myLine)
      .attr("fill", "none")
      .attr("stroke", "blue")
      

      svg
      .selectAll(".myDot")
      .data(data)
      .join("circle")
      .attr("class", "myDot")
      .attr("stroke", "blue")
      .attr("r", "4")
      .attr("fill", "yellow")
      .attr("cx", (d) => xscale(new Date(Math.floor(d.year),0,0)))
      .attr("cy", (d) => yscale(d.value))
      .on("mouseenter", (d) => {
        svgContent
          .selectAll(".tooltip")
          .data([d.value])
          .join(enter => enter.append("text").attr("y", yscale(d.value)))
          .attr("class", "tooltip")
          .text(d.value)
          .attr("x", xscale(new Date(Math.floor(d.year),0,0)))
          .attr("text-anchor", "middle")
          .attr("y", yscale(d.value)-10)
          .transition()
          .attr("opacity", 1)
      })
      .on("mouseleave", () => svg.select(".tooltip").remove())
      .transition()
      .attr("height", d => props.height - yscale(d.value))

    
	/*var info = svg.append("g")
		.attr("x",props.width-10)
		.attr("y",0);
	
	var infotext = info.append("text");*/
	
	
	svg.on("mousemove",function(){
	//console.log(d3.mouse(this));
	var mouse = d3.mouse(this);
	svg.selectAll(".crosshair").remove();

	
	svg
	.append("line")
	.attr("class","crosshair")
	.attr("x1",mouse[0])
	.attr("y1",0)
	.attr("x2",mouse[0])
	.attr("y2",props.height)
	.attr("stroke-width",2)
	.attr("stroke","black")	

	svg
	.append("line")
	.attr("class","crosshair")
	.attr("x1",0)
	.attr("y1",mouse[1])
	.attr("x2",props.width)
	.attr("y2",mouse[1])
	.attr("stroke-width",2)
	.attr("stroke","black")	

	console.log(xscale.invert(mouse[0]))
	console.log(yscale.invert(mouse[1]))
	
	//infotext.attr("text","hii");
	
})

	svg.on("mouseover",function(){

	svg.append("rect").attr("x",0).attr("y",0).attr("width",20).attr("height",30).attr("fill","blue")
	svg.append("text").attr("x","10").attr("y","20").attr("text","hiiiii").attr("font-size","30px").attr("fill","red");
	
	})

	svg.on("mouseout",function(){
	svg.selectAll(".myrect").remove();
		
})
	
      svg
      .selectAll(".bigbox")
      .join("rect")
      .attr("width",props.width)
      .attr("height",props.height)
      .attr("class","bigbox")
      .attr("x", 0)
      .attr("y", 0)
      
     
   
      const zoomBehavior = zoom()
      .scaleExtent([1, 10])
      .translateExtent([
        [0, 0],
        [props.width, props.height]
      ])
      .on("zoom", () => {
        // My Current Zoom State
    
        const zoomState = zoomTransform(svgRef.current);
        console.log("Current Zoom State", zoomState)
        setCurrentZoomState(zoomState);
        

      });
      
    svg.call(zoomBehavior)
      

  }, [data, props.selection, currentZoomState]);

  if (!props.selection) {
    return null;
  }

  return (
      <React.Fragment>
    <svg ref = {svgRef} width={props.width} height={props.height}>
    <defs>
            <clipPath id="myClipPath">
              <rect x="0" y="0" width="100%" height="100%" />
            </clipPath>
          </defs>
          <g className="content" clipPath="url(#myClipPath)"></g>
          <g className = "x-axis"></g>
          <g className = "y-axis"></g>
          <g className = "brush"></g>
        </svg>
       </React.Fragment>
  );

}

export default Test_Zoom_Child;
