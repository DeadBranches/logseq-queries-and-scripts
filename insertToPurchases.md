kit:: insertToPurchases

- ```javascript
  /**
   * @file insertToPurchases.md
   * @summary A logseq kit that inserts a block to today's purchase holder container. If the container is not yet present, the purchase holder container is added.
   *
   * @requires logseq {@link https://github.com/logseq/logseq}
   * @requires {@link https://discuss.logseq.com/t/edit-and-run-javascript-code-inside-logseq-itself/20763 Logseq Kits}
   * @requires {@link https://github.com/DeadBranches/logseq-queries-and-scripts/blob/main/kitButton.md kitButton}
   *
   * @function insertToPurchases
   * @param {HTMLElement} el - The div element triggering this script
   *
   * @usage This script should be invoked via the {{kitButton}} macro.
   * This macro should include parameters to specify the type of content to insert ('grocery' or 'shopping') and whether to focus the editor after insertion. The `focus` parameter is optional and defaults to `false`. If any value for `focus` is provided, it is treated as `true`.
   *
   * Expected syntax for the {{kitButton}} macro:
   * - `template='grocery'` (inserts a grocery block, no focus)
   * - `template='shopping'` (inserts a shopping block, no focus)
   * - `template='grocery' focus='true'` (inserts a grocery block and focuses the editor)
   * - `template='shopping' focus='true'` (inserts a shopping block and focuses the editor)
   *
   * @example In a logseq block add the following kitButton macro:
   * {{kitButton add and edit,insertToPurchases,eb0b eb25,squat dark-gray gray-border,template='shopping' focus='true'}}
   *
   * {{kitButton add,insertToPurchases,eb0b eb25,squat dark-gray gray-border,template='shopping'}}
   *
   * @note
   * 1. Create a page named "insertToPurchases" in your Logseq graph.
   * 2. Add this entire script within a JavaScript markdown code block on that page.
   * 3. No specific macro needs to be added to the Logseq config.edn file for this script.
   *
   * @author DeadBranch
   * @version 1.0.0
   * @date October 3, 2024
   */
  
  /**
   * @function getTemplateContent
   * @description Retrieves the content of a specified template. This function is used to fetch a template by name and then applies a function to get the desired content.
   *
   * The composition of this function allows flexibility, as it separates fetching the template metadata from extracting the content, enabling more reusable and modular code.
   *
   * @param {string} templateName - The name of the template to retrieve from Logseq.
   * @param {function} getContentFunction - A callback function that takes the template as input and returns the specific content. This function is typically used to extract the child blocks or process the template as needed.
   * @returns {Promise<string>} A promise that resolves with the content of the requested template.
   */
  const getTemplateContent = async (templateName, getContentFunction) => {
    if (!templateName) throw new Error("Source template name is required");
  
    const template = await logseq.api.get_template(templateName);
    const templateContent = await getContentFunction(template);
    return templateContent;
  };
  
  /**
   * @function getBlockChildContent
   * @description Retrieves the content of a specific child block given its parent block and the index of the child.
   *
   * This function is used to navigate Logseq's block hierarchy by obtaining the child block content based on a parent block. By making this function reusable, it can be used across different areas of the code where child content extraction is required.
   *
   * @param {object} block - The parent block object that contains child blocks.
   * @param {number} childIndex - The index of the child block whose content needs to be fetched.
   * @returns {Promise<string>} A promise that resolves with the content of the specified child block.
   */
  const getBlockChildContent = async (block, childIndex) => {
    if (!block) throw new Error("block is required");
  
    const blockUUID = block.uuid;
    const blockAndChildren = await logseq.api.get_block(blockUUID, {
      includeChildren: true,
    });
    return blockAndChildren.children[childIndex].content;
  };
  
  logseq.kits.insertToPurchases = insertToPurchases;
  /**
   * Main function to insert a new block into today's purchase holder container.
   * @function insertToPurchases
   * @async
   * @description This function inserts a block into the purchase holder container of today's journal page in Logseq. If the purchase holder container is not yet present, it creates one.
   *
   * The function is composed of two main parts: locating or adding the purchase holder, and inserting a new block based on the provided template. The composition enables modularity and readability, with the holder creation logic abstracted into a separate async function.
   *
   * @param {Element} el - The DOM element that triggered the function.
   * @returns {Promise<void>} A promise that resolves when the block has been successfully inserted.
   * @note This function is part of the Logseq automation workflow and is invoked through a kitButton macro to allow quick additions to a daily purchase tracker.
   *
   * @constant {string} INSERTION_IDENTIFIER - A logseq macro name identifying a sister target for the journal container
   * @constant {string} PURCHASE_HOLDER_IDENTIFIER - A logseq macro name accompanying the purchase holder container. Assists in identifying the presense or lack there of the purchase holder.
   * @constant {string} PURCHASE_HOLDER_TEMPLATE - The :template block name containing the purchase holder (as a child block) in the logseq graph.
   */
  async function insertToPurchases(el) {
    const INSERTION_IDENTIFIER = "journal-container-insertion-point";
    const PURCHASE_HOLDER_IDENTIFIER = "purchase-holder";
    const PURCHASE_HOLDER_TEMPLATE = "logseq, purchase-holder";
  
    const element = event.target;
    const me = event.target.closest(".ls-block");
    const journalRoot = me.closest(".journal-item.content");
  
    /**
     * Purchase holder container logic
     */
    let holderElement = journalRoot.querySelector(
      `[data-macro-name="${PURCHASE_HOLDER_IDENTIFIER}"]`
    );
    let holderBlockUUID;
  
    holderBlockUUID = await (async (
      element = holderElement,
      todaysJournal = journalRoot,
      purchaseHolderInsertionPoint = INSERTION_IDENTIFIER,
      holderTemplateName = PURCHASE_HOLDER_TEMPLATE,
      templateGetter = getTemplateContent,
      contentGetter = getBlockChildContent
    ) => {
      if (element) {
        console.info("Using existing purchase holder UUID.");
        return element.closest(".ls-block").getAttribute("blockId");
      }
  
      console.info("A purchase holder will be added to today's journal.");
  
      const insertionLocation = todaysJournal
        .querySelector(`[data-macro-name="${purchaseHolderInsertionPoint}"]`)
        .closest(".ls-block");
      if (!insertionLocation) {
        throw new Error(
          `Purchase holder could not be found, and holder insertion point was missing.\n 
          Could not find block with macro {{${purchaseHolderInsertionPoint}}}.`
        );
      }
      const insertionLocationUUID = insertionLocation.getAttribute("blockId");
  
      const holderTemplateBlock = await templateGetter(holderTemplateName, contentGetter);
      const insertionResults = await logseq.api.insert_block(
        insertionLocationUUID,
        holderTemplateBlock,
        {
          before: false,
          focus: false,
          sibling: true,
        }
      );
      if (insertionResults) {
        console.info("Purchase holder added successfully.");
        return insertionResults.uuid;
      }
    })();
  
    const templateType = element.getAttribute("data-template");
  
    // Define the content for the new block based on the template
    const whitespace = "\u{0020}";
    const templates = {
      grocery: `TODO {{grocery}}${whitespace}`,
      shopping: `TODO {{buy}}${whitespace}`,
    };
  
    const content = templates[templateType];
    if (!content) throw new Error(`Invalid template type provided: ${templateType}`);
  
    const focusBoolean = element.hasAttribute("data-focus");
    const focusEditor = focusBoolean ? true : false;
    await logseq.api.insert_block(holderBlockUUID, content, {
      sibling: false,
      focus: focusEditor,
    });
  }
  
  insertToPurchases();
  // Example of a kitButton macro to use this new functionality
  // - You can adjust the 'template' and 'focus' options as needed
  //    {{kitButton 'Add Grocery to Purchases' insertToPurchases '' squat dark-gray gray-border template_type='grocery' focus='true'}}
  //    {{kitButton 'Add Shopping to Purchases' insertToPurchases '' squat dark-gray gray-border template_type='shopping' focus='false'}}
  
  ```
