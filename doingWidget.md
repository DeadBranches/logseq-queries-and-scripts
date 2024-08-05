kit:: kitbutton doingWidget
description:: Adds a doing block set to the page if one doesn't already exist

- ```javascript
  logseq.kits.doingWidget = doingWidget;
  
  async function someFunctionality(positionalArg, defaultArgument = false) {
    const returnValue = ! keywordArgument;
    return returnValue;
  }
  
  async function doingWidget(el, mode = 'process') {
    const me = event.target.closest('.ls-block');
    const parentBlockId = me.parentElement.closest('.ls-block').getAttribute("blockId");
  
    // Location in graph of doing container
    const MACRO_NAME = "doing-holder";
    const COMPONENT_UUID = "66aaac57-179b-457a-8b06-3814ddbaa12b";
    const BATCH_BLOCK_CONTENT = [ { 
        content: `${await get_block_content(COMPONENT_UUID)}`
    } ];
  
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
  doingWidget(null, 'plaintext')
  ```
- # UI Elements
  {{i ec9e}} *[[logseq-journal-buddy-improvement-2024.6]]* *(live embed)*
	- {{embed ((668d8204-e490-4d23-8d14-1c8f167c9edb))}}