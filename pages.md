tags:: page
description:: That's me! Add `:block/tags "page"` to have a page show up here.
repository:: DeadBranches/logseq-queries-and-scripts

- *detailed page description*
  tags:: page-information
  collapsed:: true
	- Customize how a page appears on this list by using page properties!
	- Set `:block/property :page-title ?title` and `?title` replaces the bolded page name with another string
	- Set `:block/property :description ?desc` and ?desc becomes the text immediatly following `:page-title`
	- Add `:block/tags "page-information"` to a block in a page and the block children will be added as children under the page entry on this page!!
- query:: ((65f61ef5-45b1-4c58-b2b5-bced3827ae44))
  collapsed:: true
  #+BEGIN_QUERY
  {:inputs [:parent-block #{1 2 3}]
   :query [:find (pull ?children [*])
           :in $ ?cb ?heading-set
           :where
           [?children :block/parent ?cb]
           [?children :block/properties ?prop]
           [(get ?prop :heading) ?heading-value]
           [(contains? ?heading-set ?heading-value)]]
   :result-transform
   (fn [result]
     (let [heading-pattern (re-pattern "^(#+\\s+)") ;; => `### ` ; used to get rid of header
           icon-macro-pattern (re-pattern "(\\s*\\{\\{[iI] [a-fA-F0-9]{4}\\}\\}\\s*)") ;; => ` {{i f3f3}} ` ; used for getting rid of icon 
           glyph-pattern (re-pattern "^.*\\{\\{[iI] ([a-fA-F0-9]{4})\\}\\}.*") ;; => `f3f3` ; used to isolate glyph code
           replace-macro (fn [macro-match]
                           (if (seq macro-match)
                             (second macro-match)
                             ""))
  
           ;icon-pattern (re-pattern "\\s*\\{\\{[iI] ([a-fA-F0-9]{4})\\}\\}\\s*")
           ;macro-pattern (re-pattern "\\{\\{[iI] ([a-fA-F0-9]{4})\\}\\}")
           first-lines (map (fn [r]
                              (let [content (get-in r [:block/content])
                                    first-newline (str/index-of content "\n")
                                    line (if first-newline (subs content 0 first-newline) content)
                                    uuid (get-in r [:block/uuid])
  
                                    line-without-heading (clojure.string/replace line heading-pattern "")
                                    line-without-heading-or-icon (clojure.string/replace line-without-heading icon-macro-pattern "")
                                    ;glyph-code (clojure.string/replace line glyph-pattern replace-macro)
                                    ;glyph-code (clojure.string/replace line )
                                    ;line-with-glyphs (clojure.string/replace line-without-heading macro-pattern replace-macro)
                                    ]
                                {:text line-without-heading-or-icon
                                 :icon (if (re-find glyph-pattern line)
                                         (str "&#x" (replace-macro (re-find glyph-pattern line)))
                                         "")
                                 :uuid uuid}))
                            result)]
       first-lines))
  :view (fn [items]
          [:div
           (interpose ", "
                      (for [{:keys [text icon uuid]} items]
                        [:a {:class "tag" :href (str "logseq://graph/main?block-id=" uuid)}
                         (if (and (seq icon) (not (empty? icon)))
                           [:span {:class "ti" :dangerouslySetInnerHTML {:__html icon}}]
                           "")
                         [:span {:dangerouslySetInnerHTML {:__html text}}]]))])
   }
  
  #+END_QUERY
	- #[[advanced query]] test for scroll to block
	  collapsed:: true
		- ```
		  #+BEGIN_QUERY
		  {:inputs [:parent-block #{1 2 3}]
		   :query [:find (pull ?children [*])
		           :in $ ?cb ?heading-set
		           :where
		           [?children :block/parent ?cb]
		           [?children :block/properties ?prop]
		           [(get ?prop :heading) ?heading-value]
		           [(contains? ?heading-set ?heading-value)]]
		   :result-transform
		   (fn [result]
		     (let [heading-pattern (re-pattern "^(#+\\s+)") 
		     ;; => `### ` ; used to get rid of header
		     
		           icon-macro-pattern (re-pattern "(\\s*\\{\\{[iI] [a-fA-F0-9]{4}\\}\\}\\s*)") 
		           ;; => ` {{i f3f3}} ` ; used for getting rid of icon 
		           
		           glyph-pattern (re-pattern "^.*\\{\\{[iI] ([a-fA-F0-9]{4})\\}\\}.*") 
		           ;; => `f3f3` ; used to isolate glyph code
		           
		           replace-macro (fn [macro-match]
		                           (if (seq macro-match)
		                             (second macro-match)
		                             ""))
		  
		           ;icon-pattern (re-pattern "\\s*\\{\\{[iI] ([a-fA-F0-9]{4})\\}\\}\\s*")
		           ;macro-pattern (re-pattern "\\{\\{[iI] ([a-fA-F0-9]{4})\\}\\}")
		           first-lines (map (fn [r]
		                              (let [content (get-in r [:block/content])
		                                    first-newline (str/index-of content "\n")
		                                    line (if first-newline (subs content 0 first-newline) content)
		                                    uuid (get-in r [:block/uuid])
		  ;page (get-in r [:block/name])
		                                    line-without-heading (clojure.string/replace line heading-pattern "")
		                                    line-without-heading-or-icon (clojure.string/replace line-without-heading icon-macro-pattern "")
		                                    ;glyph-code (clojure.string/replace line glyph-pattern replace-macro)
		                                    ;glyph-code (clojure.string/replace line )
		                                    ;line-with-glyphs (clojure.string/replace line-without-heading macro-pattern replace-macro)
		                                    ]
		                                {:text line-without-heading-or-icon
		                                 :icon (if (re-find glyph-pattern line)
		                                         (str "&#x" (replace-macro (re-find glyph-pattern line)))
		                                         "")
		                                 :uuid uuid}))
		                            result)]
		       first-lines))
		  :view (fn [items]
		          [:div
		           (interpose ", "
		                      (for [{:keys [text icon uuid]} items]
		  
		                 
		                        [:a {:class "tag" :on-click (fn [] (call-api "push_state" "page" {:name "pile"})) :href (str "logseq://graph/main?block-id=" uuid)}
		                         (if (and (seq icon) (not (empty? icon)))
		                           [:span {:class "ti" :dangerouslySetInnerHTML {:__html icon}}]
		                           "")
		                         [:span {:dangerouslySetInnerHTML {:__html text}}]]))])
		   }
		  
		  #+END_QUERY
		  ```
- # {{i edef}} Pages
  {{I eac5}} *Pages help me remember where things go.*
	- #+BEGIN_QUERY
	  {:query
	      [:find (pull ?p [*])
	          :where
	          (page-tags ?p #{"page"})
	      ]
	      :result-transform (fn [result] 
	          (sort-by 
	          (fn [r] (get r :block/name))
	          result
	          )
	      )
	      :view 
	      (fn [result]
	              [:table {:class "future-appointments"}
	               [:thead
	                [:tr
	                 [:th {:width "120px" :class "wrap-at-spaces"} "Page"]
	                 [:th "Description"]]]
	               [:tbody
	          (for [r result]
	                 [:tr {:class "wrap-at-spaces" :max-width "50%"} [:td
	                  [:a 
	                   {:class "tag" :href (str "#/page/" (get-in r [:block/original-name]))}
	                   (str "#" (get r :block/name))
	                   ]] 
	                  [:td 
	                  (str " " (get-in r [:block/properties :description]))
	                  ]]
	                 )
	           ]]
	      )
	  :collapsed? false
	      :breadcrumb-show? false
	      :group-by-page? false
	  }
	  #+END_QUERY
	- {{i eb6d}} *The philosophy of Pages*
	  collapsed:: true
		- Create a page: `tags:: page`
		- Pages help me remember...
		  * My system for structuring my logseq graph
		  * The name of pages
		  * Where I might have put blocks on a given topic.
- # {{i eb45}} Collections
  {{I eac5}} *Information presented in a pretty format*
	- query-sort-by:: collector
	  query-sort-desc:: false
	  query-properties:: [:collector :page]
	  #+BEGIN_QUERY
	  {
	   :query 
	   [:find (pull ?p [*]) 
	    :where [?b :block/properties ?props]
	           [(get ?props :collection) ?collection]
	           [?p :block/name ?names]
	           [(contains? ?collection ?names)]]
	   :result-transform (
	                      fn [result] 
	                      (sort-by (fn [r] (get r :block/name)) result))
	   :view (
	          fn [result] 
	          [:table (for [r result]
	                 [:tr [:td {:width "30%"}
	                  [:a 
	                   {:class "tag" :href (str "#/page/" (get-in r [:block/original-name]))}
	                   (str "#" (get r :block/name))
	                   ]] 
	                  [:td 
	                  (str " " (get-in r [:block/properties :description]))
	                  ]]
	                 )
	           ]
	          )}
	              
	          
	      ;</base>
	  
	  #+END_QUERY
		- *(Backup copy of query)*
		  collapsed:: true
			- ### Collection list
			  #+BEGIN_QUERY
			  {:query
			      [:find (pull ?p [*])
			          :where
			          [?b :block/properties ?props]
			          [(get ?props :collection) ?collection]
			         [?p :block/name ?names]
			         [(contains? ?collection ?names)]
			      ]
			      :result-transform (fn [result] 
			          (sort-by 
			          (fn [r] (get r :block/name))
			          result
			          )
			      )
			      :view 
			      (fn [result] ;<base>
			  
			          [:ul (for [r result]
			              [:li 
			               
			              [:a {:class "tag" :href (str "#/page/" (get-in r [:block/original-name]))} (str "#" (get r :block/name))]
			              
			              (str " " (get-in r [:block/properties :description]))
			              ]
			          )]
			      );</base>
			  }
			  #+END_QUERY
- {{i eb6d}} *The philosophy of collections*
  collapsed:: true
	- are-linked-to-in-a-collector's-`page::` property.
	-
- # Collectors
  {{I eac5}} *Tag a journal block with a collector to ease finding the information later.*
	- The philosophy of collectors
	  collapsed:: true
		- **Collectors are** a category of tags with fewer and broader options.
		- **Using** them is first and easiest step in organizing information in my graph.
		- Easily **create a new collector** using the `tags:: #collector` property.
		- #### Full specification
		  `description: str`
		  `tags: collector`
		  `collection: [[]]`
- ### Collector list
  query-properties:: [:collector :page :description]
  #+BEGIN_QUERY
  {:query
      [:find (pull ?p [*])
          :where
          (page-tags ?p #{"collector"})
      ]
      :result-transform (fn [result] 
          (sort-by 
          (fn [r] (get r :block/name))
          result
          )
      )
      :view 
      (fn [result] ;<base>
  
          [:ul (for [r result]
              [:li 
              [:b 
              [:a {:href (str "#/page/" (get-in r [:block/original-name]))} (str "#" (get r :block/name))]
              ]
              (str ": " (get-in r [:block/properties :description]))
              ]
          )]
      );</base>
  }
  #+END_QUERY