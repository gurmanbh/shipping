(function(){

	function capitalize (s){
		return s[0].toUpperCase() + s.slice(1);
	}

	var width = 1080,
	    height = 800,
	    root;

	var force = d3.layout.force()
	    .linkDistance(150)
	    .charge(-200)
	    .gravity(.05)
	    .size([width, height])
	    .on("tick", tick);

	var svg = d3.select("body").append("svg")
	    .attr("width", width)
	    .attr("height", height);

	var link = svg.selectAll(".link"),
	    node = svg.selectAll(".node");

	d3.json("data/data2.json", function(file) {
	  root = file;
	  console.log(file);
	  update();
	});

	function update() {
	  var nodes = flatten(root),
	      links = d3.layout.tree().links(nodes);

	  // Restart the force layout.
	  force
	      .nodes(nodes)
	      .links(links)
	      .start();

	  // Update links.
	  link = link.data(links, function(d) { return d.target.id; 
		});

	  link.exit().remove();

	  link.enter().insert("line", ".node")
	      .attr("class", "link");

	  // Update nodes.
	  node = node.data(nodes, function(d) { return d.id; });

	  node.exit().remove();

	  var nodeEnter = node.enter().append("g")
	      .attr("class", "node")
	      .on("click", click)
	      .call(force.drag);

	  nodeEnter.append("circle")
	      .attr("r", function(d) { return Math.sqrt(d.size) / 10 || 4.5; });

	  nodeEnter.append("text")
	      .attr("dy", ".35em")
	      .text(function(d) { return d.name; });

	  node.select("circle")
	      .style("fill", color);

	  node.selectAll("circle")
	  	.on("mouseover", function(d) {

					//Get this bar's x/y values, then augment for the tooltip
		var xPosition = d.px;
		var yPosition = d.py;
		var buffer = 12;

			//Update the tooltip position and value
			d3.select("#tooltip")
				.style("left", xPosition + "px")
				.style("top", yPosition + buffer + "px")
				.select("#desc")
				.text(d.desc);
			d3.select("#tooltip")
				.select('#name')
				.text(d.name);
			d3.select("#tooltip")
				.select('#type')
				.text(capitalize(d.type));
	   
			//Show the tooltip
			d3.select("#tooltip").classed("hidden", false);

			})
			.on("mouseout", function() {
			   
			//Hide the tooltip
			d3.select("#tooltip").classed("hidden", true);
					
			   });
	}

	function tick() {
	  link.attr("x1", function(d) { return d.source.x; })
	      .attr("y1", function(d) { return d.source.y; })
	      .attr("x2", function(d) { return d.target.x; })
	      .attr("y2", function(d) { return d.target.y; });

	  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	}

	function color(d) {
	  // return 
	  // d._children ? "#3182bd" // collapsed package
	  //     : d.children ? "#c6dbef" // expanded package
	      // : 
	      return d.type == "company" ? "#fd8d3c" // leaf node
	      : d.type == "person" ? "#00FF05"
	      : d.type == "ship" ? "#FCF700"
	      : "#2F009F";
	}

	// Toggle children on click.
	function click(d) {
	  if (d3.event.defaultPrevented) return; // ignore drag
	  if (d.children) {
	    d._children = d.children;
	    d.children = null;
	  } else {
	    d.children = d._children;
	    d._children = null;
	  }
	  update();
	}

	// Returns a list of all nodes under the root.
	function flatten(root) {
	  var nodes = [], i = 0;

	  function recurse(node) {
	    if (node.children) node.children.forEach(recurse);
	    if (!node.id) node.id = ++i;
	    nodes.push(node);
	  }

	  recurse(root);
	  return nodes;
	}

}).call(this);