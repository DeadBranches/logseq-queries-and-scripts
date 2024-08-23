repository:: DeadBranches/logseq-queries-and-scripts

- {{kitButton items on the list,collapseBlock,ef40,-button-style}}
  id:: 667992b0-0c2b-4343-9c1a-9c7e5e4ada50
	- id:: 6682d241-16ee-4991-bf3f-85c90add7dbd
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
	  #+BEGIN_QUERY
	  {:inputs [:start-of-today-ms "grocery"]
	   :query
	   [:find (pull ?b [*])
	    :in $ ?start-of-today ?macro-name %
	    :where
	    (marked-done-today ?b ?start-of-today)
	    (using-macro ?b ?macro-name)]
	   
	   :rules 
	   [[(marked-done-today ?b ?start-of-today)
	     [?b :block/marker ?marker]
	     [(contains? #{"DONE"} ?marker)]
	     [?b :block/updated-at ?update-time]
	     [(< ?start-of-today ?update-time)]]
	  
	    [(using-macro ?b ?macro-name)
	     [?b :block/macros ?m]
	     [?m :block/properties ?props]
	     [(get ?props :logseq.macro-name) ?macros]
	     [(= ?macros ?macro-name)]]]
	  
	   :result-transform 
	   (fn [result]
	     (sort-by
	      (juxt
	       (fn [r] (get r :block/scheduled 99999999))
	       (fn [r] (get r :block/content)))
	      (map (fn [m]
	             (update m :block/properties (fn [u] (assoc u
	                                    :scheduled (get-in m [:block/scheduled] "-"))))) result)))
	  
	   :breadcrumb-show? false
	  }
	  #+END_QUERY
- {{kitButton previous purchases,collapseBlock,eb9b,-button-style}}
	- {{embed ((66c12458-4744-4f60-bc2b-8396c7bd3819))}}
- #### {{i f5f8}} in my basket..
  id:: 667992b0-0de4-46c7-a490-296854304e56
	- id:: 6682d241-e03c-4501-9c07-243c18d7f606
	  #+BEGIN_QUERY
	  {:inputs [:start-of-today-ms "grocery"]
	   :query
	   [:find (pull ?b [*])
	    :in $ ?start-of-today ?macro-name %
	    :where
	    (marked-done-today ?b ?start-of-today)
	    (using-macro ?b ?macro-name)]
	   
	   :rules 
	   [[(marked-done-today ?b ?start-of-today)
	     [?b :block/marker ?marker]
	     [(contains? #{"DONE"} ?marker)]
	     [?b :block/updated-at ?update-time]
	     [(< ?start-of-today ?update-time)]]
	  
	    [(using-macro ?b ?macro-name)
	     [?b :block/macros ?m]
	     [?m :block/properties ?props]
	     [(get ?props :logseq.macro-name) ?macros]
	     [(= ?macros ?macro-name)]]]
	  
	   :result-transform 
	   (fn [result]
	     (sort-by
	      (juxt
	       (fn [r] (get r :block/scheduled 99999999))
	       (fn [r] (get r :block/content)))
	      (map (fn [m]
	             (update m :block/properties (fn [u] (assoc u
	                                    :scheduled (get-in m [:block/scheduled] "-"))))) result)))
	  
	   :breadcrumb-show? false
	  }
	  #+END_QUERY
-
