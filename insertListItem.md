kit:: kitButton insertListItem

- ```javascript
  logseq.kits.insertListItem = insertListItem;
  
  async function insertListItem(el) {
    const me = event.target.closest('.ls-block');
    const leicon = event.target.dataset.buttonIcon
    
    
    const blockId = me.closest(".ls-block").getAttribute("blockid");
    const block = logseq.api.get_block(blockId);
    //const BLOCK_CONTENT = "TEST";
    let BLOCK_CONTENT;
    if (leicon == " ") {
      BLOCK_CONTENT = "TODO {{grocery}} ";
    } else if (leicon == " ") {
      BLOCK_CONTENT = "TODO {{buy}} ";
    } else {
      BLOCK_CONTENT = leicon;
    }
  
    //const BLOCK_CONTENT = leicon;
          //`<code>${event.target.outerHTML}</code>`;
    
    const targetBlockUUID = blockId;
      const options = {
        sibling: true
      };
   try {
    const insertedBlocks = await logseq.api.insert_block(
              targetBlockUUID,
              BLOCK_CONTENT);
    await new Promise(resolve => setTimeout(resolve, 400));
    await logseq.api.exit_editing_mode();
       
      console.log("Exited editing mode successfully");
        return "success";
      } catch (error) {
          return error;
      }
  }
  
  insertListItem(null);
  
  ```
	- {{evalparent}}
		- TEST
		- TEST
		- <button data-kit="evalparent" class="kit eval" data-kit-status="handled">► Evaluate code of parent block</button>
		- ► Evaluate code of parent block
		- <code>► Evaluate code of parent block</code>
		- <code><button data-kit="evalparent" class="kit eval" data-kit-status="handled">► Evaluate code of parent block</button></code>
	- TEST