- get google profile info
  name
  email
  picture

- Update extension icon
- Add styles 
- fade out loading spinner
- brief loading state then save data for that page to local storage
  - if page is saved to list, prevent re-adding to site

- on successful save to wishlist
  - success message
  - link to list


- List UI
  - title and url are not editable at first, click to edit

- Getting price:
  - check if schema data exists and if there is a price

  example code:

  ```
  function getJsonLdSchema() {
  const schemaData = [];
  const scriptTags = document.querySelectorAll('script[type="application/ld+json"]');

  scriptTags.forEach(script => {
    try {
      const data = JSON.parse(script.textContent);
      schemaData.push(data);
    } catch (e) {
      console.error("Error parsing JSON-LD script:", e);
    }
  });
  return schemaData;
}

const allSchema = getJsonLdSchema();
```

- animation idea - numbers counting up like an old alarm clock with a nice bouncing ease at the end.


title and price ui:
 - on click
  - enter edit mode
  - on change event to update list item name state
- on enter key:
  - exit edit mode
  - update the height of the text area element to match the new text value
