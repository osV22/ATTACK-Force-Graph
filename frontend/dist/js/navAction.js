let open = false;

function openSidebar() {
  open = true;
  document.getElementById("infoSidebar").style.width = "28%";  
  document.getElementById("info-toggle-icon").setAttribute("class", "fas fa-chevron-right");
}

function sidebarCalled() {
    if (!open) {
      openSidebar();
      document.getElementById("info-toggle-icon").setAttribute("class", "fas fa-chevron-right");
      document.getElementById("toggle-info-btn").classList.remove("toggle-info-btn-closed");
      document.getElementById("toggle-info-btn").classList.add("toggle-info-btn");
    } else {
      open = false;
      document.getElementById("infoSidebar").style.width = "0%";
      document.getElementById("info-toggle-icon").setAttribute("class", "fas fa-chevron-left");
      document.getElementById("toggle-info-btn").classList.remove("toggle-info-btn");
      document.getElementById("toggle-info-btn").classList.add("toggle-info-btn-closed");
    }
}