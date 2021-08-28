import { setNodeColor, setNodeType, setNodeName, updateSideBar } from './sidebar.js';

document.getElementById("btn-about").addEventListener("click", () => {
    setNodeColor("default");

    // change node type text
    setNodeType("about");
    setNodeName("About This Awesome Sauce");

    updateSideBar();
});

