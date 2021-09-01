// ---------------------------------
// INFO BAR - Sidebar 
// ---------------------------------

// General

function nodeColors(regualrColor, disabledColor) {
    document.getElementById("infoSidebar").style.borderLeft = "5px solid " + regualrColor;
    document.getElementById("set-name").style.color = regualrColor;
    document.getElementById("set-type").style.backgroundColor = regualrColor;
    document.getElementById("set-node-title").style.backgroundColor = disabledColor;
    document.getElementById("toggle-info-btn").style.backgroundColor = regualrColor;
}

export function setNodeColor(nodeType) {

    const groupColor = "#FF585B";
    const groupDisabled = "rgba(255, 88, 91, .15)";

    const toolColor = "#4BDFFF";
    const toolDisabled = "rgba(4, 211, 255, .15)";

    const techniqueColor = "#9157EB";
    const techniqueDisabled = "rgba(91, 116, 231, .15)";

    const defaultColor = "#4BFFBE";
    const defaultDisabled = "#2bffbf6b";


    if (nodeType === "group") {
        nodeColors(groupColor, groupDisabled);

    } else if (nodeType === "tool") {
        nodeColors(toolColor, toolDisabled);

    } else if (nodeType === "technique") {
        nodeColors(techniqueColor, techniqueDisabled);

    } else {
        nodeColors(defaultColor, defaultDisabled);
    }
}

function setMitreLink(nodeID, nodeType) {
    if (nodeID) {
        let mitreUrl = ""
        if (nodeID.indexOf(".") > -1) {
            const idToUrl = nodeID.replace(".", "/");
            mitreUrl = `https://attack.mitre.org/${(nodeType != "tool") ? nodeType+"s" : "software"}/${idToUrl}/`;
        } else {
            mitreUrl = `https://attack.mitre.org/${(nodeType != "tool") ? nodeType+"s" : "software"}/${nodeID}/`;
        }
        document.getElementById("set-mitre-link").href = mitreUrl;
        document.getElementById("set-mitre-id").innerHTML = ` | ${nodeID}`;

    } else {
        document.getElementById("set-mitre-link").href = "https://attack.mitre.org/";
        document.getElementById("set-mitre-id").innerHTML = " ATT&CK";

    }

}

export function setNodeName(nodeName) {
    document.getElementById("set-name").innerHTML = nodeName;
}

export function setNodeType(nodeType) {
    document.getElementById("set-type").value = (nodeType != "technique") ? nodeType : "Techn."
}

function setChainPhase(nodeChainPhase) {
    document.getElementById("set-chain-phase").innerHTML = nodeChainPhase;
}


function setDescription(nodeDescription) {
    document.getElementById("set-description").innerHTML = nodeDescription;
}

// NODE SPECIFIC 
function setDetection(nodeDeteciton) {
    document.getElementById("set-detection").innerHTML = nodeDeteciton;
}


function setAliases(nodeAliases) {
    if (nodeAliases) {
        const aliases = nodeAliases;
        const aliasesList = document.getElementById("set-aliases");
        aliasesList.innerHTML = "";
        aliases.forEach(alias => {
            const li = document.createElement("li");
            li.innerHTML = alias;
            aliasesList.appendChild(li);
        });
    }
}


function setPlatformsTargeted(nodePlatforms) {
    if (nodePlatforms) {
        const platforms = nodePlatforms;
        const platformsList = document.getElementById("set-platforms-targeted");
        platformsList.innerHTML = "";
        platforms.forEach(platform => {
            const li = document.createElement("li");
            li.innerHTML = platform;
            platformsList.appendChild(li);
        });
    }

}


function setGroupTools(groupTools) {
    if (groupTools) {
        const toolsDiv = document.getElementById("set-group-tools");
        toolsDiv.innerHTML = "";
        for (const tool in groupTools) {
            const li = document.createElement("li");
            li.innerHTML = groupTools[tool];
            toolsDiv.appendChild(li);
        }
    }
}


function setGroupTechniques(groupTechniques) {
    if (groupTechniques) {
        const technqiuesList = document.getElementById("set-group-techniques");
        technqiuesList.innerHTML = "";
        for (const teq in groupTechniques) {
            const li = document.createElement("li");
            li.innerHTML = groupTechniques[teq];
            technqiuesList.appendChild(li);
        }
    }
}


function setToolTechniques(toolTechniques) {
    if (toolTechniques) {
        const techniquesList = document.getElementById("set-tool-techniques");
        techniquesList.innerHTML = "";
        for (const teq in toolTechniques) {
            const li = document.createElement("li");
            li.innerHTML = toolTechniques[teq];
            techniquesList.appendChild(li);
        }
    }
}


function setQuickStats(node, nodeType) {
    if (nodeType === "group") {
        const toolCount = document.getElementById("tools-count");
        const techniqueCount = document.getElementById("technique-count");

        const nodeToolCount = Object.keys(node.attributes.tools).length;
        toolCount.innerHTML = nodeToolCount;

        const nodeTechniqueCount = Object.keys(node.attributes.techniques).length;
        techniqueCount.innerHTML = nodeTechniqueCount;
    }

}


function showInfoSection(sectionID) {
    document.getElementById(`${sectionID}`).hidden = false;
}

function hideInfoSection(sectionID) {
    document.getElementById(`${sectionID}`).hidden = true;
}


function isValid(obj) {
    if (obj && ((obj.length > 0) || (Object.keys(obj).length > 0))) {
        return true
    }
    return false
}

function showGroupSpecifics(node) {
    if (node.type === "group") {
        setQuickStats(node, "group");
        showInfoSection("group-quick-stats-box");

        // GROUP TOOLS
        if (isValid(node.attributes.tools)) {
            showInfoSection("group-tools-box");
            setGroupTools(node.attributes.tools);
        } 
        // GROUP TECHNIQUES
        if (isValid(node.attributes.techniques)) {
            showInfoSection("group-techniques-box");
            setGroupTechniques(node.attributes.techniques);
        } 
    } else {
        hideInfoSection("group-quick-stats-box");
        hideInfoSection("group-tools-box");
        hideInfoSection("group-techniques-box");
    }
}

function showToolSpecifics(node) {
    if (node.type === "tool") {
        // TOOL TECHNIQUES
        if (isValid(node.attributes.techniques)) {
            showInfoSection("tool-techniques-box");
            setToolTechniques(node.attributes.techniques);
        } 
        // PLATFORMS
        if (isValid(node.attributes.platforms)) {
            showInfoSection("platforms-targeted-box");
            setPlatformsTargeted(node.attributes.platforms);
        }
    } else {
        hideInfoSection("tool-techniques-box");
        hideInfoSection("platforms-targeted-box"); 
    }
}

function showTechniqueSpecifics(node) {
    if (node.type == "technique") {
        // CHAIN PHASE
        if (isValid(node.attributes.chain_phase)) {
            showInfoSection("chain-phase-box");
            setChainPhase(node.attributes.chain_phase);
        } 
        // DETECTION 
        if (isValid(node.attributes.detection)) {
            showInfoSection("detection-box");
            setDetection(node.attributes.detection);
        } 
    } else {
        hideInfoSection("chain-phase-box");
        hideInfoSection("detection-box");
    }
}

export function updateSideBar(node) {
    if (node) {
        setMitreLink(node.id, node.type);
        setNodeName(node.attributes.name);
        setNodeColor(node.type);
        setNodeType(node.type);
    
        // ALIASES
        if (isValid(node.attributes.aliases)) {
            showInfoSection("aliases-box");
            setAliases(node.attributes.aliases);
        } else {
            hideInfoSection("aliases-box");
        }
    
        // DESCRIPTION
        if (isValid(node.attributes.description)) {
            showInfoSection("description-box");
            setDescription(node.attributes.description);
        }
    
        showGroupSpecifics(node);
        showToolSpecifics(node);
        showTechniqueSpecifics(node);

        hideInfoSection("about-what-box");
        hideInfoSection("about-why-box");
        hideInfoSection("about-credits-box");


    } else {
        setMitreLink();

        hideInfoSection("description-box");
        hideInfoSection("aliases-box");
        hideInfoSection("chain-phase-box");
        hideInfoSection("detection-box");
        hideInfoSection("platforms-targeted-box");
        hideInfoSection("group-quick-stats-box");
        hideInfoSection("group-tools-box");
        hideInfoSection("group-techniques-box");
        hideInfoSection("tool-techniques-box");

        showInfoSection("about-what-box")
        showInfoSection("about-why-box")
        showInfoSection("about-credits-box")
    }

    openSidebar();
}