
# ATTACK-Force-Graph
Generate JSON force-directed/ node graph data from MITRE's ATT&CK framework
- Work-In-Progress: More to come, this script is only a small part of a larger project.

![Showcase Header](/images/showcase_header.png)


## What?
- Generate JSON force-graph data nodes and links from the MITRE ATTACK Framework based on your preferences.
- The JSON data generated is formatted for use with @vasturiano's awesome various force-directed graph projects. (Tested and works on both 2D and 3D versions)
- At the moment you can do the following combinations:
    1. Group -> Group Tools -> Group Tool Techniques: 
        - Each group (APT) node will be linked to the corresponding tools/ software the group uses along.
        - Total node connections: **(group * *n* group tools * *n* tool techniques)**
    2. Group -> Group Tools/ Software:
        - Links just the tools without fetching tool techniques data
        - Total node connections: **(group * *n* group tools)**
    3. Other
        - You can generate standalone nodes of groups or group tools/ software.

## Why?
- Draw conclusions and spot patterns fast thanks to the power of data visualization. 
- Present compelling data stakeholders can easily understand and interact with. 
- Force-directed graphs are seriously... :sunglasses: *cool*  

## How?
- The script uses @Cyb3rWard0g's ATTACK-Python-Client. Having used MITRE's STIX CTI... just use Roberto's package. 
- Lift requests are network requests and can be time-consuming.

## EXAMPLES
- [Example 0: Only Group Nodes](https://osv22.github.io/ATTACK-Force-Graph/show-example/example0/group30.html)
- [Example 1: Group -> Tool(s)](https://osv22.github.io/ATTACK-Force-Graph/show-example/example1/group30-tools.html)
- [Example 2: Group -> Group Tool(s) -> Tool Technqiue(s)](https://osv22.github.io/ATTACK-Force-Graph/show-example/example2/group10-tool-teq.html)
- [Example 3 - ALL Group -> Tools -> Technqiues (1MB of JSON Data)](https://osv22.github.io/ATTACK-Force-Graph/show-example/example3/all-group-tool-teqs.html)

## PREVIEWS
![Example0 Header](/images/ex0_header.png)
![Example1 Header](/images/ex1_header.png)
![Example1 Header](/images/ex2_header.png)
![Example1 Header](/images/ex3_header.png)

## JSON Data Preview
- Preview attached JSON files or wait for screenshots coming soon.