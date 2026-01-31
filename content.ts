import type { PlasmoCSConfig } from "plasmo"

interface TabInfo {
  url: string;
  title: string;
  price: RegExpMatchArray | null;
  schema: object
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

    const jsonTag: HTMLScriptElement | null = document.querySelector('script[type="application/ld+json"]');
    const hasJSONTag = !!jsonTag;
    let schema = {};

    if (hasJSONTag) {
      const jsonRaw = jsonTag.textContent;
      const jsonParsed = JSON.parse(jsonRaw);
      const hasContext = jsonParsed.hasOwnProperty("@context");

      if (hasContext) {
        const regex = /schema\.org/;
        const isSchema = !!jsonParsed["@context"].match(regex);

        if (isSchema) {
          schema = jsonParsed;
        }
      }
    }

    return {
      url,
      title,
      price,
      schema
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