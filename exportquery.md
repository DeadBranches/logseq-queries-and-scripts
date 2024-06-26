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
    
    // Process all images within the cloned content
    const images = htmlContent.querySelectorAll('img');
    for (const img of images) {
      try {
        // Create a temporary container for the image
        const tempContainer = document.createElement('div');
        tempContainer.appendChild(img.cloneNode());
        document.body.appendChild(tempContainer);
        
        // Use html2canvas to capture the image
        const canvas = await html2canvas(tempContainer, {
          logging: false,
          useCORS: true,
          backgroundColor: null
        });
        
        // Convert canvas to data URI
        const dataUri = canvas.toDataURL('image/png');
        
        // Replace original src with data URI
        img.src = dataUri;
        
        // Clean up temporary container
        document.body.removeChild(tempContainer);
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }
    
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