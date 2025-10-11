import type { PlasmoCSConfig } from "plasmo"

interface TabInfo {
  url: string;
  title: string;
  price: RegExpMatchArray | null;
}

// Content script to extract H1 tag content from the page
(function () {
  // Function to get H1 content
  function retrieveTabInfo(): TabInfo {
    const url: string = window.location.href;
    const title = document.title;

    const htmlContent = document.body.innerHTML;
    const searchString = /\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?/;
    const price = htmlContent.match(searchString);

    return {
      url,
      title,
      price
    }
  }

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'retrieveTabInfo') {
      const result = retrieveTabInfo();
      sendResponse(result);
    }
  });
})();