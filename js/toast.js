// MedSphere Toast Notification System

window.MedSphereToast = {
  show(title, message, type = "success", duration = 4000) {
    let container = document.getElementById("medsphere-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "medsphere-toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    } else {
      container.classList.add("toast-container");
    }

    const toast = document.createElement("div");
    toast.className = `toast-item toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<i class="fa-solid fa-circle-check" style="font-size:18px;"></i>';
    } else if (type === 'info') {
      iconSvg = '<i class="fa-solid fa-circle-info" style="font-size:18px;"></i>';
    } else {
      iconSvg = '<i class="fa-solid fa-circle-exclamation" style="font-size:18px;"></i>';
    }

    toast.innerHTML = `
      <div class="toast-icon">${iconSvg}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Close notification"><i class="fa-solid fa-xmark"></i></button>
    `;

    const closeBtn = toast.querySelector(".toast-close");
    closeBtn.addEventListener("click", () => {
      toast.classList.add("toast-hiding");
      setTimeout(() => toast.remove(), 250);
    });

    container.appendChild(toast);

    // Auto remove
    setTimeout(() => {
      if (toast.parentElement) {
        toast.classList.add("toast-hiding");
        setTimeout(() => toast.remove(), 250);
      }
    }, duration);
  }
};
