description:: Example page implementing projects queries. Shared publicly.
repository:: DeadBranches/logseq-queries-and-scripts

- ## {{i eb4e}}  [[focus]]
  Let's do it!
	- [[:project-name]]
- ## {{i ef93}}  [[next]]
  *More aspirational than anything.*
	- [[:project-name-2]]
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
	- [[:project-name-3]]
- ## {{i f59c}}  [[sometime]]
  *abandoned or otherwise unfeasible.*
	- [[:project-name-4]]
