kit:: runpage exportquery
description:: Runpage kit that exports a parent block as HTML to the clipboard (experimental)

- ```javascript
  logseq.kits.exportquery = exportquery;
  
  async function createBlobFromElementWithImages(thisElement) {
    const element = thisElement;
    if (!element || !(element instanceof Element)) {
      return null;
    }
    const htmlContent = element.cloneNode(true);
    const images = htmlContent.querySelectorAll('img');
    for (const img of images) {
      try {
        const response = await fetch(img.src);
        const blob = await response.blob();
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        img.src = dataUrl;
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }
    return htmlContent.outerHTML;
  }
  
  async function exportquery(el) {
    const thisElement = event.target.closest('.ls-block');
    const thisElementId = thisElement.getAttribute("blockid");
    console.log(`thisElementId: ${thisElementId}`);
    
    const parentBlock = thisElement.parentElement.closest('.ls-block');
    
    try {
      const htmlContent = await createBlobFromElementWithImages(parentBlock);
      
      const blob = new Blob([htmlContent], { type: 'text/html' });
      
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': blob,
          'text/plain': new Blob([parentBlock.innerText], { type: 'text/plain' })
        })
      ]);
      
      console.log('Content copied to clipboard successfully');
    } catch (error) {
      console.error('Failed to copy content to clipboard:', error);
    }
  }
  
  exportquery();
  ```