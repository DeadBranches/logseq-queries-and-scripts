description:: Integrate products into the larger system by indicating `:product-type` or `:goods-category` specifier properties.

- ## {{i eaff}} open orders
  collapsed:: true
  *from online*
	- #+BEGIN_QUERY
	  {:query
	  [:find (pull ?b [*])
	  :where
	  [?t :block/name "online order"]
	  [?b :block/refs ?t]
	  [?b :block/marker ?marker]
	  [(contains? #{"TODO"} ?marker)]
	            (not 
	             [?b :block/parent ?parent]
	             [?parent :block/properties ?props]
	             [(get ?props :template)]
	             )
	  ]
	  :collapsed? false
	  :breadcrumb-show? false
	   }
	  #+END_QUERY
- ## buy
	- Sort by
		- ```
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
		  ```
	- [ + add item ]
	  List
	  #+BEGIN_QUERY
	  {:title [:h4 "🎯 Deze week"]
	   :query [:find (pull ?b [*])
	    :where
	     ; Add the criteria for which ?b you want to find here. I've added all tasks as an example.
	     [?b :block/marker ?m]
	     (not [(contains? #{"DONE" "CANCELED"} ?m)] )
	     [?t :block/name "buy"]
	     [?b :block/refs ?t]
	    [?b :block/properties ?prop]
	    
	    (not (property ?b :goods-category "food"))
	   ]
	  
	  :result-transform (fn [result] 
	     (sort-by ; Any sort field here.
	       (juxt ; sort by multiple fields
	         (fn [r] (get r :block/scheduled 99999999)) ; sort field 1, if no value use 99999999
	         (fn [r] (get r :block/priority "X")) ; sort field 2, if no value use X
	         (fn [r] (get r :block/deadline 99999999)) ; sort field 3, if no value use 99999999
	         (fn [r] (get r :block/content)) ; sort field 4
	       )
	       (map (fn [m] ; make a new map based on the query result
	         (-> m ; use the threading macro to apply multiple update functions
	           (update :block/properties ; update the block properties
	             (fn [u] (assoc u :scheduled (get-in m [:block/scheduled] "-") :deadline (get-in m [:block/deadline] "-") ) ) ; associate the scheduled and deadline attribute values, if no value use -
	           )
	           (update :block/content ; update the block content
	             (fn [c] (str c " test")) ; append the word "test" to the content
	           )
	         )
	       ) result)
	     )
	   )
	  
	     
	      
	   :breadcrumb-show? false
	  }
	  #+END_QUERY
-
- [ + add item ]
  collapsed:: true
  List
  #+BEGIN_QUERY
  {:title [:h4 "🎯 Deze week"]
   :query [:find (pull ?b [*])
    :where
     ; Add the criteria for which ?b you want to find here. I've added all tasks as an example.
     [?b :block/marker ?m]
     (not [(contains? #{"DONE" "CANCELED"} ?m)] )
     [?t :block/name "buy"]
     [?b :block/refs ?t]
     (not (property ?b :goods-category "food"))
   ]
   :result-transform (fn [result] 
     (sort-by ; Any sort field here.
       (juxt ; sort by multiple fields
         (fn [r] (get r :block/created-at 99999999)) ; sort field 1, if no value use 99999999
         
         (fn [r] (update r :block/content) ) ; sort field 4
       
     
        result)
     )
   )
   :breadcrumb-show? false
  }
  #+END_QUERY
- [ + add item ]
  collapsed:: true
  List
  #+BEGIN_QUERY
  {:title [:h4 "🎯 Deze week"]
   :query [:find (pull ?b [*])
    :where
     ; Add the criteria for which ?b you want to find here. I've added all tasks as an example.
     [?b :block/marker ?m]
     (not [(contains? #{"DONE" "CANCELED"} ?m)] )
     [?t :block/name "buy"]
     [?b :block/refs ?t]
   ]
   :result-transform (fn [result] 
     (sort-by ; Any sort field here.
       (juxt ; sort by multiple fields
         (fn [r] (get r :block/created-at 99999999)) ; sort field 1, if no value use 99999999
         
         (fn [r] (get r :block/content)) ; sort field 4
       )
       (map (fn [m] ; make a new map based on the query result
         (update m :block/properties ; update the block properties
           (fn [u] (assoc u :scheduled (get-in m [:block/scheduled] "-") :deadline (get-in m [:block/deadline] "-") ) ) ; associate the scheduled and deadline attribute values, if no value use -
         )
       ) result)
     )
   )
   :breadcrumb-show? false
  }
  #+END_QUERY
- **Mandolin**
	- Benriner no. 95
-