
# ATTACK-Force-Graph
- Generate and visualize MITRE's ATTACK data in a 3D force-directed graph with a UI made specifically for the ATTACK data

![Showcase Header](/images/showcase_header.png)

## DEMO:
- PENDING

## Preview:
![Preview](/images/preview_header.png)


## TODO:
- [ ] Optimize time complexity for certain parts
- [ ] Add affiliation template
- [ ] Add Speciality template


## What?
- Generate JSON force-graph data nodes and links from the MITRE ATTACK Framework based on your preferences. (`graph_generator.py`)
- Use that data to visualize your results with a UI tailored around the ATTACK data. (`Frontend` directory)

- The JSON data generated is formatted for use with @vasturiano's awesome various force-directed graph projects. (Tested and works on both 2D and 3D versions)
- At the moment you can do the following combinations:
    1. Group -> Group Tools -> Group Tool Techniques:
        - Each group (APT) node will be linked to the corresponding tools/ software the group uses along.
        - Total node connections: **(group * *n* group tools * *n* tool techniques)**
    2. Group -> Group Tools/ Software:
        - Links just the tools without fetching tool techniques data
        - Total node connections: **(group * *n* group tools)**
    3. Groups Only
        - A node for each group will be generated but no links. (What would you link a group to?!)
        - Total node connections: 0 
    4. Other
        - You can generate standalone nodes of groups or group tools/ software.

## Why?
- Draw conclusions and spot patterns fast thanks to the power of data visualization. 
- Present compelling data stakeholders can easily understand and interact with. 
- Force-directed graphs are seriously... :sunglasses: *cool*  

## How?
- The script uses @Cyb3rWard0g's ATTACK-Python-Client. Having used MITRE's STIX CTI... just use Roberto's package. 
- Lift requests are network requests and can be time-consuming. Efficiency improvements planned after the main portion is done. 

## Example Demos
- Full Demo with UI: PENDING
- Graphs Only:
    - [Example 0: Only Group Nodes](https://osv22.github.io/ATTACK-Force-Graph/show-example/example0/group30.html)
    - [Example 1: Group -> Tool(s)](https://osv22.github.io/ATTACK-Force-Graph/show-example/example1/group30-tools.html)
    - [Example 2: Group -> Group Tool(s) -> Tool Technqiue(s)](https://osv22.github.io/ATTACK-Force-Graph/show-example/example2/group10-tool-teq.html)
    - [Example 3 - ALL Group -> Tools -> Technqiues (1MB of JSON Data)](https://osv22.github.io/ATTACK-Force-Graph/show-example/example3/all-group-tool-teqs.html)

## Examples
![Example0 Header](/images/ex0_header.png)
![Example1 Header](/images/ex1_header.png)
![Example1 Header](/images/ex2_header.png)
![Example1 Header](/images/ex3_header.png)

## Data Preview
- NOTE: Specific values are not part of the MITRE ATTACK Framework:
    - Group: `affiliation` - This is subjective and can be *problematic*, so it is up to your assessment to evaluate which group is affiliated with whom. 
    - Group: `targets` - Work-in-progress for defaults but hard to maintain over time given that it is not part of the ATTACK framework.
    - Group: `speciality` - Work-in-progress and is much easier to maintain.


- `val` - This is can be used to determine how big you want a node element to be.
    - For groups: The `val` is based on the number of tools the group uses
    - For tools: The `val` is based on the number of techniques the tool makes possible
    - For techniques: Set to `None` by default, leaving it up to you

### Group Node
```
"id": "MITRE GROUP ID HERE. EX: G0005",
"type": "group",
"val": 2,
"attributes": {
    "name": "Cool Group/ APT Name Here",
    "aliases": [
        "Group alias",
        "Operation Golden Kitty",
    ],
    "description": "Cleaned description. Do not use `get_desc()` if you want raw desc...",
    "affiliation": "You have assign this value yourself, read the NOTE above :)", 
    "targets": ["Also you have to", "set this. Read NOTE above"],
    "speciality": ["set this based on your assessment", "Read NOTE above"],
    "tools": {
        "tool_id_here": "tool_name_here",
        "S0225": "sqlmap",
    },
    "techniques": {
        "technique_id_here": "technique_name_here",
        "T1566.003": "Spearphishing via Service",
    }
}
```
### Tool Node
```
"id": "MITRE Software ID HERE. EX: S0084",
"type": "tool",
"val": 1
"attributes": {
    "name": "tool_name_here",
    "aliases": [],
    "labels": [
        "tool"
    ],
    "description": "Cleaned description. Do not use `get_desc()` if you want raw desc...",
    "platforms": [
        "Linux",
        ...
    ],
    "techniques": {
        "T1190": "Exploit Public-Facing Application"
    }
}
```

### Technique Node
- `val` is set to `None` by default, you can set it to length of platforms or whatever your preference is.
```
"id": "MITRE Technique ID HERE. EX: T1190",
"type": "technique",
"val": null,
"attributes": {
    "name": "Exploit Public-Facing Application",
    "chain_phase": "initial-access",
    "description": "Cleaned description. Do not use `get_desc()` if you want raw desc.",
    "detection": "Cleaned detection. Do not use `get_desc()` if you want raw detection paragraph...",
    "is_subtype": false,
    "platforms": [
        "Windows",
        ...
    ]
}
```