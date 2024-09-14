tags:: page

- # people
	  #+BEGIN_QUERY
	  {
	   :query [:find (pull ?page [* ])
	   :where
	     [?block :block/refs ?page]
	     [?page :block/name ?name]
	     [(clojure.string/starts-with? ?name "@")]
	   ]
	  }
	  #+END_QUERY
