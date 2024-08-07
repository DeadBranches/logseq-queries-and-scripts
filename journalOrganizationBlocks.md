kit:: runpage journalOrganizationBlocks

- ```javascript
  logseq.kits.journalOrganizationBlocks = journalOrganizationBlocks;
  
  async function journalOrganizationBlocks(el) {
      /**
       * Search for a block containing the logseq macro `macroName`  
       */
      const MACRO_NAME = "journalBuddy";
      const BATCH_BLOCK_CONTENT = [
        { content: "### {{h-admin}} [[admin]]\n((662e6daa-e7f1-489f-a8ae-d40add917aa1))" },
        { content: "### {{h-resources}} [[resources]]\n((662e6757-a3ce-4379-9519-52d6b6133dfb))" },
        { content: "### {{h-research}} [[research]]\n((662e691a-f289-4178-8828-d8d624de58c5))" },
        { content: "### {{h-thoughts}} [[thoughts]]\n((662e68bb-da7d-4c47-a248-71f8c4554969))" },
        { content: "### {{h-notes}} [[notes]]\n((662e67a8-8e34-4a89-b3f9-7d4fa65a47f7))" },
        { content: "### {{h-writings}} [[writings]]\n((662e696b-3d43-4201-acf5-76879c81cdc6))" },
        { content: "### {{h-code}} [[code]]\n((66841c96-4f60-4f38-9511-29506db47192))" }
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
          console.log(`Searched for blocks containing the macro {{${MACRO_NAME}}} but none were found.`)
          return null;
      }
      const firstBlockWithMacroUUID = blocksContainingMacro[0].uuid
  
  
      /**
       * Insert batch blocks
       */
      const targetBlockUUID = firstBlockWithMacroUUID;
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
  }
  
  journalOrganizationBlocks(null);
  ```
