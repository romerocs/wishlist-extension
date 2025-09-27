import type { PlasmoCSConfig } from "plasmo"


// Content script to extract H1 tag content from the page
(function () {
  // Function to get H1 content
  function contentScriptTest() {
    const h1: HTMLHeadingElement | null = document.querySelector('h1');

    return h1 ? h1.innerText : 'No H1 tag found';
  }

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'contentScriptTest') {
      const result = contentScriptTest();
      sendResponse(result);
    }
  });
})();