kit:: runpage journalGroceryWidget
description:: (depreciated). invoke from a button press to add a new grocery item to the current journal page.
created-on:: [[Sunday, Jun 30th, 2024]] 
depreciated?:: [[Friday, Aug 9th, 2024]]

- ### {{i f6ef}}  depreciation warning
      this block is no longer in use.
      -> see [[purchaseHolderComponent]]
	- {{i ea0b}} *depreciated on* *[[Tuesday, Jul 23rd, 2024]]*
- ```javascript
  logseq.kits.journalGroceryWidget = journalGroceryWidget;
  
  async function get_block_content(uuid) {
    let component_uuid = uuid
    let component_block = logseq.api.get_block(component_uuid).content;
    // Logseq blocks include an id property if the block has been referenced.
    const regexPattern = /\nid::\s(?:[\d\w]{4,8}-){4}[\d\w]{12}/gm;
    const component = component_block.replace(regexPattern, '');
    return component
  }
  
  async function journalGroceryWidget(el, mode = 'process') {
    const me = event.target.closest('.ls-block');
    const parentBlockId = me.parentElement.closest('.ls-block').getAttribute("blockId");
  
    const MACRO_NAME = "purchase-holder";
    const COMPONENT_UUID = "66913332-10d5-4554-a4ea-70380475cd0d";
    const BATCH_BLOCK_CONTENT = [
      { 
        content: "{{kitButton purchase list,collapseBlock,ef49,-button-style full-width bold}}\n{{kitButton '',insertListItem,eb0b eb25,squat,grocery}}   {{kitButton '',insertListItem,eb0b f21c,squat,shopping}}\n {{purchase-holder}}"
  }
    ];
  
      /**
       * Return the UUID of:
       * - the first block on the page
       * - that has the macro `${macroName}`
       * - on the same page containing the element that triggered this function
       */
      const eventSource = event.target.closest('.ls-block');
      if (!eventSource || !(eventSource instanceof Element)) {
          return null;
      }
      const eventSourceUUID = eventSource.getAttribute("blockid");
      const eventSourceBlockData = await logseq.api.get_block(eventSourceUUID);
      const eventSourcePageId = eventSourceBlockData.page.id;
      const eventSourcePageData = await logseq.api.get_page(eventSourcePageId);
      
      const blocksContainingMacroQuery = `
          [:find (pull ?b [*])
          :where
          [?p :block/name "${eventSourcePageData.name}"]
          [?b :block/page ?p]
          
          [?b :block/macros ?m]
          [?m :block/properties ?props]
          [(get ?props :logseq.macro-name) ?macros]
          [(= ?macros "${MACRO_NAME}")]
          ]`;
      const blocksContainingMacro = await logseq.api.datascript_query(blocksContainingMacroQuery)?.flat();
      if (!blocksContainingMacro[0]) {
          console.log(`Searched for blocks containing the macro {{${MACRO_NAME}}} but none were found.`);
  
          /**
           * Insert block
           */
          const targetBlockUUID = parentBlockId;
          const options = {
            sibling: true
          };
          try {
              const insertedBlocks = await logseq.api.insert_batch_block(
                  targetBlockUUID,
                  BATCH_BLOCK_CONTENT,
                  options
              );
  
            await new Promise(resolve => setTimeout(resolve, 400));
            await logseq.api.exit_editing_mode();
          
          console.log("Exited editing mode successfully");
          } catch (error) {
              console.log(`Inserting blocks via \`insert_batch_block()\` failed.\ntargetBlockUUID: ${targetBlockUUID}\n${error}`);
              return null;
          }
  
          return null;
      }
      //const firstBlockWithMacroUUID = blocksContainingMacro[0].uuid
  
  
  
  }
  journalGroceryWidget(null, 'plaintext')
  ```
	- {{evalparent}}
- {{kitButton purchase list,collapseBlock,ef49,-button-style full-width bold}}
  {{kitButton '',insertListItem,eb0b eb25,squat,grocery}}   {{kitButton '',insertListItem,eb0b f21c,squat,shopping}} {{grocery-holder}}
- {{kitButton purchase list,collapseBlock,ef49,full-width-secret}}
  {{kitButton '',insertListItem,eb0b eb25}} {{kitButton '',insertListItem,eb0b f21c}}
  {grocery-holder}}
- # Changes
- [[Tuesday, Jul 23rd, 2024]] **DEPRECIATION**. This kit is now depreciated in favour of [[purchaseHolderComponent]], which is simply a rename of this macro. This macro still exists to maintain backwards compatability
- [[Tuesday, Jul 23rd, 2024]] **BREAKING**: changed grocery-holder macro to purchase-holder.
