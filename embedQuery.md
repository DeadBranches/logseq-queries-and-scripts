kit:: embedQuery
created-on:: [[Tuesday, Sep 10th, 2024]]

- ```javascript
  logseq.kits.setStatic(function embedQuery(div){
  const blockId = div.closest(".ls-block").getAttribute("blockid");
  const block = logseq.api.get_block(blockId);
  const content = block.content;
  const macroStart = content.indexOf("{{" + div.closest(".macro").dataset.macroName);
  const macroEnd = content.indexOf("}}", macroStart) + 2;
  
  const html = String.raw;
  const button = html`
  #+BEGIN_QUERY
  {:inputs ["grocery"]
   :query
   [:find (pull ?b [*])
    :in $ ?macro-name %
    :where
    [?b :block/marker ?marker]
    (not [(contains? #{"DONE"} ?marker)])
    (using-macro ?b ?macro-name)
   ]
  :rules [
          [(using-macro ?b ?macro-name)
           [?b :block/macros ?m]
           [?m :block/properties ?props]
           [(get ?props :logseq.macro-name) ?macros]
           [(= ?macros ?macro-name)]]
  ]
   :result-transform
   (fn [result]
     (sort-by 
      (juxt
       (fn [r] (get r :block/scheduled 99999999)) 
       (fn [r] (get r :block/content))) 
      (map 
       (fn [m] 
         (update 
          m :block/properties 
          (fn [u] 
            (assoc 
             u :scheduled (get-in m [:block/scheduled] "-")))))
       result))) 
   :breadcrumb-show? false
    }
  #+END_QUERY
  `;
  
  div.innerHTML = `${button}`;
  
  });
  ```
