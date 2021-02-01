// Sections
const ticketInfo = document.getElementById("ticketInfo");
const settings = document.getElementById("settings");
const perms = document.getElementById("permissions");

// Settings
const saveUrlButton = document.getElementById("store");
const url = document.getElementById("url");

// Handle JIRA
const ticketNum = document.getElementById("ticket");
const button = document.getElementById("open");

chrome.permissions.contains(
  {
    permissions: ["storage"],
  },
  function (result) {
    if (result) {
      perms.classList.add("hidden");
      // Check and see if we have a URL saved
      chrome.storage.local.get(["url"], function (result) {
        //  alert(JSON.stringify(result, null, 2));
        if (result.url) {
          settings.classList.add("hidden");
          ticketInfo.classList.remove("hidden");
          ticketNum.focus();
        } else {
          settings.classList.remove("hidden");
          ticketInfo.classList.add("hidden");
          url.focus();
        }
      });
    } else {
      // The extension doesn't have the permissions.
      perms.classList.remove("hidden");
      settings.classList.add("hidden");
      ticketInfo.classList.add("hidden");
    }
  }
);

document.getElementById("givePerm").addEventListener("click", function () {
  chrome.permissions.request(
    {
      permissions: ["storage"],
    },
    function (granted) {
      if (granted) {
        perms.classList.add("hidden");
        settings.classList.remove("hidden");
      } else {
        perms.classList.remove("hidden");
        settings.classList.add("hidden");
        ticketInfo.classList.add("hidden");
        alert(
          "This extension requires storage to store your company's JIRA url."
        );
      }
    }
  );
});

saveUrlButton.addEventListener("click", function () {
  chrome.storage.local.set({ url: url.value }, function () {
    ticketInfo.classList.remove("hidden");
    settings.classList.add("hidden");
  });
});

ticketNum.addEventListener("input", function () {
  button.disabled = false;
});

ticketNum.addEventListener("keyup", function (e) {
  if (e.keyCode === 13) {
    openTab();
  }
});

button.addEventListener("click", openTab);

function openTab() {
  const ticket = ticketNum.value;
  chrome.storage.local.get(["url"], function (result) {
    if (result.url) {
      window.open(result.url + ticket);
    } else {
      window.open(url.value + ticket);
    }
  });
}
