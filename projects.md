tags:: page
description:: Project manarement home base

- ## {{i eb4e}}  [[focus]]
  id:: 66537d2b-5b7e-4077-98a1-e946001b6b1d
  Let's do it!
- ## {{i ef93}}  [[next]]
  id:: 66537d2b-bdba-46d1-a917-217fcd95d5f8
  *More aspirational than anything.*
	- [[Android quick tile manager]]
	- [[logseq journal news feed]]
	- [[android-handsfree-note-taker]]
	- [[2024-denimn-repair]]
- ## {{i f258}}  [[unmanaged]]
  *oh mah gawd*
	- #+BEGIN_QUERY
	  {:query
	   [:find (pull ?project [:block/name])
	    :where
	    ;; Step 1: Identify all project pages
	    (page-tags ?project #{"project"})
	  
	    ;; Step 2: Use not-join to exclude projects that are managed
	    (not-join [?project]
	      [?refs-project :block/refs ?project]
	  
	      ;; Ensure there is a parent block
	      [?refs-project :block/parent ?ref-parent]
	  
	      ;; Check if the parent block references a manager
	      [?ref-parent :block/refs ?managers]
	  
	      ;; Ensure the manager is one of the specified categories
	      [?managers :block/name ?name]
	      [(contains? #{"focus" "finished" "sometime" "next"} ?name)])
	  ]
	  
	  :view (fn [rows] [:div
	    (for [r rows]
	      [:p
	       [:span [:a {:on-click
	           (fn [] 
	  (call-api "insert_block" 
	                                               "66537d2b-bdba-46d1-a917-217fcd95d5f8" 
	                                               (str "[[" (get r :block/name) "]]") 
	                                               {:focus false}))
	                                   } [:span {:class "ti"} "\uf63f "] (get r :block/name)]]
	                       [:span (get-in r [:block/properties :description])]
	                       ])
	                    ])
	  }
	  #+END_QUERY
- ## {{i ef3a}}  [[finished]]
  *Hall of Glorious achievements*
	- [[semantic-icon-search-tool]]
	- [[home automation core 2024.5 update]]
	- [[logseq project manager]]
	- DONE {{project}} 2023 income tax filing
	  id:: 6612de50-a46b-4d53-9cbc-4d3bf8f6e1fb
	  collapsed:: true
		- {{i-inbox}} 2023 income tax filing inbox
		  id:: 6612de5c-b9b2-4ae8-91cf-3ac4de3b6abc
		-
		- DONE Grab any documents from CRA
		  destination: `F:\R\Record, Taxes 2023`
		- TODO Contact WealthSimple by phone to recover my account
		  SCHEDULED: <2024-04-15 Mon>
		  [[Monday, Apr 15th, 2024]]
		- ### Tax Slips
		  collapsed:: true
			- **T5** *Statement of Investment Income*
			  Alterna Savings
- ## {{i f59c}}  [[sometime]]
  collapsed:: true
  *abandoned or otherwise unfeasible.*
	- [[cheeto]]
	- [[android morning helper]]