kit:: kitButton purchaseHolderComponent
description:: (formerly journalGroceryWidget). Add a purchase manager to the current journal page.
created-on:: [[Monday, Aug 5th, 2024]]

- ```javascript
  /**
   * @file purchaseHolderComponent.md
   * @description 
   * This script provides functionality to insert a "purchase holder" 
   * component into Logseq journal pages. It's designed to streamline the 
   * process of adding structured purchase information to daily logs.
   * The script checks for an existing holder, and if not present, inserts
   * a predefined content templateat a specified location in the journal page.
   * 
   * The component insertion is triggered via a custom Logseq Kits button, 
   * allowing for easy and consistent addition of purchase tracking elements
   * across journal entries.
   * 
   * @requires Logseq Kits (https://discuss.logseq.com/t/edit-and-run-javascript-code-inside-logseq-itself/20763)
   * 
   * @function purchaseHolderComponent
   * @param {Element} el - The DOM element that triggered the function (not used in the current implementation)
   * @param {string} [mode="process"] - The mode of operation (default is "process", currently not utilized)
   * @returns {Promise<null>} - Returns null after execution
   * 
   * @example
   * // Usage in Logseq with kitButton:
   * {{kitButton '',purchaseHolderComponent,eb25 f21c,squat half-long dark-gray gray-border}}
   * 
   * @note
   * 1. Create a page named "purchaseHolderComponent" in your Logseq graph.
   * 2. Add this entire script within a JavaScript markdown code block on that page.
   * 3. No specific macro needs to be added to the Logseq config.edn file for this script.
   * 
   * @constant {string} CONTAINER_IDENTIFIER - Identifies the purchase holder container
   * @constant {string} CONTENT_TEMPLATE_UUID - UUID of the block containing the template content
   * @constant {string} INSERTION_IDENTIFIER - Name of the macro that marks the insertion point
   */
  
  logseq.kits.purchaseHolderComponent = purchaseHolderComponent;
  
  
  /**
   * Retrieves and cleans the content of a specified block.
   * @function get_block_content
   * @async
   * @param {string} uuid - The UUID of the block to retrieve
   * @returns {Promise<string>} The cleaned content of the block
   */
  async function get_block_content(uuid) {
    let component_uuid = uuid;
    let component_block = await logseq.api.get_block(component_uuid).content;
    // Logseq blocks include an id property if the block has been referenced.
    const regexPattern = /\nid::\s(?:[\d\w]{4,8}-){4}[\d\w]{12}/gm;
    const component = component_block.replace(regexPattern, "");
    return component;
  }
  
  
  /**
   * Main function to insert the purchase holder component.
   * @function purchaseHolderComponent
   * @async
   * @param {Element} el - The DOM element that triggered the function (not used)
   * @param {string} [mode="process"] - The mode of operation (not used)
   * @returns {Promise<null>} Resolves to null after execution
   */
  async function purchaseHolderComponent(el, mode = "process") {
    console.log("purchaseHolderComponent kit triggered.");
    const me = event.target.closest(".ls-block");
  
    /**
     * Constants
     */
  
    const CONTAINER_IDENTIFIER = "purchase-holder";
    // insertion content:
    const CONTENT_TEMPLATE_UUID = "66b0edf9-37ba-4756-8421-c60cbd44b334";
    const INSERTION_IDENTIFIER = "journal-container-insertion-point"; // macro name
  
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
    const batch_block_content = [
      { content: `${await get_block_content(CONTENT_TEMPLATE_UUID)}` },
    ];
    const journalRoot = me.closest(".journal-item.content");
    const targetBlockUUID = journalRoot
      .querySelector(`[data-macro-name="${INSERTION_IDENTIFIER}"]`)
      .closest(".ls-block")
      .getAttribute("blockId");
  
    try {
      const insertedBlocks = await logseq.api.insert_batch_block(
        targetBlockUUID,
        batch_block_content,
        { before: false, sibling: true }
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
  
  purchaseHolderComponent(null);
  
  ```
	- {{evalparent}}
-
- {{kitButton '',purchaseHolderComponent,eb25 f21c,squat half-long dark-gray gray-border}}
- insertion
	- {{journal-container-insertion-point}}
-
- # UI Elements
  {{i ec9e}} *[[:logseq-journal-buddy-improvement-2024.6]]* *(live embed)*
	- {{embed ((668bfa16-f000-4381-80b7-155ed5ebe7f1))}}
- # Changes
	- [[Tuesday, Jul 23rd, 2024]] feat: Use block content from project page. {{i-commit}}[e349a15](https://github.com/DeadBranches/logseq-queries-and-scripts/commits/main/)
		- Added get_block_content(uuid) function to dynamically fetch the block content to insert from a given block uuid.
	- [[Tuesday, Jul 23rd, 2024]] **BREAKING**: Added purchaseHolderComponent and depreciated [[journalGroceryWidget]]
	- [[Tuesday, Jul 23rd, 2024]] **BREAKING**: changed grocery-holder macro to purchase-holder.
	-
