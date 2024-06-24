kit:: scheduleDateToday
description:: Replace-macro that when evaluated on a journal page, creates a scheduled-date org-mode tag.

- ```javascript
  logseq.kits.setStatic(function scheduleDateToday(div){
      const blockId = div.closest(".ls-block").getAttribute("blockid");
      const block = logseq.api.get_block(blockId);
      const pageId = block.page.id;
      const page = logseq.api.get_page(pageId);
      const pageIsJournal = page['journal?'];
  
      //console.log(`Info about block.\nIs journal?: ${pageIsJournal}`);
      //console.log(JSON.stringify(block, null, "\t"));
  
      if (!pageIsJournal) { 
        return; 
        //console.log('is not journal'); 
      }
  
      // This date is in the org-mode SCHEDULED format
      const date = new Date();
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
      const year = date.getFullYear();
      const dayOfWeek = date.toLocaleString('en-US', { weekday: 'short' }); 
      const formattedDate = `${year}-${month}-${day} ${dayOfWeek}`;
      
      const content = block.content;
  
      const macroStart = content.indexOf("{{" + div.closest(".macro").dataset.macroName);
      const macroEnd = content.indexOf("}}", macroStart) + 2;
  
      //console.log(`macro start:\n${macroStart}\nmacroEnd: ${macroEnd}\ninnerHTML: ${div.innerHTML}`)
      logseq.api.update_block(blockId, content.slice(0, macroStart) + `SCHEDULED: <${formattedDate}>` + content.slice(macroEnd));
  });
  
  // {{schedule-date-today}}
  // TODO mew
  // {{schedule-date-today}}
  ```
-
-