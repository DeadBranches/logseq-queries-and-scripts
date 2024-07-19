kit:: kitButton [label], insertListItem, [icon], [classes], [grocery | buy]
description:: Inserts either a grocery or shopping list item under the purchase list container on the same page. Takes one positional argument, either grocery or buy.

- ```javascript
  logseq.kits.insertListItem = insertListItem;
  
  async function insertListItem() {
    const buttonElement = event.target;
    const containerDiv = buttonElement.closest('.ls-block');
    
    // Defaults
    const DEFAULT_BLOCK = "grocery";
    
    // Inputs
    const dataArguments = buttonElement.dataset.arguments;
    
    // Values
    const blockTemplates = {
      grocery: "TODO {{grocery}} ",
      shopping: "TODO {{buy}} ",
      do: "{{do}} ",
      doKitchen: "{{do}} {{kitchen}}",
      doOffice: "{{do}} {{office}} ",
      doBathroom: "{{do}} {{bathroom}} "
    } 
    const insertOptions = {
      before: true,
      sibling: false
    }
  
    // main
    let blockToInsert = dataArguments || DEFAULT_BLOCK;
    const containerId = containerDiv.getAttribute('blockid');
    try {
      const newBlock = await logseq.api.insert_block(
        containerId,
        blockTemplates[blockToInsert],
        insertOptions
      );
    }
    catch (error) {
      console.error(error);
    }
  }
  
  insertListItem();
  
  ```
	- {{evalparent}}
- # Test
	- {{kitButton grocery,insertListItem,'','',grocery}} {{kitButton shopping,insertListItem,'','',shopping}}