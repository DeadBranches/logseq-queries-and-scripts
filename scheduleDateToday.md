kit:: scheduleDateToday collapse[Optional]
description:: A replace-macro that when evaluated on a journal page, creates a scheduled-date org-mode tag. Optionally collapses the containing parent block by passing any value as the first macro argument. E.g. `{{scheduleDateToday collapse}}`
created-on:: [[Sunday, Mar 3rd, 2024]]
-icon:: f2da

- id:: 6682d244-247e-4fa9-9a6e-df88b5f981ab
  ```javascript
  logseq.kits.setStatic(function scheduleDateToday(div){
    const blockId = div.closest(".ls-block").getAttribute("blockid");
    const block = logseq.api.get_block(blockId);
    
    
    // Needed to address the parent block for collapsing feature
    const parentBlockId = block.parent.id;
    const parentBlock =  logseq.api.get_block(parentBlockId);
    const parentBlockUUID = parentBlock.uuid
    //console.log(JSON.stringify(parentBlock));
  	//console.log(parentBlockUuid);
    //return;
    // By evaluating this macro only on journal pages, the macro can 
    // be included in a template elsewhere and included in the daily journal
    // template (from config.edn)
    const pageId = block.page.id;
    const page = logseq.api.get_page(pageId);
    const pageIsJournal = page['journal?'];
    if (!pageIsJournal) { 
      return; 
    }
  
    // The logseq SCHEDULED task feature takes an org-mode specific date
    // format only.
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear();
    const dayOfWeek = date.toLocaleString('en-US', { weekday: 'short' }); 
    const formattedDate = `${year}-${month}-${day} ${dayOfWeek}`;
  
    const content = block.content;
    const macroStart = content.indexOf("{{" + div.closest(".macro").dataset.macroName);
    const macroEnd = content.indexOf("}}", macroStart) + 2;
  
    async function updateAndCollapsePerhaps(options) {
      await logseq.api.update_block(blockId, content.slice(0, macroStart) + `SCHEDULED: <${formattedDate}>` + content.slice(macroEnd));
      if (!options?.collapse) {
        return;
      }
      await logseq.api.set_block_collapsed(parentBlockUUID, "toggle");
    }
    updateAndCollapsePerhaps({ collapse: (div.dataset.collapse != "$1" ? true:false ), parentBlockUUID: parentBlockUUID })
  });
  
  // Usage
  // {{scheduleDateToday}}
  // {{scheduleDateToday collapse}}
  // {{scheduleDateToday anything-here-triggers-collapsing}}
  ```
	- {{evalparent}}
-
