kit:: kitButton [label], insertListItem, [icon], [classes], [grocery | buy]
description:: Inserts either a grocery or shopping list item under the purchase list container on the same page. Takes one positional argument, either grocery or buy.
created-on:: [[Thursday, Aug 15th, 2024]]
-icon:: f2da

- ```javascript
  logseq.kits.insertListItem = insertListItem;
  
  async function insertListItem() {
    const buttonElement = event.target;
    const containerDiv = buttonElement.closest(".ls-block");
    const containerId = containerDiv.getAttribute("blockid");
  
    // Defaults
    const DEFAULT_BLOCK = "grocery";
    // Inputs
    const templateChoice = buttonElement.dataset.template;
    const positionChoice = buttonElement.dataset.insert;
  
    // Default to inserting at start if no value provided
    const positionValue = ((position = positionChoice) => {
      if (position == "end") return position;
      return "start";
    })();
    const isPositionBefore = ((position = positionValue) => {
      if (position == "end") return false;
      return true;
    })();
  
    // Values
    const whitespace = "\u{0020}";
    const blockTemplates = {
      grocery: `TODO {{grocery}}${whitespace}`,
      shopping: "TODO {{buy}} ",
      do: "{{do}} ",
      doKitchen: `{{do}} {{i-kitchen}} ${whitespace}`,
      doOffice: `{{do}} {{i-office}} ${whitespace}`,
      doBathroom: `{{do}} {{i-bathroom}} ${whitespace}`,
    };
  
    const insertOptions = ((positionBoolean = isPositionBefore) => {
      return {
          before: positionBoolean,
          focus: true,
          sibling: false,
      };
    })();
  
    // main
  
    let blockToInsert = templateChoice || DEFAULT_BLOCK;
    const insertTargetId = containerId;
  
    try {
      // A collapsed logseq block doesn't automatically
      // un-collapse when a new child block is added.
      await logseq.api.set_block_collapsed(containerId, false);
      const newBlock = await logseq.api.insert_block(
        insertTargetId,
        blockTemplates[blockToInsert],
        insertOptions
      );
    } catch (error) {
      console.error(error);
    }
  }
  
  insertListItem();
  
  ```
	- {{evalparent}}
		-
		-
		-
		-
- # Test
	- {{kitButton grocery,insertListItem,'','',grocery}} {{kitButton shopping,insertListItem,'','',shopping}}
- # Change log
	- ((66a00f2b-ac1b-4b4d-81c5-d2403cca2463))
	-
