#### {{i ef40}} items on the list
	- #+BEGIN_QUERY
	  {:query [:find (pull ?b [*])
	    :where
	     [?b :block/marker ?m]
	     (not [(contains? #{"DONE"} ?m)] )
	     (property ?b :goods-category "food")
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
	   :breadcrumb-show? false
	  }
	  #+END_QUERY
- #### {{i f5f8}} in my basket
	- #+BEGIN_QUERY
	  {
	  :query [:find (pull ?b [*])
	    :in $ ?end
	    :where
	     [?b :block/marker ?m]
	     [(contains? #{"DONE"} ?m)]
	     ;;[?t :block/name "buy"]
	     ;;[?b :block/refs ?t]
	     ;[?b :block/properties ?props]
	     ;(property ?b :goods-category "food")
	     [?b :block/updated-at ?updated]
	     [(> ?updated ?end)]
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
	  :inputs [:start-of-today-ms]
	  }
	  #+END_QUERY
- lol 
  action:: h
- mushrooms. They are {{i-github}} great
  +:: lololol
  collapsed:: true
  am I rite?
	- NO YOU ARE NOT
- hi mom
  buttons:: nah
  -query:: lol
  action:: ok
-