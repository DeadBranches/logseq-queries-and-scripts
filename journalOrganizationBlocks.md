kit:: runpage journalOrganizationBlocks
created-on:: [[Saturday, Jul 6th, 2024]]

- ```javascript
  logseq.kits.journalOrganizationBlocks = journalOrganizationBlocks;
  
  
  async function journalOrganizationBlocks(el) {
    
    /**
     * SOURCE_UUID: uuid
     *  The UUID of the block that contains the content to insert
     * INSERTION_IDENTIFIER: str
     *  The logseq macro name that identifies the relative insertion point of the source
     *  content in the destination page.
     */
    const SOURCE_UUID = "66b0ead7-67ee-44fd-a324-bd5dd7602f39";
    const INSERTION_IDENTIFIER = "journal-container-insertion-point"; // macro name
  
    /**
     * BATCH_INSERT_OPTIONS
     *  Options to pass to logseq api call insert_batch_block
     * STRUCTURE_BLOCK_OPTIONS
     *  Object with options for what to include from the source block.
     *  - parent: boolean
     *      Exclude or include the parent block
     */
    const BATCH_INSERT_OPTIONS = { before: false, sibling: true };
    const STRUCTURE_BLOCK_OPTIONS = { parent: false };
  
  
    /**
     * Return the UUID of:
     * - the first block on the page
     * - that has the macro `${macroName}`
     * - on the same page containing the element that triggered this function
     */
    // const eventSource = event.target.closest(".ls-block");
    // if (!eventSource || !(eventSource instanceof Element)) {
    //   return null;
    // }
    // const eventSourceUUID = eventSource.getAttribute("blockid");
    // const eventSourceBlockData = await logseq.api.get_block(eventSourceUUID);
    // const eventSourcePageId = eventSourceBlockData.page.id;
    // const eventSourcePageData = await logseq.api.get_page(eventSourcePageId);
  
  
    /**
     * Insertion location
     */
    const me = event.target.closest(".ls-block");
    const journalRoot = me.closest(".journal-item.content");
  
    const targetBlockUUID = journalRoot
      .querySelector(`[data-macro-name="${INSERTION_IDENTIFIER}"]`)
      .closest(".ls-block")
      .getAttribute("blockId");
  
  
    /**
     * Insert batch blocks
     *
     * structuredBlockData() works to reformat the results of get_block() into
     *  { content: '' } objects, which is the format insert_batch_block() expects.
     */
    const blockAndChildren = await (async (blockId = SOURCE_UUID) => {
      if (!blockId) {
        throw new Error("Source UUID is required");
      }
  
      const blockData = await logseq.api.get_block(blockId, { includeChildren: true });
      return blockData;
    })();
  
    const structuredBlockData = ((
      blockData = blockAndChildren,
      options = STRUCTURE_BLOCK_OPTIONS
    ) => {
      const formatBlockData = (block) => {
        const formattedBlock = {
          content: block.content,
        };
  
        if (block.children && block.children.length > 0) {
          formattedBlock.children = block.children
            .map((child) => formatBlockData(child));
        }
        return formattedBlock;
      };
  
      if (options.parent) return formatBlockData(blockData);
      if (!options.parent) return formatBlockData(blockData).children;
    })();
  
  
    try {
      const insertedBlocks = await logseq.api.insert_batch_block(
        targetBlockUUID,
        structuredBlockData,
        BATCH_INSERT_OPTIONS
      );
  
      await new Promise((resolve) => setTimeout(resolve, 400));
      await logseq.api.exit_editing_mode();
  
      console.log("Exited editing mode successfully");
    } catch (error) {
      console.log(
        `Inserting blocks via \`insert_batch_block()\` failed.\ntargetBlockUUID: ${targetBlockUUID}\n${error}`
      );
      return null;
    }
  }
  
  journalOrganizationBlocks(null);
  
  ```
	- {{evalparent}}
