description:: Example page implementing projects queries. Shared publicly.
repository:: DeadBranches/logseq-queries-and-scripts

- ## {{i eb4e}}  [[focus]]
  Let's do it!
	- [[:logseq-events-and-appointments]]
- ## {{i ef93}}  [[next]]
  *More aspirational than anything.*
	- [[:Android quick tile manager]]
	- [[logseq journal news feed]]
	- [[:android handsfree note-taker]]
	- [[:denim repair 2024]]
	- [[:logseq-queries-and-scripts-repo]]
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
	- [[:semantic-icon-search-tool]]
	- [[:home automation core 2024.5 update]]
	- [[:logseq-project-manager-2024.5]]
	- 2023 income tax filing
		- {{i-inbox}} 2023 income tax filing inbox
		-
		- DONE Grab any documents from CRA
		  destination: `F:\R\Record, Taxes 2023`
		- DONE Contact WealthSimple by phone to recover my account
		  SCHEDULED: <2024-04-15 Mon>
		  [[Monday, Apr 15th, 2024]]
		- ### Tax Slips
			- **T5** *Statement of Investment Income*
			  Alterna Savings
- ## {{i f59c}}  [[sometime]]
  *abandoned or otherwise unfeasible.*
	- [[cheeto]]
	- [[android morning helper]]
