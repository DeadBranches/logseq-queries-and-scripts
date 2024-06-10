repository:: DeadBranches/logseq-queries-and-scripts

- #### {{i ef40}} items on the list
	- #+BEGIN_QUERY
	  {:inputs ["grocery"]
	   :query
	   [:find (pull ?b [*])
	    :in $ ?macro
	    :where
	    [?b :block/marker ?marker]
	    (not [(contains? #{"DONE"} ?marker)])
	    [?b :block/macros ?m]
	    [?m :block/properties ?props]
	    [(get ?props :logseq.macro-name) ?macros]
	    [(= ?macros ?macro)]
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
- #### {{i f5f8}} in my basket..
	- #+BEGIN_QUERY
	  {:query 
	   [:find (pull ?b [*]) 
	    :in $ ?end  ?macro
	    :where
	    ; Find blocks marked DONE today.
	    [?b :block/updated-at ?updated]
	    [(> ?updated ?end)]
	    [?b :block/marker ?marker]
	    [(contains? #{"DONE"} ?marker)]
	  
	    ; Find blocks using {{grocery}}
	    [?b :block/macros ?m]
	    [?m :block/properties ?props]
	    [(get ?props :logseq.macro-name) ?macros]
	    [(= ?macros ?macro)]
	   ]
	   
	   :result-transform (fn [result] 
	     (sort-by
	       (juxt
	         (fn [r] (get r :block/scheduled 99999999))
	         (fn [r] (get r :block/content))
	         )
	       (map (fn [m]
	         (update m :block/properties
	           (fn [u] (assoc u 
	           :scheduled (get-in m [:block/scheduled] "-") 
	           ) )
	         )
	       ) result)
	     )
	   )
	   :inputs [:start-of-today-ms "grocery"] 
	   :breadcrumb-show? false
	  }
	  #+END_QUERY
-