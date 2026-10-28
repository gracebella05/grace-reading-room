"use strict";

(() => {
  // Fill these three fields when Grace supplies the real contact details.
  const contacts = {
    wechatGroupQr: "",
    personalWechatId: "",
    whatsappNumber: ""
  };

  const menuButton = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#main-nav");
  const navGroups = [...document.querySelectorAll(".nav-group")];
  const setGroup = (group, opened) => {
    group.classList.toggle("open", opened);
    group.querySelector(".nav-group-toggle").setAttribute("aria-expanded", String(opened));
  };
  const closeGroups = (except = null) => {
    navGroups.forEach((group) => {
      if (group !== except) setGroup(group, false);
    });
  };
  const closeMenu = () => {
    if (!menu || !menuButton) return;
    menu.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "打开导航");
    closeGroups();
  };

  menuButton?.addEventListener("click", () => {
    const opened = menu.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(opened));
    menuButton.setAttribute("aria-label", opened ? "关闭导航" : "打开导航");
    if (!opened) closeGroups();
  });
  navGroups.forEach((group) => {
    const button = group.querySelector(".nav-group-toggle");
    button.addEventListener("click", () => {
      const opened = button.getAttribute("aria-expanded") !== "true";
      closeGroups(group);
      setGroup(group, opened);
    });
    group.addEventListener("focusout", (event) => {
      if (!group.contains(event.relatedTarget)) setGroup(group, false);
    });
  });
  menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("click", (event) => {
    if (menu && !menu.contains(event.target)) closeGroups();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const openedGroup = navGroups.find((group) => group.classList.contains("open"));
    if (openedGroup) {
      closeGroups();
      openedGroup.querySelector(".nav-group-toggle").focus();
    } else if (menu?.classList.contains("open")) {
      closeMenu();
      menuButton.focus();
    }
  });

  const groupTarget = document.querySelector("#group-action");
  if (contacts.wechatGroupQr.trim() && groupTarget) {
    const label = document.createElement("span");
    label.className = "contact-qr-label";
    label.textContent = "扫码申请入群";
    const qr = document.createElement("img");
    qr.className = "contact-qr";
    qr.src = contacts.wechatGroupQr.trim();
    qr.alt = "申请加入长在日常微信群的二维码";
    qr.loading = "lazy";
    groupTarget.replaceChildren(label, qr);
  }

  const wechatTarget = document.querySelector("#wechat-action");
  if (contacts.personalWechatId.trim() && wechatTarget) {
    const id = contacts.personalWechatId.trim();
    const detail = document.createElement("div");
    detail.className = "contact-detail";
    detail.textContent = `微信号：${id}`;
    const copy = document.createElement("button");
    copy.className = "copy-button";
    copy.type = "button";
    copy.textContent = "复制微信号 ↗";
    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(id);
        copy.textContent = "已复制微信号 ✓";
      } catch {
        copy.textContent = "请长按上方微信号复制";
      }
    });
    wechatTarget.replaceChildren(detail, copy);
  }

  const whatsapp = contacts.whatsappNumber.replace(/\D/g, "");
  const whatsappTarget = document.querySelector("#whatsapp-action");
  if (whatsapp && whatsappTarget) {
    const link = document.createElement("a");
    link.className = "contact-link";
    link.href = `https://wa.me/${whatsapp}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "打开 WhatsApp 对话 ↗";
    whatsappTarget.replaceChildren(link);
  }

  const year = document.querySelector("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
