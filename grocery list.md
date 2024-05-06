- #+BEGIN_QUERY
  {:query [:find (pull ?b [*])
    :where
     [?b :block/marker ?m]
     (not [(contains? #{"DONE" "CANCELED"} ?m)] )
     ;;[?t :block/name "buy"]
     ;;[?b :block/refs ?t]
     ;[?b :block/properties ?props]
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