kit:: runpage journalOrganizationBlocks

- ```javascript
  logseq.kits.journalOrganizationBlocks = journalOrganizationBlocks;
  
  async function get_block_content(uuid) {
    let component_uuid = uuid;
    let component_block = await logseq.api.get_block(component_uuid).content;
    // Logseq blocks include an id property if the block has been referenced.
    const regexPattern = /\nid::\s(?:[\d\w]{4,8}-){4}[\d\w]{12}/gm;
    const component = component_block.replace(regexPattern, "");
    return component;
  }
  
  //((66b0ead7-67ee-44fd-a324-bd5dd7602f39))
  async function journalOrganizationBlocks(el) {
      const me = event.target.closest(".ls-block");
    
      /**
     * Container content
     */
    const TEMPLATE_UUID = "66b0edf9-37ba-4756-8421-c60cbd44b334";
    const BATCH_BLOCK_CONTENT = [
      {
        content: `${await get_block_content(TEMPLATE_UUID)}`,
      },
    ];
    
      /**
       * Search for a block containing the logseq macro `macroName`  
       */
      const MACRO_NAME = "journal-container-insertion-point";
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
      
  
    /**
     * Insert block
     */
  
    const INSERTION_IDENTIFIER = "journal-container-insertion-point"  // macro name
    const journalRoot = me.closest(".journal-item.content");
  
    const targetBlockUUID = journalRoot
      .querySelector(`[data-macro-name="${INSERTION_IDENTIFIER}"]`)
      .closest(".ls-block")
      .getAttribute("blockId");
    
      /**
       * Insert batch blocks
       */
  
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
	- {{evalparent}}
