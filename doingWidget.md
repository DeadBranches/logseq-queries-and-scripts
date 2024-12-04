kit:: kitbutton doingWidget
description:: Adds a doing block set to the page if one doesn't already exist
created-on:: [[Monday, Aug 5th, 2024]]
-icon:: f2da

- ```javascript
  // doingWidget.js
  // created-on:: [[Monday, Aug 5th, 2024]]
  
  logseq.kits.doingWidget = doingWidget;
  
  async function get_block_content(uuid) {
    let component_uuid = uuid;
    let component_block = await logseq.api.get_block(component_uuid).content;
    // Logseq blocks include an id property if the block has been referenced.
    const regexPattern = /\nid::\s(?:[\d\w]{4,8}-){4}[\d\w]{12}/gm;
    const component = component_block.replace(regexPattern, "");
    return component;
  }
  
  async function doingWidget(el, mode = "process") {
    const me = event.target.closest(".ls-block");
  
    /**
     * Container identification
     */
    const CONTAINER_IDENTIFIER = "doing-holder"; // A macro in the container
  
    /**
     * Container content
     *  get_template() returns an object with this structure:
     *    { uuid: str }
     *  and get_block returns an object with this structure:
     *    { children: [ ['uuid', str] ] }
     *    where the second array item is the uuid
     */
    const SOURCE_TEMPLATE_NAME = "logseq, doing-holder";
    const TEMPLATE_UUID = await (async (templateName = SOURCE_TEMPLATE_NAME) => {
      if (!templateName) throw new Error("Source template name is required");
      const template = await logseq.api.get_template(templateName);
      const templateBlock = await logseq.api.get_block(template.uuid);
      return templateBlock.children[0][1];
    })();
    // const TEMPLATE_UUID = "66aaac57-179b-457a-8b06-3814ddbaa12b"; // doing-container data
    const BATCH_BLOCK_CONTENT = [
      {
        content: `${await get_block_content(TEMPLATE_UUID)}`,
      },
    ];
  
    /**
     * Don't add the container if one already exists on the page. Check for the
     * presence of a specific macro present only in the doing-container block.
     *
     * Return the UUID of:
     * - the first block on the page
     * - that has the macro `${macroName}`
     * - on the same page containing the element that triggered this function
     */
    const eventSource = event.target.closest(".ls-block");
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
          [(= ?macros "${CONTAINER_IDENTIFIER}")]
          ]`;
    const blocksContainingMacro = await logseq.api
      .datascript_query(blocksContainingMacroQuery)
      ?.flat();
  
    if (blocksContainingMacro[0]) return null;
    // There's already a doing-container on the page.
  
    /**
     * Insert block
     */
  
    const INSERTION_IDENTIFIER = "journal-container-insertion-point"  // macro name
    const journalRoot = me.closest(".journal-item.content");
    // const blockWithMacro = journalRoot.querySelector(`[data-macro-name="${INSERTION_IDENTIFIER}"]`);
    // console.log(journalRoot);
    // console.log(blockWithMacro);
  
    const targetBlockUUID = journalRoot
      .querySelector(`[data-macro-name="${INSERTION_IDENTIFIER}"]`)
      .closest(".ls-block")
      .getAttribute("blockId");
  
  
    try {
      const insertedBlocks = await logseq.api.insert_batch_block(
        targetBlockUUID,
        BATCH_BLOCK_CONTENT,
        {before: false, sibling: true}
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
  
    return null;
  }
  //const firstBlockWithMacroUUID = blocksContainingMacro[0].uuid
  
  doingWidget(null, "plaintext");
  
  ```
	- {{evalparent}}
- # UI Elements
  {{i ec9e}} *[[:logseq-journal-buddy-improvement-2024.6]]* *(live embed)*
	- {{embed ((668d8204-e490-4d23-8d14-1c8f167c9edb))}}
-
