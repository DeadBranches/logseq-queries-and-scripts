kit:: kitButton purchaseHolderComponent
description:: (formerly journalGroceryWidget). Add a purchase manager to the current journal page.

- ```javascript
  logseq.kits.purchaseHolderComponent = purchaseHolderComponent;
  
  async function get_block_content(uuid) {
    let component_uuid = uuid;
    let component_block = await logseq.api.get_block(component_uuid).content;
    // Logseq blocks include an id property if the block has been referenced.
    const regexPattern = /\nid::\s(?:[\d\w]{4,8}-){4}[\d\w]{12}/gm;
    const component = component_block.replace(regexPattern, "");
    return component;
  }
  
  async function purchaseHolderComponent(el, mode = "process") {
    const me = event.target.closest(".ls-block");
  
    /**
     * Container identification
     */
    const CONTAINER_IDENTIFIER = "purchase-holder";
  
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
    const journal_root = me.closest('.journal-item.content'); 
    const INSERTION_IDENTIFIER = "journal-container-insertion-point"  // macro name
    const journalRoot = me.closest(".journal-item.content");
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
  
    } catch (error) {
      console.log(
        `Inserting blocks via \`insert_batch_block()\` failed.\ntargetBlockUUID: ${targetBlockUUID}\n${error}`
      );
      return null;
    }
  
    return null;
  }
  
  purchaseHolderComponent(null, "plaintext");
  
  
  ```
	- {{evalparent}}
- #### {{kitButton purchase list,collapseBlock,ef49,-button-style full-width +bold-nth-word}}
  {{kitButton '',insertListItem,eb0b eb25,squat,template='shopping'}}   {{kitButton '',insertListItem,eb0b f21c,squat,template='grocery'}}
  {{purchase-holder}}
-
- # UI Elements
  {{i ec9e}} *[[logseq-journal-buddy-improvement-2024.6]]* *(live embed)*
	- {{embed ((668bfa16-f000-4381-80b7-155ed5ebe7f1))}}
- # Changes
	- [[Tuesday, Jul 23rd, 2024]] feat: Use block content from project page. {{i-commit}}[e349a15](https://github.com/DeadBranches/logseq-queries-and-scripts/commits/main/)
		- Added get_block_content(uuid) function to dynamically fetch the block content to insert from a given block uuid.
	- [[Tuesday, Jul 23rd, 2024]] **BREAKING**: Added purchaseHolderComponent and depreciated [[journalGroceryWidget]]
	- [[Tuesday, Jul 23rd, 2024]] **BREAKING**: changed grocery-holder macro to purchase-holder.
	-
