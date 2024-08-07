tags:: page

- # Info
  Part of the [[life organization]] group of logseq functionality
	- {{i eac5}} organizations are like people, but they are not people.
	- {{i eac5}} organization pages are prefixed with `%`
	- {{i eb39}}  use the page template `/contacts - organization page` with organizations
	- Organizations interact with the {{i f021}} **[[contacts]]** list
		- They can record information such as
			- phone number
			- address
			- directions
		- They can also hold information about {{i eac3}} *multiple people* who are not important enough to have their own page
	- Organizations are entities that interact with the {{i f621}} **[[agenda]]** through *activity cards*
		- An organization is a valid value for the **activity card** fields
			- `:who`
			- `:location`
	-
- # organizations
	- #+BEGIN_QUERY
	  {
	   :query [:find (pull ?page [* ])
	   :where
	     [?block :block/refs ?page]
	     [?page :block/name ?name]
	     [(clojure.string/starts-with? ?name "%")]
	   ]
	  }
	  #+END_QUERY
-
