kit:: runpage exportquery
description:: Runpage kit that exports a parent block as HTML to the clipboard (experimental)

- ```javascript
  logseq.kits.exportquery = exportquery;
  
  async function createHTMLContentWithImages(thisElement, keepOriginal = false) {
    const element = thisElement;
    if (!element || !(element instanceof Element)) {
      return null;
    }
    const htmlContent = element.cloneNode(true);
    
    if (keepOriginal) {
      // Return the original HTML without processing images
      return htmlContent.outerHTML;
    }
    
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
  
  async function exportquery(el, mode = 'process') {
    const me = event.target.closest('.ls-block');
    const parentBlock = me.parentElement.closest('.ls-block');
    
    try {
      let htmlContent;
      let clipboardData;
  
      switch (mode) {
        case 'original':
          htmlContent = await createHTMLContentWithImages(parentBlock, true);
          clipboardData = {
            'text/html': new Blob([htmlContent], { type: 'text/html' })
          };
          break;
        case 'plaintext':
          htmlContent = await createHTMLContentWithImages(parentBlock, true);
          clipboardData = {
            'text/plain': new Blob([htmlContent], { type: 'text/plain' })
          };
          break;
        default: // 'process'
          htmlContent = await createHTMLContentWithImages(parentBlock, false);
          clipboardData = {
            'text/html': new Blob([htmlContent], { type: 'text/html' }),
            'text/plain': new Blob([parentBlock.innerText], { type: 'text/plain' })
          };
      }
  
      // Use Electron's clipboard API if available
      if (window.electron && window.electron.clipboard && window.electron.clipboard.writeHTML) {
        window.electron.clipboard.writeHTML(htmlContent);
        console.log('Content copied to clipboard successfully using Electron API');
      } else {
        // Fallback to web API if Electron API is not available
        await navigator.clipboard.write([
          new ClipboardItem(clipboardData)
        ]);
        console.log('Content copied to clipboard successfully using Web API');
      }
    } catch (error) {
      console.error('Failed to copy content to clipboard:', error);
    }
  }
  exportquery(null)
  ```
	- {{evalparent}}
