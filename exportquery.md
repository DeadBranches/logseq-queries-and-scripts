kit:: runpage exportquery
description:: Runpage kit that exports a parent block as HTML to the clipboard (experimental)

- ```javascript
  logseq.kits.exportquery = exportquery;
  
  async function createHTMLContentWithImages(thisElement) {
    const element = thisElement;
    if (!element || !(element instanceof Element)) {
      return null;
    }
    const htmlContent = element.cloneNode(true);
    
    // We're not modifying image sources, just returning the HTML content as-is
    return htmlContent.outerHTML;
  }
  
  async function exportquery(el) {
    const me = event.target.closest('.ls-block');
    const parentBlock = me.parentElement.closest('.ls-block');
    
    try {
      const htmlContent = await createHTMLContentWithImages(parentBlock);
      
      // Use Electron's clipboard API if available
      if (window.electron && window.electron.clipboard && window.electron.clipboard.writeHTML) {
        window.electron.clipboard.writeHTML(htmlContent);
        console.log('Content copied to clipboard successfully using Electron API');
      } else {
        // Fallback to web API if Electron API is not available
        const blob = new Blob([htmlContent], { type: 'text/html' });
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': blob,
            'text/plain': new Blob([parentBlock.innerText], { type: 'text/plain' })
          })
        ]);
        console.log('Content copied to clipboard successfully using Web API');
      }
    } catch (error) {
      console.error('Failed to copy content to clipboard:', error);
    }
  }
  exportquery();
  ```
	- {{evalparent}}