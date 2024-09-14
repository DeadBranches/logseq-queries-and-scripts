kit:: infoBox
description:: kitButton hi,infoBox,'','',content='<template name>'

- ```javascript
  logseq.kits.setStatic(function infoBox(div) {
  
  const button = event.target.closest(
    "button[data-kit]");
  
  let infoBox = document.body.querySelector(
    '.info-box-container');
   
  if (button.dataset.reset) {
    try {
      infoBox.remove();
      console.log("hi");
    }
    catch {
      console.log(
        "There is no box.");
    }
  }
  
  //console.log(button.dataset.content);
  const use_template = button.dataset.content;
    
  if (!infoBox) {
   Alpine.store(
    'objectives', {
      objective:
      'This is some objectives',
      goal:
      'this is some objective.'
    }
   );
  
  const html = String.raw;
    
  const infoBoxElement = html`
  <md-dialog class="info-box-container" x-data>
    <div slot="headline">
      Dialog title
    </div>
    
    <form 
      slot="content" 
      id="form-id" 
      method="dialog" 
      x-text="$store.objectives.goal"
    >
      A simple dialog with free-form content.
    </form>
  
    <div slot="actions">
      <md-text-button form="form-id">Ok</md-text-button>
    </div>
    
  </md-dialog>
  `;
    
    document.body
     .insertAdjacentHTML(
      'beforeend', 
      infoBoxElement);
    
    infoBox = document.body
      .querySelector(
       '.info-box-container');
  } else {
    //Alpine.store('infoBox').setTemplate(use_template);
    //Alpine.data('infoBox', 'objectives');
  }
    infoBox.show();
  });
  
  logseq.kits.infoBox();
  ```
	- {{evalparent}}
- {{kitButton reset,infoBox,'','',reset='true' buttons='false'}}
- {{kitButton content,infoBox,'','',content='objective'}} {{kitButton goal,infoBox,'','',content='goal'}}
- hi qwhy sa
	-
-
-
