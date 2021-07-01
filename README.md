# ATTACK-Force-Graph
Generate JSON force-directed/ node graph data from MITRE's ATT&CK framework
- Work-In-Progress: More to come, this script is only a small part of a larger project.

## What?
- Generate JSON force-graph data nodes and links in the MITRE Attack Framework based on your preferences.
- The data JSON data generated is formatted for use with @vasturiano's awesome various force-directed graph projects. (Tested and works on both 2D and 3D versions)
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
- Force-directed graphs are seriously... *cool* :sunglasses: 

## How?
- The script uses @Cyb3rWard0g's ATTACK-Python-Client. Having used MITRE's STIX CTI... just use Roberto's package. 
- Lift requests are network requests and can be time-consuming.

