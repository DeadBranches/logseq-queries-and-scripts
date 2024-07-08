kit:: runpage journalGroceryWidget
description:: invoke from a button press to add a new grocery item to the current journal page.

- ```javascript
  logseq.kits.journalGroceryWidget = journalGroceryWidget;
  
  async function someFunctionality(positionalArg, defaultArgument = false) {
    const returnValue = ! keywordArgument;
    return returnValue;
  }
  
  async function journalGroceryWidget(el, mode = 'process') {
    const me = event.target.closest('.ls-block');
    const parentBlockId = me.parentElement.closest('.ls-block').getAttribute("blockId");
  
    const MACRO_NAME = "grocery-holder";
    const BATCH_BLOCK_CONTENT = [
      { content: "{{kitButton purchase list,collapseBlock,ef49,full-width-secret}}\n{{kitButton '',insertListItem,eb0b eb25}} {{kitButton '',insertListItem,eb0b f21c}}\n{{grocery-holder}}" }
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
- {{kitButton purchase list,collapseBlock,ef49,full-width-secret}}
  {{kitButton '',insertListItem,eb0b eb25}} {{kitButton '',insertListItem,eb0b f21c}}
  {grocery-holder}}