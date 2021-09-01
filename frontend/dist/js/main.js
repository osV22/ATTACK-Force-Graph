import {
    updateSideBar
} from "./sidebar.js";

// ---------------------------------
// GRAPH 
// ---------------------------------

const defaultData = "entry_ex_groups_tools.json"

const groupNodeColor = "red";
const toolNodeColor = "cyan";
const techniqueNodeColor = "#9157EB";
const defaultNodeColor = "yellow";

const graphElement = document.getElementById("3d-graph");

const Graph = ForceGraph3D({
        extraRenderers: [new THREE.CSS2DRenderer()]
    })
    (graphElement)
    .jsonUrl(defaultData)
    .nodeLabel(node => {
        return node.attributes.name
    })
    .nodeLabel(node => {
        return node.attributes.name
    })
    .nodeColor(node => {
        switch (node.type) {
            case "group":
                return groupNodeColor;
            case "tool":
                return toolNodeColor;
            case "technique":
                return techniqueNodeColor;
            default:
                return defaultNodeColor;
        }
    })
    .linkDirectionalArrowLength(3.5)
    .linkDirectionalArrowRelPos(1)
    .linkCurvature(0.25)
    .onNodeClick(node => {
        // Aim at node from outside it
        const distance = 80;
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

        Graph.cameraPosition({
                x: node.x * distRatio,
                y: node.y * distRatio,
                z: node.z * distRatio
            }, // new position
            node, // lookAt ({ x, y, z })
            3000 // ms transition duration
        );

        updateSideBar(node);
        hideGuide(true);

        // Will be moved later on
        // document.getElementById("affiliation-avatar").src = `assets/icons/states/doc.png`;
    })
    .showNavInfo(false);


// Make Graph Responsive
window.addEventListener("resize", () => {
    Graph.width(innerWidth);
    Graph.height(innerHeight);
});


// ---------------------------------
// GRAPH OPTIONS 
// ---------------------------------

Graph.d3Force("charge").strength(-120);

Graph
    .warmupTicks(0) // Adjust number of iterations to taste
    .cooldownTicks(1000)
    .nodeThreeObject(node => {
        if (node.type === "group") {
            const nodeEl = document.createElement('div');
            nodeEl.textContent = node.attributes.name;
            nodeEl.style.color = "#FF585B";
            nodeEl.style.backgroundColor = "rgba(0, 0, 0, .30)";
            nodeEl.style.padding = "0 10px";
            nodeEl.className = "node-label";
            return new THREE.CSS2DObject(nodeEl);
        } else if (node.type === "tool") {
            const nodeEl = document.createElement('div');
            nodeEl.textContent = node.attributes.name;
            nodeEl.style.color = "cyan";
            nodeEl.className = "node-label";
            return new THREE.CSS2DObject(nodeEl);
        }
        
    })
    .nodeThreeObjectExtend(true)
    // A few feaures that will be added later
    

    // .nodeThreeObject(node => {
    //     const sprite = new SpriteText(node.id);
    //     sprite.material.depthWrite = false; // make sprite background transparent
    //     sprite.color = "#90ff00";
    //     sprite.textHeight = 8;
    //     return sprite;
    // })


// ---------------------------------
// CAMERA 
// ---------------------------------
function resetCamera() {
    Graph.cameraPosition({
        x: 0,
        y: 0,
        z: 500
    })
}

document.getElementById("btn-camera").addEventListener("click", () => {
    resetCamera();
});


// ---------------------------------
// GENERAL 
// ---------------------------------
function changeGraphData(newGraph) {
    Graph.jsonUrl(`${newGraph}.json`);
}

function hideFullDataWarning(bool) {
    document.getElementById("warning-box").hidden = bool;
}

function hideGuide(bool) {
    bool === true ? document.getElementById("guide-box").hidden = true : false;
}

function disableLinks(graph, bool) {
    bool === true ? graph.linkVisibility(false) : graph.linkVisibility(true);
}

// ---------------------------------
// DATA INPUT 
// ---------------------------------
function setDataBtnActive(dataButtonId) {
    document.getElementById(dataButtonId).classList.add("active");
}

function setDataBtnInactive(dataButtonId) {
    document.getElementById(dataButtonId).classList.remove("active");
}

function deactivateBtnGroup(btnGroup) {
    if (btnGroup === "mitre") {
        setDataBtnInactive("full-groups");
        setDataBtnInactive("full-group-tools");
        setDataBtnInactive("full-group-tools-teqs");

        hideFullDataWarning(true);
    } else if (btnGroup === "examples") {
        setDataBtnInactive("example-groups");
        setDataBtnInactive("example-group-tools");
        setDataBtnInactive("example-group-tools-teqs");

    }

}

// EXAMPLES
document.getElementById("example-groups").addEventListener("click", () => {
    changeGraphData("data/ex_groups");

    setDataBtnActive("example-groups");
    setDataBtnInactive("example-group-tools");
    setDataBtnInactive("example-group-tools-teqs");

    deactivateBtnGroup("mitre");
});

document.getElementById("example-group-tools").addEventListener("click", () => {
    changeGraphData("data/ex_groups_tools");

    setDataBtnActive("example-groups");
    setDataBtnActive("example-group-tools");
    setDataBtnInactive("example-group-tools-teqs");

    deactivateBtnGroup("mitre");
});

document.getElementById("example-group-tools-teqs").addEventListener("click", () => {
    changeGraphData("data/ex_groups_tools_teqs");

    setDataBtnActive("example-groups");
    setDataBtnActive("example-group-tools");
    setDataBtnActive("example-group-tools-teqs");

    deactivateBtnGroup("mitre");
});

// MITRE
document.getElementById("full-groups").addEventListener("click", () => {
    changeGraphData("data/all_groups");
    setDataBtnActive("full-groups");
    setDataBtnInactive("full-group-tools");
    setDataBtnInactive("full-group-tools-teqs");

    deactivateBtnGroup("examples");
});

document.getElementById("full-group-tools").addEventListener("click", () => {
    changeGraphData("data/all_groups_tools");
    setDataBtnActive("full-groups");
    setDataBtnActive("full-group-tools");
    setDataBtnInactive("full-group-tools-teqs");

    deactivateBtnGroup("examples");
    hideFullDataWarning(false);

});

document.getElementById("full-group-tools-teqs").addEventListener("click", () => {
    changeGraphData("data/all_groups_tools_teqs");

    setDataBtnActive("full-groups");
    setDataBtnActive("full-group-tools");
    setDataBtnActive("full-group-tools-teqs");

    deactivateBtnGroup("examples");
    hideFullDataWarning(false);
});

// Links Visibility
const miterWrapper = document.getElementById('mitre-data-wrapper');

miterWrapper.addEventListener('click', (event) => {
  const isButton = event.target.nodeName === 'BUTTON';
  if (isButton) {
    disableLinks(Graph, true);
  }
})

const examplesWrapper = document.getElementById('examples-data-wrapper');
examplesWrapper.addEventListener('click', (event) => {
    const isButton = event.target.nodeName === 'BUTTON';
    if (isButton) {
        disableLinks(Graph, false);
    }
})