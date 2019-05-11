var RadarChart = {
  draw: function(id, d, options){
    var cfg = {
     radius: 5,
     w: 600,
     h: 600,
     factor: 1,
     factorLegend: .85,
     levels: 3,
     maxValue: 0,
     radians: 2 * Math.PI,
     opacityArea: 0.3,
     ToRight: 5,
     TranslateX: 80,
     TranslateY: 30,
     ExtraWidthX: 300,
     ExtraWidthY: 100,
     color: d3.scaleOrdinal(d3.schemeCategory10)
    };
	
    if('undefined' !== typeof options){
      for(var i in options){
      if('undefined' !== typeof options[i]){
        cfg[i] = options[i];
      }
      }
    }
    function compare(a,b) {
      if (a.total > b.total)
        return -1;
      if (a.total < b.total)
        return 1;
      return 0;
    }
    var unsorted = d.slice(0)
    d = d.sort(compare)
    var data = d
    cfg.maxValue = 200;
    
    // var allAxis = (d[0].map(function(i, j){return i.area}));
    //console.log(d[0])
    var allAxis = (d[0].axis.map(function(i, j){return i.stat}));
    //console.log(allAxis)
    var total = allAxis.length;
    //console.log(total)
    var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
    var Format = d3.format('%');
    //d3.select(id).select("svg").remove();

    var g = d3.select(id)
        .append("svg")
        .attr("width", cfg.w+cfg.ExtraWidthX)
        .attr("height", cfg.h+cfg.ExtraWidthY)
        .append("g")
        .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");

	  //var tooltip;
    var tooltip = d3.select("body").append("div").attr("class", "toolTip").attr('id','toolTip');

    // const pokemonInfoContainer = d3.select(id).append('div').attr('id', 'pokemonInfoContainer')
    // const tempImg = document.createElement('img')
    // tempImg.className = 'pokemonImage'
    // document.getElementById("pokemonInfoContainer").appendChild(tempImg);
    // const ulNode = document.createElement('ul')
    // ulNode.className = 'radar-facts'
    // console.log(ulNode);
    // document.getElementById("pokemonInfoContainer").appendChild(ulNode);

    var pic = d3.select(id).append('img')
    //const pic = d3.select('pokemonImage')

    //const ul = d3.select(id).append('ul').attr('id', 'radar-facts')
    //Circular segments
    for(var j=0; j<cfg.levels; j++){
      var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
      g.selectAll(".levels")
       .data(allAxis)
       .enter()
       .append("svg:line")
       .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
       .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
       .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
       .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
       .attr("class", "line")
       .style("stroke", "grey")
       .style("stroke-opacity", "0.75")
       .style("stroke-width", "0.3px")
       .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
    }

    //Text indicating at what % each level is
    for(var j=0; j<cfg.levels; j++){
      var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
      g.selectAll(".levels")
       .data([1]) //dummy data
       .enter()
       .append("svg:text")
       .attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
       .attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
       .attr("class", "legend")
       .style("font-family", "sans-serif")
       .style("font-size", "10px")
       .attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight + 7) + ", " + (cfg.h/2-levelFactor) + ")")
       .attr("fill", "#737373")
       .text((j+1)*cfg.maxValue/cfg.levels);
    }

    series = 0;

    var axis = g.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");

    axis.append("line")
      .attr("x1", cfg.w/2)
      .attr("y1", cfg.h/2)
      .attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
      .attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
      .attr("class", "line")
      .style("stroke", "grey")
      .style("stroke-width", "1px");

    axis.append("text")
      .attr("class", "legend")
      .text(function(d){return d})
      .style("font-family", "sans-serif")
      .style("font-size", "11px")
	  .attr("fill", "white")
      .attr("text-anchor", "middle")
      .attr("dy", "1.5em")
      .attr("transform", function(d, i){return "translate(0, -10)"})
      .attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
      .attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});

    for (var key in d) {
      // d.forEach(function(y, x){
        // d[key].axis.forEach(function(y, x){
        // console.log(y,x)
        dataValues = [];
        //g.selectAll(".nodes")
        //.data(y, function(j, i){
        for (var ax in d[key].axis){
          var j = d[key].axis[ax]
          var i = ax
          //console.log(j)
          // console.log(j,i)
          dataValues.push([
          cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
          cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
          ]);
        }//);
        //console.log(dataValues)
        dataValues.push(dataValues[0]);

        g.selectAll(".stat")
               .data([dataValues])
               .enter()
               .append("polygon")
               .attr("class", () => `radar-${d[key].name}`)
               //.attr("class", "radar-chart-serie"+series)
               .attr('id',key)
               .style("stroke-width", "2px")
               .style("stroke",function(j,i){
                return data[this.id].color
               })
               .attr("points",function(d) {
                  //console.log(data[this.id].color)
                 var str="";
                 for(var pti=0;pti<d.length;pti++){
                   str=str+d[pti][0]+","+d[pti][1]+" ";
                 }
                 return str;
                })
               .style("fill", function(j, i){
                return data[this.id].color
                // return cfg.color(series)
              })
               .style("fill-opacity", cfg.opacityArea)
               .on('mouseover', function (){
                 console.log(d[key]);
                 const { catchRate, height, gen, weight } = d[key]

                  const liNode1 = document.createElement('LI')
                  liNode1.className = 'radar-facts-li'
                  const textNode1 = document.createTextNode(`Catch Rate: ${catchRate}%`)
                  liNode1.appendChild(textNode1)

                  const liNode2 = document.createElement('LI')
                  liNode2.className = 'radar-facts-li'
                  const textNode2 = document.createTextNode(`Height: ${height}m`)
                  liNode2.appendChild(textNode2)

                  const liNode3 = document.createElement('LI')
                  liNode3.className = 'radar-facts-li'
                  const textNode3 = document.createTextNode(`Gen: ${gen}`)
                  liNode3.appendChild(textNode3)

                  const liNode4 = document.createElement('LI')
                  liNode4.className = 'radar-facts-li'
                  const textNode4 = document.createTextNode(`Weight: ${weight}kg`)
                  liNode4.appendChild(textNode4)

                  document.getElementById('radar-facts').appendChild(liNode1)
                  document.getElementById('radar-facts').appendChild(liNode2)
                  document.getElementById('radar-facts').appendChild(liNode3)
                  document.getElementById('radar-facts').appendChild(liNode4)

                  //ul.append(liNode1)

                  z = "polygon."+d3.select(this).attr("class");
                  g.selectAll("polygon")
                    .transition(200)
                    .style("fill-opacity", 0.1); 
                  g.selectAll(z)
                    .transition(200)
                    .style("fill-opacity", .5);
                  
                  })

               .on('mousemove', function(){

                //console.log(data[this.id]);
                          tooltip
                         .style("display", "inline-block")
                         .html((data[this.id].name))
                         .style("left", d3.event.pageX-(document.getElementById("toolTip").getBoundingClientRect().width/2) + "px")
                         .style("top", d3.event.pageY- 50+ "px")

                        var src = "pokemon/" + data[this.id]['id'] + ".png";

                        pic.attr('src',src).attr('style','width:256px; height:256px; display:inline-block;')
                        })

               .on('mouseout', function(){
                        g.selectAll("polygon")
                         .transition(200)
                         .style("fill-opacity", cfg.opacityArea);
                        tooltip.style("display", "none");
                        pic.transition()
                        .duration(50).style("display", "none");

                        const radarLiNodes = document.getElementsByClassName('radar-facts-li')
                        while (radarLiNodes.length > 0) {
                          radarLiNodes[0].parentNode.removeChild(radarLiNodes[0])
	                      }
               });


        g.selectAll(".nodes")
          .data(d[key].axis).enter()
          .append("circle")
          .attr("class", () => `radar-${d[key].name}`)
        //.attr("class", "radar-chart-serie"+series)
        .attr('id',key)
        .attr('r', cfg.radius)
        .attr("alt", function(j){
          // console.log(j)
          return Math.max(j.value, 0)})
        .attr("cx", function(j, i){
          // console.log(j,i)
          dataValues.push([
          cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
          cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
        ]);
        return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
        })
        .attr("cy", function(j, i){
          return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
        })
        .attr("data-id", function(j){ 
          // console.log(j) 
          return j.stat})
        .style("fill", function(j,i){
          return data[this.id].color
        })//cfg.color(series))
        .style("stroke-width", "1px")
        .style("stroke", function(j,i){
          //return data[this.id].color
          return 'black'
        })//cfg.color(series))
        .style("fill-opacity", .9)
        .on('mouseover', function (d){
          //console.log(d.stat)
              tooltip
                .style("display", "inline-block")
                .html((data[this.id].name)+"<br>"+(d.stat) + "<br><span>" + (d.value) + "</span>")
                .style("left", d3.event.pageX-(document.getElementById("toolTip").getBoundingClientRect().width/2)+ "px")
                .style("top", d3.event.pageY - 95 + "px")

              })
         .on("mouseout", function(d){ tooltip.style("display", "none");});
        // }    
        series++;
      };
      series=0;
      //console.log(unsorted)
      //console.log(data)
      var radarlegend = g.append('g').attr('id','radarlegend').attr('class','radarlegend').selectAll('g').data(unsorted).enter().append('g').attr("transform", function(d, i) { return "translate("+(cfg.TranslateX+250)+"," + (i * 20 + 50)+")"; });
      //radarlegend.append('circle').attr('r',6).attr('fill',function(d){return d.color}).attr('stroke','black')


      radarlegend.append('text').attr('x',0.5).attr('y',3)
                 .style('text-align','center').style('font-size','10px').style('fill','white').style('text-shadow','1px 1px #000000')

      radarlegend.append('text')
                  .attr('class', d => `radar-${d.name}`)
                 .attr('x',120).attr('y',4).text("X")
                 .attr("fill", 'red')
                 .on('click', function (d){
                  radardata = radardata.filter(radarPokemon => radarPokemon.name !== d.name)
                  const radarPokemon = document.getElementsByClassName(`radar-${d.name}`)
                  while (radarPokemon.length > 0) {
                    radarPokemon[0].parentNode.removeChild(radarPokemon[0])
                  }
                 })

      radarlegend.append('text')
                 .attr('x',60).attr('y',4).text(function(d) { return d.name })
                 .attr("fill", function(d){return d.color})
                 .attr('class', d => `radar-${d.name}`)
<<<<<<< HEAD
                 .data([dataValues])
                 .attr('id', key)
                 .on('mouseover', function (d){

                      z = "polygon."+d3.select(this).attr("class");
                      g.selectAll("polygon")
                       .transition(200)
                       .style("fill-opacity", 0.1); 
                      g.selectAll(z)
                       .transition(200)
                       .style("fill-opacity", .5);

                    console.log(z);
                 })
               .on('mousemove', function(){
=======
                 .on('mouseover', function(d) {
                        tooltip
                         .style("display", "inline-block")
                         .html(d.name)
                         .style("left", d3.event.pageX-(document.getElementById("toolTip").getBoundingClientRect().width/2) + "px")
                         .style("top", d3.event.pageY- 50+ "px");

                        var src = "pokemon/" + d.id + ".png";
                  
                        pic.attr('src',src).attr('style','width:256px; height:256px; display:inline-block;')
>>>>>>> eee7853c266917ed1ebdf22514617f97d094db63



                        z = "polygon."+d3.select(this).attr("class");
                        g.selectAll("polygon")
                         .transition(200)
                         .style("fill-opacity", 0.1); 
                        g.selectAll(z)
                         .transition(200)
                         .style("fill-opacity", .8);
                 })
                 .on('mousemove', function(d){
                        tooltip
                         .style("display", "inline-block")
                         .html(d.name)
                         .style("left", d3.event.pageX-(document.getElementById("toolTip").getBoundingClientRect().width/2) + "px")
                         .style("top", d3.event.pageY- 50+ "px");

                        var src = "pokemon/" + d.id + ".png";
                  
                        pic.attr('src',src).attr('style','width:256px; height:256px; display:inline-block;')
                        })
                 .on('mouseout', function(){
                        radarlegend.selectAll("text")
                         .transition(200)
                         .style("fill-opacity", 1);



                        g.selectAll("polygon")
                         .transition(200)
                         .style("fill-opacity", cfg.opacityArea);
                        tooltip.style("display", "none");
                        pic.transition()
                        .duration(50).style("display", "none");
                 })
                 ;


    }
};