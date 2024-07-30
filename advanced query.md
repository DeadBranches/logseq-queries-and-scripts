description:: Saved or otherwise in-progress Logseq advanced queries. Also currently query reference and library (needs ???)
tags:: collector, page
collection:: [[logseq queries]]
repository:: DeadBranches/logseq-queries-and-scripts

- query:: ((65f61ef5-45b1-4c58-b2b5-bced3827ae44))
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
- ## {{i eff2}} Query library
  query:: ((65f7767a-9fe3-4b51-a564-c36be58ce5fa))
  collapsed:: true
  *Advanced queries I reuse*
  #+BEGIN_QUERY
  {:inputs [:current-block #{1 2 3 4 5}]
   :query [:find (pull ?children [*])
           :in $ ?cb ?heading-set
           :where
           [?children :block/parent ?cb]
           [?children :block/properties ?prop]
           [(get ?prop :heading) ?heading-value]
           [(contains? ?heading-set ?heading-value)]
           ]
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
          [:div [:span {:class "ti"} "   \uf019 "]
           (interpose ", "
                      (for [{:keys [text icon uuid]} items]
                        [:a {:class "tag" :href (str "logseq://graph/main?block-id=" uuid)}
                         (if (and (seq icon) (not (empty? icon)))
                           [:span {:class "ti" :dangerouslySetInnerHTML {:__html icon}}]
                           "")
                         [:span {:dangerouslySetInnerHTML {:__html text}}]]))])
   }
  
  #+END_QUERY
	- ## Embedding queries
	  collapsed:: true
	  *for `{{embedding}}`*
		- **Related page** linked references
		  collapsed:: true
			- On a given page with the `:related` page property,
				- Find all blocks with linked references to pages included in `:related`
			- Linked references to pages in `:related` advanced query:
			  ```datalog
			  #+BEGIN_QUERY
			  {
			  :inputs [:query-page]
			  :query
			  [:find (pull ?b [*])
			  :in $ ?query-page
			  :where
			  [?qp :block/name ?query-page]
			  [?qp :block/properties ?properties]
			  [(get ?properties :related) ?related-page]
			  
			  [?rp :block/original-name ?page-name]
			  [(contains? ?related-page ?page-name)]
			  
			  [?b :block/refs ?rp]
			  ]
			  }
			  #+END_QUERY
			  ```
		- #### Nutritional facts (vitamins)
		  id:: 666f7716-c32e-40e0-8b10-8f93fc591165
		  collapsed:: true
			- id:: 666f7733-1891-45d3-8bbb-8f32dd4631e1
			  #+BEGIN_QUERY
			   {:inputs [:current-page]
			   :query
			   [:find ?current-page ?nutrient ?amount ?unit
			    :keys current-page nutrient amount unit
			    :in $ ?current-page
			    :where
			    [?f :block/name ?current-page]
			    [?b :block/page ?f]
			    [?b :block/path-refs [:block/name "vitamins"]]
			    [?b :block/properties ?props]
			    [(get ?props :nutrient) ?nutrient]
			  
			    [(get ?props :per-100g) ?amount]
			  [(not= ?amount 0)]
			    [(get ?props :unit) ?unit]]
			   :view (fn [query-results]
			           [:div {:class "mdc-grid-list button-bunny"}
			            [:md-list  
			            (map (fn [{:keys [nutrient amount unit]}]
			                   [:div
			                    [:md-list-item
			                    [:div {:slot "headline" :class "list-item"} (str (first nutrient))]
			                    [:div {:slot "supporting-text" :class "list-item"} (str amount " " unit)]]]
			                   )
			                 query-results)]])}
			  
			  #+END_QUERY
			-
		- #### Nutritional facts (minerals)
		  id:: 666f7726-4350-45b0-b0fd-4cdd2b75497c
		  collapsed:: true
			- id:: 666f7747-d031-4ef7-8a4e-faaadde102c4
			  #+BEGIN_QUERY
			   {:inputs [:current-page]
			   :query
			   [:find ?current-page ?nutrient ?amount ?unit
			    :keys current-page nutrient amount unit
			    :in $ ?current-page
			    :where
			    [?f :block/name ?current-page]
			    [?b :block/page ?f]
			    [?b :block/path-refs [:block/name "minerals"]]
			    [?b :block/properties ?props]
			    [(get ?props :nutrient) ?nutrient]
			  
			    [(get ?props :per-100g) ?amount]
			  [(not= ?amount 0)]
			    [(get ?props :unit) ?unit]]
			   :view (fn [query-results]
			           [:div {:class "mdc-grid-list button-bunny"}
			            [:md-list  
			            (map (fn [{:keys [nutrient amount unit]}]
			                   [:div
			                    [:md-list-item
			                    [:div {:slot "headline" :class "list-item"} (str (first nutrient))]
			                    [:div {:slot "supporting-text" :class "list-item"} (str amount " " unit)]]]
			                   )
			                 query-results)]])}
			  
			  #+END_QUERY
		- #### {{i ef91}} Upcoming project quick-view
		  collapsed:: true
		        ![image.png](../assets/image_1719764401764_0.png){:height 38, :width 143}
			- *see [[logseq project manager]]*
			- **Current query**
				- id:: 6654b591-49ea-4d3a-b9d9-1dc4f25bab0c
				  #+BEGIN_QUERY
				  {:query
				   [:find ?current-page-id ?project-name ?manager-name ?project-properties
				    :keys current-page-id project-name manager-name project-properties
				    :in $ ?current-page
				    :where
				    ;; Step 1: Identify all project pages
				    (page-tags ?project #{"project"})
				  
				      [?refs-project :block/refs ?project]
				      ;; Ensure there is a parent block
				  
				      [?refs-project :block/parent ?ref-parent]
				      ;; Check if the parent block references a manager
				  
				      [?ref-parent :block/refs ?managers]
				      ;; Ensure the manager is one of the specified categories
				  
				      [?managers :block/name ?manager-name]
				      [(contains? #{"next"} ?manager-name)]
				    
				    [?page :block/name ?current-page]
				    [?page :block/uuid ?current-page-id]
				    [?project :block/name ?project-name]
				    [?project :block/properties ?project-properties]
				  
				  ]
				  :result-transform (fn [results]
				                      (let [sorted-results (sort-by (fn [r] (get r :block/name "none")) results)]
				                        (map (fn [result]
				                               (let [icon (get-in result [:block/properties :icon] "ef27")] ; Use fallback icon if none
				                                 (assoc result :icon icon))) ; Associate the icon with the result
				                             (if (empty? sorted-results)
				                               [{:block/name "\uf4a5 none"}]
				                               sorted-results))))
				  
				   :view (fn [results]
				           [:div {:class "projects-list-container"}
				            (map (fn [results]
				                   (let [project-name (:project-name results)
				                         uuid (str (:current-page-id results))
				                         icon (:icon results)]
				                                 ;inside let scope 
				                      [:span {:class "project-item"}
				                          [:a {:class "project-quick-add" 
				                               :on-click (
				                                          fn [] (call-api "append_block_in_page" uuid (
				                                                                                       str "{{i " icon "}} #[[" project-name "]]")))
				                               }
				                           [:span {:class "project-leading-icon"} "\uf63f "] [:span {:class "project-name"} project-name]
				                           ] [:a {
				                                  :class "project-trailing-icon" 
				                                  :on-click (fn [] (call-api "push_state" "page" {:name project-name}))
				                                  } "\uea99 "
				                              ]
				                          ]
				                     ))
				                 results)
				                                     ])
				  :inputs [:current-page]
				  }
				  #+END_QUERY
			- [:small "(older versions)"]
			  collapsed:: true
				- version 1.2
				  collapsed:: true
				  *introduces project icons & open page icon*
					- #+BEGIN_QUERY
					  {:query
					   [:find ?current-page-id ?project-name ?manager-name ?project-properties
					    :keys current-page-id project-name manager-name project-properties
					    :in $ ?current-page
					    :where
					    ;; Step 1: Identify all project pages
					    (page-tags ?project #{"project"})
					  
					      [?refs-project :block/refs ?project]
					      ;; Ensure there is a parent block
					  
					      [?refs-project :block/parent ?ref-parent]
					      ;; Check if the parent block references a manager
					  
					      [?ref-parent :block/refs ?managers]
					      ;; Ensure the manager is one of the specified categories
					  
					      [?managers :block/name ?manager-name]
					      [(contains? #{"next"} ?manager-name)]
					    
					    [?page :block/name ?current-page]
					    [?page :block/uuid ?current-page-id]
					    [?project :block/name ?project-name]
					    [?project :block/properties ?project-properties]
					  
					  ]
					  :result-transform (fn [results]
					                      (let [sorted-results (sort-by (fn [r] (get r :block/name "none")) results)]
					                        (map (fn [result]
					                               (let [icon (get-in result [:block/properties :icon] "ef27")] ; Use fallback icon if none
					                                 (assoc result :icon icon))) ; Associate the icon with the result
					                             (if (empty? sorted-results)
					                               [{:block/name "\uf4a5 none"}]
					                               sorted-results))))
					  
					   :view (fn [results]
					           [:div
					            (map (fn [results]
					                   (let [project-name (:project-name results)
					                         uuid (str (:current-page-id results))
					                         icon (:icon results)]
					                                 ;inside let scope 
					                     [:p [:span
					                          [:a
					                           {:class "tag"
					                            :on-click (fn [] (call-api "append_block_in_page"
					                                                       uuid
					                                                       (str "{{i " icon "}} #[[" project-name "]]")))
					                            }
					                           [:span {:class "ti"} "\uf63f "] 
					                           project-name] [:a {:class "ti"
					                          :on-click (fn [] (call-api "push_state" "page" {:name project-name}))} 
					                      "  \uea99 "
					                      ] 
					                          ]]
					                     ))
					                 results)
					                                     ])
					  :inputs [:current-page]
					  }
					  #+END_QUERY
					-
				- version 1.1
				  collapsed:: true
				  ![image.png](../assets/image_1717608526060_0.png)
					- ```
					  #+BEGIN_QUERY
					  {:query
					   [:find ?current-page-id ?project-name
					    :keys current-page-id project-name
					    :in $ ?current-page
					    :where
					    ;; Step 1: Identify all project pages
					    (page-tags ?project #{"project"})
					  
					      [?refs-project :block/refs ?project]
					      ;; Ensure there is a parent block
					  
					      [?refs-project :block/parent ?ref-parent]
					      ;; Check if the parent block references a manager
					  
					      [?ref-parent :block/refs ?managers]
					      ;; Ensure the manager is one of the specified categories
					  
					      [?managers :block/name ?name]
					      [(contains? #{"next"} ?name)]
					    
					    [?page :block/name ?current-page]
					    [?page :block/uuid ?current-page-id]
					    [?project :block/name ?project-name]
					  ]
					  
					   :view (fn [results]
					           [:div
					            (map (fn [results]
					                   (let [project-name (:project-name results)
					                         uuid (str (:current-page-id results))]
					                                 ;inside let scope 
					                     [:p [:span
					                          [:a
					                           {:class "tag tag-like"
					                            :on-click (fn [] (call-api "append_block_in_page"
					                                                       uuid
					                                                       (str "[[" project-name "]]")))
					                            }
					                           [:span {:class "ti"} "\uf63f "] 
					                           project-name]
					                          ]]
					                     ))
					                 results)
					                    
					  
					                    ])
					  :inputs [:current-page]
					  }
					  #+END_QUERY
					  ```
		- #### {{i ef91}} project management journal widget
		  id:: 6666f9ad-7589-4721-a459-d7d18591c09e
		  collapsed:: true
		      ![image.png](../assets/image_1719764465551_0.png){:height 30, :width 183}
			- ###  {{i f635}} information
				- for related {{i ef91}} project see [[logseq project manager]]
			- ### {{i eb89}} current query
			  *for use in embedding*
				- id:: 664f42a4-40eb-44ba-8e8c-89dba2c17a06
				  #+BEGIN_QUERY
				  {:query
				   [:find ?current-page-id ?project-name ?project-properties
				    :keys current-page-id project-name project-properties
				    :in $ ?current-page
				    :where
				    (page-tags ?project #{"project"})
				    [?managers :block/name ?name]
				    [(contains? #{"focus"} ?name)]
				    [?refs-project :block/refs ?project]
				    [?refs-project :block/parent ?project-ref-parent]
				    [?project-ref-parent :block/refs ?managers]
				    [?page :block/name ?current-page]
				    [?page :block/uuid ?current-page-id]
				    [?project :block/name ?project-name]
				    [?project :block/properties ?project-properties]
				   ]
				  
				   :result-transform (fn [results]
				                       (let [sorted-results (sort-by (fn [r] (get r :block/name "none")) results)]
				                         (map (fn [result]
				                                (let [icon (get-in result [:project-properties :-icon] "ef27")] ; Use fallback icon if none
				                                  (assoc result :icon icon))) ; Associate the icon with the result
				                              (if (empty? sorted-results)
				                                [{:block/name "\uf4a5 none"}]
				                                sorted-results))))
				   
				  :view (fn [results]
				            (map (fn [result]
				                   (let [project-name (:project-name result)
				                         uuid (str (:current-page-id result))
				                         icon (:icon result)] ; Define icon here
				                     [:div {:class "quick-view-container"} 
				                      [:span {:class "ti"} (read-string (str "\"\\u" icon "\""))]
				                      [:span {:class "content-slot"}
				                       [:a {:data-ref project-name :class "link"
				                            :on-click (fn [] (call-api "append_block_in_page" uuid (str "\n{{i " icon "}} #[[" project-name "]]")))}
				                        project-name]]
				                      [:span {:class "trailing-slot"}
				                       [:a {:class "project-trailing-icon"
				                            :on-click (fn [] (call-api "push_state" "page" {:name project-name}))}
				                        "\uea99"]]
				                      ]
				                     ))
				                 results))
				   :inputs [:current-page]
				  }
				  #+END_QUERY
			- ### {{i ea0b}} *version archive*
			  id:: 6653554c-6a4b-4673-9f08-a7e58a13c5fe
			  collapsed:: true
			  *older stuff*
				- version 2.4 improves styling (*current*)
				- version 2.3
				  collapsed:: true
				  *introduces project icon for added blocks*
					- ```
					  #+BEGIN_QUERY
					  {:query
					   [:find ?current-page-id ?project-name ?project-properties
					    :keys current-page-id project-name project-properties
					    :in $ ?current-page
					    :where
					    (page-tags ?project #{"project"})
					    [?managers :block/name ?name]
					    [(contains? #{"focus"} ?name)]
					    [?refs-project :block/refs ?project]
					    [?refs-project :block/parent ?project-ref-parent]
					    [?project-ref-parent :block/refs ?managers]
					    [?page :block/name ?current-page]
					    [?page :block/uuid ?current-page-id]
					    [?project :block/name ?project-name]
					    [?project :block/properties ?project-properties]
					   ]
					   :result-transform (fn [results]
					                       (let [sorted-results (sort-by (fn [r] (get r :block/name "none")) results)]
					                         (map (fn [result]
					                                (let [icon (get-in result [:project-properties :icon] "ef27")] ; Use fallback icon if none
					                                  (assoc result :icon icon))) ; Associate the icon with the result
					                              (if (empty? sorted-results)
					                                [{:block/name "\uf4a5 none"}]
					                                sorted-results))))
					   :view (fn [results]
					           [:div
					            [:span {:class "quick-view-label"} "focus"]
					            (map (fn [result]
					                   (let [project-name (:project-name result)
					                         uuid (str (:current-page-id result))
					                         icon (:icon result)] ; Define icon here
					                     [:span {:class "quick-view-content"}
					                      [:a {:class "ti light-gray"
					                           :on-click (fn [] (call-api "push_state" "page" {:name project-name}))} 
					                       "  \uea99 "
					                       ] [:a {:data-ref project-name :class "tag"
					                              :on-click (fn [] (call-api "append_block_in_page" uuid (str "\n{{i " icon "}} #[[" project-name "]]")))}
					                          project-name]
					                      ]))
					                 results)])
					   :inputs [:current-page]
					  }
					  #+END_QUERY
					  ```
				- version 2.2
				  collapsed:: true
				  *introduces open project icon*
					- ```
					  #+BEGIN_QUERY
					  {:query
					   [:find ?current-page-id ?project-name
					    :keys current-page-id project-name
					    :in $ ?current-page
					    :where
					  
					    (page-tags ?project #{"project"})
					    [?managers :block/name ?name]
					    [(contains? #{"focus"} ?name)]
					    [?refs-project :block/refs ?project]
					    [?refs-project :block/parent ?project-ref-parent]
					    [?project-ref-parent :block/refs ?managers]
					    [?page :block/name ?current-page]
					    [?page :block/uuid ?current-page-id]
					    [?project :block/name ?project-name]]
					   :result-transform (fn [result]
					                       (if (empty? result)
					                         [{:block/name "\uf4a5 none"}]
					                         (sort-by (fn [r] (get r :block/name "none")) result)))
					  
					   :view (fn [results]
					           [:div
					            [:span {:class "quick-view-label"} "focus"]
					            (map (fn [result]
					                   (let [project-name (:project-name result)
					                         uuid (str (:current-page-id result))
					                         icon (:icon result)]
					                     [:span {:class "quick-view-content"}
					                      [:a {:class "ti light-gray"
					                           :on-click (fn [] (call-api "push_state" "page" {:name project-name}))}
					                       "  \uea99 "] [:a {:data-ref project-name :class "tag"
					                                         :on-click (fn [] (call-api "append_block_in_page" uuid (str "\n{{project}} #[[" project-name "]]")))}
					                                     project-name]]))
					                 results)])
					  
					   :inputs [:current-page]}
					  
					  
					  #+END_QUERY
					  ```
				- version 2.1
				  collapsed:: true
					- ```
					  #+BEGIN_QUERY
					  
					  {:query
					  [:find ?current-page-id ?project-name
					  :keys current-page-id project-name
					  :in $ ?current-page
					  :where
					  
					  (page-tags ?project #{"project"})
					  [?managers :block/name ?name]
					  [(contains? #{"focus"} ?name)]
					  [?refs-project :block/refs ?project]
					  [?refs-project :block/parent ?project-ref-parent]
					  [?project-ref-parent :block/refs ?managers]
					  [?page :block/name ?current-page]
					  [?page :block/uuid ?current-page-id]
					  [?project :block/name ?project-name]
					  ]
					  :result-transform (fn [result]
					                     (if (empty? result)
					                       [{:block/name "\uf4a5 none"}]
					                       (sort-by (fn [r] (get r :block/name "none")) result)))
					  
					  :view (fn [results]
					          [:div
					           [:span {:class "quick-view-label"} "focus"]
					           (map (fn [result]
					                  (let [project-name (:project-name result)
					                        uuid (str (:current-page-id result))]
					                    [:span {:class "quick-view-content"}
					                    [:a {:data-ref project-name :class "tag"
					                         :on-click (fn [] (call-api "append_block_in_page" uuid (str "\n{{project}} #[[" project-name "]]")))}
					                     project-name]]))
					                results)])
					  
					  :inputs [:current-page]
					  }
					  #+END_QUERY
					  ```
				- version 2.0
				  collapsed:: true
					- ```
					  #+BEGIN_QUERY
					  {:query
					  [:find ?current-page-id ?project-name
					  :keys current-page-id project-name
					  :in $ ?current-page
					  :where
					  
					  (page-tags ?project #{"project"})
					  [?managers :block/name ?name]
					  [(contains? #{"focus"} ?name)]
					  [?refs-project :block/refs ?project]
					  [?refs-project :block/parent ?project-ref-parent]
					  [?project-ref-parent :block/refs ?managers]
					  [?page :block/name ?current-page]
					  [?page :block/uuid ?current-page-id]
					  [?project :block/name ?project-name]
					  ]
					  :result-transform (fn [result]
					                     (if (empty? result)
					                       [{:block/name "\uf4a5 none"}]
					                       (sort-by (fn [r] (get r :block/name "none")) result)))
					  
					  :view (fn [results]
					          [:div
					           [:span {:class "quick-view-label"} "focus"]
					           (map (fn [result]
					                  (let [project-name (:project-name result)
					                        uuid (str (:current-page-id result))]
					                    [:span {:class "quick-view-content"}
					                    [:a {:data-ref project-name :class "tag"
					                         :on-click (fn [] (call-api "append_block_in_page" uuid (str "[[" project-name "]]")))}
					                     project-name]]))
					                results)])
					  
					  :inputs [:current-page]
					  }
					  #+END_QUERY
					  ```
				- version 1.0
				  collapsed:: true
					- ```
					  #+BEGIN_QUERY
					  
					  {:query
					   [:find (pull ?project [:block/name])
					    :where
					    
					    (page-tags ?project #{"project"})
					    [?managers :block/name ?name]
					    [(contains? #{"focus"} ?name)]
					  
					    [?refs-project :block/refs ?project]
					    [?refs-project :block/parent ?project-ref-parent]
					  
					    [?project-ref-parent :block/refs ?managers]]
					   :result-transform (fn [result]
					                       (if (empty? result)
					                         [{:block/name "\uf4a5 none"}]
					                         (sort-by (fn [r] (get r :block/name "none")) result)))
					   :view (fn [result]
					           [:div
					  [:span {:class "quick-view-label"} "focus"]
					                  
					          [:span {:class "quick-view-content"} (for [r result] 
					                    (let [project-name (get r :block/name)]
					                      [:a {:data-ref project-name :class "tag"
					                           :on-click
					                           (fn [] (call-api "push_state" "14723" {:name project-name}))} project-name]))]        
					                  ]
					           )
					  }
					  #+END_QUERY
					  ```
		- ####  {{i ee21}} next appointment journal widget
		  id:: 664ceeec-b343-4d67-94d5-4db82220f06f
		  collapsed:: true
		      ![image.png](../assets/image_1719765578558_0.png){:height 28, :width 229}
			- ###  {{i f635}} information
				- for related {{i ef91}} project see [[logseq-events-and-appointments]]
			- ### {{i eb89}} current query
				- id:: 664e4055-3b72-4ba1-ac8b-48e34544629c
				  #+BEGIN_QUERY
				  {:query
				   [:find (min ?datestamp) ?date ?datestamp ?today-datestamp ?content ?props ?current-page-name ?activity-uuid ?current-page-uuid
				    :keys first-activity-datestamp date datestamp today-datestamp content properties current-page-name activity-card-uuid current-page-uuid
				    :in $ ?today-datestamp ?current-page-name
				  
				    :where
				    [?a :block/properties ?props]
				    [(get ?props :activity) ?activity]
				    [(get ?props :event) ?event]
				    [(get ?props :date) ?date]
				    [?a :block/refs ?refs]
				    [?a :block/content ?content]
				    [?refs :block/journal-day ?datestamp]
				    [(>= ?datestamp ?today-datestamp)]
				    [?a :block/uuid ?activity-uuid]
				  
				    [?p :block/name ?current-page-name]
				    [?p :block/uuid ?current-page-uuid]]
				  
				  
				   :view 
				   (fn [results]
				     (letfn [(format-event-string [event-name person-names]
				               (if (seq person-names)
				                 (str event-name " with " (clojure.string/join ", " person-names))
				                 (str event-name)))]
				       (let [current-page-uuid (str (get-in (first results) [:current-page-uuid]))
				             first-activity-datestamp (get-in (first results) [:first-activity-datestamp])
				             dates-set (get-in (first results) [:date])
				             date-str (if (set? dates-set)
				                        (first dates-set)
				                        dates-set)
				             today (get-in (first results) [:today-datestamp])
				             difference (- first-activity-datestamp today)
				  
				             next-events
				             (vec
				              (keep (fn [result]
				                      (when (= (get-in result [:datestamp]) first-activity-datestamp)
				                        result))
				                    results))
				  
				             formatted-events
				             (map
				              (fn [result]
				                (let [event-name (get-in result [:properties :event])
				                      person-names (get-in result [:properties :with])
				                      event-uuid (str (get-in result [:activity-card-uuid]))
				                      current-page-uuid (str (get-in (first results) [:current-page-uuid]))]
				                  {:name (format-event-string event-name person-names)
				                   :uuid event-uuid
				                   :current-page-uuid current-page-uuid}))
				              next-events)]
				  
				            [:div [:small
				                   (cond (empty? next-events) "no events"
				                         (= (count next-events) 1)  (for [event formatted-events] 
				                            [:a {:on-click (fn [] (call-api "append_block_in_page"
				                                                                 (:current-page-uuid event)
				                                                                 (str "{{i eb6d}} note for {{i f621}} [" (:name event)
				                                                                      "](((" (:uuid event) ")))")))} (:name event)])
				                         :else [:ul (for [event formatted-events] [:li [:a {:on-click
				                               (fn [] (call-api "append_block_in_page"
				                                                (:current-page-uuid event)
				                                                (str "{{i eb6d}} note for {{i f621}} [" (:name event)
				                                                     "](((" (:uuid event) ")))")))}
				                                                                        (:name event)]])])]])))
				                      
				              
				   :result-transform (fn [result]
				                       (sort-by (fn [r] (get-in r [:datestamp])) (fn [a b] (compare a b)) result))
				   :inputs [:today :current-page]}
				   
				  #+END_QUERY
			- ### {{i ea0b}} *version archive*
			  collapsed:: true
			  *older stuff*
				- v2.0 upcoming event and activities information **with quick-reference links**
				  *date retired*: **(current version)**
				  ![image.png](../assets/image_1719765578558_0.png){:height 31, :width 246}
					- {{i eac5}} Developed on [[Sunday, Jun 30th, 2024]] during {{i ea77}} [this iteration session](((66817d91-9f86-4ab3-9c45-face6802e356)))
				- v1.8 **simplified** event information
				  collapsed:: true
				  *date retired:* [[Sunday, Jun 30th, 2024]]
				    ![image.png](../assets/image_1719765241005_0.png){:height 24, :width 246}
					- simplified next appointment journal widget advanced query
					  ```datascript
					  #+BEGIN_QUERY
					  {:query
					   [:find (min ?day) ?date ?day ?content ?props ?today
					   :keys min-day date day content properties today
					    :in $ ?today
					  
					    :where
					    [?e :block/properties ?props]
					    [(get ?props :event) ?event]
					    [(get ?props :date) ?date]
					    [?e :block/refs ?refs]
					    [?e :block/content ?content]
					    [?refs :block/journal-day ?day]
					    [(>= ?day ?today)]
					  ]
					  
					  :view 
					   (fn [results]
					     (let
					      [min-day (get-in (first results) [:min-day])
					       date-set (get-in (first results) [:date])
					       date (if (set? date-set)
					              (first date-set)
					              date-set)
					       ;date (get-in (first results) [:date])
					       today (get-in (first results) [:today])
					       difference (- min-day today)
					       events
					       (map
					        (fn [result]
					          (let
					           [event-day (get-in result [:day])
					            event-name (get-in result [:properties :event])
					            person-names (get-in result [:properties :with])]
					            (when (= event-day min-day) 
					              (str
					               (when event-name
					                 (str event-name))
					               (when person-names
					                 (str " with " (clojure.string/join ", " (seq person-names))))))))
					        results)
					       filtered-events (filter some? events)
					       events-but-last (butlast filtered-events)
					       last-event (last filtered-events)] 
					       [:div
					        [:small
					         (if (= 1 (count filtered-events))
					           ;; No longer using date
					           ;; (str (first filtered-events) " on " date)
					            (str (first filtered-events))
					           (str 
					            (clojure.string/join ", " (butlast filtered-events))
					            ", and "
					            (last filtered-events)
					     
					            )
					  )]]))
					         
					         
					  
					  :result-transform (fn [result]
					                      (sort-by (fn [r] (get-in r [:day])) (fn [a b] (compare a b)) result))
					  
					   :inputs [:today]
					  }
					  #+END_QUERY
					  ```
				- v1.6 **appointment with** including date
				  collapsed:: true
				      ![image.png](../assets/image_1718922194354_0.png){:height 27, :width 327}
					- id:: 6660535c-5420-4cdb-ba03-5e9ab8e66213
					  ```markdown
					  #+BEGIN_QUERY
					  {:query
					   [:find (min ?day) ?date ?day ?content ?props ?today
					   :keys min-day date day content properties today
					    :in $ ?today
					  
					    :where
					    [?e :block/properties ?props]
					    [(get ?props :event) ?event]
					    [(get ?props :date) ?date]
					    [?e :block/refs ?refs]
					    [?e :block/content ?content]
					    [?refs :block/journal-day ?day]
					    [(>= ?day ?today)]
					  ]
					  
					  :view 
					   (fn [results]
					     (let
					      [min-day (get-in (first results) [:min-day])
					       date-set (get-in (first results) [:date])
					       date (if (set? date-set)
					              (first date-set)
					              date-set)
					       ;date (get-in (first results) [:date])
					       today (get-in (first results) [:today])
					       difference (- min-day today)
					       events
					       (map
					        (fn [result]
					          (let
					           [event-day (get-in result [:day])
					            event-name (get-in result [:properties :event])
					            person-names (get-in result [:properties :with])]
					            (when (= event-day min-day) 
					              (str
					               (when event-name
					                 (str event-name))
					               (when person-names
					                 (str " with " (clojure.string/join ", " (seq person-names))))))))
					        results)
					       filtered-events (filter some? events)
					       events-but-last (butlast filtered-events)
					       last-event (last filtered-events)] 
					       [:div
					        [:small
					         (if (= 1 (count filtered-events))
					           (str (first filtered-events) " on " date)
					           (str
					            (clojure.string/join ", " (butlast filtered-events))
					            ", and "
					            (last filtered-events)
					            " on " date))]]))
					         
					         
					  
					  :result-transform (fn [result]
					                      (sort-by (fn [r] (get-in r [:day])) (fn [a b] (compare a b)) result))
					  
					   :inputs [:today]
					  }
					  #+END_QUERY
					  ```
				- v1.5 **broken** version of event, with, and date
				  collapsed:: true
				      ![image.png](../assets/image_1718922309388_0.png){:height 39, :width 352}
					- ```datascript
					  #+BEGIN_QUERY
					  {:query
					   [:find (min ?day) ?date ?day ?content ?props ?today
					   :keys min-day date day content properties today
					    :in $ ?today
					  
					    :where
					    [?e :block/properties ?props]
					    [(get ?props :event) ?event]
					    [(get ?props :date) ?date]
					    [?e :block/refs ?refs]
					    [?e :block/content ?content]
					    [?refs :block/journal-day ?day]
					    [(>= ?day ?today)]
					  ]
					  
					  :view 
					   (fn [results]
					     (let
					      [min-day
					       (get-in (first results) [:min-day])
					       date (get-in (first results) [:date])
					       today (get-in (first results) [:today])
					       difference (- min-day today)
					       events
					       (map
					        (fn [result]
					          (let
					           [event-day (get-in result [:day])
					            event-name (get-in result [:properties :event])
					            person-names (get-in result [:properties :with])]
					            (when (= event-day min-day) 
					              (str
					               (when event-name
					                 (str event-name))
					               (when person-names
					                 (str " with " (clojure.string/join ", " (seq person-names))))))))
					        results)
					       filtered-events (filter some? events)
					       events-but-last (butlast filtered-events)
					       last-event (last filtered-events)] 
					       [:div
					        [:small
					         (concat
					          (interpose
					           ", " 
					           (map 
					            (fn [event] event) 
					            events-but-last)) 
					          [", and " 
					           [:span (str last-event)]]) 
					         " on " date]]) )
					  
					  :result-transform (fn [result]
					                      (sort-by (fn [r] (get-in r [:day])) (fn [a b] (compare a b)) result))
					  
					   :inputs [:today]
					  }
					  #+END_QUERY
					  ```
		- #### {{i ee20}} future appointments list
		  id:: 66415c9e-ff58-4281-8007-160cb44fb8b3
			- id:: 66415ca6-d397-4fc1-97f1-95f7b516e6d1
			  #+BEGIN_QUERY
			  {:query
			   [:find (min ?journal-day) ?date ?journal-day ?content ?props ?today ?activity ?event ?uuid ?current-page
			    :keys min-day date journal-day content properties today activity event uuid current-page
			    :in $ ?today ?current-page
			    :where
			    [?b :block/properties ?props]
			    [(get
			      ?props :activity) ?activity]
			  ;[(contains? ?activity "ocrevus infusion")] 
			    [?e :block/properties ?props]
			    [(get ?props :event) ?event]
			    [(get ?props :date) ?date]
			    [?e :block/refs ?refs]
			    [?e :block/content ?content]
			    [?refs :block/journal-day ?journal-day]
			    [(> ?journal-day ?today)]
			  
			   [?e :block/uuid ?uuid] 
			    ]
			  
			   :result-transform  (fn [result] (sort-by (fn [r] (get-in r [:journal-day])) (fn [a b] (compare a b)) result))
			  
			   :view (letfn [(make-append-link [page block-content link-text]
			                                   [:a {:on-click
			                                        (fn [] (call-api "append_block_in_page"
			                                                         page
			                                                         block-content))}
			                                    link-text])
			                 (make-link [text destination]
			                   [:a {:on-click
			                        (fn []
			                          (call-api "push_state" "page" {:name destination}))} text])]
			           (fn [results]
			             [:div
			              [:table {:class "future-appointments"}
			               [:thead
			                [:tr
			                 [:th {:width "120px"} "Date"]
			                 [:th "Event"]]]
			               [:tbody
			                (for [result results]
			                  [:tr
			                   [:td (get-in result [:date])]
			                   [:td (make-append-link
			                         (get-in result [:current-page])
			                          (str "{{i-note}} text \n{{i-event}} [" (get-in result [:event]) "](" (get-in result [:uuid])")")
			                          (get-in result [:event]))        
			                   ]])]]])
			   )
			  
			          
			   :inputs [:today :current-page]
			   :breadcrumb-show? false
			   :children? false
			   :group-by-page? false}
			  #+END_QUERY
		- ####  {{i ec44}} current medication list
		  id:: 667a53af-9c93-4a1d-a01b-7e8b8fd22b53
		      ![image.png](../assets/image_1719766132026_0.png){:height 107, :width 337}
			- id:: 664cb068-64bb-4dc5-aa7e-b0678b63a6fe
			  #+BEGIN_QUERY
			  {:query
			   [:find ?mname ?date ?day ?dose
			    :keys mname date day dose
			    :where
			    [?m :block/properties ?props]
			    [(get ?props :medication) ?mname]
			    [(get ?props :dose) ?dose]
			    [?m :block/page ?p]
			    [?p :block/original-name ?day]
			    [?p :block/journal-day ?date]]
			   
			   :result-transform 
			   (letfn [(preprocess-mname [result]
			             (update result :mname first))
			           
			           (sort-entries [entries]
			             (->> entries
			                  (sort-by :date)
			                  (reverse)))
			           
			           (filter-active-medications [medication-entries]
			             (let [sorted-entries (sort-entries medication-entries)
			                   most-recent (first sorted-entries)]
			               (when (not= (:dose most-recent) "0 mg")
			                 sorted-entries)))
			           
			           (keep-most-recent [entries]
			             (first entries))
			           
			           (flatten-result [medication-map]
			             (let [[medication entry] (first medication-map)]
			               [entry]))
			  
			  ]
			     
			     (fn [results]
			       (->> results
			            (map preprocess-mname)
			            (group-by :mname)
			            (map (fn [[medication entries]]
			                   {medication (filter-active-medications entries)}))
			            (filter (fn [medication-map]
			                      (seq (val (first medication-map)))))
			            (map (fn [medication-map]
			                   (update-in medication-map [(key (first medication-map))] keep-most-recent)))
			            (mapcat flatten-result))))
			   
			   :view (fn [rows]
			           [:table {:class "medication-table"}
			            [:thead
			             [:tr
			              [:th "Medication name"]
			              [:th "Dose"]
			              [:th "Date"]]]
			            [:tbody
			             (for [r rows]
			               [:tr
			                [:td
			                 [:a {:on-click
			                      (fn [] (call-api "push_state" "page" {:name (str (get-in r [:mname]))}))}
			                  (get-in r [:mname])]]
			                [:td (get-in r [:dose])]
			                [:td (get-in r [:day])]])]])
			  }
			  #+END_QUERY
				- {{runpage exportquery}}
				  {{kitButton export,exportquery}}
			- #+BEGIN_QUERY
			  {:query
			  [:find ?mname ?date ?day ?dose
			  :keys mname date day dose
			  :where
			  [?m :block/properties ?props]
			  [(get ?props :medication) ?mname]
			  [(get ?props :dose) ?dose]
			  - [?m :block/page ?p]
			  [?p :block/original-name ?day]
			  [?p :block/journal-day ?date]]
			  :result-transform (fn [results]
			                     (->> results
			                          (group-by :mname)
			                          (map (fn [[med-name group]]
			                                 (reduce (fn [acc curr]
			                                           (if (> (get acc :date) (get curr :date))
			                                             acc
			                                             curr))
			                                         group)))
			                          (sort-by (comp - :date))))
			  :view (fn [rows] [:table
			                  [:thead [:tr
			                           [:th "Medication name"]
			                           [:th "Dose"]
			                           [:th "Date"]]] 
			                  [:tbody (for [r rows] 
			                            [:tr
			                             [:td [:a {:on-click (fn [] (call-api "push_state" "page" {:name (str (get-in r [:mname]))}))} 
			                                  (get-in r [:mname])]]
			                             [:td (get-in r [:dose])]
			                             [:td (get-in r [:day])]])
			                   ]])}
			  #+END_QUERY
		- #### {{i f21c}} grocery list quick-ref (journal widget)
		  id:: 6666f9ad-2b57-4f34-b088-41e5b3e5bd53
		  collapsed:: true
		      ![image.png](../assets/image_1719765985169_0.png){:height 30, :width 214}
		- #### {{i eaff}} online orders (journal widget)
		      ![image.png](../assets/image_1719766180275_0.png){:height 31, :width 135}
			- id:: 663f79d8-20d7-4027-9ff5-500ae36ff757
			  #+BEGIN_QUERY
			  {
			    :query [:find (pull ?b [*])
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
			  :result-transform (fn [result]
			                      (let [heading-pattern (re-pattern "^(TODO\\s+)")
			                            macro-pattern (re-pattern "\\{\\{[iI] ([a-fA-F0-9]{4})\\}\\}")
			                            replace-macro (fn [macro-match]
			                                            (str "&#x" (second macro-match) ";"))
			                            first-lines (map (fn [r]
			                                               (let [content (get-in r [:block/content])
			                                                     first-newline (str/index-of content "\n")
			                                                     line (if first-newline
			                                                            (subs content 0 first-newline)
			                                                            content)             
			                                                     line-without-heading (clojure.string/replace line heading-pattern "")
			                                                     line-with-glyphs (clojure.string/replace line-without-heading macro-pattern replace-macro)]
			                                                 {:text line-with-glyphs
			                                                  }))
			                                             result)]
			                        first-lines))
			   :view (fn [items]
			  [:div {:class "journal-quickview"}
			    [:div {:class "jq-icon-container"}
			      [:a {:class "jq-icon-link" :href "#/page/shopping"} "\ueaff"][:span {:class "jq-label"} "deliveries"]
			  ]
			    [:div {:class "jq-data"}
			      
			      [:span {:class "jq-items"} (interpose ", " (for [{:keys [text]} items] text))]]]
			   )
			  }
			  #+END_QUERY
			- id:: 663f8303-7fca-406d-83ed-d93002164105
			  #+BEGIN_QUERY
			  {:inputs ["grocery"]
			    :query [:find (pull ?b [*])
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
			     (let 
			      [heading-pattern (re-pattern "^(TODO\\s\\{\\{grocery\\}\\}\\s+)")
			       macro-pattern (re-pattern "\\{\\{[iI] ([a-fA-F0-9]{4})\\}\\}")
			       replace-macro (fn [macro-match] (str "&#x" (second macro-match) ";"))
			       first-lines (map (fn [r] (let [content (get-in r [:block/content])
			                                      first-newline (str/index-of content "\n")
			                                      line (if first-newline 
			                                             (subs content 0 first-newline) content)             
			                                      line-without-heading (clojure.string/replace line heading-pattern "")
			                                      line-with-glyphs (clojure.string/replace line-without-heading macro-pattern replace-macro)]
			                                  {:text line-with-glyphs }))
			                        result)]
			       first-lines))
			  :view (fn [items]
			  [:div {:class "journal-quickview"}
			   [:div {:class "jq-icon-container"}
			    [:a {:class "jq-icon-link" :href "#/page/grocery%20list"} "\uf21c"]
			    [:span {:class "jq-label"} " grocery"]
			  ]
			   [:div {:class "jq-data"}
			    [:span {:class "jq-items"} (interpose ", " (for [{:keys [text]} items] text))]]]
			  )
			  }
			  #+END_QUERY
		- #### {{i eafd}} logseq graph news
		  collapsed:: true
			- jump to: info  embed, history
			- id:: 66415d9e-5591-4219-bc68-eb54393bccff
			  #+BEGIN_QUERY
			  {:inputs ["news" :5d-before :today :current-page]
			  :query
			  [:find (pull ?b [*])
			  :in $ ?macro ?start ?end ?current-page
			  :where
			  [?m :block/properties ?props]
			  [(get ?props :logseq.macro-name) ?macros]
			  [(= ?macros ?macro)]
			  [?b :block/macros ?m]
			  [?b :block/page ?p]
			  [?p :block/journal-day ?j-day]
			  [(>= ?j-day ?start)]
			  [(<= ?j-day ?end)]
			  [?j :block/name ?current-page]
			  [?j :block/journal-day ?day]
			  [(= ?end ?day)]
			        ]
			   :result-transform :sort-by-journal-day
			  :breadcrumb-show? false
			  :children? false
			  :group-by-page? false
			  }
			  #+END_QUERY
		- {{i ef66}} Individual **medication dose**
		  id:: 660c9a6b-a79d-4bd7-bc24-02f8d0fb588a
		  collapsed:: true
		  *From dose changes in journal page*\
			- *Current dose is: 5mg*
			- ```edn
			  #+BEGIN_QUERY
			  {:query
			   [:find ?date ?day ?dose
			    :keys date day dose
			    :in $ ?medication
			    :where
			    [?m :block/properties ?props]
			    [(get ?props :medication) ?mname]
			    [(get ?props :dose) ?dose]
			    [(contains? ?mname ?medication)]
			    ;; ^- :medication contains name of current page
			    [?m :block/page ?p]
			    [?p :block/original-name ?day]
			    [?p :block/journal-day ?date]
			    ]
			   :inputs [:current-page]
			  :result-transform (fn [result]
			                       (sort-by (fn [h] 
			                                  (get h :date)) 
			                                (fn [a b] (compare b a)) 
			                                result))
			  
			   :view (fn [rows]
			           [:div
			           
			            (str "Current dose is ") 
			                 [:i (get (first rows) :dose)]
			  
			            ])}
			  }
			  #+END_QUERY
			  #[[advanced query]]
			  ```
	- ## Reusable queries
	  *that need to be manually added to a block*
	  #+BEGIN_QUERY
	  {:inputs [:current-block #{1 2 3 4 5}]
	    :query [:find (pull ?children [*])
	            :in $ ?cb ?heading-set
	            :where
	            [?children :block/parent ?cb]
	            [?children :block/properties ?prop]
	            [(get ?prop :heading) ?heading-value]
	            [(contains? ?heading-set ?heading-value)]
	    ] 
	  :result-transform (fn [result]
	                      (let [heading-pattern (re-pattern "^(#+\\s+)")
	                            first-lines (map (fn [r]
	                                               (let [content (get-in r [:block/content])
	                                                     first-newline (str/index-of content "\n")
	                                                     line (if first-newline
	                                                            (subs content 0 first-newline)
	                                                            content)
	                                                     uuid (get-in r [:block/uuid])]
	                                                 {:text (clojure.string/replace line heading-pattern "")
	                                                  :uuid uuid}))
	                                             result)]
	                        first-lines))
	  :view (fn [items]
	          [:div [:span {:class "ti"} "   \uf019 "]
	           (for [[idx {:keys [text uuid]}] (map-indexed vector items)]
	             (if (= idx (dec (count items)))
	               [:a {:href (str "logseq://graph/main?block-id=" uuid)} text]
	               [:span [:a {:href (str "logseq://graph/main?block-id=" uuid)} text] ", "]))])
	  }
	  #+END_QUERY
		- #### Macro-based tracker (for blocks)
		     ![image.png](../assets/image_1721831716907_0.png){:height 111, :width 243}
			- ### Description
				- Shows `TODO {{macro}}` blocks that reference the grandparent block.
			- ### Query code
			  {{code-inside}}
				- ```clj
				  #+BEGIN_QUERY
				  {:inputs [:parent-block "issue"]
				   :query
				   [:find (pull ?r [*]) ?uuid ?content ?first-line ?marker
				    :keys issue uuid content first-line state
				    :in $ ?parent-block ?macro-name
				    :where
				    [?parent-block :block/left ?component-block]
				  [?component-block :block/refs ?kit-page] ;; kit page
				    [?r :block/refs ?kit-page]
				  
				    [?r :block/marker ?marker]
				    ;(not [(contains? #{"DONE"} ?marker)])
				  
				    [?r :block/macros ?m]
				    [?m :block/properties ?props]
				    [(get ?props :logseq.macro-name) ?macros]
				    [(= ?macros ?macro-name)]
				  
				    ;; info we want, now that we have a match
				    [?r :block/uuid ?uuid]
				  
				    [?r :block/content ?content]
				    [(re-pattern "(?<=^(?:TODO|DONE) {{issue}} ).*") ?first-line-pattern]
				    [(re-find ?first-line-pattern ?content) ?first-line]
				  
				    ;[?r :block/page ?p]
				    ;[?p :block/journal-day ?date]
				  ]
				  
				   :view (letfn [(make-link [text destination]
				                            [:a {:on-click 
				                                 (fn [] 
				                                   (call-api "push_state" "page" {:name destination}))
				                                 } text])
				                 (make-marker-box [uuid marker content]
				                                  [:input
				                                   {:type "checkbox"
				                                    ;; checked attribute takes a boolean value
				                                    :checked (= marker "DONE")
				                                    :on-click
				                                    (fn []
				                                      (call-api "update_block" uuid
				                                                (str
				                                                 (if (= marker "DONE")
				                                                   "TODO"
				                                                   "DONE")
				                                                 " "
				                                                 (clojure.string/replace
				                                                  content
				                                                  (re-pattern "(TODO|DONE)\\s")
				                                                  ""))))}])
				                 ]
				          
				          (fn [results]
				           [:div
				            [:table {:class "future-appointments"}
				             [:thead
				              [:tr
				               [:th {:width "80"} "Status"]
				               [:th "Issue"]]]
				             [:tbody
				              (for [result results]
				                [:tr
				                 [:td
				                  (make-marker-box 
				                   (get-in result [:uuid]) 
				                   (get-in result [:state]) 
				                   (get-in result [:content])) 
				                  ]
				                 [:td 
				                  (make-link 
				                   (get-in result [:first-line]) 
				                   (get-in result [:uuid]))
				                  ]
				                 
				  
				                 ])]]]
				            )
				           
				           
				           )
				   }
				  #+END_QUERY
				  ```
		- #### Macro-based tracker (for pages)
		  collapsed:: true
		     ![image.png](../assets/image_1721831424254_0.png){:height 62, :width 197}
			- ### Boilerplate blocks
				- **1. On the tracking page**
				  collapsed:: true
					- `[[page-name]] component
						- *any text*
							- **REMOVE THE CODE FENCE**
							  ```
							  #+BEGIN_QUERY
							  {:inputs [:parent-block "issue"]
							   :query
							   [:find (pull ?r [*]) ?uuid ?content ?first-line ?marker
							    :keys issue uuid content first-line state
							    :in $ ?parent-block ?macro-name
							    :where
							    [?parent-block :block/left ?component-block]
							  [?component-block :block/refs ?kit-page] ;; kit page
							    [?r :block/refs ?kit-page]
							  
							    [?r :block/marker ?marker]
							    ;(not [(contains? #{"DONE"} ?marker)])
							  
							    [?r :block/macros ?m]
							    [?m :block/properties ?props]
							    [(get ?props :logseq.macro-name) ?macros]
							    [(= ?macros ?macro-name)]
							  
							    ;; info we want, now that we have a match
							    [?r :block/uuid ?uuid]
							  
							    [?r :block/content ?content]
							    [(re-pattern "(?<=^(?:TODO|DONE) {{issue}} ).*") ?first-line-pattern]
							    [(re-find ?first-line-pattern ?content) ?first-line]
							  
							    ;[?r :block/page ?p]
							    ;[?p :block/journal-day ?date]
							  ]
							  
							   :view (letfn [(make-link [text destination]
							                            [:a {:on-click 
							                                 (fn [] 
							                                   (call-api "push_state" "page" {:name destination}))
							                                 } text])
							                 (make-marker-box [uuid marker content]
							                                  [:input
							                                   {:type "checkbox"
							                                    ;; checked attribute takes a boolean value
							                                    :checked (= marker "DONE")
							                                    :on-click
							                                    (fn []
							                                      (call-api "update_block" uuid
							                                                (str
							                                                 (if (= marker "DONE")
							                                                   "TODO"
							                                                   "DONE")
							                                                 " "
							                                                 (clojure.string/replace
							                                                  content
							                                                  (re-pattern "(TODO|DONE)\\s")
							                                                  ""))))}])
							                 ]
							          
							          (fn [results]
							           [:div
							            [:table {:class "future-appointments"}
							             [:thead
							              [:tr
							               [:th {:width "80"} "Status"]
							               [:th "Issue"]]]
							             [:tbody
							              (for [result results]
							                [:tr
							                 [:td
							                  (make-marker-box 
							                   (get-in result [:uuid]) 
							                   (get-in result [:state]) 
							                   (get-in result [:content])) 
							                  ]
							                 [:td 
							                  (make-link 
							                   (get-in result [:first-line]) 
							                   (get-in result [:uuid]))
							                  ]
							                 
							  
							                 ])]]]
							            )
							           
							           
							           )
							   }
							  #+END_QUERY
							  ```
				- **2. On a journal page**
					- `TODO {{issue}} trackedPage is a bitch.
					  #[[trackedPage]]
			- ### [[Advanced query]]
			  {{code-inside}}
				- Advanced query
				  ```clojure
				  #+BEGIN_QUERY
				  {:inputs [:parent-block "issue"]
				   :query
				   [:find (pull ?r [*]) ?uuid ?content ?first-line ?marker
				    :keys issue uuid content first-line state
				    :in $ ?parent-block ?macro-name
				    :where
				    [?parent-block :block/left ?component-block]
				  [?component-block :block/refs ?kit-page] ;; kit page
				    [?r :block/refs ?kit-page]
				  
				    [?r :block/marker ?marker]
				    ;(not [(contains? #{"DONE"} ?marker)])
				  
				    [?r :block/macros ?m]
				    [?m :block/properties ?props]
				    [(get ?props :logseq.macro-name) ?macros]
				    [(= ?macros ?macro-name)]
				  
				    ;; info we want, now that we have a match
				    [?r :block/uuid ?uuid]
				  
				    [?r :block/content ?content]
				    [(re-pattern "(?<=^(?:TODO|DONE) {{issue}} ).*") ?first-line-pattern]
				    [(re-find ?first-line-pattern ?content) ?first-line]
				  
				    ;[?r :block/page ?p]
				    ;[?p :block/journal-day ?date]
				  ]
				  
				   :view (letfn [(make-link [text destination]
				                            [:a {:on-click 
				                                 (fn [] 
				                                   (call-api "push_state" "page" {:name destination}))
				                                 } text])
				                 (make-marker-box [uuid marker content]
				                                  [:input
				                                   {:type "checkbox"
				                                    ;; checked attribute takes a boolean value
				                                    :checked (= marker "DONE")
				                                    :on-click
				                                    (fn []
				                                      (call-api "update_block" uuid
				                                                (str
				                                                 (if (= marker "DONE")
				                                                   "TODO"
				                                                   "DONE")
				                                                 " "
				                                                 (clojure.string/replace
				                                                  content
				                                                  (re-pattern "(TODO|DONE)\\s")
				                                                  ""))))}])
				                 ]
				          
				          (fn [results]
				           [:div
				            [:table {:class "future-appointments"}
				             [:thead
				              [:tr
				               [:th {:width "80"} "Status"]
				               [:th "Issue"]]]
				             [:tbody
				              (for [result results]
				                [:tr
				                 [:td
				                  (make-marker-box 
				                   (get-in result [:uuid]) 
				                   (get-in result [:state]) 
				                   (get-in result [:content])) 
				                  ]
				                 [:td 
				                  (make-link 
				                   (get-in result [:first-line]) 
				                   (get-in result [:uuid]))
				                  ]
				                 
				  
				                 ])]]]
				            )
				           
				           
				           )
				   }
				  #+END_QUERY
				  ```
		- #### Section contents (with icons)
		  collapsed:: true
		    ![image.png](../assets/image_1719767371213_0.png){:height 83, :width 213}
			- ```code
			  #+BEGIN_QUERY
			  {:inputs [:current-block #{1 2 3 4 5}]
			   :query [:find (pull ?children [*])
			           :in $ ?cb ?heading-set
			           :where
			           [?children :block/parent ?cb]
			           [?children :block/properties ?prop]
			           [(get ?prop :heading) ?heading-value]
			           [(contains? ?heading-set ?heading-value)]
			           ]
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
			  ```
		- #### Section contents (no icons)
		  id:: 65f7767a-9fe3-4b51-a564-c36be58ce5fa
		  collapsed:: true
		    ![image.png](../assets/image_1719767073419_0.png){:height 35, :width 169}
			- Linked list of children w/ headers (dynamically specified)
			- ```datalog
			  
			  #+BEGIN_QUERY
			  {:inputs [:current-block #{1 2 3 4 5}]
			    :query [:find (pull ?children [*])
			            :in $ ?cb ?heading-set
			            :where
			            [?children :block/parent ?cb]
			            [?children :block/properties ?prop]
			            [(get ?prop :heading) ?heading-value]
			            [(contains? ?heading-set ?heading-value)]
			    ] 
			  :result-transform (fn [result]
			                      (let [heading-pattern (re-pattern "^(#+\\s+)")
			                            first-lines (map (fn [r]
			                                               (let [content (get-in r [:block/content])
			                                                     first-newline (str/index-of content "\n")
			                                                     line (if first-newline
			                                                            (subs content 0 first-newline)
			                                                            content)
			                                                     uuid (get-in r [:block/uuid])]
			                                                 {:text (clojure.string/replace line heading-pattern "")
			                                                  :uuid uuid}))
			                                             result)]
			                        first-lines))
			  :view (fn [items]
			          [:div
			           (for [[idx {:keys [text uuid]}] (map-indexed vector items)]
			             (if (= idx (dec (count items)))
			               [:a {:href (str "logseq://graph/main?block-id=" uuid)} text]
			               [:span [:a {:href (str "logseq://graph/main?block-id=" uuid)} text] ", "]))])
			  }
			  #+END_QUERY
			  ```
		- #### Page table of contents
		  id:: 65f61ef5-45b1-4c58-b2b5-bced3827ae44
		  collapsed:: true
		  ![image.png](../assets/image_1713994770190_0.png){:height 59, :width 241}
			- [[Wednesday, Apr 24th, 2024]]: Created an improved and updated **page table of contents**.
			  Improvement: fixes text being rendered in `.ti` font.
			  (see ((662becd7-fa05-45af-b368-bfe0144befc9)) )
			- #### improved table of content
			  id:: 662becd7-fa05-45af-b368-bfe0144befc9
			  collapsed:: true
				- ```md
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
				  ```
			- 2024-03-10 (code block)
			  collapsed:: true
				- ```datalog
				  #+BEGIN_QUERY
				  {
				    :inputs [:parent-block #{1 2 3}]
				    :query [:find (pull ?children [*])
				            :in $ ?cb ?heading-set
				            :where
				            [?children :block/parent ?cb]
				            [?children :block/properties ?prop]
				            [(get ?prop :heading) ?heading-value]
				            [(contains? ?heading-set ?heading-value)]
				    ]
				  :result-transform (fn [result]
				                      (let [heading-pattern (re-pattern "^(#+\\s+)")
				                            macro-pattern (re-pattern "\\{\\{[iI] ([a-fA-F0-9]{4})\\}\\}")
				                            replace-macro (fn [macro-match]
				                                            (str "&#x" (second macro-match) ";"))
				                            first-lines (map (fn [r]
				                                               (let [content (get-in r [:block/content])
				                                                     first-newline (str/index-of content "\n")
				                                                     line (if first-newline
				                                                            (subs content 0 first-newline)
				                                                            content)
				                                                     uuid (get-in r [:block/uuid])
				                                                     line-without-heading (clojure.string/replace line heading-pattern "")
				                                                     line-with-glyphs (clojure.string/replace line-without-heading macro-pattern replace-macro)]
				                                                 {:text line-with-glyphs
				                                                  :uuid uuid}))
				                                             result)]
				                        first-lines))
				  :view (fn [items]
				          [:div
				           (interpose ", "
				             (for [{:keys [text uuid]} items]
				               [:a {:class "tag" :href (str "logseq://graph/main?block-id=" uuid)
				                    :dangerouslySetInnerHTML {:__html text}}]))])
				  }
				  #+END_QUERY
				  ```
			- 2024-03-05 (code block)
			  collapsed:: true
				- ```datalog
				  {
				    :inputs [:parent-block #{1 2 3}]
				    :query [:find (pull ?children [*])
				            :in $ ?cb ?heading-set
				            :where
				            [?children :block/parent ?cb]
				            [?children :block/properties ?prop]
				            [(get ?prop :heading) ?heading-value]
				            [(contains? ?heading-set ?heading-value)]
				    ]
				  :result-transform (fn [result]
				                      (let [heading-pattern (re-pattern "^(#+\\s+)")
				                            macro-pattern (re-pattern "\\{\\{[iI] ([a-fA-F0-9]{4})\\}\\}")
				                            replace-macro (fn [macro-match]
				                                            (str "&#x" (second macro-match) ";"))
				                            first-lines (map (fn [r]
				                                               (let [content (get-in r [:block/content])
				                                                     first-newline (str/index-of content "\n")
				                                                     line (if first-newline
				                                                            (subs content 0 first-newline)
				                                                            content)
				                                                     uuid (get-in r [:block/uuid])
				                                                     line-without-heading (clojure.string/replace line heading-pattern "")
				                                                     line-with-glyphs (clojure.string/replace line-without-heading macro-pattern replace-macro)]
				                                                 {:text line-with-glyphs
				                                                  :uuid uuid}))
				                                             result)]
				                        first-lines))
				  :view (fn [items]
				          [:div
				           (interpose ", "
				             (for [{:keys [text uuid]} items]
				               [:a {:class "tag" :href (str "logseq://graph/main?block-id=" uuid)
				                    :dangerouslySetInnerHTML {:__html text}}]))])
				  }
				  ```
		- Show **last exfoliation date**
		  collapsed:: true
		  *Date of last `:block/marker { #{"DONE"} }` under `:block/parent` with specific ref*
			- ```clj
			  {:query
			   [:find ?name ?day ?routine-element
			   :keys name day routine-element
			    :in $ ?routine-name ?routine-element
			    :where
			    ;; Block is child of "skin-care routine"
			    [?bid-scr :block/name ?routine-name]
			    [?bid-ref-scr :block/refs ?bid-scr]
			    [?bid-chd-ref-scr :block/parent ?bid-ref-scr]
			    ;; Block has reference to "exfoliation"
			    [?bid-exf :block/name ?routine-element]
			    [?bid-chd-ref-scr :block/refs ?bid-exf]
			    [?bid-chd-ref-scr :block/marker "DONE"] ; is done
			  
			    [?bid-chd-ref-scr :block/page ?result-page]
			    [?result-page :block/original-name ?name]
			    [?result-page :block/journal-day ?day]
			    ]
			   :inputs ["skin-care routine" "exfoliation"]
			   :result-transform (fn [result]
			                       (reverse (sort-by (fn [h] 
			                                  (get h :day)) result)))
			  :view (fn [rows]
			          [:div [:b 
			                 (str "last " 
			                      (get (first rows) :routine-element))] 
			           (str ": " 
			                (get (first rows) :name))])
			   }
			  
			  ```
		- Find **lost blocks**
		  id:: 65ff0dba-73e5-4e18-b24d-e3647f09eb31
		  collapsed:: true
		  That ended up on other pages
			- ```datalog
			  id:: 65fb3d5b-62ff-4797-a485-b9c7b06474f4
			  #+BEGIN_QUERY
			  {:query
			   [:find (pull ?b [*])
			    :in $ ?current-page ?property-name
			    :where
			    [?b :block/properties ?prop]
			    [(get ?prop ?property-name)]
			    [?b :block/page ?p]
			    [?p :block/name ?page-name]
			    [(not= ?current-page ?page-name)]
			    ]
			   ;; Change :template to what ever property you desire to find located
			   ;; On pages other than the current one.
			   :inputs [:current-page :template]
			   }
			  #+END_QUERY
			  ```
		- Ordered **clickable task blocks**
		  collapsed:: true
		  Makes a Grocery items list
			- ```datalog
			   {:query [:find (pull ?b [*])
			     :where
			      ; Add the criteria for which ?b you want to find here. I've added all tasks as an example.
			      [?b :block/marker ?m]
			      (not [(contains? #{"DONE" "CANCELED"} ?m)] )
			      [?t :block/name "buy"]
			      [?b :block/refs ?t]
			      ;[?b :block/properties ?props]
			      (property ?b :goods-category "food")
			   
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
			          (update m :block/properties ; update the block properties
			            (fn [u] (assoc u :scheduled (get-in m [:block/scheduled] "-") :deadline (get-in m [:block/deadline] "-") ) ) ; associate the scheduled and deadline attribute values, if no value use -
			          )
			        ) result)
			      )
			    )
			    :breadcrumb-show? false
			   }
			  ```
		- Show **unfinished tasks** on `:current-page`
		  collapsed:: true
			- ![2024-02-08-23-10-36.jpeg](../assets/2024-02-08-23-10-36.jpeg)
			- ```clj
			  #+BEGIN_PINNED
			  
			  #+BEGIN_QUERY
			  {:title [:h2 "Open Tasks ?page"]
			   :query [
			           :find (pull ?b [*])
			           :in $ ?page
			           :where 
			           [?b :block/marker ?marker]
			           (task ?b #{"TODO"})
			           (page ?b ?page)
			          ]
			   :inputs [:current-page]
			  }
			  #+END_QUERY 
			  #+END_PINNED
			  ```
		- Results from **dynamic input** text
		    {{I eb1c}} Find an icon
		- **query** dynamic input: markers
		  collapsed:: true
		  Match markers specified in :inputs
		  `:inputs [:current-page #{"TODO" "DOING"}]`
			- ![image.png](../assets/image_1711462196038_0.png)
			- ```
			  #+BEGIN_QUERY
			  {
			  :inputs [:current-page #{"TODO" "DOING"}]
			  :query [:find (pull ?b [*])
			  :in $ ?current-page ?markers
			  :where
			  [?p :block/name ?current-page]
			  [?b :block/page ?p]
			  [?b :block/marker ?m]
			  [(contains? ?markers ?m)]
			  ]
			  }
			  #+END_QUERY
			  ```
	- ## Previous page-queries
	  *Queries located on a page, but versioned here*
		- ### Shopping list -> In basket
			- **version 1.2** {{code-inside}}
			  id:: 669137d3-3f99-4931-9dff-3c584e43c00d
			  Shows items crossed off today, or nothing.
			  from June 12, 2024
			- **version 1.0** {{code-inside}}
			  id:: 669136b1-ac6e-4a40-abc3-50c3687cf2dd
			  collapsed:: true
			  Shows items crossed off today, or "no results found".
			  from June 12, 2024
			  
			  *state: no items*
			  ![image.png](../assets/image_1720792834135_0.png){:height 65, :width 165}
			  
			  *state: items*
			  ![image.png](../assets/image_1720792873059_0.png){:height 63, :width 200}
				- in shopping basket query 
				  ```datascript
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
				  
				   :breadcrumb-show? false}
				   :breadcrumb-show? false
				  }
				  #+END_QUERY
				  ```
- ## {{i efc5}} datalog language reference
  cateloguing advanced query syntax elements
  #+BEGIN_QUERY
  {
    :query [:find (pull ?children [*])
            :in $ ?cb ?heading-set
            :where
            [?children :block/parent ?cb]
            [?children :block/properties ?prop]
            [(get ?prop :heading) ?heading-value]
            [(contains? ?heading-set ?heading-value)]
    ]
    :inputs [:current-block #{1 2 3 4}]
  :result-transform (fn [result]
                      (let [heading-pattern (re-pattern "^(#+\\s+)")
                            first-lines (map (fn [r]
                                               (let [content (get-in r [:block/content])
                                                     first-newline (str/index-of content "\n")
                                                     line (if first-newline
                                                            (subs content 0 first-newline)
                                                            content)
                                                     uuid (get-in r [:block/uuid])]
                                                 {:text (clojure.string/replace line heading-pattern "")
                                                  :uuid uuid}))
                                             result)]
                        first-lines))
  :view (fn [items]
          [:div
           (for [[idx {:keys [text uuid]}] (map-indexed vector items)]
             (if (= idx (dec (count items)))
               [:a {:href (str "logseq://graph/main?block-id=" uuid) :class "tag"} text]
               [:span [:a {:href (str "logseq://graph/main?block-id=" uuid) :class "tag"} text] ", "]))])
  }
  #+END_QUERY
	- #### {{i f3f3}} Database utility functions
	  id:: 65c59bb1-08f0-4e2f-bf0f-a7d9e5a4bb79
	  collapsed:: true
	  Keywords for `:inputs`
	  *(e.g. `:current-page`, `:query-page`, etc*)
	  {{Il ec1c,logseq db.cljs:L77,https://github.com/logseq/logseq/blob/c3df737390d4728edc865136c07ee74860bce39a/deps/graph-parser/src/logseq/graph_parser/util/db.cljs#L77}}
		- #+BEGIN_QUERY
		  {:query
		   [:find ?input ?input-txt
		    :keys input input-txt
		    :in $ ?input ?input-txt
		    :where
		    [_]]
		  
		   :inputs [:current-page ":current-page"]
		  
		   :view (fn [rows]
		           [:div
		            [:code (get (first rows) :input-txt)]
		            (str " is ") 
		                 [:i (get (first rows) :input)]
		            ])}
		  #+END_QUERY
		- #+BEGIN_QUERY
		  {:query
		   [:find ?input ?input-txt
		    :keys input input-txt
		    :in $ ?input ?input-txt
		    :where
		    [_]]
		  
		   :inputs [:query-page ":query-page"]
		  
		   :view (fn [rows]
		           [:div
		            [:code (get (first rows) :input-txt)]
		            (str " is ") 
		                 [:i (get (first rows) :input)]
		            ])}
		  #+END_QUERY
		- #+BEGIN_QUERY
		  {:query
		   [:find ?input ?input-txt
		    :keys input input-txt
		    :in $ ?input ?input-txt
		    :where
		    [_]]
		  
		   :inputs [:current-block ":current-block"]
		  
		   :view (fn [rows]
		           [:div
		            [:code (get (first rows) :input-txt)]
		            (str " is ") 
		                 [:i (get (first rows) :input)]
		            ])}
		  #+END_QUERY
		- #+BEGIN_QUERY
		  {:query
		   [:find ?input ?input-txt
		    :keys input input-txt
		    :in $ ?input ?input-txt
		    :where
		    [_]]
		  
		   :inputs [:parent-block ":parent-block"]
		  
		   :view (fn [rows]
		           [:div
		            [:code (get (first rows) :input-txt)]
		            (str " is ") 
		                 [:i (get (first rows) :input)]
		            ])}
		  #+END_QUERY
		- #+BEGIN_QUERY
		  {:query
		   [:find ?input ?input-txt
		    :keys input input-txt
		    :in $ ?input ?input-txt
		    :where
		    [_]]
		  
		   :inputs [:today ":today"]
		  
		   :view (fn [rows]
		           [:div
		            [:code (get (first rows) :input-txt)]
		            (str " is ") 
		                 [:i (get (first rows) :input)]
		            ])}
		  #+END_QUERY
		- #+BEGIN_QUERY
		  {:query
		   [:find ?input ?input-txt
		    :keys input input-txt
		    :in $ ?input ?input-txt
		    :where
		    [_]]
		  
		   :inputs [:yesterday ":yesterday"]
		  
		   :view (fn [rows]
		           [:div
		            [:code (get (first rows) :input-txt)]
		            (str " is ") 
		                 [:i (get (first rows) :input)]
		            ])}
		  #+END_QUERY
		- #+BEGIN_QUERY
		  {:query
		   [:find ?input ?input-txt
		    :keys input input-txt
		    :in $ ?input ?input-txt
		    :where
		    [_]]
		  
		   :inputs [:tomorrow ":tomorrow"]
		  
		   :view (fn [rows]
		           [:div
		            [:code (get (first rows) :input-txt)]
		            (str " is ") 
		                 [:i (get (first rows) :input)]
		            ])}
		  #+END_QUERY
		- #+BEGIN_QUERY
		  {:query
		   [:find ?input ?input-txt
		    :keys input input-txt
		    :in $ ?input ?input-txt
		    :where
		    [_]]
		  
		   :inputs [:right-now-ms ":right-now"]
		  
		   :view (fn [rows]
		           [:div
		            [:code (get (first rows) :input-txt)]
		            (str " is ") 
		                 [:i (get (first rows) :input)]
		            ])}
		  #+END_QUERY
		- #+BEGIN_QUERY
		  {:query
		   [:find ?input ?input-txt
		    :keys input input-txt
		    :in $ ?input ?input-txt
		    :where
		    [_]]
		  
		   :inputs [:start-of-today-ms ":start-of-today-ms"]
		  
		   :view (fn [rows]
		           [:div
		            [:code (get (first rows) :input-txt)]
		            (str " is ") 
		                 [:i (get (first rows) :input)]
		            ])}
		  #+END_QUERY
		- #+BEGIN_QUERY
		  {:query
		   [:find ?input ?input-txt
		    :keys input input-txt
		    :in $ ?input ?input-txt
		    :where
		    [_]]
		  
		   :inputs [:+3d ":+3d"]
		  
		   :view (fn [rows]
		           [:div
		            [:code (get (first rows) :input-txt)]
		            (str " is ") 
		                 [:i (get (first rows) :input)]
		            ])}
		  #+END_QUERY
	- #### DSL rule reference
	  collapsed:: true
	  `:where` clause helpers
	  *(e.g. `(page-tags ?p ?t)`)*
	  {{il ec1c,logseq/rules.cljc:63,https://github.com/logseq/logseq/blob/53257d0919713f6096087fc188b80224742fe502/deps/db/src/logseq/db/rules.cljc#L63}}
		- For more information see
		- (page-property ?p ?key ?val)
		  collapsed:: true
			- [(page-property ?p ?key ?val)
			       [?p :block/name]
			       [?p :block/properties ?prop]
			       [(get ?prop ?key) ?v]
			       (or [(= ?v ?val)] [(contains? ?v ?val)])]
		- (has-page-property ?p ?key)
		  collapsed:: true
			- [(has-page-property ?p ?key)
			       [?p :block/name]
			       [?p :block/properties ?prop]
			       [(get ?prop ?key)]]
		- (task ?b ?markers)
		  collapsed:: true
			- [(task ?b ?markers)
			     [?b :block/marker ?marker]
			     [(contains? ?markers ?marker)]]
		- (priority ?b ?priorities)
		  collapsed:: true
			- [(priority ?b ?priorities)
			     [?b :block/priority ?priority]
			     [(contains? ?priorities ?priority)]]
		- (page-tags ?p ?tags)
		  collapsed:: true
			- [(page-tags ?p ?tags)
			     [?p :block/tags ?t]
			     [?t :block/name ?tag]
			     [(contains? ?tags ?tag)]]
		- (all-page-tags ?p)
		  collapsed:: true
			- [(all-page-tags ?p)
			     [_ :block/tags ?p]]
		- (between ?b ?start ?end)
		  collapsed:: true
			- [(between ?b ?start ?end)
			     [?b :block/page ?p]
			     [?p :block/journal? true]
			     [?p :block/journal-day ?d]
			     [(>= ?d ?start)]
			     [(<= ?d ?end)]]
		- (has-property ?b ?prop)
		  collapsed:: true
			- [(has-property ?b ?prop)
			     [?b :block/properties ?bp]
			     [(missing? $ ?b :block/name)]
			     [(get ?bp ?prop)]]
		- (block-content ?b ?query)
		  collapsed:: true
			- [(block-content ?b ?query)
			     [?b :block/content ?content]
			     [(clojure.string/includes? ?content ?query)]]
		- (page ?b ?page-name)
		  collapsed:: true
			- [(page ?b ?page-name)
			     [?b :block/page ?bp]
			     [?bp :block/name ?page-name]]
		- (namespace ?p ?namespace)
		  collapsed:: true
			- [(namespace ?p ?namespace)
			     [?p :block/namespace ?parent]
			     [?parent :block/name ?namespace]]
		- (property ?b ?key ?val)
		  collapsed:: true
			- [(property ?b ?key ?val)
			     [?b :block/properties ?prop]
			     [(missing? $ ?b :block/name)]
			     [(get ?prop ?key) ?v]
			     [(str ?val) ?str-val]
			     (or [(= ?v ?val)]
			         [(contains? ?v ?val)]
			         ;; For integer pages that aren't strings
			         [(contains? ?v ?str-val)])]
		- (page-ref ?b ?page-name)
		  collapsed:: true
			- [(page-ref ?b ?page-name)
			     [?b :block/path-refs ?br]
			     [?br :block/name ?page-name]]})
		- *page-tags*
		  `(page-tags ?page #{"tagname"}`
		- block property
		  `(property ?p :type "Player")`
		- get-children
		  `(get-children ?parent ?child)`
	- #### query predicate functions
	  id:: 6666f9ad-ef7d-455e-8319-906283ee8dcc
	  collapsed:: true
	  (*for the* `:where` *clause*)
	  {{il ec1c,datascript/built_ins.cljc:L81,https://https://github.com/tonsky/datascript/blob/9e3ad968ec6b25b53963f3f96c8f6cae6713d918/src/datascript/built_ins.cljc#L81}}
		- **raw list** of functions
		  collapsed:: true
		  *from source*
			- ```clj
			  (def query-fns {
			    '= =, 
			    '== ==,
			    'not= not=,
			    '!= not=,
			    '< less, 
			    '> greater,
			    '<= less-equal,
			    '>= greater-equal,
			    '+ +,
			    '- -, 
			    '* *, 
			    '/ /,
			    'quot quot, 
			    'rem rem,
			    'mod mod, 
			    'inc inc,
			    'dec dec, 
			    'max max, 
			    'min min, 
			    'zero? zero?,
			    'pos? pos?,
			    'neg? neg?,
			    'even? even?,
			    'odd? odd?,
			    'compare compare,
			    'rand rand, 
			    'rand-int rand-int,
			    'true? true?, 
			    'false? false?, 
			    'nil? nil?, 
			    'some? some?,
			    'not not, 
			    'and and-fn,
			    'or or-fn,
			    'complement complement,
			    'identical? identical?,
			    'identity identity,
			    'keyword keyword, 
			    'meta meta,
			    'name name, 
			    'namespace namespace,
			    'type type,
			    'vector vector,
			    'list list, 
			    'set set,
			    'hash-map hash-map,
			    'array-map array-map,
			    'count count,
			    'range range, 
			    'not-empty not-empty,
			    'empty? empty?, 
			    'contains? contains?,
			    'str str,
			    'subs, subs,
			    'get get, 
			    'pr-str pr-str,
			    'print-str print-str,
			    'println-str println-str,
			    'prn-str prn-str,
			    're-find re-find, 
			    're-matches re-matches,
			    're-seq re-seq,
			    're-pattern re-pattern,
			    '-differ? -differ?,
			    'get-else -get-else,
			    'get-some -get-some,
			    'missing? -missing?,
			    'ground identity,
			    'clojure.string/blank? str/blank?,
			    'clojure.string/includes? str/includes?,
			    'clojure.string/starts-with? str/starts-with?,
			    'clojure.string/ends-with? str/ends-with?
			    'tuple vector, 
			    'untuple identity
			  })
			  ```
		- function **explanation**
		  *as a table*
			- *note: use the `/page, code function documentation` template when adding new info*
			- silly query attempt at automation
			  id:: 66a2b92f-68a8-48fe-b9fa-921a4518ef4b
			  collapsed:: true
				- ```
				  #+BEGIN_QUERY
				  {:query
				  [:find ?doc-page ?details ?header ?b
				  :keys doc-page details header b
				  :where
				  [?p :block/properties ?properties]
				  [(get ?properties :datascript) ?datascript]
				  [(= ?datascript "query predicate function")]
				  [?p :block/page ?doc-page]
				  
				  
				  [?d :block/name "details"]
				  [?b :block/path-refs ?d]
				  [?b :block/page ?doc-page]
				  [?b :block/content ?details]
				  
				  [?header :block/refs ?d]
				  ]
				  :view :pprint
				  }
				  #+END_QUERY
				  ```
			- {{embed ((66785bca-acd2-4401-95e2-32efb961ccb3))}}
		- Conversational analyses
		  collapsed:: true
			- ((66749df3-627b-4ef6-8e5d-88f843e2ccbc))
			  collapsed:: true
				- {{embed ((66749df3-627b-4ef6-8e5d-88f843e2ccbc))}}
	- #### clojure functions
	  available in `:result-transform` and `:view`
		- ((66749df3-8843-473e-bfe7-d32bfce93215))
		  collapsed:: true
			- {{embed ((66749df3-8843-473e-bfe7-d32bfce93215))}}
- ## {{i eb6d}}  concept snippets
  advanced queries labeled by use case
	- ### :rules
	  *clause expressions*
		- show query **results only**
		  collapsed:: true
			- ```
			   :breadcrumb-show? false
			   :children? false
			   :group-by-page? false
			  ```
				-
	- ### :where
	  *clause expressions*
		- blocks **without property** *:property-name*
		  collapsed:: true
			- Exclude blocks with property value *x*
			- ```clj
			  (not (property ?b :goods-category "food"))
			  ```
		- blocks **with property** *:property-name*
		  collapsed:: true
			- ```datalog
			    [?b :block/properties ?prop]
			    [(contains? ?prop :goods-category)]
			  ```
		- blocks **with :property value** *"value"*
		  collapsed:: true
			- ```datalog
			  [?b :block/properties ?props]
			  [(get ?props :goods-category) ?category]
			  [(contains? ?category "mushroom")]
			  ```
		- blocks where **marker isn't #{"DONE" "CANCELED"}**
		  collapsed:: true
			- ```datalog
			  [?b :block/marker ?m]
			  (not [(contains? #{"DONE" "CANCELED"} ?m)] )
			  ```
		- blocks **with a given \{\{macro}}**
		  id:: 6638f4e8-101f-4d66-8aa5-0782d73d32f7
			- collapsed:: true
			  ```datalog
			  {:inputs ["grocery"]
			   :query
			   [:find (pull ?b [*])
			    :in $ ?macro
			    :where
			    [?m :block/properties ?props]
			    [(get ?props :logseq.macro-name) ?macros]
			    [(= ?macros ?macro)]
			    [?b :block/macros ?m]
			   ]
			   }
			  ```
			- news!!!
			  collapsed:: true
			  #+BEGIN_QUERY
			  {:inputs ["news"]
			   :query 
			    [:find (pull ?b [*])
			     :in $ ?macro
			     :where
			      [?m :block/properties ?props]
			      [(get ?props :logseq.macro-name) ?macros]
			      [(= ?macros ?macro)]
			      [?b :block/macros ?m]
			     ]
			   :results-transform
			    (fn [result] (sort-by (fn [s] (get s :block/journal-day)) (fn [a b] (compare b a)) result))
			  
			    :breadcrumb-show? false
			    :children? false
			    :group-by-page? false}
			  #+END_QUERY
	- ### :view
		- construct an **unordered list**
		  collapsed:: true
			- {{nested-code-block}}
			  collapsed:: true
				- copy_second_sibling:
				  ```js
				  const second_child = logseq.api.get_next_sibling_block(this.nestedMacroUuid);
				  const pattern = new RegExp("```(?:[a-zA-Z\\d_-]*)*\\n(.+?)\\n```", "usgm");
				  const match = pattern.exec(second_child.content);
				  const clipboard = `${match[1]}\n\n[source](((${second_child.uuid})))`;
				  navigator.clipboard.writeText(clipboard);
				  ```
			- ```clj
			  #+BEGIN_QUERY
			  {:query
			      [:find (pull ?p [*])
			          :where
			          (page-tags ?p #{"page"})
			      ]
			      :result-transform (fn [result] 
			          (sort-by 
			          (fn [r] (get r :block/name))
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
			  ```
		- get **first line** of block content
		  collapsed:: true
			- {{nested-code-block}}
			  collapsed:: true
				- copy_second_sibling:
				  ```js
				  const second_child = logseq.api.get_next_sibling_block(this.nestedMacroUuid);
				  const pattern = new RegExp("```(?:[a-zA-Z\\d_-]*)*\\n(.+?)\\n```", "usgm");
				  const match = pattern.exec(second_child.content);
				  const clipboard = `${match[1]}\n\n[source](((${second_child.uuid})))`;
				  navigator.clipboard.writeText(clipboard);
				  ```
			- ```
			  #+BEGIN_QUERY
			  {:query
			  [:find ?template ?first-line
			  :keys template first-line
			  :in $ ?page-name
			  :where
			  ;; Find the page by name
			  [?page :block/name ?page-name]
			  ;; Find the parent block that has a reference to the page
			  [?child :block/refs ?page]
			  [?child :block/parent ?parent]
			  ;; Get the properties and content of the parent block
			  [?parent :block/properties ?props]
			  [?parent :block/content ?full-content]
			  ;; Check if the properties contain a template and extract it
			  [(contains? ?props :template)]
			  [(get ?props :template) ?template]
			  ;; Use re-pattern and re-find to extract the first line of content
			  [(re-pattern "^.*") ?first-line-pattern]
			  [(re-find ?first-line-pattern ?full-content) ?first-line]
			  ]
			  :inputs ["logseq-news"]
			  :result-transform (fn [result]
			                     (map (fn [row] 
			                            {
			                             :template (get row :template)
			                             :first-line (get row :first-line)}) result))
			  :view (fn [rows]
			         (let [row (first rows)]
			           [:div (str "New ((" (get row :first-line) ")) using template `" (get row :template) "`\n{{i eafd}} #logseq-news")]))
			  }
			  #+END_QUERY
			  
			  #+BEGIN_QUERY
			  {:query
			   [:find ?template ?first-line
			    :keys template first-line
			    :in $ ?page-name
			    :where
			    ;; Find the page by name
			    [?page :block/name ?page-name]
			    ;; Find the parent block that has a reference to the page
			    [?child :block/refs ?page]
			    [?child :block/parent ?parent]
			    ;; Get the properties and content of the parent block
			    [?parent :block/properties ?props]
			    [?parent :block/content ?full-content]
			    ;; Check if the properties contain a template and extract it
			    [(contains? ?props :template)]
			    [(get ?props :template) ?template]
			    ;; Use re-pattern and re-find to extract the first line of content
			    [(re-pattern "^.*") ?first-line-pattern]
			    [(re-find ?first-line-pattern ?full-content) ?first-line]
			   ]
			   :inputs ["logseq-news"]
			   :result-transform (fn [result]
			                       (map (fn [row] 
			                              {
			                               :template (get row :template)
			                               :first-line (get row :first-line)}) result))
			   :view (fn [rows]
			           (let [row (first rows)]
			             ;; Hiccup syntax to render the content with evaluated markdown and macros
			             [:div
			              [:span "New " [:block-ref (get row :first-line)] " using template `"]
			              [:code (get row :template)]
			              "`\n"
			              [:span "{{i eafd}} #logseq-news"]]))
			  }
			  
			  #+END_QUERY
			  ```
		- make a dd clickable :block/marker box
		  id:: 66a05e34-42c8-4cf7-8b0b-27cb0943d9ac
		  to `:view` function
			- :view function excerpt
				- ```
				  :view (letfn [(make-marker-box [uuid marker content]
				                      [:input
				                       {:type "checkbox"
				                                    ;; checked attribute takes a boolean value
				                        :checked (= marker "DONE")
				                        :on-click
				                        (fn []
				                          (call-api "update_block" uuid
				                                    (str
				                                     (if (= marker "DONE")
				                                       "TODO"
				                                       "DONE")
				                                     " "
				                                     (clojure.string/replace
				                                      content
				                                      (re-pattern "(TODO|DONE)\\s")
				                                      ""))))}])]
				              (fn [results])
				              [:div
				               [:table {:class "future-appointments"}
				                [:thead
				                 [:tr
				                  [:th "Status"]
				                  [:th "Issue"]]]
				                [:tbody
				                 (for [result results]
				                   [:tr
				                    [:td
				                     (make-marker-box
				                      (get-in result [:uuid])
				                      (get-in result [:state])
				                      (get-in result [:content]))]
				                    [:td
				                     (get-in result [:content])]])]]])
				  ```
			- Full query example
			  collapsed:: true
				- **Mock journal page**
					- TODO {{issue}} ah shit
					  ((66a05f8b-929c-4c83-beb9-61b01849f890))
					- TODO {{issue}} Belly buttons have fluff in them
					  ((66a05f8b-929c-4c83-beb9-61b01849f890))
				- **Mock project page**
					- {{component}} Belly buttons
					  id:: 66a05f8b-929c-4c83-beb9-61b01849f890
						- *Component issue tracker*
							- id:: 66a05fe3-c2a0-4867-8339-2cfa9060003d
							  #+BEGIN_QUERY
							  {:inputs [:parent-block "issue"]
							   :query
							   [:find (pull ?r [*]) ?uuid ?content ?first-line ?marker
							    :keys issue uuid content first-line state
							    :in $ ?parent-block ?macro-name
							    :where
							    [?parent-block :block/left ?component-block]
							    [?r :block/refs ?component-block]
							  
							    [?r :block/marker ?marker]
							    ;(not [(contains? #{"DONE"} ?marker)])
							  
							    [?r :block/macros ?m]
							    [?m :block/properties ?props]
							    [(get ?props :logseq.macro-name) ?macros]
							    [(= ?macros ?macro-name)]
							  
							    ;; info we want, now that we have a match
							    [?r :block/uuid ?uuid]
							  
							    [?r :block/content ?content]
							    [(re-pattern "(?<=^(?:TODO|DONE) {{issue}} ).*") ?first-line-pattern]
							    [(re-find ?first-line-pattern ?content) ?first-line]
							  
							    ;[?r :block/page ?p]
							    ;[?p :block/journal-day ?date]
							  ]
							  
							   :view (letfn [(make-link [text destination]
							                            [:a {:on-click 
							                                 (fn [] 
							                                   (call-api "push_state" "page" {:name destination}))
							                                 } text])
							                 (make-marker-box [uuid marker content]
							                                  [:input
							                                   {:type "checkbox"
							                                    ;; checked attribute takes a boolean value
							                                    :checked (= marker "DONE")
							                                    :on-click
							                                    (fn []
							                                      (call-api "update_block" uuid
							                                                (str
							                                                 (if (= marker "DONE")
							                                                   "TODO"
							                                                   "DONE")
							                                                 " "
							                                                 (clojure.string/replace
							                                                  content
							                                                  (re-pattern "(TODO|DONE)\\s")
							                                                  ""))))}])
							                 ]
							          
							          (fn [results]
							           [:div
							            [:table {:class "future-appointments"}
							             [:thead
							              [:tr
							               [:th {:width "80"} "Status"]
							               [:th "Issue"]]]
							             [:tbody
							              (for [result results]
							                [:tr
							                 [:td
							                  (make-marker-box 
							                   (get-in result [:uuid]) 
							                   (get-in result [:state]) 
							                   (get-in result [:content])) 
							                  ]
							                 [:td 
							                  (make-link 
							                   (get-in result [:first-line]) 
							                   (get-in result [:uuid]))
							                  ]
							                 
							  
							                 ])]]]
							            )
							           
							           
							           )
							   }
							  #+END_QUERY
						- *UI/UX* designs
							- Here's some stuff I'm working on
	- ### :result-transform
		- Sort by result [:block/page **:journal-day**]
		  id:: 663a1f42-6ff8-4a1b-a953-cca70c833e52
			- ```datalog
			  :result-transform
			    (fn [result] 
			      (sort-by (comp - (fn [r] (get-in r [:block/page :block/journal-day]))) result)
			      )
			  ```
		- **Sort by date created** (or failing that, date last modified)
		  collapsed:: true
			- {{nested-code-block}}
			  collapsed:: true
				- copy_second_sibling:
				  ```js
				  const second_child = logseq.api.get_next_sibling_block(this.nestedMacroUuid);
				  const pattern = new RegExp("```(?:[a-zA-Z\\d_-]*)*\\n(.+?)\\n```", "usgm");
				  const match = pattern.exec(second_child.content);
				  const clipboard = `${match[1]}\n\n[source](((${second_child.uuid})))`;
				  navigator.clipboard.writeText(clipboard);
				  ```
			- ```datalog
			   :result-transform 
			    (fn [result]
			      (sort-by 
			        (fn [r] 
			          (let [journal-day (get-in r [:block/page :block/journal-day])
			                created-at (get r :block/created-at)]
			            (- (or journal-day created-at))))
			        result))
			   :breadcrumb-show? false
			  ```
			- {{il eb6c,Bing: sort by date created,https://sl.bing.net/4TV8A6wblI}}
		- Click to complete TODO blocks via **call-api**
		  collapsed:: true
		    `:result-transform` `:view`
		  {{button copy,copy_second_sibling,ea6f,long squat}}
			- {{nested-code-block}}
			  collapsed:: true
				- copy_second_sibling:
				  ```js
				  const second_child = logseq.api.get_next_sibling_block(this.nestedMacroUuid);
				  const pattern = new RegExp("```(?:[a-zA-Z\\d_-]*)*\\n(.+?)\\n```", "usgm");
				  const match = pattern.exec(second_child.content);
				  const clipboard = `${match[1]}\n\n[source](((${second_child.uuid})))`;
				  navigator.clipboard.writeText(clipboard);
				  ```
			- ```datalog
			  {
			   :query [:find (pull ?b [*])
			           :in $ ?current
			           :where
			           [?p :block/name ?current]
			           [?b :block/page ?p]
			           (task ?b #{"TODO" "DONE"})
			         ]
			   :inputs [:current-page]
			   :table-view? true
			   :view (fn [r] 
			     [:table 
			       [:thead 
			         [:tr [:td "task"] [:td "marker"]]
			       ]
			       [:tbody
			         (map (fn [m] 
			           (let [marker (get m :block/marker)
			                   content (clojure.string/replace (get m :block/content) (re-pattern "(TODO|LATER|DONE|DOING)\\s") "")] 
			            [:tr 
			              [:td content] 
			              [:td [:a {:on-click (fn [_] (call-api "update_block" (str (:block/uuid m)) (if (= marker "TODO") (str "DONE" " " content) (str "TODO" " " content))))} marker]]
			           ])
			          ) r)
			       ]
			     ]
			   )
			  }
			  ```
			- > it can be done with latest call-api ability (logseq nightly)
			- source: https://discord.com/channels/725182569297215569/743139225746145311/1047314074930782308
			- via https://discuss.logseq.com/t/show-todo-toggle-in-query-table-view/12720/5
		- Clickable **links** using `call-api` and `push_state()`
		    `:result-transform` `:view`
		  {{button copy,copy_second_sibling,ea6f,long squat}}
			- {{nested-code-block}}
			  collapsed:: true
				- copy_second_sibling:
				  ```js
				  const second_child = logseq.api.get_next_sibling_block(this.nestedMacroUuid);
				  const pattern = new RegExp("```(?:[a-zA-Z\\d_-]*)*\\n(.+?)\\n```", "usgm");
				  const match = pattern.exec(second_child.content);
				  const clipboard = `${match[1]}\n\n[source](((${second_child.uuid})))`;
				  navigator.clipboard.writeText(clipboard);
				  ```
			- ### new way
			- ```
			  :view (letfn [(make-link [text destination]
			                  [:a {:on-click
			                       (fn []
			                         (call-api "push_state" "page" {:name destination}))} text])]
			  
			          (fn [results]
			            (make-link
			             (get-in result [:first-line])
			             (get-in result [:uuid]))))
			  
			  ```
			- #### Old way
			- ```
			  {:view (fn
			           ; the query will return an array with one item, so [[count]] will destructure the number
			           [[count]]
			           [:div
			            {:style {:color "#b1b1b1"}}
			            "There are "
			            [:span count]
			            " notes in the "
			            [:a {:data-ref "pile"
			                 :style {:color "#797979"}
			                 :on-click
			                 ; call-api is a magical call that allows you to call any API available
			                 ; in this case, it navigates to the "pile" page if you click the link
			                 (fn [] (call-api "push_state" "page" {:name "pile"}))} "pile"]
			            "."])
			   :query
			   [:find (count ?b)         ; return a single item - the total count of blocks
			    :where
			    [?pb :block/name "pile"] ; where pb is the block for a page named "pile"
			    [?b :block/refs ?pb]]}   ; and blocks reference it
			  ```
- ## {{i eb6e}} My functions
  collapsed:: true
  for `:result-transform` and `:view` clauses
	- ### {{i f38e}} `:result-transform` functions
		- #### Sort by journal day
		  id:: 663a1fa7-6f8c-4790-b8d5-8d7c0ffff815
		  collapsed:: true
		  `:sort-by-journal-day`
			- Implements ((663a1f42-6ff8-4a1b-a953-cca70c833e52))
	- ### {{i f4cb}} `:view` functions
- ## {{i eb6c}} Query prompts
  collapsed:: true
  *For conversations with Co-pilot*
	- ### Query predicate functions
	  collapsed:: true
		- #+BEGIN_QUOTE
		  Please read the following clojure source code for that defines the query predicate functions available for use in Logseq advanced queries as I am going to ask you some questions about it aferwards.
		  
		  Built-in query predicate functions from `datascript/src/datascript/built_ins.cljc:
		  ```clj
		  (def query-fns {
		    '= =, '== ==, 'not= not=, '!= not=,
		    '< less, '> greater, '<= less-equal, '>= greater-equal,
		    '+ +, '- -, '* *, '/ /,
		    'quot quot, 'rem rem, 'mod mod, 'inc inc, 'dec dec, 'max max, 'min min,
		    'zero? zero?, 'pos? pos?, 'neg? neg?, 'even? even?, 'odd? odd?, 'compare compare,
		    'rand rand, 'rand-int rand-int,
		    'true? true?, 'false? false?, 'nil? nil?, 'some? some?, 'not not, 'and and-fn, 'or or-fn,
		    'complement complement, 'identical? identical?,
		    'identity identity, 'keyword keyword, 'meta meta, 'name name, 'namespace namespace, 'type type,
		    'vector vector, 'list list, 'set set, 'hash-map hash-map, 'array-map array-map,
		    'count count, 'range range, 'not-empty not-empty, 'empty? empty?, 'contains? contains?,
		    'str str, 'subs, subs, 'get get,
		    'pr-str pr-str, 'print-str print-str, 'println-str println-str, 'prn-str prn-str,
		    're-find re-find, 're-matches re-matches, 're-seq re-seq, 're-pattern re-pattern,
		    '-differ? -differ?, 'get-else -get-else, 'get-some -get-some, 'missing? -missing?, 'ground identity,
		    'clojure.string/blank? str/blank?, 'clojure.string/includes? str/includes?,
		    'clojure.string/starts-with? str/starts-with?, 'clojure.string/ends-with? str/ends-with?
		    'tuple vector, 'untuple identity
		  })
		  ```
		  #+END_QUOTE
	- ### :result-transform
	  collapsed:: true
		- #+BEGIN_QUOTE
		  Please carefully read the following Clojure code relating to proper use of :result-transform in logseq advanced queries. I am going to ask you some questions about it afterwards.
		  ```clj
		  (def namespaces
		     {#?@(:clj ['clojure.lang clojure-lang])
		      'clojure.core clojure-core
		      'clojure.string {:obj clojure-string-namespace
		                       'blank? (copy-var clojure.string/blank? clojure-string-namespace) 
		                       /*
		                         Note: All vars listed below are copies from the clojure.string namespace.
		                         The standard expression used to copy each var has been removed to simplify this list.
		                         Refer to the above line for the full expression.
		                       */
		                       'capitalize ;; From this point on I am trimming the (copy-var clojure.string/<var> clojure-string-namespace)
		                       'ends-with? ;; trimmed
		                       'escape ;; ...
		                       'includes? 
		                       'index-of 
		                       'join 
		                       'last-index-of 
		                       'lower-case 
		                       'replace 
		                       'replace-first 
		                       'reverse 
		                       'split 
		                       'split-lines 
		                       'starts-with? 
		                       'trim 
		                       'trim-newline 
		                       'triml 
		                       'trimr 
		                       'upper-case 
		                       #?@(:clj ['re-quote-replacement])}
		      'clojure.set {:obj clojure-set-namespace
		                    'difference (copy-var clojure.set/difference clojure-set-namespace)
		                    'index ;; I am trimming this out of the remaining vars: (copy-var clojure.set/index clojure-set-namespace)
		                    'intersection ;; trimmed
		                    'join ;; trimmed
		                    'map-invert ;; trimmed
		                    'project ;; ...
		                    'rename 
		                    'rename-keys
		                    'select
		                    'subset?
		                    'superset?
		                    'union}})
		  ```
		  #+END_QUOTE
	- ### DSL rules
	  collapsed:: true
		- #+BEGIN_QUOTE
		  File `deps/db/src/logseq/db/rules.cljc` in the logseq github repository:
		  ```clj
		  (ns ^:bb-compatible logseq.db.rules
		    "Datalog rules for use with logseq.db.schema")
		  
		  
		  (def ^:large-vars/data-var query-dsl-rules
		    "Rules used by frontend.db.query-dsl. The symbols ?b and ?p respectively refer
		    to block and page. Do not alter them as they are programmatically built by the
		    query-dsl ns"
		    {:page-property
		     '[(page-property ?p ?key ?val)
		       [?p :block/name]
		       [?p :block/properties ?prop]
		       [(get ?prop ?key) ?v]
		       (or [(= ?v ?val)] [(contains? ?v ?val)])]
		  
		     :has-page-property
		     '[(has-page-property ?p ?key)
		       [?p :block/name]
		       [?p :block/properties ?prop]
		       [(get ?prop ?key)]]
		  
		     :task
		     '[(task ?b ?markers)
		       [?b :block/marker ?marker]
		       [(contains? ?markers ?marker)]]
		  
		     :priority
		     '[(priority ?b ?priorities)
		       [?b :block/priority ?priority]
		       [(contains? ?priorities ?priority)]]
		  
		     :page-tags
		     '[(page-tags ?p ?tags)
		       [?p :block/tags ?t]
		       [?t :block/name ?tag]
		       [(contains? ?tags ?tag)]]
		  
		     :all-page-tags
		     '[(all-page-tags ?p)
		       [_ :block/tags ?p]]
		  
		     :between
		     '[(between ?b ?start ?end)
		       [?b :block/page ?p]
		       [?p :block/journal? true]
		       [?p :block/journal-day ?d]
		       [(>= ?d ?start)]
		       [(<= ?d ?end)]]
		  
		     :has-property
		     '[(has-property ?b ?prop)
		       [?b :block/properties ?bp]
		       [(missing? $ ?b :block/name)]
		       [(get ?bp ?prop)]]
		  
		     :block-content
		     '[(block-content ?b ?query)
		       [?b :block/content ?content]
		       [(clojure.string/includes? ?content ?query)]]
		  
		     :page
		     '[(page ?b ?page-name)
		       [?b :block/page ?bp]
		       [?bp :block/name ?page-name]]
		  
		     :namespace
		     '[(namespace ?p ?namespace)
		       [?p :block/namespace ?parent]
		       [?parent :block/name ?namespace]]
		  
		     :property
		     '[(property ?b ?key ?val)
		       [?b :block/properties ?prop]
		       [(missing? $ ?b :block/name)]
		       [(get ?prop ?key) ?v]
		       [(str ?val) ?str-val]
		       (or [(= ?v ?val)]
		           [(contains? ?v ?val)]
		           ;; For integer pages that aren't strings
		           [(contains? ?v ?str-val)])]
		  
		     :page-ref
		     '[(page-ref ?b ?page-name)
		       [?b :block/path-refs ?br]
		       [?br :block/name ?page-name]]})
		  
		  ```
		  #+END_QUOTE
- ### datascript code
  id:: 663a4752-f9b9-4dc2-b4bf-fb7b09d9c283
	- #### and
	  id:: 663a4799-cf84-4fa4-9a1b-88452254f1cf
	  collapsed:: true
	  {{i-github}} [datascript/parser.clj:L548](https://github.com/tonsky/datascript/blob/61edb9e76d92fad2106f9c01bc80e659a4292ea8/src/datascript/parser.cljc#L548)   {{button copy,copy_second_sibling,ea6f,long squat}}
		- {{nested-code-block}}
		  collapsed:: true
			- copy_second_sibling:
			  ```js
			  const second_child = logseq.api.get_next_sibling_block(this.nestedMacroUuid);
			  const pattern = new RegExp("```(?:[a-zA-Z\\d_-]*)*\\n(.+?)\\n```", "usgm");
			  const match = pattern.exec(second_child.content);
			  const clipboard = `${match[1]}\n\n[source](((${second_child.uuid})))`;
			  navigator.clipboard.writeText(clipboard);
			  ```
		- ```datalog
		  (defn parse-and [form]
		    (when (and (sequential? form)
		               (= 'and (first form)))
		      (let [clauses* (parse-clauses (next form))]
		        (if (not-empty clauses*)
		          (And. clauses*)
		          (raise "Cannot parse 'and' clause, expected [ 'and' clause+ ]"
		                 {:error :parser/where, :form form})))))
		  ```
	- #### or
	  collapsed:: true
	  {{i-github}} [datascript/parser.clj:L557](https://github.com/tonsky/datascript/blob/61edb9e76d92fad2106f9c01bc80e659a4292ea8/src/datascript/parser.cljc#L557)  {{button copy,copy_second_sibling,ea6f,long squat}}
		- {{nested-code-block}}
		  collapsed:: true
			- copy_second_sibling:
			  ```js
			  const second_child = logseq.api.get_next_sibling_block(this.nestedMacroUuid);
			  const pattern = new RegExp("```(?:[a-zA-Z\\d_-]*)*\\n(.+?)\\n```", "usgm");
			  const match = pattern.exec(second_child.content);
			  const clipboard = `${match[1]}\n\n[source](((${second_child.uuid})))`;
			  navigator.clipboard.writeText(clipboard);
			  ```
		- ```datalog
		  (defn parse-or [form]
		    (when-let [[source* next-form] (take-source form)]
		      (let [[sym & clauses] next-form]
		        (when (= 'or sym)
		          (if-let [clauses* (parse-seq (some-fn parse-and parse-clause) clauses)]
		            (-> (Or. source* (RuleVars. nil (collect-vars-distinct clauses*)) clauses*)
		                (with-source form)
		                (validate-or form))
		            (raise "Cannot parse 'or' clause, expected [ src-var? 'or' clause+ ]"
		                   {:error :parser/where, :form form}))))))
		  ```
	- #### or-join
	  collapsed:: true
	  {{i-github}} [datascript/parser.clj:L568](https://github.com/tonsky/datascript/blob/61edb9e76d92fad2106f9c01bc80e659a4292ea8/src/datascript/parser.cljc#L568)  {{button copy,copy_second_sibling,ea6f,long squat}}
		- {{nested-code-block}}
		  collapsed:: true
			- copy_second_sibling:
			  ```js
			  const second_child = logseq.api.get_next_sibling_block(this.nestedMacroUuid);
			  const pattern = new RegExp("```(?:[a-zA-Z\\d_-]*)*\\n(.+?)\\n```", "usgm");
			  const match = pattern.exec(second_child.content);
			  const clipboard = `${match[1]}\n\n[source](((${second_child.uuid})))`;
			  navigator.clipboard.writeText(clipboard);
			  ```
		- ```datalog
		  (defn parse-or-join [form]
		    (when-let [[source* next-form] (take-source form)]
		      (let [[sym vars & clauses] next-form]
		        (when (= 'or-join sym)
		          (let [vars*    (parse-rule-vars vars)
		                clauses* (parse-seq (some-fn parse-and parse-clause) clauses)]
		            (if (and vars* clauses*)
		              (-> (Or. source* vars* clauses*)
		                  (with-source form)
		                  (validate-or form))
		              (raise "Cannot parse 'or-join' clause, expected [ src-var? 'or-join' [variable+] clause+ ]"
		                     {:error :parser/where, :form form})))))))
		  ```
	- #### parsing...
	  collapsed:: true
	  {{i-github}} [datascript/parser.clj:L43](https://github.com/tonsky/datascript/blob/61edb9e76d92fad2106f9c01bc80e659a4292ea8/src/datascript/parser.cljc#L43)   {{button copy,copy_second_sibling,ea6f,long squat}}
		- {{nested-code-block}}
		  collapsed:: true
			- copy_second_sibling:
			  ```js
			  const second_child = logseq.api.get_next_sibling_block(this.nestedMacroUuid);
			  const pattern = new RegExp("```(?:[a-zA-Z\\d_-]*)*\\n(.+?)\\n```", "usgm");
			  const match = pattern.exec(second_child.content);
			  const clipboard = `${match[1]}\n\n[source](((${second_child.uuid})))`;
			  navigator.clipboard.writeText(clipboard);
			  ```
		- ```datalog
		  (defn parse-seq [parse-el form]
		    (when (sequential? form)
		      (reduce #(if-let [parsed (parse-el %2)]
		                 (conj %1 parsed)
		                 (reduced nil))
		              [] form)))
		  
		  (defn parse-where [form]
		    (or (parse-clauses form)
		        (raise "Cannot parse :where clause, expected [clause+]"
		               {:error :parser/where, :form form})))
		  
		  (defn parse-clauses [clauses]
		    (parse-seq parse-clause clauses))
		  
		  (defn parse-clause [form]
		    (or 
		        (parse-not       form)
		        (parse-not-join  form)
		        (parse-or        form)
		        (parse-or-join   form)
		        (parse-pred      form)
		        (parse-fn        form)
		        (parse-rule-expr form)
		        (parse-pattern   form)
		        (raise "Cannot parse clause, expected (data-pattern | pred-expr | fn-expr | rule-expr | not-clause | not-join-clause | or-clause | or-join-clause)"
		               {:error :parser/where, :form form} )))
		  ```
	- #### parse spec
	  collapsed:: true
	  {{i-github}} [datascript/parser.clj:L407](https://github.com/tonsky/datascript/blob/61edb9e76d92fad2106f9c01bc80e659a4292ea8/src/datascript/parser.cljc#L407)
		- ```datalog
		  ;; clause          = (data-pattern | pred-expr | fn-expr | rule-expr | not-clause | not-join-clause | or-clause | or-join-clause)
		  ;; data-pattern    = [ src-var? (variable | constant | '_')+ ]
		  ;; pred-expr       = [ [ pred fn-arg+ ] ]
		  ;; pred            = (plain-symbol | variable)
		  ;; fn-expr         = [ [ fn fn-arg+ ] binding ]
		  ;; fn              = (plain-symbol | variable)
		  ;; rule-expr       = [ src-var? rule-name (variable | constant | '_')+ ]
		  ;; not-clause      = [ src-var? 'not' clause+ ]
		  ;; not-join-clause = [ src-var? 'not-join' [ variable+ ] clause+ ]
		  ;; or-clause       = [ src-var? 'or' (clause | and-clause)+ ]
		  ;; or-join-clause  = [ src-var? 'or-join' rule-vars (clause | and-clause)+ ]
		  ;; and-clause      = [ 'and' clause+ ]
		  
		  (deftrecord Pattern   [source pattern])
		  (deftrecord Predicate [fn args])
		  (deftrecord Function  [fn args binding])
		  (deftrecord RuleExpr  [source name args]) ;; TODO rule with constant or '_' as argument
		  (deftrecord Not       [source vars clauses])
		  (deftrecord Or        [source rule-vars clauses])
		  (deftrecord And       [clauses])
		  
		  
		  (defn parse-pattern-el [form]
		    (or (parse-placeholder form)
		        (parse-variable form)
		        (parse-constant form)))
		  
		  (defn take-source [form]
		    (when (sequential? form)
		      (if-let [source* (parse-src-var (first form))]
		        [source* (next form)]
		        [(DefaultSrc.) form])))
		        
		  (defn parse-pattern [form]
		    (when-let [[source* next-form] (take-source form)]
		      (when-let [pattern* (parse-seq parse-pattern-el next-form)]
		        (if-not (empty? pattern*)
		          (with-source (Pattern. source* pattern*) form)
		          (raise "Pattern could not be empty"
		                 {:error :parser/where, :form form})))))
		  
		  (defn parse-call [form]
		    (when (sequential? form)
		      (let [[fn & args] form
		            args  (if (nil? args) [] args)
		            fn*   (or (parse-plain-symbol fn)
		                      (parse-variable fn))
		            args* (parse-seq parse-fn-arg args)]
		        (when (and fn* args*)
		          [fn* args*]))))
		  
		  (defn parse-pred [form]
		    (when (of-size? form 1)
		      (when-let [[fn* args*] (parse-call (first form))]
		        (-> (Predicate. fn* args*)
		            (with-source form)))))
		  
		  (defn parse-fn [form]
		    (when (of-size? form 2)
		      (let [[call binding] form]
		        (when-let [[fn* args*] (parse-call call)]
		          (when-let [binding* (parse-binding binding)]
		            (-> (Function. fn* args* binding*)
		                (with-source form)))))))
		  
		  (defn parse-rule-expr [form]
		    (when-let [[source* next-form] (take-source form)]
		      (let [[name & args] next-form
		            name* (parse-plain-symbol name)
		            args* (parse-seq parse-pattern-el args)]
		        (when name*
		          (cond
		            (empty? args)
		              (raise "rule-expr requires at least one argument"
		                     {:error :parser/where, :form form})
		            (nil? args*)
		              (raise "Cannot parse rule-expr arguments, expected [ (variable | constant | '_')+ ]"
		                     {:error :parser/where, :form form})
		            :else
		              (RuleExpr. source* name* args*)
		            )))))
		  ```
	- #### parse spec
	  collapsed:: true
	  {{i-github}} [datascript/parser.clj:L229](https://github.com/tonsky/datascript/blob/61edb9e76d92fad2106f9c01bc80e659a4292ea8/src/datascript/parser.cljc#L229)
		- ```datalog
		  ;; find-spec        = ':find' (find-rel | find-coll | find-tuple | find-scalar)
		  ;; find-rel         = find-elem+
		  ;; find-coll        = [ find-elem '...' ]
		  ;; find-scalar      = find-elem '.'
		  ;; find-tuple       = [ find-elem+ ]
		  ;; find-elem        = (variable | pull-expr | aggregate | custom-aggregate) 
		  ;; pull-expr        = [ 'pull' src-var? variable pull-pattern ]
		  ;; pull-pattern     = (constant | variable | plain-symbol)
		  ;; aggregate        = [ aggregate-fn fn-arg+ ]
		  ;; aggregate-fn     = plain-symbol
		  ;; custom-aggregate = [ 'aggregate' variable fn-arg+ ]
		  ```
- ### {{I eade}} resources
	- https://charleschiugit.github.io/page/logseq/queries/
	- https://www.reddit.com/r/logseq/comments/15yib2v/advanced_query_bootstrap_please_check_and_comment/