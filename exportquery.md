kit:: runpage exportquery
description:: Runpage kit that exports a parent block as HTML to the clipboard (experimental)
created-on:: [[Sunday, Jun 23rd, 2024]]

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
  
  async function exportquery(el, mode) {
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
  exportquery(null, 'process')
  ```
	- {{evalparent}}
- ## {{ii}} [[Tests]]
	- Example table
	  | item | content |
	  | --- | --- |
	  | 1 | stuff |
		- {{runpage exportquery,export query,'',squat}}
-
- ## {{kitButton issues,collapseBlock,ea06,-button-style full-width small-caps}}
	- {{embed ((66ccdccf-f9e2-4028-b867-a7b5406fd634))}}
- ## {{kitButton ideas, collapseBlock,ea76,-button-style full-width small-caps}}
	- {{embed ((66df909d-79a2-4532-917e-94d3bd8b32a8))}}
- ## {{kitButton questions,collapseBlock,ea76,-button-style full-width small-caps}}
	- {{embed ((66df90b1-ccba-494b-94c9-76f3194e0963))}}
-
-