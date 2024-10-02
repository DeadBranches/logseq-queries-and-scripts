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
- See: [[:result-transform]] for interactive REPL
- ### {{i-cloud}} idea trackers
	- {{kitButton issues,collapseBlock,ea06,-button-style full-width small-caps}}
		- {{embed ((66ccdccf-f9e2-4028-b867-a7b5406fd634))}}
	- {{kitButton ideas,collapseBlock,ea76,-button-style full-width small-caps}}
		- {{embed ((66df909d-79a2-4532-917e-94d3bd8b32a8))}}
	- {{kitButton questions,collapseBlock,ea76,-button-style full-width small-caps}}
		- {{embed ((66df90b1-ccba-494b-94c9-76f3194e0963))}}
- Namespace reference
	- #+BEGIN_QUERY
	  {:title "find"
	   :query [:find (pull ?b [*])
	           :where
	           [?b :block/properties ?p]
	           [(get ?p :type) ?t]
	           [(= ?t "demo")]]
	   :view (fn [r] [:div.flex.flex-wrap.gap-4
	                  (for [ns (all-ns)]
	                    [:div [[:h2 (str ns)]
	                           [:div.grid.grid-cols-4
	                            (for
	                             [name (sort (keys (ns-publics ns)))]
	                              [:a {:href (str "https://clojuredocs.org/"
	                                              (str ns)
	                                              "/"
	                                              (str name))} (str name)])]]])])}
	  #+END_QUERY
- # {{i eff2}} Query library
  query:: ((65f7767a-9fe3-4b51-a564-c36be58ce5fa))
  *for re-use*
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
	- ## Embedable queries
	  {{i f635}} *`{{embed }}` these queries*
		- page tags or aliases
			- template
			  template:: query, page tags or aliases
			  template-including-parent:: false
				- {{embed ((66e9df6d-b316-46a7-9593-ce2abcd174b1))}}
				- query
				- id:: 66e9df6d-b316-46a7-9593-ce2abcd174b1
				  #+BEGIN_QUERY
				  {:inputs [:current-page]
				  :query
				  [:find  (pull ?t [:db/id :block/uuid :block/properties :block/tags :block/name])
				  ;;(pull ?t [*])
				   :in $ ?current-page
				   :where
				  
				  ;; Capture all aliases to this page in ?pa
				   [?cp :block/name ?current-page]
				   [?cp :block/alias ?pa]
				  
				  ;; Show all pages tagged with either this page's id or one of the pages with an alias to this page.
				   (or
				    [?t :block/tags ?pa]
				    [?t :block/tags ?cp])]
				  :result-transform
				  (letfn [(create-groups [property-value block-data]
				            (group-by (fn [item]
				                        (get-in item [:block/properties property-value]))
				                      block-data))
				          (alphabetize-maps [maps]
				            (into {}
				                  (map (fn [[k v]]
				                         [k (sort-by :block/name v)])
				                       maps)))]
				    (fn [results]
				      (->> results
				  
				           (create-groups :tags)
				         ;;(into (sorted-map-by (fn [a b] (compare (first a) (first b)))))
				        ;; (alphabetize-maps)
				           )))
				  :view
				  (fn [results]
				    [:div
				     (for [[group-name blocks] results]
				       [:div
				        [:b (str "Pages taged with " (apply str group-name))]
				        [:ul
				         (for [item blocks]
				           [:li [:a {:on-click (fn [_] 
				                                 (call-api "push_state" "page" {:name (:block/name item)} ))} (:block/name item)]])]])])
				  
				  }
				  #+END_QUERY
				- show blocks with ref to linked reference in parent block
				- template:: query, show references to link in parent
				  template-including-parent:: false
				- #+BEGIN_QUERY
				  ;; show blocks with ref to linked reference in parent block v1
				  {:inputs [:current-block :query-page]
				  :query
				  [:find (pull ?b [*])
				   :in $ ?current-block ?qp
				   :where
				   [?current-block :block/parent ?parent]
				   [?parent :block/refs ?ability-limitation]
				   [?b :block/refs ?ability-limitation]
				  
				  ;; Exclude current page from results
				   [?b :block/page ?ref-page]
				   [?ref-page :block/name ?ref-page-name]
				   [(not= ?ref-page-name ?qp)]]
				  :result-transform (fn [result]
				                      (if (empty? result)
				                        [[]]
				                        (sort-by (comp - (fn [r] (get-in r [:block/page :block/journal-day]))) result)))
				  
				  :view (fn [results]
				          (if (= results [[]]) 
				            "no results"
				            result))
				  
				  :group-by-page? true
				  }
				  #+END_QUERY
				- {{i f015}}  count of references to block
				     ![image.png](../assets/image_1726792772149_0.png){:height 36, :width 191}
				- to linked reference in parent block
				  template:: query, count of references in parent block
				  template-including-parent:: false
				- #+BEGIN_QUERY
				  ;; see number of references to linked reference in parent block
				  {:inputs [:current-block :current-page]
				  :query
				  [:find ?b
				   :in $ ?current-block ?qp
				   :where
				  
				   ;; target block is the block containing a linked reference for which
				   ;; we want to find other blocks who reference it
				    [?current-block :block/parent ?parent-block]
				    [(identity ?parent-block) ?target-block]
				   ;; [(identity ?current-block) ?target-block]
				  
				   [?target-block :block/refs ?ability-limitation]
				   [?b :block/refs ?ability-limitation]
				  
				   ;; Exclude current page from results
				   [?b :block/page ?ref-page]
				   [?ref-page :block/name ?ref-page-name]
				   [(not= ?ref-page-name ?qp)]]
				  
				  :result-transform (fn [result]
				                      (if (empty? result)
				                        [[]]
				                        result))
				  :view ;;:pprint 
				   (fn [results]
				           (let [result-count (count results)]
				             
				                          (if (= results [[]]) 
				                "" 
				                [:div [:small.italic (str "  see " result-count " references ->")]])))
				  }
				  
				  #+END_QUERY
				- to linked reference in current block
				  template:: query, count of references in current block
				  template-including-parent:: false
				- id:: 66e74343-77eb-4199-93ab-1d22b36e158d
				  #+BEGIN_QUERY
				  
				  {:inputs [:current-block :current-page]
				  :query
				  [:find ?b
				   :in $ ?current-block ?qp
				   :where
				  
				   ;; target block is the block containing a linked reference for which
				   ;; we want to find other blocks who reference it
				   ;; [?current-block :block/parent ?parent-block]
				   ;; [(identity ?parent-block) ?target-block]
				   [(identity ?current-block) ?target-block]
				  
				   [?target-block :block/refs ?ability-limitation]
				   [?b :block/refs ?ability-limitation]
				  
				   ;; Exclude current page from results
				   [?b :block/page ?ref-page]
				   [?ref-page :block/name ?ref-page-name]
				   [(not= ?ref-page-name ?qp)]]
				  
				  :result-transform (fn [result]
				                      (if (empty? result)
				                        [[]]
				                        result))
				  :view ;;:pprint 
				   (fn [results]
				           (let [result-count (count results)]
				             
				                          (if (= results [[]]) 
				                "" 
				                [:div [:small.italic (str "  see " result-count " references ->")]])))
				  }
				  #+END_QUERY
				- {{i eb6c}}  discussion topics
				  ![image.png](../assets/image_1726792556144_0.png){:height 162, :width 299}
				- open topics
				- id:: 66e5e078-e59c-4064-91cf-2c3eec36af87
				  #+BEGIN_QUERY
				  {:inputs [:current-page "topic"]
				  :query
				  [:find (pull ?b [*])
				  :in $ ?cp ?tag
				  :where
				  
				  [?p :block/name ?cp]
				  [?b :block/refs ?p]
				  
				  [?t :block/name ?tag]
				  [?t :block/alias ?ta]
				  (or 
				   [?b :block/refs ?t]
				   [?b :block/refs ?ta])
				  
				  
				  [?b :block/marker ?m]
				  [(contains? #{"TODO"} ?m)]
				  
				  [?b :block/properties ?props]
				  (or-join [?b ?props ?journal-day]
				           (and
				            ;; The block is in a journal page
				            [?b :block/page ?bp]
				            [?bp :block/journal-day ?journal-day]
				            [(some? ?journal-day)])
				  
				           (and
				            ;; The block has a journal page ref in the property :created-on
				            [(get ?props :created-on) ?created-on]
				            [?cp :block/original-name ?all-page-names]
				            [(contains? ?created-on ?all-page-names)]
				            [?cp :block/journal-day ?journal-day]
				            [(some? ?journal-day)])
				  
				           (and
				            ;; There is a block in a journal page referencing ?b
				            [?r :block/refs ?b]
				            [?r :block/page ?rp]
				            [?rp :block/journal-day ?journal-day]
				            [(some? ?journal-day)])
				            )
				  ]
				  
				  :result-transform
				   (fn [result] 
				     (sort-by (comp - (fn [r] (get-in r [:block/page :block/journal-day]))) result)
				     )
				  
				  :group-by-page? true
				  }
				  
				  #+END_QUERY
				- covered topics
				- id:: 66e5e0c4-d1cc-4598-8e00-07f0abad84b0
				  #+BEGIN_QUERY
				  {:inputs [:current-page]
				  :query
				  [:find (pull ?b [*])
				  :in $ ?cp
				  :where
				  
				  [?p :block/name ?cp]
				  [?t :block/name "topics"]
				  [?ta :block/alias ?t]
				  
				  [?b :block/refs ?p]
				  (or 
				   [?b :block/refs ?t]
				   [?b :block/refs ?ta])
				  
				  
				  [?b :block/marker ?m]
				  [(contains? #{"DONE"} ?m)]
				  ]
				  
				  :group-by-page? true
				  }
				  #+END_QUERY
				- {{i fd1f}}  appointment summary
				- previous appointment summary
				- id:: 66e5dcb2-1960-4c28-9fe3-45371b023f0e
				  #+BEGIN_QUERY
				  {:inputs [:current-page :today]
				  :query
				  [:find (pull ?b [*]) 
				  ;;:keys block cp ;;with-name
				  :in $ ?cp ?today-datestamp
				  :where
				  
				  
				  [?b :block/properties ?props]
				   [(get ?props :activity) ?activity]
				   [(get ?props :event "") ?event]
				   [(get ?props :date) ?date]
				   [(get ?props :with "") ?with]
				  
				  
				  ;; I want to use :current-page as the input for the `:with` field.
				  ;; However, :current-page and :with cannot be directly compared.
				  ;; 
				  ;; {:current-page "@dr teplitsky"} ;; :block/name format
				  ;; {:with  #{"@Dr Teplitsky"}}         ;; :block/original-name format
				  ;; 
				  ;; :current-page returns in :block/name format (lower case)
				  ;; :with is in original case.
				  ;;
				  ;; Therefore, I need to convert :current-page to :block/original-name
				  ;; 
				  [?w :block/name ?cp]
				  [?w :block/original-name ?original-name]
				  [(contains? ?with ?original-name)]
				   ;; (pr-ln ?cp) => "@dr teplitsky"
				   ;; (pr-ln ?original-name) => "@Dr Teplitsky"
				  
				  ;; :journal-day for :date
				  [?d :block/original-name ?bn]
				  [(contains? ?date ?bn)]
				  [?d :block/journal-day ?activity-datestamp]
				  [(< ?activity-datestamp ?today-datestamp)]
				  
				  ]
				  
				  
				  :result-transform
				   (fn [result] 
				     (sort-by (comp - (fn [r] (get-in r [:block/page :block/journal-day]))) result)
				     )
				  
				  ;; :view :pprint
				  :view (fn [results]
				       [:div [:table.future-event-table.stop-click.compact
				              [:caption "Past appointments"]
				              [:thead [:tr
				                       [:th "date"] [:th "details"]]]
				              [:tbody
				               (for [item results]
				                 [:tr
				                 [:td (str (first (get-in item [:block/properties :date])))]
				                 [:td (str (get-in item [:block/properties-text-values :event]))]
				                 ]
				                 )
				               
				               ]]]
				         )
				  
				  :children? true
				  :breadcrumb-show? true
				  :group-by-page? true
				  }
				  #+END_QUERY
				- previous appointment table
				- id:: 66e5dcbc-31a8-4e66-a0b3-2b393d3b4919
				  #+BEGIN_QUERY
				  {:inputs [:current-page :today]
				  :query
				  [:find (pull ?b [*]) 
				  ;;:keys block cp ;;with-name
				  :in $ ?cp ?today-datestamp
				  :where
				  
				  
				  [?b :block/properties ?props]
				   [(get ?props :activity) ?activity]
				   [(get ?props :event "") ?event]
				   [(get ?props :date) ?date]
				   [(get ?props :with "") ?with]
				  
				  
				  ;; I want to use :current-page as the input for the `:with` field.
				  ;; However, :current-page and :with cannot be directly compared.
				  ;; 
				  ;; {:current-page "@dr teplitsky"} ;; :block/name format
				  ;; {:with  #{"@Dr Teplitsky"}}         ;; :block/original-name format
				  ;; 
				  ;; :current-page returns in :block/name format (lower case)
				  ;; :with is in original case.
				  ;;
				  ;; Therefore, I need to convert :current-page to :block/original-name
				  ;; 
				  [?w :block/name ?cp]
				  [?w :block/original-name ?original-name]
				  [(contains? ?with ?original-name)]
				   ;; (pr-ln ?cp) => "@dr teplitsky"
				   ;; (pr-ln ?original-name) => "@Dr Teplitsky"
				  
				  ;; :journal-day for :date
				  [?d :block/original-name ?bn]
				  [(contains? ?date ?bn)]
				  [?d :block/journal-day ?activity-datestamp]
				  [(< ?activity-datestamp ?today-datestamp)]
				  
				  ]
				  
				  
				  :result-transform
				   (fn [result] 
				     (sort-by (comp - (fn [r] (get-in r [:block/page :block/journal-day]))) result)
				     )
				  ;;:view :pprint
				  
				  
				  :children? true
				  :breadcrumb-show? true
				  :group-by-page? true
				  }
				  #+END_QUERY
				- future appointments summary
				-
				- future appointments table
				- id:: 66e5dcc2-148a-4f77-88fc-bad898a3fdde
				  #+BEGIN_QUERY
				  {:inputs [:current-page :today]
				  :query
				  [:find (pull ?b [*]) 
				  ;;:keys block cp ;;with-name
				  :in $ ?cp ?today-datestamp
				  :where
				  
				  
				  [?b :block/properties ?props]
				   [(get ?props :activity) ?activity]
				   [(get ?props :event "") ?event]
				   [(get ?props :date) ?date]
				   [(get ?props :with "") ?with]
				  
				  
				  ;; I want to use :current-page as the input for the `:with` field.
				  ;; However, :current-page and :with cannot be directly compared.
				  ;; 
				  ;; {:current-page "@dr teplitsky"} ;; :block/name format
				  ;; {:with  #{"@Dr Teplitsky"}}         ;; :block/original-name format
				  ;; 
				  ;; :current-page returns in :block/name format (lower case)
				  ;; :with is in original case.
				  ;;
				  ;; Therefore, I need to convert :current-page to :block/original-name
				  ;; 
				  [?w :block/name ?cp]
				  [?w :block/original-name ?original-name]
				  [(contains? ?with ?original-name)]
				   ;; (pr-ln ?cp) => "@dr teplitsky"
				   ;; (pr-ln ?original-name) => "@Dr Teplitsky"
				  
				  ;; :journal-day for :date
				  [?d :block/original-name ?bn]
				  [(contains? ?date ?bn)]
				  [?d :block/journal-day ?activity-datestamp]
				  [(>= ?activity-datestamp ?today-datestamp)]
				  
				  ]
				  
				  
				  :result-transform
				   (fn [result] 
				     (sort-by (comp - (fn [r] (get-in r [:block/page :block/journal-day]))) result)
				     )
				  ;;:view :pprint
				  
				  
				  :children? true
				  :breadcrumb-show? true
				  :group-by-page? true
				  }
				  #+END_QUERY
				- {{i ea51}}  idea workshop
				  ![image.png](../assets/image_1726792618253_0.png){:height 199, :width 336}
				- Issues query
				- id:: 66ccdccf-f9e2-4028-b867-a7b5406fd634
				  #+BEGIN_QUERY
				  {:inputs [:current-page "issue"]
				  :query
				  [:find ?uuid ?content ?idea-type ?marker (pull ?r [*]) 
				   :keys uuid content idea-type idea-state block-content
				   :in $ ?current-page ?idea-type
				   :where
				   [?p :block/name ?current-page]
				   [?r :block/refs ?p]
				  
				   (or-join [?r ?marker]
				    (and 
				     [?r :block/marker ?marker])
				    (and 
				     [(missing? $ ?r :block/marker)]
				     [(identity "UNINITIALIZED") ?marker]))
				   ;;(not [?r :block/marker ?marker])
				  
				   [?r :block/macros ?m]
				   [?m :block/properties ?props]
				   [(get ?props :logseq.macro-name) ?macros]
				   [(= ?macros ?idea-type)]
				  
				   ;; info we want, now that we have a match
				   [?r :block/uuid ?uuid]
				   [?r :block/content ?content]]
				  
				  :result-transform
				  (letfn 
				   [(first-line [block-content]
				     (first (clojure.string/split-lines block-content)))
				    
				    (strip-idea-type [line idea-type]
				     (clojure.string/replace
				      line
				      (re-pattern (str "(?:TODO\\s|DONE\\s)?{{" idea-type "}}\\s"))
				      ""))
				    
				    (format-idea-state [block-marker]
				     (case block-marker
				       "UNINITIALIZED" "new"
				       "TODO" "open"
				       "DONE" "realized"))
				    
				    (structure-result [result]
				     (let [content (get-in result [:content])
				           block-uuid (get-in result [:uuid])
				           idea-type (get-in result [:idea-type])
				           idea-state (get-in result [:idea-state])]
				       {:block/content content
				        :uuid block-uuid
				        :idea-type idea-type
				        :idea-state (format-idea-state idea-state)
				        :display-text (strip-idea-type 
				                       (first-line content)
				                       idea-type)}))] 
				  
				   (fn [results]
				     (->> results
				          (map structure-result)
				          (group-by :idea-state)
				          (into (sorted-map)))))
				    
				  
				  :view
				  (letfn
				   [(make-link [text destination]
				     [:a {:on-click
				          (fn []
				            (call-api "push_state"
				                      "page"
				                      {:name destination}))}
				      text])
				  
				  (make-icon-link [text destination]
				                     [:a (merge
				                         {:class "ti"}
				                          
				  
				                          {:on-click
				                           (fn []
				                             (call-api "push_state"
				                                       "page"
				                                       {:name destination}))
				                           })
				                      text])
				  
				    (make-marker-box [uuid state content]
				     [:input
				      {:type "checkbox"
				       ;; checked attribute takes a boolean value
				       :checked (= state "realized")
				       :on-click
				       (fn []
				         (call-api
				          "update_block"
				          uuid
				          (str (if (= state "realized")
				                 "TODO"
				                 "DONE")
				               " "
				               (clojure.string/replace
				                content
				                (re-pattern "(TODO|DONE)\\s")
				                ""))))}])
				  
				    (make-initialization-link [uuid content macro-name]
				     [:button 
				      {:on-click
				       (fn []
				         (call-api "update_block"
				                   uuid
				                   (clojure.string/replace
				                    content
				                    (re-pattern (str "{{" macro-name "}}\\s"))
				                    (str "TODO {{" macro-name "}} "))))}
				      "initialize"])]
				  
				   (fn [results]
				     (for [[state items] results]
				       (let [idea-type (-> items
				                           first :idea-type)]
				         [:div
				          [:table {:class "future-event-table stop-click compact"}
				           [:caption state " " idea-type "s"]
				           [:thead [:tr
				                    [:th {:width "80"} "Status"] [:th idea-type] [:th]]]
				           [:tbody
				            (for [result items]
				              [:tr
				               [:td.touch-screen (case (get-in result [:idea-state])
				                      "new" (make-initialization-link
				                             (get-in result [:uuid])
				                             (get-in result [:block/content])
				                             idea-type)
				                      "open" (make-marker-box
				                              (get-in result [:uuid])
				                              (get-in result [:idea-state])
				                              (get-in result [:block/content]))
				                      "realized" (make-marker-box
				                                  (get-in result [:uuid])
				                                  (get-in result [:idea-state])
				                                  (get-in result [:block/content]))
				                      "other")]
				               [:td (get-in result [:display-text]) ]
				               [:td.touch-screen (make-icon-link
				                     "\uea99"
				                     (get-in result [:uuid]))]
				               
				               ])]]]))))} 
				  
				  #+END_QUERY
				  {{issue-identifier}}
				- Ideas query
				- id:: 66df909d-79a2-4532-917e-94d3bd8b32a8
				  #+BEGIN_QUERY
				  {:inputs [:current-page "idea"]
				  :query
				  [:find ?uuid ?content ?idea-type ?marker (pull ?r [*]) 
				   :keys uuid content idea-type idea-state block-content
				   :in $ ?current-page ?idea-type
				   :where
				   [?p :block/name ?current-page]
				   [?r :block/refs ?p]
				  
				   (or-join [?r ?marker]
				    (and 
				     [?r :block/marker ?marker])
				    (and 
				     [(missing? $ ?r :block/marker)]
				     [(identity "UNINITIALIZED") ?marker]))
				   ;;(not [?r :block/marker ?marker])
				  
				   [?r :block/macros ?m]
				   [?m :block/properties ?props]
				   [(get ?props :logseq.macro-name) ?macros]
				   [(= ?macros ?idea-type)]
				  
				   ;; info we want, now that we have a match
				   [?r :block/uuid ?uuid]
				   [?r :block/content ?content]]
				  
				  :result-transform
				  (letfn 
				   [(first-line [block-content]
				     (first (clojure.string/split-lines block-content)))
				    
				    (strip-idea-type [line idea-type]
				     (clojure.string/replace
				      line
				      (re-pattern (str "(?:TODO\\s|DONE\\s)?{{" idea-type "}}\\s"))
				      ""))
				    
				    (format-idea-state [block-marker]
				     (case block-marker
				       "UNINITIALIZED" "new"
				       "TODO" "open"
				       "DONE" "realized"))
				    
				    (structure-result [result]
				     (let [content (get-in result [:content])
				           block-uuid (get-in result [:uuid])
				           idea-type (get-in result [:idea-type])
				           idea-state (get-in result [:idea-state])]
				       {:block/content content
				        :uuid block-uuid
				        :idea-type idea-type
				        :idea-state (format-idea-state idea-state)
				        :display-text (strip-idea-type 
				                       (first-line content)
				                       idea-type)}))] 
				  
				   (fn [results]
				     (->> results
				          (map structure-result)
				          (group-by :idea-state)
				          (into (sorted-map)))))
				    
				  
				  :view
				  (letfn
				   [(make-link [text destination]
				     [:a {:on-click
				          (fn []
				            (call-api "push_state"
				                      "page"
				                      {:name destination}))}
				      text])
				  
				  (make-icon-link [text destination]
				                     [:a (merge
				                         {:class "ti"}
				                          
				  
				                          {:on-click
				                           (fn []
				                             (call-api "push_state"
				                                       "page"
				                                       {:name destination}))
				                           })
				                      text])
				  
				    (make-marker-box [uuid state content]
				     [:input
				      {:type "checkbox"
				       ;; checked attribute takes a boolean value
				       :checked (= state "realized")
				       :on-click
				       (fn []
				         (call-api
				          "update_block"
				          uuid
				          (str (if (= state "realized")
				                 "TODO"
				                 "DONE")
				               " "
				               (clojure.string/replace
				                content
				                (re-pattern "(TODO|DONE)\\s")
				                ""))))}])
				  
				    (make-initialization-link [uuid content macro-name]
				     [:button 
				      {:on-click
				       (fn []
				         (call-api "update_block"
				                   uuid
				                   (clojure.string/replace
				                    content
				                    (re-pattern (str "{{" macro-name "}}\\s"))
				                    (str "TODO {{" macro-name "}} "))))}
				      "initialize"])]
				  
				   (fn [results]
				     (for [[state items] results]
				       (let [idea-type (-> items
				                           first :idea-type)]
				         [:div
				          [:table {:class "future-event-table stop-click compact"}
				           [:caption state " " idea-type "s"]
				           [:thead [:tr
				                    [:th {:width "80"} "Status"] [:th idea-type] [:th]]]
				           [:tbody
				            (for [result items]
				              [:tr
				               [:td.touch-screen (case (get-in result [:idea-state])
				                      "new" (make-initialization-link
				                             (get-in result [:uuid])
				                             (get-in result [:block/content])
				                             idea-type)
				                      "open" (make-marker-box
				                              (get-in result [:uuid])
				                              (get-in result [:idea-state])
				                              (get-in result [:block/content]))
				                      "realized" (make-marker-box
				                                  (get-in result [:uuid])
				                                  (get-in result [:idea-state])
				                                  (get-in result [:block/content]))
				                      "other")]
				               [:td (get-in result [:display-text]) ]
				               [:td.touch-screen (make-icon-link
				                     "\uea99"
				                     (get-in result [:uuid]))]
				               
				               ])]]]))))} 
				  
				  #+END_QUERY
				  {{idea-identifier}}
				- Questions query
				- id:: 66df90b1-ccba-494b-94c9-76f3194e0963
				  #+BEGIN_QUERY
				  {:inputs [:current-page "question"]
				  :query
				  [:find ?uuid ?content ?idea-type ?marker (pull ?r [*]) 
				   :keys uuid content idea-type idea-state block-content
				   :in $ ?current-page ?idea-type
				   :where
				   [?p :block/name ?current-page]
				   [?r :block/refs ?p]
				  
				   (or-join [?r ?marker]
				    (and 
				     [?r :block/marker ?marker])
				    (and 
				     [(missing? $ ?r :block/marker)]
				     [(identity "UNINITIALIZED") ?marker]))
				   ;;(not [?r :block/marker ?marker])
				  
				   [?r :block/macros ?m]
				   [?m :block/properties ?props]
				   [(get ?props :logseq.macro-name) ?macros]
				   [(= ?macros ?idea-type)]
				  
				   ;; info we want, now that we have a match
				   [?r :block/uuid ?uuid]
				   [?r :block/content ?content]]
				  
				  :result-transform
				  (letfn 
				   [(first-line [block-content]
				     (first (clojure.string/split-lines block-content)))
				    
				    (strip-idea-type [line idea-type]
				     (clojure.string/replace
				      line
				      (re-pattern (str "(?:TODO\\s|DONE\\s)?{{" idea-type "}}\\s"))
				      ""))
				    
				    (format-idea-state [block-marker]
				     (case block-marker
				       "UNINITIALIZED" "new"
				       "TODO" "open"
				       "DONE" "realized"))
				    
				    (structure-result [result]
				     (let [content (get-in result [:content])
				           block-uuid (get-in result [:uuid])
				           idea-type (get-in result [:idea-type])
				           idea-state (get-in result [:idea-state])]
				       {:block/content content
				        :uuid block-uuid
				        :idea-type idea-type
				        :idea-state (format-idea-state idea-state)
				        :display-text (strip-idea-type 
				                       (first-line content)
				                       idea-type)}))] 
				  
				   (fn [results]
				     (->> results
				          (map structure-result)
				          (group-by :idea-state)
				          (into (sorted-map)))))
				    
				  
				  :view
				  (letfn
				   [(make-link [text destination]
				     [:a {:on-click
				          (fn []
				            (call-api "push_state"
				                      "page"
				                      {:name destination}))}
				      text])
				  
				  (make-icon-link [text destination]
				                     [:a (merge
				                         {:class "ti"}
				                          
				  
				                          {:on-click
				                           (fn []
				                             (call-api "push_state"
				                                       "page"
				                                       {:name destination}))
				                           })
				                      text])
				  
				    (make-marker-box [uuid state content]
				     [:input
				      {:type "checkbox"
				       ;; checked attribute takes a boolean value
				       :checked (= state "realized")
				       :on-click
				       (fn []
				         (call-api
				          "update_block"
				          uuid
				          (str (if (= state "realized")
				                 "TODO"
				                 "DONE")
				               " "
				               (clojure.string/replace
				                content
				                (re-pattern "(TODO|DONE)\\s")
				                ""))))}])
				  
				    (make-initialization-link [uuid content macro-name]
				     [:button 
				      {:on-click
				       (fn []
				         (call-api "update_block"
				                   uuid
				                   (clojure.string/replace
				                    content
				                    (re-pattern (str "{{" macro-name "}}\\s"))
				                    (str "TODO {{" macro-name "}} "))))}
				      "initialize"])]
				  
				   (fn [results]
				     (for [[state items] results]
				       (let [idea-type (-> items
				                           first :idea-type)]
				         [:div
				          [:table {:class "future-event-table stop-click compact"}
				           [:caption state " " idea-type "s"]
				           [:thead [:tr
				                    [:th {:width "80"} "Status"] [:th idea-type] [:th]]]
				           [:tbody
				            (for [result items]
				              [:tr
				               [:td.touch-screen (case (get-in result [:idea-state])
				                      "new" (make-initialization-link
				                             (get-in result [:uuid])
				                             (get-in result [:block/content])
				                             idea-type)
				                      "open" (make-marker-box
				                              (get-in result [:uuid])
				                              (get-in result [:idea-state])
				                              (get-in result [:block/content]))
				                      "realized" (make-marker-box
				                                  (get-in result [:uuid])
				                                  (get-in result [:idea-state])
				                                  (get-in result [:block/content]))
				                      "other")]
				               [:td (get-in result [:display-text]) ]
				               [:td.touch-screen (make-icon-link
				                     "\uea99"
				                     (get-in result [:uuid]))]
				               
				               ])]]]))))} 
				  
				  #+END_QUERY
				  {{question-identifier}}
				- {{i f287}}  Previous **grocery purchases**
				  ![image.png](../assets/image_1726792654601_0.png){:height 149, :width 150}
				- query v4.5. Gets icon data from [[data]] block
				  id:: 66f31002-f6e7-4656-b4a4-3721b3d9771d
				- id:: 66c12458-4744-4f60-bc2b-8396c7bd3819
				  #+BEGIN_QUERY
				  ;; query v3.1
				  {:inputs ["grocery" :today]
				  :query
				  [:find ?content ?journal-day ?today-journal-day ?today ?today-journal-uuid ?marker
				   :keys content journal-day today-journal-day today today-journal-uuid marker
				   :in $ ?macro-name ?today-journal-day %
				  
				   :where
				   [?b :block/marker ?marker]
				  ;;[(contains? #{"DONE"} ?marker)]
				   (using-macro ?b ?macro-name)
				  
				   [?b :block/content ?content]
				   [?b :block/page ?p]
				   [?p :block/journal-day ?journal-day]
				  
				   [?j :block/journal-day ?today-journal-day]
				   [?j :block/name ?today]
				   [?j :block/uuid ?today-journal-uuid]]
				  
				  
				  :rules
				  [[(using-macro ?b ?macro-name)
				    [?b :block/macros ?m]
				    [?m :block/properties ?props]
				    [(get ?props :logseq.macro-name) ?macros]
				    [(= ?macros ?macro-name)]]]
				  
				  
				  :result-transform
				  (fn [results]
				    (defn date-today-impl
				      ^{:doc "Returns today's date as an integer in the format YYYYMMDD.
				  			      	Uses the datascript_query API to fetch the current date."
				        :example "(date-today) ; => 20240918"}
				      [] (let [query-result (call-api "datascript_query"
				                                      "[:find ?today :in $ ?today :where [_ :block/name _]]"
				                                      ":today")
				  
				               date-integer (read-string (apply
				                                          str
				                                          query-result))]
				           date-integer))
				    (def date-today (memoize date-today-impl))
				  
				  
				    (defn convert-range
				      ^{:doc "Given a value within a range, converts the value to a different range"
				        :example "(convert-range -4 [-30 0] [0 255]) ;; => 221"}
				      [value [old-range-min old-range-max] [new-range-min new-range-max]]
				      (+
				       (/
				        (*
				         (- value
				            old-range-min) ;; *
				         (- new-range-max
				            new-range-min)) ;; /
				        (- old-range-max
				           old-range-min)) ;; +
				       new-range-min))
				  
				    (defn integer-floor
				      ^{:doc "Returns the largest double less than or equal to number,
				  		 and equal to a mathematical integer. Equivalent to clojure.math/floor"
				        :example "(integer-floor 11.1) => ;; => 11"}
				      [number]
				      (if (>= number 0)
				        (int number)
				        (dec (int number))))
				  
				    (defn number-absolute
				      ^{:doc "Returns the absolute value of a number. Equivalent to abs."
				        :example "(number-absolute -10) ;; => 10"}
				      [number]
				  
				      (if (>= number 0)
				        number
				        (- number)))
				  
				    (defn date-journal-day->julian-day
				      [year month day]
				      ^{:doc "Converts a Gregorian calendar date to a Julian day number.
				  		This function is used for date calculations.
				  		Parameters:
				  			 year: Integer representing the year
				  			 month: Integer representing the month (1-12)
				  			 day: Integer representing the day of the month
				  		Returns: Integer representing the Julian day number"
				        :example "(date-journal-day->julian-day 2024 9 18) ; => 2460211"}
				      (let
				       [adjustment
				        (integer-floor (/ (- month
				                             14)
				                          12))
				  
				        adjusted-year
				        (+ year
				           4800
				           adjustment)
				  
				        adjusted-month
				        (+ month
				           (* 12
				              adjustment)
				           -3)]
				  
				        (+ (integer-floor (+ (* 365.25
				                                adjusted-year)
				                             0.5))
				           (integer-floor (+ (* 30.6001
				                                (+ adjusted-month
				                                   1))
				                             0.5))
				           day
				           -32075)))
				  
				    (defn date-get-difference
				      ([journal-day] (date-get-difference journal-day (date-today)))
				      ^{:doc "Calculates the absolute difference in days between a date and today.
				  		 Parameters:
				  			journal-day: Integer representing a date in YYYYMMDD format."}
				      ([journal-day1 journal-day2]
				       ^{:doc "Calculates the absolute difference in days between two dates.
				  		  Parameters:
				  			  journal-day1: Integer representing a date in YYYYMMDD format
				  			  journal-day2: Integer representing a date in YYYYMMDD format
				  			  Returns: Integer representing the number of days between the two dates"
				         :example "(date-get-difference 20240918 20240610) ; => 100"}
				  
				       (let
				        [extract-date
				         (fn [date]
				           [(quot date 10000)
				            (rem (quot date 100) 100)
				            (rem date 100)])
				  
				         [year1 month1 day1]
				         (extract-date
				          journal-day1)
				  
				         [year2 month2 day2]
				         (extract-date
				          journal-day2)
				         julian-day-number1
				         (date-journal-day->julian-day
				          year1
				          month1
				          day1)
				  
				         julian-day-number2
				         (date-journal-day->julian-day
				          year2
				          month2
				          day2)]
				  
				         (number-absolute (- julian-day-number1
				                             julian-day-number2)))))
				  
				    (let
				     [first-line
				      (fn [item]
				        (if (clojure.string/index-of item "\n")
				          (subs item 0 (clojure.string/index-of item "\n"))
				          item))
				  
				      query-data (first results)
				  
				      query-results
				      (map (fn [result]
				             (dissoc result
				                     :today-journal-day
				                     :today
				                     :today-journal-uuid))
				           results)
				  
				      transformed-results
				      (->> query-results
				           (map
				            (fn [result]
				              (update result
				                      :content
				                      (fn
				                        [item]
				                        (-> item
				                            first-line
				                            clojure.string/lower-case
				                            (clojure.string/replace
				                             (re-pattern "(?:done|todo) \\{\\{grocery\\}\\} ") "")
				                            (clojure.string/replace (re-pattern "x\\d$") "")
				                            clojure.string/trim)))))
				           (group-by :content)
				  
				           (sort-by (fn [[_ entries]]
				                      (count entries))
				                    >)
				  
				           (map (fn [[grocery-item entries]]
				                  [grocery-item
				                   (map (fn [entry]
				                          (dissoc entry :content))
				                        entries)]))
				  
				           (map (fn [[grocery-item purchase-data]]
				                  (let
				                   [in-basket?
				                    (some (fn [entry]
				                            (=
				                             (:marker entry)
				                             "TODO"))
				                          purchase-data)
				  
				                    first-purchase-date
				                    (->> purchase-data
				                         (map :journal-day)
				                         (apply min))
				  
				                    days-from-first-purchase ;;first-purchase-days
				                    (date-get-difference first-purchase-date)
				  
				                    last-purchase-date
				                    (->> purchase-data
				                         (filter (fn [m]
				                                   (= (:marker m) "DONE")))
				                         (map :journal-day)
				                         (apply max))
				  
				                    days-from-last-purchase ;;last-purchase-days
				                    (date-get-difference last-purchase-date)
				  
				                    purchase-count
				                    (count purchase-data)
				  
				                    adjusted-purchase-count ;; Don't count items on the list for purchase because that's cheating.
				                    (if in-basket?
				                      (dec purchase-count)
				                      purchase-count)
				  
				                    average-purchase-in-days ;; Average number of days between purchases beginning from the first purchase and until the last purchase.
				                    (integer-floor
				                     (/ (- days-from-first-purchase
				                           days-from-last-purchase)
				                        adjusted-purchase-count))
				  
				                    expected-purchase-in-days
				                    (- average-purchase-in-days
				                       days-from-last-purchase)
				  
				                    overdue-purchase?
				                    (< expected-purchase-in-days 1)
				  
				                    text-color ;; Go from red to black over -1 to -30 days of overdue purchase time ;; -1 = 88% 58% ;; -30 = 53% 29%
				                    {:hue-degrees
				                     (integer-floor
				                      (convert-range
				                       expected-purchase-in-days
				                       [-30 -1]
				                       [203 0])) ;; blue: 203 82 35
				  
				                     :saturation-percent
				                     (integer-floor
				                      (convert-range
				                       expected-purchase-in-days
				                       [-30 -1]
				                       [82 52])) ;;82 ;; dest start
				  
				                     :lightness-percent
				                     (integer-floor
				                      (convert-range
				                       expected-purchase-in-days
				                       [-30 -1]
				                       [45 71]))}] ;;35
				  
				                    [grocery-item
				                     {:purchase-count adjusted-purchase-count
				                      :first-purchase-date first-purchase-date
				                      :last-purchase-date last-purchase-date
				                      :days-from-first-purchase days-from-first-purchase
				                      :days-from-last-purchase days-from-last-purchase
				                      :average-purchase-days average-purchase-in-days
				                      :expected-purchase-in-days expected-purchase-in-days
				                      :purchase-overdue? overdue-purchase?
				                      :in-basket in-basket?
				                      :text-color text-color
				                      :purchase-data purchase-data}]))))]
				  
				      (assoc {}
				             :query-data
				             (select-keys query-data
				                          [:today-journal-day
				                           :today
				                           :today-journal-uuid])
				             :query-results transformed-results)))
				  
				  :view
				  (letfn
				   [(get-map-from-block
				      ([uuid] (get-map-from-block uuid :edn))
				      ([uuid key]
				       (let [result (call-api "get_block" uuid)
				             processed-result
				             (-> result ;; thread-first
				                 (js->clj :keywordize-keys
				                          true)
				                 (get-in [:properties key])
				                 (read-string))
				             return-value processed-result]
				         return-value)))
				  
				    (sanitize-string
				     [s]
				     (-> s
				         (clojure.string/replace " " "-")
				         (clojure.string/replace (re-pattern "\\[\\[") "")
				         (clojure.string/replace (re-pattern "\\]\\]") "")
				         (clojure.string/replace (re-pattern "[\\(\\)]") "")))
				  
				    (make-link
				      ([text journal-uuid class-addition]
				       [:a
				        {:class class-addition
				         :on-click
				         (fn []
				           (call-api
				            "append_block_in_page"
				            (str journal-uuid)
				            (str "TODO {{grocery}} " text)))}
				        text])
				  
				      ([text journal-uuid class-addition hsl-map] ;; Arity-3 version
				       [:a
				        {:class class-addition
				         :style
				         {;;:font-weight "bold" ;;idea: use a font-weight gradient
				          :color
				          (str "hsl(203 "
				               (:saturation-percent hsl-map) "% "
				               (:lightness-percent hsl-map) "%)")}
				         
				         :on-click
				         (fn []
				           (call-api
				            "append_block_in_page"
				            (str journal-uuid)
				            (str "TODO {{grocery}} " text)))}
				        text])) 
				  
				    (make-icon [item-name]
				      (let [icon-table (get-map-from-block "66f30d33-c7ed-409c-8b9e-175cf9ded264")
				            sanitized-item-name
				            (-> item-name
				                (clojure.string/replace " " "-")
				                (clojure.string/replace (re-pattern "\\[\\[") "")
				                (clojure.string/replace (re-pattern "\\]\\]") "")
				                (clojure.string/replace (re-pattern "[\\(\\)]") ""))
				            icon-code (get icon-table
				                           (keyword sanitized-item-name)
				                           "0000")]
				        (str "&#x" icon-code ";")))]
				  
				    (fn [results]
				      (let [query-data (get-in results [:query-data])
				            query-results (get-in results [:query-results])]
				  
				        [:div
				         [:table.display-table.compact.more-compact.needs-disclosure-listener
				          [:thead
				           [:tr
				            [:th.left-column ""]
				            [:th "Item"]
				            [:th.disclosure]]]
				          [:tbody
				           (for [[grocery-item item-data] query-results]
				             (let [table-name (str "grocery-purchases")
				                   class-addition (if (:in-basket item-data)
				                                    "strikethrough"
				                                    "")
				                   sanitized-id (sanitize-string grocery-item)]
				               [:<>
				                [:tr
				                 [:td.left-column {:rowspan "2"}
				                  [:span {:class "bti bigger"
				                          :dangerouslySetInnerHTML
				                          {:__html (make-icon grocery-item)}}]]
				  
				                 [:td.touch-screen
				                  (if (and
				                       (< (:expected-purchase-in-days item-data) 0)
				                       (> (:expected-purchase-in-days item-data) -30))
				  
				                    (make-link grocery-item
				                               (get-in query-data
				                                       [:today-journal-uuid])
				                               class-addition
				                               (:text-color item-data))
				                    (make-link grocery-item
				                               (get-in query-data
				                                       [:today-journal-uuid])
				                               class-addition)
				  			  				                            ;; (str "expected purchase in days:" (:expected-purchase-in-days item-data))
				                    )]
				  
				                 [:td.touch-screen.ti
				                  [:a.disclosure-trigger
				                   {:id (str table-name
				                             "-disclosure-trigger-"
				                             sanitized-id)
				                    :data-target (str table-name
				                                      "-secondary-content-"
				                                      sanitized-id)}
				                   (str "▼")]]]
				  
				                [:tr
				                 [:td.closed.event-info.secondary-content
				                  {:colspan "2"
				                   :id (str table-name
				                            "-secondary-content-"
				                            sanitized-id)}
				                  [:div.quick-view-container
				                   [:span.content-slot
				                    (str "Purchased "
				                         (sanitize-string grocery-item)
				                         " "
				                         (:purchase-count item-data)
				                         " times.")
				                    [:br]
				                    (str "on average every "
				                         (:average-purchase-days item-data)
				                         " days,")
				                    [:br]
				                    (str "last "
				                         (:days-from-last-purchase item-data)
				                         " days ago.")
				                    [:br] [:br]
				                    (str "expected purchase in (days): "
				                         (:expected-purchase-in-days item-data))]]]]]))]]])))
				  
				  
				  
				  
				  :breadcrumb-show? false}
				  #+END_QUERY
				- query v4. Now shows if items are in the basket or not lol
				  id:: 66f31005-b902-4c75-a9f5-761cddb23eaa
				- ![image.png](../assets/image_1727205936205_0.png)
				- ```md
				  #+BEGIN_QUERY
				  			  ;; query v3
				  {:inputs ["grocery" :today]
				  :query
				  [:find ?content ?journal-day ?today-journal-day ?today ?today-journal-uuid ?marker
				   :keys content journal-day today-journal-day today today-journal-uuid marker
				   :in $ ?macro-name ?today-journal-day %
				  
				   :where
				   [?b :block/marker ?marker]
				  			     ;;[(contains? #{"DONE"} ?marker)]
				   (using-macro ?b ?macro-name)
				  
				   [?b :block/content ?content]
				   [?b :block/page ?p]
				   [?p :block/journal-day ?journal-day]
				  
				   [?j :block/journal-day ?today-journal-day]
				   [?j :block/name ?today]
				   [?j :block/uuid ?today-journal-uuid]]
				  
				  
				  :rules
				  [[(using-macro ?b ?macro-name)
				    [?b :block/macros ?m]
				    [?m :block/properties ?props]
				    [(get ?props :logseq.macro-name) ?macros]
				    [(= ?macros ?macro-name)]]]
				  
				  
				  :result-transform
				  (fn [results]
				   (defn date-today-impl
				     ^{:doc "Returns today's date as an integer in the format YYYYMMDD.
				     	Uses the datascript_query API to fetch the current date."
				       :example "(date-today) ; => 20240918"}
				     [] (let [query-result (call-api "datascript_query"
				                                     "[:find ?today :in $ ?today :where [_ :block/name _]]"
				                                     ":today")
				  
				              date-integer (read-string (apply
				                                         str
				                                         query-result))]
				          date-integer))
				   (def date-today (memoize date-today-impl))
				  
				  
				   (defn convert-range
				     ^{:doc "Given a value within a range, converts the value to a different range"
				       :example "(convert-range -4 [-30 0] [0 255]) ;; => 221"}
				     [value [old-range-min old-range-max] [new-range-min new-range-max]]
				     (+
				      (/
				       (*
				        (- value
				           old-range-min)
				   	   ;; * 
				        (- new-range-max
				           new-range-min))
				   	;;----------------
				       (- old-range-max
				          old-range-min))
				   	  ;; +
				      new-range-min))
				  
				   (defn integer-floor
				     ^{:doc "Returns the largest double less than or equal to number,
				   				              and equal to a mathematical integer. Equivalent to clojure.math/floor"
				       :example "(integer-floor 11.1) => ;; => 11"}
				     [number]
				     (if (>= number 0)
				       (int number)
				       (dec (int number))))
				   
				    (defn number-absolute
				      ^{:doc "Returns the absolute value of a number. Equivalent to abs."
				        :example "(number-absolute -10) ;; => 10"}
				      [number]
				  
				      (if (>= number 0)
				        number
				        (- number)))
				  
				   (defn date-journal-day->julian-day
				    [year month day]
				    ^{:doc "Converts a Gregorian calendar date to a Julian day number.
				   				              This function is used for date calculations.
				   				              Parameters:
				   				                year: Integer representing the year
				   				                month: Integer representing the month (1-12)
				   				                day: Integer representing the day of the month
				   				              Returns: Integer representing the Julian day number"
				      :example "(date-journal-day->julian-day 2024 9 18) ; => 2460211"}
				    (let [adjustment (integer-floor (/ (- month
				                                          14)
				                                       12))
				   
				          adjusted-year (+ year
				                           4800
				                           adjustment)
				            adjusted-month (+ month
				                            (* 12
				                               adjustment)
				                            -3)]
				        (+ (integer-floor (+ (* 365.25
				                              adjusted-year)
				                           0.5))
				         (integer-floor (+ (* 30.6001
				                              (+ adjusted-month
				                                 1))
				                           0.5))
				         day
				         -32075)))
				  
				  (defn date-get-difference
				  ([journal-day] (date-get-difference journal-day (date-today)))
				  ^{:doc "Calculates the absolute difference in days between a date and today.
				  			              Parameters:
				  			                journal-day: Integer representing a date in YYYYMMDD format."}
				  ([journal-day1 journal-day2]
				   ^{:doc "Calculates the absolute difference in days between two dates.
				  			              Parameters:
				  			                journal-day1: Integer representing a date in YYYYMMDD format
				  			                journal-day2: Integer representing a date in YYYYMMDD format
				  			              Returns: Integer representing the number of days between the two dates"
				     :example "(date-get-difference 20240918 20240610) ; => 100"}
				  
				   (let [extract-date (fn [date]
				                        [(quot date 10000)
				                         (rem (quot date 100) 100)
				                         (rem date 100)])
				         [year1 month1 day1] (extract-date
				                              journal-day1)
				         [year2 month2 day2] (extract-date
				                              journal-day2)
				         julian-day-number1 (date-journal-day->julian-day
				                             year1
				                             month1
				                             day1)
				         julian-day-number2 (date-journal-day->julian-day
				                             year2
				                             month2
				                             day2)]
				     (number-absolute (- julian-day-number1
				                         julian-day-number2)))))
				  	
				  
				  
				  
				     (let [first-line (fn [item]
				                        (if (clojure.string/index-of item "\n")
				                          (subs item 0 (clojure.string/index-of item "\n"))
				                          item))
				           query-data (first results)
				           query-results (map (fn [result]
				                                (dissoc result :today-journal-day :today :today-journal-uuid))
				                              results)
				           transformed-results
				           (->> query-results
				                (map (fn [result]
				                       (update result :content
				                               (fn [item]
				                                 (-> item
				                                     first-line
				                                     clojure.string/lower-case
				                                     (clojure.string/replace
				                                      (re-pattern "(?:done|todo) \\{\\{grocery\\}\\} ") "")
				                                     (clojure.string/replace (re-pattern "x\\d$") "")
				                                     clojure.string/trim)))))
				                (group-by :content)
				  
				                (sort-by (fn [[_ entries]]
				                           (count entries))
				                         >)
				  
				                (map (fn [[grocery-item entries]]
				                       [grocery-item (map (fn [entry]
				                                            (dissoc entry :content))
				                                          entries)]))
				  
				                (map (fn [[grocery-item purchase-data]]
				                       (let [in-basket?
				                             (some (fn [entry]
				                                     (=
				                                      (:marker entry)
				                                      "TODO"))
				                                   purchase-data)
				  
				                             first-purchase-date
				                             (->> purchase-data
				                                  (map :journal-day)
				                                  (apply min))
				  
				                             days-from-first-purchase ;;first-purchase-days
				                             (date-get-difference first-purchase-date)
				  
				                             last-purchase-date
				                             (->> purchase-data
				                                  (filter (fn [m]
				                                            (= (:marker m) "DONE")))
				                                  (map :journal-day)
				                                  (apply max))
				  
				                             days-from-last-purchase ;;last-purchase-days
				                             (date-get-difference last-purchase-date)
				  
				                             purchase-count
				                             (count purchase-data)
				  
				  			                               ;; Don't count items on the list for purchase
				  			                               ;; because that's cheating.
				                             adjusted-purchase-count
				                             (if in-basket?
				                               (dec purchase-count)
				                               purchase-count)
				  
				  			                               ;; Average number of days between purchases beginning from
				  			                               ;; the first purchase and until the last purchase.
				                             average-purchase-in-days
				                             (integer-floor
				                              (/ (- days-from-first-purchase
				                                    days-from-last-purchase)
				                                 adjusted-purchase-count))
				  
				                             expected-purchase-in-days (- average-purchase-in-days
				                                                          days-from-last-purchase)
				  
				                             overdue-purchase? (< expected-purchase-in-days 1)
				  
				  			                               ;; Go from red to black over -1 to -30 days of overdue
				  			                               ;; purchase time
				  			                               ;; -1 = 88% 58%
				  			                               ;; -30 = 53% 29%
				                             text-color {:hue-degrees (integer-floor
				                                                       (convert-range
				                                                        expected-purchase-in-days
				                                                        [-30 -1]
				                                                        [203 0])) ;; blue: 203 82 35
				                                         :saturation-percent (integer-floor
				                                                              (convert-range
				                                                               expected-purchase-in-days
				                                                               [-30 -1]
				                                                               [82 52])) ;;82 ;; dest start
				                                         :lightness-percent (integer-floor (convert-range
				                                                                            expected-purchase-in-days
				                                                                            [-30 -1]
				                                                                            [45 71]))}] ;;35
				  
				  
				                         [grocery-item {:purchase-count adjusted-purchase-count
				                                        :first-purchase-date first-purchase-date
				                                        :last-purchase-date last-purchase-date
				                                        :days-from-first-purchase days-from-first-purchase
				                                        :days-from-last-purchase days-from-last-purchase
				                                        :average-purchase-days average-purchase-in-days
				                                        :expected-purchase-in-days expected-purchase-in-days
				                                        :purchase-overdue? overdue-purchase?
				                                        :in-basket in-basket?
				                                        :text-color text-color
				                                        :purchase-data purchase-data}]))))]
				  
				  
				       (assoc {}
				              :query-data (select-keys query-data
				                                       [:today-journal-day
				                                        :today
				                                        :today-journal-uuid])
				              :query-results transformed-results)))
				  
				  
				  			    ;;  :view :pprint
				  
				  :view (letfn [(sanitize-string [s] (-> s
				                                         (clojure.string/replace " " "-")
				                                         (clojure.string/replace (re-pattern "\\[\\[") "")
				                                         (clojure.string/replace (re-pattern "\\]\\]") "")
				                                         (clojure.string/replace (re-pattern "[\\(\\)]") "")))
				                (make-link ([text journal-uuid class-addition]
				                            [:a
				                             {:class class-addition
				                              :on-click (fn []
				                                          (call-api
				                                           "append_block_in_page"
				                                           (str journal-uuid)
				                                           (str "TODO {{grocery}} " text)))}
				                             text])
				                  ([text journal-uuid class-addition hsl-map]
				                   [:a
				                    {:class class-addition
				                     :style  {;;:font-weight "bold" ;;idea: use a font-weight gradient
				                              :color (str "hsl(203 "
				  			                                                     ;;(:hue-degrees hsl-map) " "
				                                          (:saturation-percent hsl-map) "% "
				                                          (:lightness-percent hsl-map) "%)")
				  
				  			                                        ;;  :color (str "hsl(0, "
				  			                                        ;;              (:saturation-percent hsl-map)
				  			                                        ;;              "%, "
				  			                                        ;;              (:lightness-percent hsl-map)
				  			                                        ;;              "%);")
				  			                                        ;;  :color "hsl(1 88% 55%)"
				                              }
				                     :on-click (fn []
				                                 (call-api
				                                  "append_block_in_page"
				                                  (str journal-uuid)
				                                  (str "TODO {{grocery}} " text)))}
				  			                               ;; (str (:saturation-percent hsl-map) (:lightness-percent hsl-map) text) ;; debug
				                    text]))
				                (make-icon [item-name]
				                  (let [icon-table {:cream "ef13"
				                                    :frozen-berries "f511"
				                                    :yogurt "f4c8"
				                                    :cat-food "f287"
				                                    :naan "efa3"
				                                    :patties "feb5"
				                                    :eggs "f500"
				                                    :water "ef0b"
				                                    :sour-cream "ee9f"
				                                    :milk "ef13"
				                                    :cheese "ef26"
				                                    :cheese-powder "ee92"
				                                    :cat-litter "f65b"
				                                    :salad "f50a"
				                                    :tomato-sauce "edbb"
				                                    :automatic-toilet-bowl-cleaner-pucks "efd3"
				                                    :fries "fae9"
				                                    :detergent "f30e"
				                                    :wax-paper "eb2f"
				                                    :perogies "feb5"
				                                    :potatoes "eb8a"
				                                    :sapporo-ramen-noodle "fd90"
				                                    :frozen-veg "f21c"
				                                    :butter "fab5"
				                                    :berries "f511"
				                                    :sodium-bicarbonate "ef16"
				                                    :peanut-oil "ef60"
				                                    :dried-meat "ef17"
				                                    :smokies "ef17"
				                                    :brioche-hotdog-buns "f3a5"
				                                    :sodium-bicarbonate-laundry-booster "f311"
				                                    :garbage-bags "f02f"
				                                    :downy-rinse-and-refresh-laundry-stripper "f311"
				                                    :borax-laundry-booster "f311"
				                                    :little-tissues "f4c9"}
				  
				                        sanitized-item-name (-> item-name
				                                                (clojure.string/replace " " "-")
				                                                (clojure.string/replace (re-pattern "\\[\\[") "")
				                                                (clojure.string/replace (re-pattern "\\]\\]") "")
				                                                (clojure.string/replace (re-pattern "[\\(\\)]") ""))
				                        icon-code (get icon-table
				                                       (keyword sanitized-item-name)
				                                       "0000")]
				                    (str "&#x" icon-code ";")))]
				  
				          (fn [results]
				            (let [query-data (get-in results [:query-data])
				                  query-results (get-in results [:query-results])]
				  
				              [:div
				               [:table.display-table.compact.more-compact.needs-disclosure-listener
				                [:thead
				                 [:tr
				                  [:th.left-column ""]
				                  [:th "Item"]
				                  [:th.disclosure]]]
				                [:tbody
				                 (for [[grocery-item item-data] query-results]
				                   (let [table-name (str "grocery-purchases")
				                         class-addition (if (:in-basket item-data)
				                                          "strikethrough"
				                                          "")
				                         sanitized-id (sanitize-string grocery-item)]
				                     [:<>
				                      [:tr
				                       [:td.left-column {:rowspan "2"}
				                        [:span {:class "bti bigger"
				                                :dangerouslySetInnerHTML
				                                {:__html (make-icon grocery-item)}}]]
				  
				                       [:td.touch-screen
				                        (if (and
				                             (< (:expected-purchase-in-days item-data) 0)
				                             (> (:expected-purchase-in-days item-data) -30))
				  
				                          (make-link grocery-item
				                                     (get-in query-data
				                                             [:today-journal-uuid])
				                                     class-addition
				                                     (:text-color item-data))
				                          (make-link grocery-item
				                                     (get-in query-data
				                                             [:today-journal-uuid])
				                                     class-addition)
				  			                            ;; (str "expected purchase in days:" (:expected-purchase-in-days item-data))
				                          )]
				  
				                       [:td.touch-screen.ti
				                        [:a.disclosure-trigger
				                         {:id (str table-name
				                                   "-disclosure-trigger-"
				                                   sanitized-id)
				                          :data-target (str table-name
				                                            "-secondary-content-"
				                                            sanitized-id)}
				                         (str "▼")]]]
				  
				                      [:tr
				                       [:td.closed.event-info.secondary-content
				                        {:colspan "2"
				                         :id (str table-name
				                                  "-secondary-content-"
				                                  sanitized-id)}
				                        [:div.quick-view-container
				                         [:span.content-slot
				                          (str "Purchased "
				                               (sanitize-string grocery-item)
				                               " "
				                               (:purchase-count item-data)
				                               " times.")
				                          [:br]
				                          (str "on average every "
				                               (:average-purchase-days item-data)
				                               " days,")
				                          [:br]
				                          (str "last "
				                               (:days-from-last-purchase item-data)
				                               " days ago.")
				                          [:br] [:br]
				                          (str "expected purchase in (days): "
				                               (:expected-purchase-in-days item-data))]]]]]))]]])))
				  
				  
				  
				  
				  :breadcrumb-show? false}
				  			  #+END_QUERY
				  ```
			- past queries
				- query v3 (with stats)
				  ![image.png](../assets/image_1724109056266_0.png){:height 190, :width 181}
					- [[Thursday, Sep 19th, 2024]]
					- ```cljs
					  #+BEGIN_QUERY
					  ;; original ()not working)
					   {:inputs ["grocery" :today]
					    :query
					    [:find ?content ?journal-day ?today-journal-day ?today ?today-journal-uuid ?marker
					     :keys content journal-day today-journal-day today today-journal-uuid marker
					     :in $ ?macro-name ?today-journal-day %
					  
					     :where
					     [?b :block/marker ?marker]
					     ;;[(contains? #{"DONE"} ?marker)]
					     (using-macro ?b ?macro-name)
					  
					     [?b :block/content ?content]
					     [?b :block/page ?p]
					     [?p :block/journal-day ?journal-day]
					  
					     [?j :block/journal-day ?today-journal-day]
					     [?j :block/name ?today]
					     [?j :block/uuid ?today-journal-uuid]]
					  
					  
					    :rules
					    [[(using-macro ?b ?macro-name)
					      [?b :block/macros ?m]
					      [?m :block/properties ?props]
					      [(get ?props :logseq.macro-name) ?macros]
					      [(= ?macros ?macro-name)]]]
					  
					  
					    :result-transform
					    (letfn
					     [(convert-range [value [old-range-min old-range-max] [new-range-min new-range-max]]
					        ^{:doc "Given a value within a range, converts the value to a different range"
					          :example "(convert-range -4 [-30 0] [0 255]) ;; => 221"}
					        (+
					         (/
					          (*
					           (- value
					              old-range-min)
					                        ;; * 
					           (- new-range-max
					              new-range-min))
					                       ;;----------------
					          (- old-range-max
					             old-range-min))
					                       ;; +
					         new-range-min))
					  
					  
					  
					      (integer-floor
					        [number]
					        ^{:doc "Returns the largest double less than or equal to number,
					              and equal to a mathematical integer. Equivalent to clojure.math/floor"
					          :example "(integer-floor 11.1) => ;; => 11"}
					        (if (>= number 0)
					          (int number)
					          (dec (int number))))
					  
					  
					  
					      (number-absolute
					        [number]
					        ^{:doc "Returns the absolute value of a number. Equivalent to abs."
					          :example "(number-absolute -10) ;; => 10"}
					        (if (>= number 0)
					          number
					          (- number)))
					  
					  
					  
					      (date/today
					        []
					        ^{:doc "Returns today's date as an integer in the format YYYYMMDD.
					              Uses the datascript_query API to fetch the current date."
					          :example "(date/today) ; => 20240918"}
					        (let [query-result (call-api "datascript_query"
					                                     "[:find ?today :in $ ?today :where [_ :block/name _]]"
					                                     ":today")
					  
					              date-integer (read-string (apply
					                                         str
					                                         query-result))]
					          date-integer))
					  
					  
					  
					      (date/journal-day->julian-day
					        [year month day]
					        ^{:doc "Converts a Gregorian calendar date to a Julian day number.
					              This function is used for date calculations.
					              Parameters:
					                year: Integer representing the year
					                month: Integer representing the month (1-12)
					                day: Integer representing the day of the month
					              Returns: Integer representing the Julian day number"
					          :example "(date/journal-day->julian-day 2024 9 18) ; => 2460211"}
					        (let [adjustment (integer-floor (/ (- month
					                                              14)
					                                           12))
					  
					              adjusted-year (+ year
					                               4800
					                               adjustment)
					  
					              adjusted-month (+ month
					                                (* 12
					                                   adjustment)
					                                -3)]
					  
					          (+ (integer-floor (+ (* 365.25
					                                  adjusted-year)
					                               0.5))
					             (integer-floor (+ (* 30.6001
					                                  (+ adjusted-month
					                                     1))
					                               0.5))
					             day
					             -32075)))
					  
					  
					  
					      (date/get-difference
					        ([journal-day] (date/get-difference journal-day (date/today)))
					        ^{:doc "Calculates the absolute difference in days between a date and today.
					              Parameters:
					                journal-day: Integer representing a date in YYYYMMDD format."}
					        ([journal-day1 journal-day2]
					         ^{:doc "Calculates the absolute difference in days between two dates.
					              Parameters:
					                journal-day1: Integer representing a date in YYYYMMDD format
					                journal-day2: Integer representing a date in YYYYMMDD format
					              Returns: Integer representing the number of days between the two dates"
					           :example "(date/get-difference 20240918 20240610) ; => 100"}
					  
					         (let [extract-date (fn [date]
					                              [(quot date 10000)
					                               (rem (quot date 100) 100)
					                               (rem date 100)])
					               [year1 month1 day1] (extract-date
					                                    journal-day1)
					               [year2 month2 day2] (extract-date
					                                    journal-day2)
					               julian-day-number1 (date/journal-day->julian-day
					                                   year1
					                                   month1
					                                   day1)
					               julian-day-number2 (date/journal-day->julian-day
					                                   year2
					                                   month2
					                                   day2)]
					           (number-absolute (- julian-day-number1
					                               julian-day-number2)))))]
					  
					      (fn [results]
					        (let [first-line (fn [item]
					                           (if (clojure.string/index-of item "\n")
					                             (subs item 0 (clojure.string/index-of item "\n"))
					                             item))
					              query-data (first results)
					              query-results (map (fn [result]
					                                   (dissoc result :today-journal-day :today :today-journal-uuid))
					                                 results)
					              transformed-results
					              (->> query-results
					                   (map (fn [result]
					                          (update result :content
					                                  (fn [item]
					                                    (-> item
					                                        first-line
					                                        clojure.string/lower-case
					                                        (clojure.string/replace
					                                         (re-pattern "(?:done|todo) \\{\\{grocery\\}\\} ") "")
					                                        (clojure.string/replace (re-pattern "x\\d$") "")
					                                        clojure.string/trim)))))
					                   (group-by :content)
					  
					                   (sort-by (fn [[_ entries]]
					                              (count entries))
					                            >)
					  
					                   (map (fn [[grocery-item entries]]
					                          [grocery-item (map (fn [entry]
					                                               (dissoc entry :content))
					                                             entries)]))
					  
					                   (map (fn [[grocery-item purchase-data]]
					                          (let [in-basket?
					                                (some (fn [entry]
					                                        (=
					                                         (:marker entry)
					                                         "TODO"))
					                                      purchase-data)
					  
					                                first-purchase-date
					                                (->> purchase-data
					                                     (map :journal-day)
					                                     (apply min))
					  
					                                days-from-first-purchase ;;first-purchase-days
					                                (date/get-difference first-purchase-date)
					  
					                                last-purchase-date
					                                (->> purchase-data
					                                     (filter (fn [m]
					                                               (= (:marker m) "DONE")))
					                                     (map :journal-day)
					                                     (apply max))
					  
					                                days-from-last-purchase ;;last-purchase-days
					                                (date/get-difference last-purchase-date)
					  
					                                purchase-count
					                                (count purchase-data)
					  
					                               ;; Don't count items on the list for purchase
					                               ;; because that's cheating.
					                                adjusted-purchase-count
					                                (if in-basket?
					                                  (dec purchase-count)
					                                  purchase-count)
					  
					                               ;; Average number of days between purchases beginning from
					                               ;; the first purchase and until the last purchase.
					                                average-purchase-in-days
					                                (integer-floor
					                                 (/ (- days-from-first-purchase
					                                       days-from-last-purchase)
					                                    adjusted-purchase-count))
					  
					                                expected-purchase-in-days (- average-purchase-in-days
					                                                             days-from-last-purchase)
					  
					                                overdue-purchase? (< expected-purchase-in-days 1)
					  
					                               ;; Go from red to black over -1 to -30 days of overdue
					                               ;; purchase time
					                               ;; -1 = 88% 58%
					                               ;; -30 = 53% 29%
					                                text-color {:hue-degrees (integer-floor
					                                                                 (convert-range
					                                                                  expected-purchase-in-days
					                                                                  [-30 -1]
					                                                                  [203 0])) ;; blue: 203 82 35
					                                            :saturation-percent (integer-floor
					                                                                 (convert-range
					                                                                  expected-purchase-in-days
					                                                                  [-30 -1]
					                                                                  [82 52])) ;;82 ;; dest start
					                                            :lightness-percent (integer-floor (convert-range
					                                                                               expected-purchase-in-days
					                                                                               [-30 -1]
					                                                                               [45 71]))}] ;;35
					  
					  
					                            [grocery-item {:purchase-count adjusted-purchase-count
					                                           :first-purchase-date first-purchase-date
					                                           :last-purchase-date last-purchase-date
					                                           :days-from-first-purchase days-from-first-purchase
					                                           :days-from-last-purchase days-from-last-purchase
					                                           :average-purchase-days average-purchase-in-days
					                                           :expected-purchase-in-days expected-purchase-in-days
					                                           :purchase-overdue? overdue-purchase?
					                                           :in-basket in-basket?
					                                           :text-color text-color
					                                           :purchase-data purchase-data}]))))]
					  
					  
					          (assoc {}
					                 :query-data (select-keys query-data
					                                          [:today-journal-day
					                                           :today
					                                           :today-journal-uuid])
					                 :query-results transformed-results))))
					  
					  
					    ;;  :view :pprint
					  
					    :view (letfn [(sanitize-string [s] (-> s
					                                           (clojure.string/replace " " "-")
					                                           (clojure.string/replace (re-pattern "\\[\\[") "")
					                                           (clojure.string/replace (re-pattern "\\]\\]") "")
					                                           (clojure.string/replace (re-pattern "[\\(\\)]") "")))
					                  (make-link ([text journal-uuid class-addition]
					                    [:a
					                     {:class class-addition
					                      :on-click (fn []
					                                  (call-api
					                                   "append_block_in_page"
					                                   (str journal-uuid)
					                                   (str "TODO {{grocery}} " text)))}
					                     text])
					                             ([text journal-uuid class-addition hsl-map]
					                              [:a
					                               {:class class-addition
					                                :style  {;;:font-weight "bold" ;;idea: use a font-weight gradient
					                                         :color (str "hsl(203 "
					                                                     ;;(:hue-degrees hsl-map) " "
					                                                     (:saturation-percent hsl-map) "% "
					                                                     (:lightness-percent hsl-map) "%)")
					                                         
					                                        ;;  :color (str "hsl(0, "
					                                        ;;              (:saturation-percent hsl-map)
					                                        ;;              "%, "
					                                        ;;              (:lightness-percent hsl-map)
					                                        ;;              "%);")
					                                        ;;  :color "hsl(1 88% 55%)"
					                                         }
					                                :on-click (fn []
					                                            (call-api
					                                             "append_block_in_page"
					                                             (str journal-uuid)
					                                             (str "TODO {{grocery}} " text)))}
					                               ;; (str (:saturation-percent hsl-map) (:lightness-percent hsl-map) text) ;; debug
					                               text])
					                             )
					                  (make-icon [item-name]
					                    (let [icon-table {:cream "ef13"
					                                      :frozen-berries "f511"
					                                      :yogurt "f4c8"
					                                      :cat-food "f287"
					                                      :naan "efa3"
					                                      :patties "feb5"
					                                      :eggs "f500"
					                                      :water "ef0b"
					                                      :sour-cream "ee9f"
					                                      :milk "ef13"
					                                      :cheese "ef26"
					                                      :cheese-powder "ee92"
					                                      :cat-litter "f65b"
					                                      :salad "f50a"
					                                      :tomato-sauce "edbb"
					                                      :automatic-toilet-bowl-cleaner-pucks "efd3"
					                                      :fries "fae9"
					                                      :detergent "f30e"
					                                      :wax-paper "eb2f"
					                                      :perogies "feb5"
					                                      :potatoes "eb8a"
					                                      :sapporo-ramen-noodle "fd90"
					                                      :frozen-veg "f21c"
					                                      :butter "fab5"
					                                      :berries "f511"
					                                      :sodium-bicarbonate "ef16"
					                                      :peanut-oil "ef60"
					                                      :dried-meat "ef17"
					                                      :smokies "ef17"
					                                      :brioche-hotdog-buns "f3a5"
					                                      :sodium-bicarbonate-laundry-booster "f311"
					                                      :garbage-bags "f02f"
					                                      :downy-rinse-and-refresh-laundry-stripper "f311"
					                                      :borax-laundry-booster "f311"
					                                      :little-tissues "f4c9"}
					    
					                          sanitized-item-name (-> item-name
					                                                  (clojure.string/replace " " "-")
					                                                  (clojure.string/replace (re-pattern "\\[\\[") "")
					                                                  (clojure.string/replace (re-pattern "\\]\\]") "")
					                                                  (clojure.string/replace (re-pattern "[\\(\\)]") ""))
					                          icon-code (get icon-table
					                                         (keyword sanitized-item-name)
					                                         "0000")]
					                      (str "&#x" icon-code ";")))]
					    
					            (fn [results]
					              (let [query-data (get-in results [:query-data])
					                    query-results (get-in results [:query-results])]
					    
					                [:div
					                 [:table.display-table.compact.more-compact.needs-disclosure-listener
					                  [:thead
					                   [:tr
					                    [:th.left-column ""]
					                    [:th "Item"]
					                    [:th.disclosure]]]
					                  [:tbody
					                   (for [[grocery-item item-data] query-results]
					                     (let [table-name (str "grocery-purchases")
					                           class-addition (if (:in-basket item-data)
					                                            "strikethrough"
					                                            "")
					                           sanitized-id (sanitize-string grocery-item)]
					                       [:<>
					                        [:tr
					                         [:td.left-column {:rowspan "2"}
					                          [:span {:class "bti bigger"
					                                  :dangerouslySetInnerHTML
					                                  {:__html (make-icon grocery-item)}}]]
					    
					                         [:td.touch-screen
					                          (if (and
					                               (< (:expected-purchase-in-days item-data) 0)
					                               (> (:expected-purchase-in-days item-data) -30))
					  
					                            (make-link grocery-item
					                                       (get-in query-data
					                                               [:today-journal-uuid])
					                                       class-addition
					                                       (:text-color item-data))
					                            (make-link grocery-item
					                                       (get-in query-data
					                                               [:today-journal-uuid])
					                                       class-addition)
					                            ;; (str "expected purchase in days:" (:expected-purchase-in-days item-data))
					                            )
					                          ]
					    
					                         [:td.touch-screen.ti
					                          [:a.disclosure-trigger
					                           {:id (str table-name
					                                     "-disclosure-trigger-"
					                                     sanitized-id)
					                            :data-target (str table-name
					                                              "-secondary-content-"
					                                              sanitized-id)}
					                           (str "▼")]]]
					    
					                        [:tr
					                         [:td.closed.event-info.secondary-content
					                          {:colspan "2"
					                           :id (str table-name
					                                    "-secondary-content-"
					                                    sanitized-id)}
					                          [:div.quick-view-container
					                           [:span.content-slot
					                            (str "Purchased "
					                                 (sanitize-string grocery-item)
					                                 " "
					                                 (:purchase-count item-data)
					                                 " times.")
					                            [:br]
					                            (str "on average every "
					                                 (:average-purchase-days item-data)
					                                 " days,")
					                            [:br]
					                            (str "last "
					                                 (:days-from-last-purchase item-data)
					                                 " days ago.")
					                            [:br][:br]
					                            (str "expected purchase in (days): "
					                                 (:expected-purchase-in-days item-data))
					                            
					                            ]]]]]))]]])))
					  
					  
					  
					  
					    :breadcrumb-show? false}
					  #+END_QUERY
					  ```
					- memoized
					- #+BEGIN_QUERY
					  ;; original ()not working)
					   {:inputs ["grocery" :today]
					    :query
					    [:find ?content ?journal-day ?today-journal-day ?today ?today-journal-uuid ?marker
					     :keys content journal-day today-journal-day today today-journal-uuid marker
					     :in $ ?macro-name ?today-journal-day %
					  
					     :where
					     [?b :block/marker ?marker]
					     ;;[(contains? #{"DONE"} ?marker)]
					     (using-macro ?b ?macro-name)
					  
					     [?b :block/content ?content]
					     [?b :block/page ?p]
					     [?p :block/journal-day ?journal-day]
					  
					     [?j :block/journal-day ?today-journal-day]
					     [?j :block/name ?today]
					     [?j :block/uuid ?today-journal-uuid]]
					  
					  
					    :rules
					    [[(using-macro ?b ?macro-name)
					      [?b :block/macros ?m]
					      [?m :block/properties ?props]
					      [(get ?props :logseq.macro-name) ?macros]
					      [(= ?macros ?macro-name)]]]
					  
					  
					    :result-transform 
					    (letfn
					     [(convert-range [value [old-range-min old-range-max] [new-range-min new-range-max]]
					        ^{:doc "Given a value within a range, converts the value to a different range"
					          :example "(convert-range -4 [-30 0] [0 255]) ;; => 221"}
					        (+
					         (/
					          (*
					           (- value
					              old-range-min)
					                        ;; * 
					           (- new-range-max
					              new-range-min))
					                       ;;----------------
					          (- old-range-max
					             old-range-min))
					                       ;; +
					         new-range-min))
					  
					  
					  
					      (integer-floor
					        [number]
					        ^{:doc "Returns the largest double less than or equal to number,
					              and equal to a mathematical integer. Equivalent to clojure.math/floor"
					          :example "(integer-floor 11.1) => ;; => 11"}
					        (if (>= number 0)
					          (int number)
					          (dec (int number))))
					  
					  
					  
					      (number-absolute
					        [number]
					        ^{:doc "Returns the absolute value of a number. Equivalent to abs."
					          :example "(number-absolute -10) ;; => 10"}
					        (if (>= number 0)
					          number
					          (- number)))
					  
					  
					  
					      (date/today
					       []
					       ^{:doc "Returns today's date as an integer in the format YYYYMMDD.
					              Uses the datascript_query API to fetch the current date."
					         :example "(date/today) ; => 20240918"}
					       (defn get-today [] (let [query-result (call-api "datascript_query"
					                                                       "[:find ?today :in $ ?today :where [_ :block/name _]]"
					                                                       ":today")
					  
					                                date-integer (read-string (apply
					                                                           str
					                                                           query-result))]
					                            date-integer))
					       (def get-cached-date (memoize get-today))
					       
					       (get-cached-date))
					  
					  
					  
					      (date/journal-day->julian-day
					        [year month day]
					        ^{:doc "Converts a Gregorian calendar date to a Julian day number.
					              This function is used for date calculations.
					              Parameters:
					                year: Integer representing the year
					                month: Integer representing the month (1-12)
					                day: Integer representing the day of the month
					              Returns: Integer representing the Julian day number"
					          :example "(date/journal-day->julian-day 2024 9 18) ; => 2460211"}
					        (let [adjustment (integer-floor (/ (- month
					                                              14)
					                                           12))
					  
					              adjusted-year (+ year
					                               4800
					                               adjustment)
					  
					              adjusted-month (+ month
					                                (* 12
					                                   adjustment)
					                                -3)]
					  
					          (+ (integer-floor (+ (* 365.25
					                                  adjusted-year)
					                               0.5))
					             (integer-floor (+ (* 30.6001
					                                  (+ adjusted-month
					                                     1))
					                               0.5))
					             day
					             -32075)))
					  
					  
					  
					      (date/get-difference
					        ([journal-day] (date/get-difference journal-day (date/today)))
					        ^{:doc "Calculates the absolute difference in days between a date and today.
					              Parameters:
					                journal-day: Integer representing a date in YYYYMMDD format."}
					        ([journal-day1 journal-day2]
					         ^{:doc "Calculates the absolute difference in days between two dates.
					              Parameters:
					                journal-day1: Integer representing a date in YYYYMMDD format
					                journal-day2: Integer representing a date in YYYYMMDD format
					              Returns: Integer representing the number of days between the two dates"
					           :example "(date/get-difference 20240918 20240610) ; => 100"}
					  
					         (let [extract-date (fn [date]
					                              [(quot date 10000)
					                               (rem (quot date 100) 100)
					                               (rem date 100)])
					               [year1 month1 day1] (extract-date
					                                    journal-day1)
					               [year2 month2 day2] (extract-date
					                                    journal-day2)
					               julian-day-number1 (date/journal-day->julian-day
					                                   year1
					                                   month1
					                                   day1)
					               julian-day-number2 (date/journal-day->julian-day
					                                   year2
					                                   month2
					                                   day2)]
					           (number-absolute (- julian-day-number1
					                               julian-day-number2)))))]
					      (def date/today (memoize today))
					      (fn [results]
					  
					        (let [first-line (fn [item]
					                           (if (clojure.string/index-of item "\n")
					                             (subs item 0 (clojure.string/index-of item "\n"))
					                             item))
					              query-data (first results)
					              query-results (map (fn [result]
					                                   (dissoc result :today-journal-day :today :today-journal-uuid))
					                                 results)
					              transformed-results
					              (->> query-results
					                   (map (fn [result]
					                          (update result :content
					                                  (fn [item]
					                                    (-> item
					                                        first-line
					                                        clojure.string/lower-case
					                                        (clojure.string/replace
					                                         (re-pattern "(?:done|todo) \\{\\{grocery\\}\\} ") "")
					                                        (clojure.string/replace (re-pattern "x\\d$") "")
					                                        clojure.string/trim)))))
					                   (group-by :content)
					  
					                   (sort-by (fn [[_ entries]]
					                              (count entries))
					                            >)
					  
					                   (map (fn [[grocery-item entries]]
					                          [grocery-item (map (fn [entry]
					                                               (dissoc entry :content))
					                                             entries)]))
					  
					                   (map (fn [[grocery-item purchase-data]]
					                          (let [in-basket?
					                                (some (fn [entry]
					                                        (=
					                                         (:marker entry)
					                                         "TODO"))
					                                      purchase-data)
					  
					                                first-purchase-date
					                                (->> purchase-data
					                                     (map :journal-day)
					                                     (apply min))
					  
					                                days-from-first-purchase ;;first-purchase-days
					                                (date/get-difference first-purchase-date)
					  
					                                last-purchase-date
					                                (->> purchase-data
					                                     (filter (fn [m]
					                                               (= (:marker m) "DONE")))
					                                     (map :journal-day)
					                                     (apply max))
					  
					                                days-from-last-purchase ;;last-purchase-days
					                                (date/get-difference last-purchase-date)
					  
					                                purchase-count
					                                (count purchase-data)
					  
					                               ;; Don't count items on the list for purchase
					                               ;; because that's cheating.
					                                adjusted-purchase-count
					                                (if in-basket?
					                                  (dec purchase-count)
					                                  purchase-count)
					  
					                               ;; Average number of days between purchases beginning from
					                               ;; the first purchase and until the last purchase.
					                                average-purchase-in-days
					                                (integer-floor
					                                 (/ (- days-from-first-purchase
					                                       days-from-last-purchase)
					                                    adjusted-purchase-count))
					  
					                                expected-purchase-in-days (- average-purchase-in-days
					                                                             days-from-last-purchase)
					  
					                                overdue-purchase? (< expected-purchase-in-days 1)
					  
					                               ;; Go from red to black over -1 to -30 days of overdue
					                               ;; purchase time
					                               ;; -1 = 88% 58%
					                               ;; -30 = 53% 29%
					                                text-color {:hue-degrees (integer-floor
					                                                          (convert-range
					                                                           expected-purchase-in-days
					                                                           [-30 -1]
					                                                           [203 0])) ;; blue: 203 82 35
					                                            :saturation-percent (integer-floor
					                                                                 (convert-range
					                                                                  expected-purchase-in-days
					                                                                  [-30 -1]
					                                                                  [82 52])) ;;82 ;; dest start
					                                            :lightness-percent (integer-floor (convert-range
					                                                                               expected-purchase-in-days
					                                                                               [-30 -1]
					                                                                               [45 71]))}] ;;35
					  
					  
					                            [grocery-item {:purchase-count adjusted-purchase-count
					                                           :first-purchase-date first-purchase-date
					                                           :last-purchase-date last-purchase-date
					                                           :days-from-first-purchase days-from-first-purchase
					                                           :days-from-last-purchase days-from-last-purchase
					                                           :average-purchase-days average-purchase-in-days
					                                           :expected-purchase-in-days expected-purchase-in-days
					                                           :purchase-overdue? overdue-purchase?
					                                           :in-basket in-basket?
					                                           :text-color text-color
					                                           :purchase-data purchase-data}]))))]
					  
					  
					          (assoc {}
					                 :query-data (select-keys query-data
					                                          [:today-journal-day
					                                           :today
					                                           :today-journal-uuid])
					                 :query-results transformed-results))))
					  
					  
					    ;;  :view :pprint
					  
					    :view (letfn [(sanitize-string [s] (-> s
					                                           (clojure.string/replace " " "-")
					                                           (clojure.string/replace (re-pattern "\\[\\[") "")
					                                           (clojure.string/replace (re-pattern "\\]\\]") "")
					                                           (clojure.string/replace (re-pattern "[\\(\\)]") "")))
					                  (make-link ([text journal-uuid class-addition]
					                    [:a
					                     {:class class-addition
					                      :on-click (fn []
					                                  (call-api
					                                   "append_block_in_page"
					                                   (str journal-uuid)
					                                   (str "TODO {{grocery}} " text)))}
					                     text])
					                             ([text journal-uuid class-addition hsl-map]
					                              [:a
					                               {:class class-addition
					                                :style  {;;:font-weight "bold" ;;idea: use a font-weight gradient
					                                         :color (str "hsl(203 "
					                                                     ;;(:hue-degrees hsl-map) " "
					                                                     (:saturation-percent hsl-map) "% "
					                                                     (:lightness-percent hsl-map) "%)")
					                                         
					                                        ;;  :color (str "hsl(0, "
					                                        ;;              (:saturation-percent hsl-map)
					                                        ;;              "%, "
					                                        ;;              (:lightness-percent hsl-map)
					                                        ;;              "%);")
					                                        ;;  :color "hsl(1 88% 55%)"
					                                         }
					                                :on-click (fn []
					                                            (call-api
					                                             "append_block_in_page"
					                                             (str journal-uuid)
					                                             (str "TODO {{grocery}} " text)))}
					                               ;; (str (:saturation-percent hsl-map) (:lightness-percent hsl-map) text) ;; debug
					                               text])
					                             )
					                  (make-icon [item-name]
					                    (let [icon-table {:cream "ef13"
					                                      :frozen-berries "f511"
					                                      :yogurt "f4c8"
					                                      :cat-food "f287"
					                                      :naan "efa3"
					                                      :patties "feb5"
					                                      :eggs "f500"
					                                      :water "ef0b"
					                                      :sour-cream "ee9f"
					                                      :milk "ef13"
					                                      :cheese "ef26"
					                                      :cheese-powder "ee92"
					                                      :cat-litter "f65b"
					                                      :salad "f50a"
					                                      :tomato-sauce "edbb"
					                                      :automatic-toilet-bowl-cleaner-pucks "efd3"
					                                      :fries "fae9"
					                                      :detergent "f30e"
					                                      :wax-paper "eb2f"
					                                      :perogies "feb5"
					                                      :potatoes "eb8a"
					                                      :sapporo-ramen-noodle "fd90"
					                                      :frozen-veg "f21c"
					                                      :butter "fab5"
					                                      :berries "f511"
					                                      :sodium-bicarbonate "ef16"
					                                      :peanut-oil "ef60"
					                                      :dried-meat "ef17"
					                                      :smokies "ef17"
					                                      :brioche-hotdog-buns "f3a5"
					                                      :sodium-bicarbonate-laundry-booster "f311"
					                                      :garbage-bags "f02f"
					                                      :downy-rinse-and-refresh-laundry-stripper "f311"
					                                      :borax-laundry-booster "f311"
					                                      :little-tissues "f4c9"}
					    
					                          sanitized-item-name (-> item-name
					                                                  (clojure.string/replace " " "-")
					                                                  (clojure.string/replace (re-pattern "\\[\\[") "")
					                                                  (clojure.string/replace (re-pattern "\\]\\]") "")
					                                                  (clojure.string/replace (re-pattern "[\\(\\)]") ""))
					                          icon-code (get icon-table
					                                         (keyword sanitized-item-name)
					                                         "0000")]
					                      (str "&#x" icon-code ";")))]
					    
					            (fn [results]
					              (let [query-data (get-in results [:query-data])
					                    query-results (get-in results [:query-results])]
					    
					                [:div
					                 [:table.display-table.compact.more-compact.needs-disclosure-listener
					                  [:thead
					                   [:tr
					                    [:th.left-column ""]
					                    [:th "Item"]
					                    [:th.disclosure]]]
					                  [:tbody
					                   (for [[grocery-item item-data] query-results]
					                     (let [table-name (str "grocery-purchases")
					                           class-addition (if (:in-basket item-data)
					                                            "strikethrough"
					                                            "")
					                           sanitized-id (sanitize-string grocery-item)]
					                       [:<>
					                        [:tr
					                         [:td.left-column {:rowspan "2"}
					                          [:span {:class "bti bigger"
					                                  :dangerouslySetInnerHTML
					                                  {:__html (make-icon grocery-item)}}]]
					    
					                         [:td.touch-screen
					                          (if (and
					                               (< (:expected-purchase-in-days item-data) 0)
					                               (> (:expected-purchase-in-days item-data) -30))
					  
					                            (make-link grocery-item
					                                       (get-in query-data
					                                               [:today-journal-uuid])
					                                       class-addition
					                                       (:text-color item-data))
					                            (make-link grocery-item
					                                       (get-in query-data
					                                               [:today-journal-uuid])
					                                       class-addition)
					                            ;; (str "expected purchase in days:" (:expected-purchase-in-days item-data))
					                            )
					                          ]
					    
					                         [:td.touch-screen.ti
					                          [:a.disclosure-trigger
					                           {:id (str table-name
					                                     "-disclosure-trigger-"
					                                     sanitized-id)
					                            :data-target (str table-name
					                                              "-secondary-content-"
					                                              sanitized-id)}
					                           (str "▼")]]]
					    
					                        [:tr
					                         [:td.closed.event-info.secondary-content
					                          {:colspan "2"
					                           :id (str table-name
					                                    "-secondary-content-"
					                                    sanitized-id)}
					                          [:div.quick-view-container
					                           [:span.content-slot
					                            (str "Purchased "
					                                 (sanitize-string grocery-item)
					                                 " "
					                                 (:purchase-count item-data)
					                                 " times.")
					                            [:br]
					                            (str "on average every "
					                                 (:average-purchase-days item-data)
					                                 " days,")
					                            [:br]
					                            (str "last "
					                                 (:days-from-last-purchase item-data)
					                                 " days ago.")
					                            [:br][:br]
					                            (str "expected purchase in (days): "
					                                 (:expected-purchase-in-days item-data))
					                            
					                            ]]]]]))]]])))
					  
					  
					  
					  
					    :breadcrumb-show? false}
					  #+END_QUERY
				- query v2
					- ```cljs
					  #+BEGIN_QUERY
					  ;; query v2
					   {:inputs ["grocery" :today]
					    :query
					    [:find ?content ?journal-day ?today-journal-day ?today ?today-journal-uuid ?marker
					     :keys content journal-day today-journal-day today today-journal-uuid marker
					     :in $ ?macro-name ?today-journal-day %
					  
					     :where
					     [?b :block/marker ?marker]
					     ;;[(contains? #{"DONE"} ?marker)]
					     (using-macro ?b ?macro-name)
					  
					     [?b :block/content ?content]
					     [?b :block/page ?p]
					     [?p :block/journal-day ?journal-day]
					  
					     [?j :block/journal-day ?today-journal-day]
					     [?j :block/name ?today]
					     [?j :block/uuid ?today-journal-uuid]]
					  
					  
					    :rules
					    [[(using-macro ?b ?macro-name)
					      [?b :block/macros ?m]
					      [?m :block/properties ?props]
					      [(get ?props :logseq.macro-name) ?macros]
					      [(= ?macros ?macro-name)]]]
					  
					  
					    :result-transform
					    (fn [results]
					      (let [first-line (fn [item]
					                         (if (clojure.string/index-of item "\n")
					                           (subs item 0 (clojure.string/index-of item "\n"))
					                           item))
					            query-data (first results)
					            query-results (map (fn [result]
					                                 (dissoc result :today-journal-day :today :today-journal-uuid))
					                               results)
					            transformed-results (->> query-results
					                                     (map (fn [result]
					                                            (update result :content
					                                                    (fn [item]
					                                                      (-> item
					                                                          first-line
					                                                          clojure.string/lower-case
					                                                          (clojure.string/replace
					                                                           (re-pattern "(?:done|todo) \\{\\{grocery\\}\\} ") "")
					                                                          (clojure.string/replace (re-pattern "x\\d$") "")
					                                                          clojure.string/trim)))))
					  
					  
					                                     (group-by :content)
					  
					                                     (sort-by (fn [[_ entries]] (count entries)) >)
					  
					                                     (map (fn [[grocery-item entries]]
					                                            [grocery-item (map (fn [entry] (dissoc entry :content)) entries)]))
					  
					                                     (map (fn [[grocery-item purchase-data]]
					                                            [grocery-item {:purchase-count (count purchase-data)
					                                                           :first-purchase (->> purchase-data
					                                                                                (map :journal-day)
					                                                                                (apply min))
					                                                           :last-purchase (->> purchase-data
					                                                                               (map :journal-day)
					                                                                               (apply max))
					                                                           :in-basket (some (fn [entry] (= (:marker entry) "TODO")) purchase-data)
					                                                           :purchase-data purchase-data}])))]
					  
					        (assoc {}
					               :query-data (select-keys query-data [:today-journal-day :today :today-journal-uuid])
					               :query-results transformed-results)))
					  
					    :view (letfn [(make-link [text journal-uuid class-addition]
					                   [:a {:class class-addition :on-click (fn [] (call-api "append_block_in_page" (str journal-uuid) (str "TODO {{grocery}} " text)))}
					                    text])
					                  (make-icon [item-name]
					                    (let [icon-table {:cream "ef13"
					                                      :frozen-berries "f511"
					                                      :yogurt "f4c8"
					                                      :cat-food "f287"
					                                      :naan "efa3"
					                                      :patties "feb5"
					                                      :eggs "f500"
					                                      :water "ef0b"
					                                      :sour-cream "ee9f"
					                                      :milk "ef13"
					                                      :cheese "ef26"
					                                      :cheese-powder "ee92"
					                                      :cat-litter "f65b"
					                                      :salad "f50a"
					                                      :tomato-sauce "edbb"
					                                      :automatic-toilet-bowl-cleaner-pucks "efd3"
					                                      :fries "fae9"
					                                      :detergent "f30e"
					                                      :wax-paper "eb2f"
					                                      :perogies "feb5"
					                                      :potatoes "eb8a"
					                                      :sapporo-ramen-noodle "fd90"
					                                      :frozen-veg "f21c"
					                                      :butter "fab5"
					                                      :berries "f511"
					                                      :sodium-bicarbonate "ef16"
					                                      :peanut-oil "ef60"
					                                      :dried-meat "ef17"
					                                      :smokies "ef17"
					                                      :brioche-hotdog-buns "f3a5"
					                                      :sodium-bicarbonate-laundry-booster "f311"
					                                      :garbage-bags "f02f"
					                                      :downy-rinse-and-refresh-laundry-stripper "f311"
					                                      :borax-laundry-booster "f311"
					                                      :little-tissues "f4c9"}
					            
					                          sanitized-item-name (-> item-name
					                                                  (clojure.string/replace " " "-")
					                                                  (clojure.string/replace (re-pattern "[\\(\\)]") ""))
					                          icon-code (get icon-table (keyword sanitized-item-name) "0000")]
					                      (str "&#x" icon-code ";")))]
					  
					           (fn [results]
					             (let [query-data (get-in results [:query-data])
					                   query-results (get-in results [:query-results])]
					                  
					               [:div
					                [:table {:class "future-appointments compact more-compact stop-click"}
					                 [:thead
					                  [:tr
					                   [:th ""]
					                   [:th "Item"]]]
					                 [:tbody
					                  (for [[grocery-item item-data] query-results]
					                    (let [class-addition (if (:in-basket item-data) "strikethrough" "")]
					                     [:tr
					                      [:td [:span {:class "bti bigger" :dangerouslySetInnerHTML {:__html (make-icon grocery-item)}}]]
					                      [:td.touch-screen (make-link grocery-item (get-in query-data [:today-journal-uuid]) class-addition)]]))]]])))
					                   
					                 
					  
					    :breadcrumb-show? false}
					  #+END_QUERY
					  ```
				- query v1
					- ![image.png](../assets/image_1723933819675_0.png){:height 161, :width 240}
					- No way to indicate if an item is in the basket
					- ```cljs
					  #+BEGIN_QUERY
					  ;; [[grocery list]] query
					   {:inputs ["grocery" :today]
					    :query
					    [:find ?content ?journal-day ?today-journal-day ?today ?today-journal-uuid
					     :keys content journal-day today-journal-day today today-journal-uuid
					     :in $ ?macro-name ?today-journal-day %
					  
					     :where
					     [?b :block/marker ?marker]
					     [(contains? #{"DONE"} ?marker)]
					     (using-macro ?b ?macro-name)
					  
					     [?b :block/content ?content]
					     [?b :block/page ?p]
					     [?p :block/journal-day ?journal-day]
					  
					     [?j :block/journal-day ?today-journal-day]
					     [?j :block/name ?today]
					     [?j :block/uuid ?today-journal-uuid]]
					  
					  
					    :rules
					    [[(using-macro ?b ?macro-name)
					      [?b :block/macros ?m]
					      [?m :block/properties ?props]
					      [(get ?props :logseq.macro-name) ?macros]
					      [(= ?macros ?macro-name)]]]
					  
					  
					    :result-transform
					    (fn [results]
					      (let [query-data (first results)
					            query-results (map (fn [result]
					                                 (dissoc result :today-journal-day :today :today-journal-uuid))
					                               results)
					            transformed-results (->> query-results
					                                     (map (fn [result]
					                                            (update result :content
					                                                    (fn [item]
					                                                      (-> item
					                                                          clojure.string/lower-case
					                                                          (clojure.string/replace
					                                                           (re-pattern "done \\{\\{grocery\\}\\} ") "")
					                                                          (clojure.string/replace (re-pattern "x\\d$") "")
					                                                          clojure.string/trim)))))
					  
					  
					                                     (group-by :content)
					  
					                                     (sort-by (fn [[_ entries]] (count entries)) >)
					  
					                                     (map (fn [[grocery-item entries]]
					                                            [grocery-item (map (fn [entry] (dissoc entry :content)) entries)]))
					  
					                                     (map (fn [[grocery-item purchase-data]]
					                                            [grocery-item {:purchase-count (count purchase-data)
					                                                           :first-purchase (->> purchase-data
					                                                                                (map :journal-day)
					                                                                                (apply min))
					                                                           :last-purchase (->> purchase-data
					                                                                               (map :journal-day)
					                                                                               (apply max))
					                                                           :purchase-data purchase-data}])))]
					  
					        (assoc {}
					               :query-data (select-keys query-data [:today-journal-day :today :today-journal-uuid])
					               :query-results transformed-results)))
					  
					    :view (letfn [(make-link [text journal-uuid]
					                    [:a {:on-click (fn [] (call-api "append_block_in_page" (str journal-uuid) (str "TODO {{grocery}} " text)))}
					                     text])
					                  (make-icon [item-name]
					                    (let [icon-table {:cream "ef13"
					                                      :frozen-berries "f511"
					                                      :yogurt "f4c8"
					                                      :cat-food "f287"
					                                      :naan "efa3"
					                                      :patties "feb5"
					                                      :eggs "f500"
					                                      :water "ef0b"
					                                      :sour-cream "ee9f"
					                                      :milk "ef13"
					                                      :cheese "ef26"
					                                      :cheese-powder "ee92"
					                                      :cat-litter "f65b"
					                                      :salad "f50a"
					                                      :tomato-sauce "edbb"
					                                      :automatic-toilet-bowl-cleaner-pucks "efd3"
					                                      :fries "fae9"
					                                      :detergent "f30e"
					                                      :wax-paper "eb2f"
					                                      :perogies "feb5"
					                                      :potatoes "eb8a"
					                                      :sapporo-ramen-noodle "fd90"
					                                      :frozen-vegetables "f21c"
					                                      :butter "fab5"
					                                      :berries "f511"
					                                      :sodium-bicarbonate "ef16"
					                                      :peanut-oil "ef60"
					                                      :pizza-meat "ef17"
					                                      :garbage-bags "f02f"
					                                      :downy-rinse-and-refresh "f311"
					                                      :little-tissues "f4c9"}
					                          icon-code (get icon-table (keyword (clojure.string/replace item-name " " "-")) "0000")]
					                      (str "&#x" icon-code ";")))]
					  
					            (fn [results]
					              (let [query-data (get-in results [:query-data])
					                    query-results (get-in results [:query-results])]
					                [:div
					                 [:table {:class "future-appointments compact"}
					                  [:thead
					                   [:tr
					                    [:th ""]
					                    [:th "Item"]
					                    ]]
					                  [:tbody
					                   (for [[grocery-item _] query-results]
					                     [:tr
					                      [:td [:span {:class "bti bigger" :dangerouslySetInnerHTML {:__html (make-icon grocery-item)}} ]]
					                      [:td (make-link grocery-item (get-in query-data [:today-journal-uuid]))]
					                      
					                      ])]]])))
					  
					    :breadcrumb-show? false}
					  #+END_QUERY
					  ```
		- {{i ecd0}}  Related page *linked reference count*
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
		- {{i ef91}}  **projects** journal widget
		  id:: 6666f9ad-7589-4721-a459-d7d18591c09e
		      ![image.png](../assets/image_1719764465551_0.png){:height 32, :width 210}
			- {{i f635}} information
				- for related {{i ef91}} project see [[:logseq-project-manager-2024.5]]
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
				                     [:div {:class "quick-view-container left-spacing"} 
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
			- {{i ea0b}} *version archive*
			  id:: 6653554c-6a4b-4673-9f08-a7e58a13c5fe
			  *older stuff*
				- version 2.4 improves styling (*current*)
				- version 2.3
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
		- {{i ef91}}  **project list** quick-view
		        ![image.png](../assets/image_1719764401764_0.png){:height 38, :width 143}
			- *see [[:logseq-project-manager-2024.5]]*
			- *next up list*
				- **Current query**
					- id:: 6654b591-49ea-4d3a-b9d9-1dc4f25bab0c
					  #+BEGIN_QUERY
					  {:inputs [:current-page #{"next"}]
					   :query
					   [:find ?current-page-id ?project-name ?manager-name ?project-properties
					    :keys current-page-id project-name manager-name project-properties
					    :in $ ?current-page ?completion-category
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
					    [(contains? ?completion-category ?manager-name)]
					  
					  
					    [?page :block/name ?current-page]
					    [?page :block/uuid ?current-page-id]
					    [?project :block/name ?project-name]
					    [?project :block/properties ?project-properties]]
					  
					   :result-transform
					   (fn [results]
					     (let [sorted-results (sort-by
					                           (fn [r]
					                             (get r
					                                  :block/name
					                                  "none")) results)]
					       (map (fn [result]
					              (let [icon (get-in result
					                                 [:project-properties :-icon]
					                                 "ef27")] ; Use fallback icon if none
					                (assoc result :icon icon))) ; Associate the icon with the result
					            (if (empty? sorted-results)
					              [{:block/name "\uf4a5 none"}]
					              sorted-results))))
					  
					   :view
					   (fn [results]
					     [:div.projects-list-container
					      (map (fn [results]
					             (let [project-name (:project-name results)
					                   uuid (str (:current-page-id results))
					                   icon (:icon results)]
					   
					               [:span.project-item
					                [:a.project-quick-add 
					                 {:on-click
					                  (fn [] (call-api
					                          "append_block_in_page"
					                          uuid
					                          (str "{{i " icon "}} #[[" project-name "]]")))}
					                 
					                 [:span.project-leading-icon.lighter "\uf63f "] 
					                 [:span.project-name  
					                  [:span.ti 
					                   (read-string (str "\" \\u" icon "\""))
					                   ] project-name]] 
					                
					                [:a.project-trailing-icon 
					                 {:on-click 
					                  (fn [] 
					                    (call-api 
					                     "push_state" 
					                     "page" {:name project-name}))}
					                 "\uea99 "]]))
					           results)])
					  }
					  #+END_QUERY
				- [:small "(older versions)"]
					- version 1.4 (current)
					  *introduces display icons & dynamic completion category specification*
						- ```cljs
						  #+BEGIN_QUERY
						  {:inputs [:current-page #{"next"}]
						   :query
						   [:find ?current-page-id ?project-name ?manager-name ?project-properties
						    :keys current-page-id project-name manager-name project-properties
						    :in $ ?current-page ?completion-category
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
						    ;; [(contains? #{"finished"} ?manager-name)]
						    [(contains? ?completion-category ?manager-name)]
						  
						  
						    [?page :block/name ?current-page]
						    [?page :block/uuid ?current-page-id]
						    [?project :block/name ?project-name]
						    [?project :block/properties ?project-properties]]
						  
						   :result-transform
						   (fn [results]
						     (let [sorted-results (sort-by
						                           (fn [r]
						                             (get r
						                                  :block/name
						                                  "none")) results)]
						       (map (fn [result]
						              (let [icon (get-in result
						                                 [:project-properties :-icon]
						                                 "ef27")] ; Use fallback icon if none
						                (assoc result :icon icon))) ; Associate the icon with the result
						            (if (empty? sorted-results)
						              [{:block/name "\uf4a5 none"}]
						              sorted-results))))
						  
						   :view
						   (fn [results]
						     [:div.projects-list-container
						      (map (fn [results]
						             (let [project-name (:project-name results)
						                   uuid (str (:current-page-id results))
						                   icon (:icon results)]
						   
						               [:span.project-item
						                [:a.project-quick-add 
						                 {:on-click
						                  (fn [] (call-api
						                          "append_block_in_page"
						                          uuid
						                          (str "{{i " icon "}} #[[" project-name "]]")))}
						                 
						                 [:span.project-leading-icon.lighter "\uf63f "] 
						                 [:span.project-name  
						                  [:span.ti 
						                   (read-string (str "\" \\u" icon "\""))
						                   ] project-name]] 
						                
						                [:a.project-trailing-icon 
						                 {:on-click 
						                  (fn [] 
						                    (call-api 
						                     "push_state" 
						                     "page" {:name project-name}))}
						                 "\uea99 "]]))
						           results)])
						  }
						  #+END_QUERY
						  ```
					- version 1.3
					  *more compact*
					  ![image.png](../assets/image_1726346493459_0.png){:height 178, :width 437}
						- retired [[Saturday, Sep 14th, 2024]]
						- ```cljs
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
						                               (let [icon (get-in result [:project-properties :-icon] "ef27")] ; Use fallback icon if none
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
						  ```
					- version 1.2
					  *introduces project icons & open page icon*
					  ![image.png](../assets/image_1726346531928_0.png){:height 216, :width 296}
						- ```cljs
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
						  ```
						-
					- version 1.1
					  ![image.png](../assets/image_1717608526060_0.png){:height 95, :width 182}
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
			- *finished list*
				- *current query*
					- id:: 66e5f125-a19b-444b-ba8c-733711e2cd0f
					  #+BEGIN_QUERY
					  {:inputs [:current-page #{"finished"}]
					   :query
					   [:find ?current-page-id ?project-name ?manager-name ?project-properties
					    :keys current-page-id project-name manager-name project-properties
					    :in $ ?current-page ?completion-category
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
					    ;; [(contains? #{"finished"} ?manager-name)]
					    [(contains? ?completion-category ?manager-name)]
					  
					  
					    [?page :block/name ?current-page]
					    [?page :block/uuid ?current-page-id]
					    [?project :block/name ?project-name]
					    [?project :block/properties ?project-properties]]
					  
					   :result-transform
					   (fn [results]
					     (let [sorted-results (sort-by
					                           (fn [r]
					                             (get r
					                                  :block/name
					                                  "none")) results)]
					       (map (fn [result]
					              (let [icon (get-in result
					                                 [:project-properties :-icon]
					                                 "ef27")] ; Use fallback icon if none
					                (assoc result :icon icon))) ; Associate the icon with the result
					            (if (empty? sorted-results)
					              [{:block/name "\uf4a5 none"}]
					              sorted-results))))
					  
					   :view
					   (fn [results]
					     [:div.projects-list-container
					      (map (fn [results]
					             (let [project-name (:project-name results)
					                   uuid (str (:current-page-id results))
					                   icon (:icon results)]
					   
					               [:span.project-item
					                [:a.project-quick-add 
					                 {:on-click
					                  (fn [] (call-api
					                          "append_block_in_page"
					                          uuid
					                          (str "{{i " icon "}} #[[" project-name "]]")))}
					                 
					                 [:span.project-leading-icon.lighter "\uf63f "] 
					                 [:span.project-name  
					                  [:span.ti 
					                   (read-string (str "\" \\u" icon "\""))
					                   ] project-name]] 
					                
					                [:a.project-trailing-icon 
					                 {:on-click 
					                  (fn [] 
					                    (call-api 
					                     "push_state" 
					                     "page" {:name project-name}))}
					                 "\uea99 "]]))
					           results)])
					  }
					  #+END_QUERY
		- {{i ee21}}  **next appointment** journal widget
		  id:: 664ceeec-b343-4d67-94d5-4db82220f06f
		       ![image.png](../assets/image_1724503316662_0.png){:height 30, :width 245}
			- {{i f635}} information
				- for related {{i ef91}} project see [[:logseq-events-and-appointments]]
			- ### {{i eb89}} current query
			  version: **v2.4.2**
				- id:: 664e4055-3b72-4ba1-ac8b-48e34544629c
				  #+BEGIN_QUERY
				  {:query
				   [:find (min ?activity-datestamp) ?date ?activity-datestamp ?today-datestamp ?content ?props ?current-page-name ?activity-uuid ?current-page-uuid (distinct ?icon)
				    :keys first-activity-datestamp date activity-datestamp today-datestamp content properties current-page-name activity-card-uuid current-page-uuid icon
				    :in $ ?today-datestamp ?current-page-name
				    :where
				  
				    [?b :block/properties ?props]
				    [(get ?props :activity) ?activity]
				    [(get ?props :event) ?event]
				    [(get ?props :date) ?date]
				    [(get ?props :scheduling "") ?scheduling]
				    (not [(contains? ?scheduling "CANCELED")])
				  
				    ;; :date
				    [?d :block/original-name ?bn]
				    [(contains? ?date ?bn)]
				    [?d :block/journal-day ?activity-datestamp]
				    [(>= ?activity-datestamp ?today-datestamp)]
				  
				    [?b :block/content ?content]
				    [?b :block/uuid ?activity-uuid]
				  
				    [?p :block/name ?current-page-name]
				    [?p :block/uuid ?current-page-uuid]
				  
				    [?a :block/name ?activity-page]
				    [(contains? ?activity ?activity-page)]
				    (or-join [?a ?icon]
				             (and
				              [?a :block/properties ?activity-props]
				              [(get ?activity-props :-icon) ?icon]
				              [(some? ?icon)]) ;; :-icon exists and is not nil
				             (and
				              [?a :block/properties ?activity-props]
				              [(get ?activity-props :-icon :not-found) ?icon-or-not-found]
				              [(= ?icon-or-not-found :not-found)] ;; :block/properties, but nil icon
				              [(identity "0000") ?icon])
				             (and ;; no block properties
				              [(missing? $ ?a :block/properties)] ;; no :bp
				              [(identity "0000") ?icon]))]
				  
				  
				   :result-transform
				   (letfn [(format-event-string [event-name person-names]
				             (if (seq person-names)
				               (str event-name " with " (clojure.string/join ", " person-names))
				               (str event-name)))
				  
				           (sort-by-activity-datestamp [results]
				             (sort-by (fn [r] (get-in r [:activity-datestamp])) compare results))
				  
				           (filter-next-events [results]
				             (let [first-activity-datestamp (get-in (first results) [:first-activity-datestamp])]
				               (filter (fn [result]
				                         (= (get-in result [:activity-datestamp]) first-activity-datestamp))
				                       results)))
				  
				           (format-event [result]
				             (let [event-name (get-in result [:properties :event])
				                   person-names (get-in result [:properties :with])
				                   event-uuid (str (get-in result [:activity-card-uuid]))
				                   current-page-uuid (str (get-in result [:current-page-uuid]))
				                   event-icon (first (get-in result [:icon]))]
				               {:name (format-event-string event-name person-names)
				                :uuid event-uuid
				                :current-page-uuid current-page-uuid
				                :icon event-icon}))]
				  
				  
				     (fn [results]
				       (->> results
				            (sort-by-activity-datestamp)
				            (filter-next-events)
				            (map format-event))))
				  
				   :view
				   (fn [formatted-events]
				     (if (empty? formatted-events)
				       "no events"
				       (for [event formatted-events]
				         [:div {:class "quick-view-container left-spacing"}
				          [:span {:class "ti"} (read-string (str "\"\\u" (:icon event) "\""))]
				          [:span {:class "content-slot"}
				           [:a {:on-click (fn []
				                            (call-api "append_block_in_page" (:current-page-uuid event)
				                                      (str "{{i eb6d}} note for {{i f621}} [" (:name event)
				                                           "](((" (:uuid event) ")))")))}
				            (:name event)]]])))
				  
				   :inputs [:today :current-page]}
				  #+END_QUERY
			- {{i ea0b}} *version archive*
			  *older stuff*
				- v2.4.2 fix: Do not skip results where :block/properties exists but is empty.
					- See workspace: ((66d5be14-15cf-4d64-8fbf-ca561c6c4084))
					- ```cljs
					  {:query
					   [:find (min ?activity-datestamp) ?date ?activity-datestamp ?today-datestamp ?content ?props ?current-page-name ?activity-uuid ?current-page-uuid (distinct ?icon)
					    :keys first-activity-datestamp date activity-datestamp today-datestamp content properties current-page-name activity-card-uuid current-page-uuid icon
					    :in $ ?today-datestamp ?current-page-name
					    :where
					  
					    [?b :block/properties ?props]
					    [(get ?props :activity) ?activity]
					    [(get ?props :event) ?event]
					    [(get ?props :date) ?date]
					    [(get ?props :scheduling "") ?scheduling]
					    (not [(contains? ?scheduling "CANCELED")])
					  
					    ;; :date
					    [?d :block/original-name ?bn]
					    [(contains? ?date ?bn)]
					    [?d :block/journal-day ?activity-datestamp]
					    [(>= ?activity-datestamp ?today-datestamp)]
					  
					    [?b :block/content ?content]
					    [?b :block/uuid ?activity-uuid]
					  
					    [?p :block/name ?current-page-name]
					    [?p :block/uuid ?current-page-uuid]
					  
					    [?a :block/name ?activity-page]
					    [(contains? ?activity ?activity-page)]
					    (or-join [?a ?icon]
					             (and
					              [?a :block/properties ?activity-props]
					              [(get ?activity-props :-icon) ?icon]
					              [(some? ?icon)]) ;; :-icon exists and is not nil
					             (and
					              [?a :block/properties ?activity-props]
					              [(get ?activity-props :-icon :not-found) ?icon-or-not-found]
					              [(= ?icon-or-not-found :not-found)] ;; :block/properties, but nil icon
					              [(identity "0000") ?icon])
					             (and ;; no block properties
					              [(missing? $ ?a :block/properties)] ;; no :bp
					              [(identity "0000") ?icon]))]
					  
					  
					   :result-transform
					   (letfn [(format-event-string [event-name person-names]
					             (if (seq person-names)
					               (str event-name " with " (clojure.string/join ", " person-names))
					               (str event-name)))
					  
					           (sort-by-activity-datestamp [results]
					             (sort-by (fn [r] (get-in r [:activity-datestamp])) compare results))
					  
					           (filter-next-events [results]
					             (let [first-activity-datestamp (get-in (first results) [:first-activity-datestamp])]
					               (filter (fn [result]
					                         (= (get-in result [:activity-datestamp]) first-activity-datestamp))
					                       results)))
					  
					           (format-event [result]
					             (let [event-name (get-in result [:properties :event])
					                   person-names (get-in result [:properties :with])
					                   event-uuid (str (get-in result [:activity-card-uuid]))
					                   current-page-uuid (str (get-in result [:current-page-uuid]))
					                   event-icon (first (get-in result [:icon]))]
					               {:name (format-event-string event-name person-names)
					                :uuid event-uuid
					                :current-page-uuid current-page-uuid
					                :icon event-icon}))]
					  
					  
					     (fn [results]
					       (->> results
					            (sort-by-activity-datestamp)
					            (filter-next-events)
					            (map format-event))))
					  
					   :view
					   (fn [formatted-events]
					     (if (empty? formatted-events)
					       "no events"
					       (for [event formatted-events]
					         [:div {:class "quick-view-container left-spacing"}
					          [:span {:class "ti"} (read-string (str "\"\\u" (:icon event) "\""))]
					          [:span {:class "content-slot"}
					           [:a {:on-click (fn []
					                            (call-api "append_block_in_page" (:current-page-uuid event)
					                                      (str "{{i eb6d}} note for {{i f621}} [" (:name event)
					                                           "](((" (:uuid event) ")))")))}
					            (:name event)]]])))
					  
					   :inputs [:today :current-page]}
					  ```
				- v2.4.2 change: Use thread-last macro instead of thread-as
					- ```cljs
					  #+BEGIN_QUERY
					  {:query
					   [:find (min ?activity-datestamp) ?date ?activity-datestamp ?today-datestamp ?content ?props ?current-page-name ?activity-uuid ?current-page-uuid (distinct ?icon)
					    :keys first-activity-datestamp date activity-datestamp today-datestamp content properties current-page-name activity-card-uuid current-page-uuid icon
					    :in $ ?today-datestamp ?current-page-name
					    :where
					  
					    [?b :block/properties ?props]
					    [(get ?props :activity) ?activity]
					    [(get ?props :event) ?event]
					    [(get ?props :date) ?date]
					    [(get ?props :scheduling "") ?scheduling]
					    (not [(contains? ?scheduling "CANCELED")])
					  
					    ;; :date
					    [?d :block/original-name ?bn]
					    [(contains? ?date ?bn)]
					    [?d :block/journal-day ?activity-datestamp]
					    [(>= ?activity-datestamp ?today-datestamp)]
					  
					    [?b :block/content ?content]
					    [?b :block/uuid ?activity-uuid]
					  
					    [?p :block/name ?current-page-name]
					    [?p :block/uuid ?current-page-uuid]
					  
					    [?a :block/name ?activity-page]
					    [(contains? ?activity ?activity-page)]
					    (or-join [?a ?icon]
					             (and
					              [?a :block/properties ?activity-props]
					              [(get ?activity-props :-icon) ?icon]
					              [(some? ?icon)]) ;; :-icon exists and is not nil
					             (and
					              [?a :block/properties ?activity-props]
					              [(get ?activity-props :-icon) ?icon]
					              [(nil? ?icon)] ;; :block/properties, but nil icon
					              [(identity "0000") ?icon])
					             (and ;; no block properties
					              [(missing? $ ?a :block/properties)] ;; no :bp
					              [(identity "0000") ?icon]))]
					   
					  
					   :result-transform
					   (letfn [(format-event-string [event-name person-names]
					             (if (seq person-names)
					               (str event-name " with " (clojure.string/join ", " person-names))
					               (str event-name)))
					  
					           (sort-by-activity-datestamp [results]
					             (sort-by (fn [r] (get-in r [:activity-datestamp])) compare results))   
					           
					           (filter-next-events [results]
					             (let [first-activity-datestamp (get-in (first results) [:first-activity-datestamp])]
					               (filter (fn [result]
					                         (= (get-in result [:activity-datestamp]) first-activity-datestamp))
					                       results)))
					           
					           (format-event [result]
					             (let [event-name (get-in result [:properties :event])
					                   person-names (get-in result [:properties :with])
					                   event-uuid (str (get-in result [:activity-card-uuid]))
					                   current-page-uuid (str (get-in result [:current-page-uuid]))
					                   event-icon (first (get-in result [:icon]))]
					               {:name (format-event-string event-name person-names)
					                :uuid event-uuid
					                :current-page-uuid current-page-uuid
					                :icon event-icon}))]
					           
					  
					     (fn [results]
					       (->> results
					         (sort-by-activity-datestamp)
					         (filter-next-events)
					         (map format-event))))
					  
					   :view
					   (fn [formatted-events]
					     (if (empty? formatted-events)
					       "no events"
					       (for [event formatted-events]
					         [:div {:class "quick-view-container left-spacing"}
					          [:span {:class "ti"} (read-string (str "\"\\u" (:icon event) "\""))]
					          [:span {:class "content-slot"}
					           [:a {:on-click (fn []
					                            (call-api "append_block_in_page" (:current-page-uuid event)
					                                      (str "{{i eb6d}} note for {{i f621}} [" (:name event)
					                                           "](((" (:uuid event) ")))")))}
					            (:name event)]]])))
					  
					   :inputs [:today :current-page]}
					  #+END_QUERY
					  ```
				- v2.4.1 fix: Show icon if at least one :activity :-icon exists.
					- ```cljs
					  #+BEGIN_QUERY
					  {:query
					   [:find (min ?activity-datestamp) ?date ?activity-datestamp ?today-datestamp ?content ?props ?current-page-name ?activity-uuid ?current-page-uuid (distinct ?icon)
					    :keys first-activity-datestamp date activity-datestamp today-datestamp content properties current-page-name activity-card-uuid current-page-uuid icon
					    :in $ ?today-datestamp ?current-page-name
					    :where
					    [?b :block/properties ?props]
					    [(get ?props :activity) ?activity]
					    [(get ?props :event) ?event]
					    [(get ?props :date) ?date]
					  
					    [(get ?props :scheduling "") ?scheduling]
					    (not [(contains? ?scheduling "CANCELED")])
					  
					    ;; :date
					    [?d :block/original-name ?bn]
					    [(contains? ?date ?bn)]
					    [?d :block/journal-day ?activity-datestamp]
					    [(>= ?activity-datestamp ?today-datestamp)]
					  
					    [?b :block/content ?content]
					    [?b :block/uuid ?activity-uuid]
					  
					    [?p :block/name ?current-page-name]
					    [?p :block/uuid ?current-page-uuid]
					  
					    [?a :block/name ?activity-page]
					    [(contains? ?activity ?activity-page)]
					    (or-join [?a ?icon]
					             (and
					              [?a :block/properties ?activity-props]
					              [(get ?activity-props :-icon) ?icon]
					              [(some? ?icon)]) ;; :-icon exists and is not nil
					             (and
					              [?a :block/properties ?activity-props]
					              [(get ?activity-props :-icon) ?icon]
					              [(nil? ?icon)] ;; :block/properties, but nil icon
					              [(identity "0000") ?icon])
					             (and ;; no block properties
					              [(missing? $ ?a :block/properties)] ;; no :bp
					              [(identity "0000") ?icon]))]
					   
					  
					   :result-transform
					   (letfn [(format-event-string [event-name person-names]
					             (if (seq person-names)
					               (str event-name " with " (clojure.string/join ", " person-names))
					               (str event-name)))
					  
					           (format-event [result]
					             (let [event-name (get-in result [:properties :event])
					                   person-names (get-in result [:properties :with])
					                   event-uuid (str (get-in result [:activity-card-uuid]))
					                   current-page-uuid (str (get-in result [:current-page-uuid]))
					                   event-icon (first (get-in result [:icon]))]
					               {:name (format-event-string event-name person-names)
					                :uuid event-uuid
					                :current-page-uuid current-page-uuid
					                :icon event-icon}))
					  
					           (filter-next-events [results]
					             (let [first-activity-datestamp (get-in (first results) [:first-activity-datestamp])]
					               (filter (fn [result]
					                         (= (get-in result [:activity-datestamp]) first-activity-datestamp))
					                       results)))
					  
					           (sort-by-activity-datestamp [results]
					             (sort-by (fn [r] (get-in r [:activity-datestamp])) compare results))]
					  
					     (fn [results]
					       (as-> results $
					         (sort-by-activity-datestamp $)
					         (filter-next-events $)
					         (map format-event $))))
					  
					   :view
					   (fn [formatted-events]
					     (if (empty? formatted-events)
					       "no events"
					       (for [event formatted-events]
					         [:div {:class "quick-view-container left-spacing"}
					          [:span {:class "ti"} (read-string (str "\"\\u" (:icon event) "\""))]
					          [:span {:class "content-slot"}
					           [:a {:on-click (fn []
					                            (call-api "append_block_in_page" (:current-page-uuid event)
					                                      (str "{{i eb6d}} note for {{i f621}} [" (:name event)
					                                           "](((" (:uuid event) ")))")))}
					            (:name event)]]])))
					  
					   :inputs [:today :current-page]}
					  #+END_QUERY
					  ```
				- v2.4 refactored :view, moving transforms to :result-transform
					- ```cljs
					  #+BEGIN_QUERY
					  {:query
					   [:find (min ?activity-datestamp) ?date ?activity-datestamp ?today-datestamp ?content ?props ?current-page-name ?activity-uuid ?current-page-uuid (distinct ?icon)
					    :keys first-activity-datestamp date activity-datestamp today-datestamp content properties current-page-name activity-card-uuid current-page-uuid icon
					    :in $ ?today-datestamp ?current-page-name
					    :where
					    [?b :block/properties ?props]
					    [(get ?props :activity) ?activity]
					    [(get ?props :event) ?event]
					    [(get ?props :date) ?date]
					  
					    [(get ?props :scheduling "") ?scheduling]
					    (not [(contains? ?scheduling "CANCELED")])
					  
					    ;; :date
					    [?d :block/original-name ?bn]
					    [(contains? ?date ?bn)]
					    [?d :block/journal-day ?activity-datestamp]
					    [(>= ?activity-datestamp ?today-datestamp)]
					  
					    [?b :block/content ?content]
					    [?b :block/uuid ?activity-uuid]
					  
					    [?p :block/name ?current-page-name]
					    [?p :block/uuid ?current-page-uuid]
					  
					    [?a :block/name ?activity-page]
					    [(contains? ?activity ?activity-page)]
					    (or-join [?a ?icon]
					             (and
					              [?a :block/properties ?activity-props]
					              [(get ?activity-props :-icon "0000") ?icon])
					             (and
					              [(missing? $ ?a :block/properties)]
					              [(identity "0000") ?icon]))]
					   
					  
					   :result-transform
					   (letfn [(format-event-string [event-name person-names]
					             (if (seq person-names)
					               (str event-name " with " (clojure.string/join ", " person-names))
					               (str event-name)))
					  
					           (format-event [result]
					             (let [event-name (get-in result [:properties :event])
					                   person-names (get-in result [:properties :with])
					                   event-uuid (str (get-in result [:activity-card-uuid]))
					                   current-page-uuid (str (get-in result [:current-page-uuid]))
					                   event-icon (first (get-in result [:icon]))]
					               {:name (format-event-string event-name person-names)
					                :uuid event-uuid
					                :current-page-uuid current-page-uuid
					                :icon event-icon}))
					  
					           (filter-next-events [results]
					             (let [first-activity-datestamp (get-in (first results) [:first-activity-datestamp])]
					               (filter (fn [result]
					                         (= (get-in result [:activity-datestamp]) first-activity-datestamp))
					                       results)))
					  
					           (sort-by-activity-datestamp [results]
					             (sort-by (fn [r] (get-in r [:activity-datestamp])) compare results))]
					  
					     (fn [results]
					       (as-> results $
					         (sort-by-activity-datestamp $)
					         (filter-next-events $)
					         (map format-event $))))
					  
					   :view
					   (fn [formatted-events]
					     (if (empty? formatted-events)
					       "no events"
					       (for [event formatted-events]
					         [:div {:class "quick-view-container left-spacing"}
					          [:span {:class "ti"} (read-string (str "\"\\u" (:icon event) "\""))]
					          [:span {:class "content-slot"}
					           [:a {:on-click (fn []
					                            (call-api "append_block_in_page" (:current-page-uuid event)
					                                      (str "{{i eb6d}} note for {{i f621}} [" (:name event)
					                                           "](((" (:uuid event) ")))")))}
					            (:name event)]]])))
					  
					   :inputs [:today :current-page]}
					  #+END_QUERY
					  ```
				- v2.3.1 renamed ?datestamp to ?activity-datestamp for clarity
					- ```cljs
					  #+BEGIN_QUERY
					  {:query
					   [:find (min ?activity-datestamp) ?date ?activity-datestamp ?today-datestamp ?content ?props ?current-page-name ?activity-uuid ?current-page-uuid (distinct ?icon)
					    :keys first-activity-datestamp date activity-datestamp today-datestamp content properties current-page-name activity-card-uuid current-page-uuid icon
					    :in $ ?today-datestamp ?current-page-name
					  
					    :where
					    [?b :block/properties ?props]
					    [(get ?props :activity) ?activity]
					    [(get ?props :event) ?event]
					    [(get ?props :date) ?date]
					  
					    [(get ?props :scheduling "") ?scheduling]
					    (not [(contains? ?scheduling "CANCELED")])
					  
					    ;; :date
					    [?d :block/original-name ?bn]
					    [(contains? ?date ?bn)]
					    [?d :block/journal-day ?activity-datestamp]
					    [(>= ?activity-datestamp ?today-datestamp)]
					  
					    [?b :block/content ?content]
					    [?b :block/uuid ?activity-uuid]
					  
					    [?p :block/name ?current-page-name]
					    [?p :block/uuid ?current-page-uuid]
					  
					    [?a :block/name ?activity-page]
					    [(contains? ?activity ?activity-page)]
					    (or-join [?a ?icon]
					             (and
					              [?a :block/properties ?activity-props]
					              [(get ?activity-props :-icon "0000") ?icon])
					             (and
					              [(missing? $ ?a :block/properties)]
					              [(identity "0000") ?icon]))]
					  
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
					                     (when (= (get-in result [:activity-datestamp]) first-activity-datestamp)
					                       result))
					                   results))
					  
					            formatted-events
					            (map
					             (fn [result]
					               (let [event-name (get-in result [:properties :event])
					                     person-names (get-in result [:properties :with])
					                     event-uuid (str (get-in result [:activity-card-uuid]))
					                     current-page-uuid (str (get-in (first results) [:current-page-uuid]))
					                     event-icon (first (get-in result [:icon]))]
					                 {:name (format-event-string event-name person-names)
					                  :uuid event-uuid
					                  :current-page-uuid current-page-uuid
					                  :icon event-icon}))
					             next-events)]
					  
					  
					  
					  
					        (cond (empty? next-events) "no events"
					              :else (for [event formatted-events]
					                      [:div {:class "quick-view-container left-spacing"}
					                       [:span {:class "ti"} (read-string (str "\"\\u" (:icon event) "\""))]
					                      ;; [:span {:class "ti"} (read-string (str "\"\\u" icon "\""))]
					                       [:span {:class "content-slot"}
					                        [:a {:on-click (fn []
					                                         (call-api "append_block_in_page" (:current-page-uuid event)
					                                                   (str "{{i eb6d}} note for {{i f621}} [" (:name event)
					                                                        "](((" (:uuid event) ")))")))}
					                         (:name event)]]])))))
					  
					  :result-transform (fn [result]
					                      (map (fn [r] (update r :icons (fn [icons] (if icons (set icons) #{})))))
					                      (sort-by (fn [r] (get-in r [:activity-datestamp])) (fn [a b] (compare a b)) result))
					  :inputs [:today :current-page]
					  
					  }
					   
					  #+END_QUERY
					  ```
				- v2.3 excluding `scheduling:: [[CANCELED]]` cards.
					- ```cljs
					  #+BEGIN_QUERY
					  {:query
					   [:find (min ?datestamp) ?date ?datestamp ?today-datestamp ?content ?props ?current-page-name ?activity-uuid ?current-page-uuid (distinct ?icon)
					    :keys first-activity-datestamp date datestamp today-datestamp content properties current-page-name activity-card-uuid current-page-uuid icon
					    :in $ ?today-datestamp ?current-page-name
					  
					    :where
					    [?b :block/properties ?props]
					    [(get ?props :activity) ?activity]
					    [(get ?props :event) ?event]
					    [(get ?props :date) ?date]
					    [(get ?props :scheduling "") ?scheduling]
					    (not [(contains? ?scheduling "CANCELED")])
					  
					    [?b :block/refs ?refs]
					    [?refs :block/journal-day ?datestamp]
					    [(>= ?datestamp ?today-datestamp)]
					  
					    [?b :block/content ?content]
					    [?b :block/uuid ?activity-uuid]
					  
					    [?p :block/name ?current-page-name]
					    [?p :block/uuid ?current-page-uuid]
					  
					    [?a :block/name ?activity-page]
					    [(contains? ?activity ?activity-page)]
					  
					    (or-join [?a ?icon]
					             (and
					              [?a :block/properties ?activity-props]
					              [(get ?activity-props :-icon "0000") ?icon])
					             (and
					              [(missing? $ ?a :block/properties)]
					              [(identity "0000") ?icon]))]
					  
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
					                     current-page-uuid (str (get-in (first results) [:current-page-uuid]))
					                     event-icon (first (get-in result [:icon]))]
					                 {:name (format-event-string event-name person-names)
					                  :uuid event-uuid
					                  :current-page-uuid current-page-uuid
					                  :icon event-icon}))
					             next-events)]
					  
					  
					  
					  
					        (cond (empty? next-events) "no events"
					              :else (for [event formatted-events]
					                      [:div {:class "quick-view-container left-spacing"}
					                       [:span {:class "ti"} (read-string (str "\"\\u" (:icon event) "\""))]
					                      ;; [:span {:class "ti"} (read-string (str "\"\\u" icon "\""))]
					                       [:span {:class "content-slot"}
					                        [:a {:on-click (fn []
					                                         (call-api "append_block_in_page" (:current-page-uuid event)
					                                                   (str "{{i eb6d}} note for {{i f621}} [" (:name event)
					                                                        "](((" (:uuid event) ")))")))}
					                         (:name event)]]])))))
					  
					  :result-transform (fn [result]
					                      (map (fn [r] (update r :icons (fn [icons] (if icons (set icons) #{})))))
					                      (sort-by (fn [r] (get-in r [:datestamp])) (fn [a b] (compare a b)) result))
					  :inputs [:today :current-page]
					  
					  }
					   
					  #+END_QUERY
					  ```
				- v.2.2 formatted event with activity icons
				  ![image.png](../assets/image_1724503316662_0.png){:height 30, :width 245}
					- ```cljs
					  #+BEGIN_QUERY
					  {:query
					   [:find (min ?datestamp) ?date ?datestamp ?today-datestamp ?content ?props ?current-page-name ?activity-uuid ?current-page-uuid (distinct ?icon)
					    :keys first-activity-datestamp date datestamp today-datestamp content properties current-page-name activity-card-uuid current-page-uuid icon
					    :in $ ?today-datestamp ?current-page-name
					  
					    :where
					    [?b :block/properties ?props]
					    [(get ?props :activity) ?activity]
					    [(get ?props :event) ?event]
					    [(get ?props :date) ?date]
					  
					    [?b :block/refs ?refs]
					    [?refs :block/journal-day ?datestamp]
					    [(>= ?datestamp ?today-datestamp)]
					  
					    [?b :block/content ?content]
					    [?b :block/uuid ?activity-uuid]
					  
					    [?p :block/name ?current-page-name]
					    [?p :block/uuid ?current-page-uuid]
					  
					    [?a :block/name ?activity-page]
					    [(contains? ?activity ?activity-page)]
					  
					    (or-join [?a ?icon]
					             (and
					              [?a :block/properties ?activity-props]
					              [(get ?activity-props :-icon "0000") ?icon])
					             (and
					              [(missing? $ ?a :block/properties)]
					              [(identity "0000") ?icon])
					             )
					  
					    ]
					  
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
					                      current-page-uuid (str (get-in (first results) [:current-page-uuid]))
					                      event-icon (first (get-in result [:icon]))]
					                  {:name (format-event-string event-name person-names)
					                   :uuid event-uuid
					                   :current-page-uuid current-page-uuid
					                   :icon event-icon}))
					              next-events)]
					  
					  
					         
					  
					       (cond (empty? next-events) "no events"
					             :else (for [event formatted-events]
					                     [:div {:class "quick-view-container left-spacing"}
					                      [:span {:class "ti"} (read-string (str "\"\\u" (:icon event) "\""))]
					                      ;; [:span {:class "ti"} (read-string (str "\"\\u" icon "\""))]
					                      [:span {:class "content-slot"}
					                       [:a {:on-click (fn []
					                                        (call-api "append_block_in_page" (:current-page-uuid event)
					                                                  (str "{{i eb6d}} note for {{i f621}} [" (:name event)
					                                                       "](((" (:uuid event) ")))")))}
					                        (:name event)]]])))))
					  
					   :result-transform (fn [result]
					                       (map (fn [r] (update r :icons (fn [icons] (if icons (set icons) #{})))))
					                       (sort-by (fn [r] (get-in r [:datestamp])) (fn [a b] (compare a b)) result))
					   :inputs [:today :current-page]}
					   
					  #+END_QUERY
					  ```
				- v2.1 slightly more formatted event.
				  ![image.png](../assets/image_1724361343098_0.png){:height 38, :width 240}
					- ```
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
					  
					            [:div {:class "quick-view-container left-spacing"} 
					             [:span {:class "ti"} "\u0020"]
					             [:span {:class "content-slot"}
					                   (cond (empty? next-events) "no events"
					                         (= (count next-events) 1)  (for [event formatted-events]
					                                                      [:a {:class "link"
					                                                           :on-click (fn [] (call-api "append_block_in_page" (:current-page-uuid event)
					                                                                                      (str "{{i eb6d}} note for {{i f621}} [" (:name event) "](((" (:uuid event) ")))")))} (:name event)])
					                         :else [:ul (for [event formatted-events]
					                                      [:li [:a {:on-click (fn []
					                                                            (call-api "append_block_in_page" (:current-page-uuid event)
					                                                                      (str "{{i eb6d}} note for {{i f621}} [" (:name event)
					                                                                           "](((" (:uuid event) ")))")))}
					                                            (:name event)]])])]])))
					                      
					              
					   :result-transform (fn [result]
					                       (sort-by (fn [r] (get-in r [:datestamp])) (fn [a b] (compare a b)) result))
					   :inputs [:today :current-page]}
					   
					  #+END_QUERY
					  ```
				- v2.0 upcoming event and activities information **with quick-reference links**
				  *date retired*: [[Saturday, Aug 10th, 2024]] 
				  ![image.png](../assets/image_1719765578558_0.png){:height 31, :width 246}
					- {{i eac5}} Developed on [[Sunday, Jun 30th, 2024]] during {{i ea77}} [this iteration session](((66817d91-9f86-4ab3-9c45-face6802e356)))
					  ```javascript
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
					  ```
				- v1.8 **simplified** event information
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
		- {{i ec44}}  **current medication** list
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
			            (filter (fn [medication-map] ;; Filter empty
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
				- {{kitButton export,exportquery}}
			- {{runpage exportquery}}
			- idk what this is, but it's broke:
				- ```
				  #+BEGIN_QUERY
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
				  ```
		- {{i f21c}}  *grocery list* quick-ref (journal widget)
		  id:: 6666f9ad-2b57-4f34-b088-41e5b3e5bd53
		      ![image.png](../assets/image_1719765985169_0.png){:height 30, :width 214}
		- {{i eaff}}  online orders (journal widget)
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
		- {{i ee20}}  ~~future appointments list~~
		  id:: 66415c9e-ff58-4281-8007-160cb44fb8b3
			- ### {{i f6ef}}  depreciation warning
			      this block is no longer in use
				- {{i ea0b}} *depreciated on* *[[Saturday, Aug 24th, 2024]]*
			- [:small "upcoming appointments"]
			  id:: 66415ca6-d397-4fc1-97f1-95f7b516e6d1
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
			              [:table {:class "future-appointments stop-click"}
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
		- {{i eafd}}  ~~logseq graph news~~
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
		- Nutritional facts (vitamins)
		  id:: 666f7716-c32e-40e0-8b10-8f93fc591165
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
		- Nutritional facts (minerals)
		  id:: 666f7726-4350-45b0-b0fd-4cdd2b75497c
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
	- ## Reusable queries
	  {{i f635}} *for manual addition to a block*
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
	          [:div [:span.bti "   \uf019 "]
	           (for [[idx {:keys [text uuid]}] (map-indexed vector items)]
	             (if (= idx (dec (count items)))
	               [:a.tag {:href (str "logseq://graph/main?block-id=" uuid)} text]
	               [:span [:a.tag {:href (str "logseq://graph/main?block-id=" uuid)} text] ", "]))])
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
		     ![image.png](../assets/image_1721831424254_0.png){:height 62, :width 197}
			- ### Boilerplate blocks
				- **1. On the tracking page**
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
		  ![image.png](../assets/image_1713994770190_0.png){:height 59, :width 241}
			- [[Wednesday, Apr 24th, 2024]]: Created an improved and updated **page table of contents**.
			  Improvement: fixes text being rendered in `.ti` font.
			  (see ((662becd7-fa05-45af-b368-bfe0144befc9)) )
			- #### improved table of content
			  id:: 662becd7-fa05-45af-b368-bfe0144befc9
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
	- ## Single-use queries
	  {{i f635}} *And archive*
		- *Queries and historical versions that appear on only one page*
		- ### Shopping list -> In basket
			- **version 1.2** {{code-inside}}
			  id:: 669137d3-3f99-4931-9dff-3c584e43c00d
			  Shows items crossed off today, or nothing.
			  from June 12, 2024
			- **version 1.0** {{code-inside}}
			  id:: 669136b1-ac6e-4a40-abc3-50c3687cf2dd
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
- # {{i eb6d}}  query concepts
  *by use case*
	- ### {{i eead}} query concept inbox
	  id:: 66ae786c-0e7c-4d19-a94a-a1ae04fa3f19
	        {{i f635}} *unsorted saved queries*
		  #+BEGIN_QUERY
		  {:inputs [:parent-block]
		  :query
		  [:find (pull ?b [*])
		  :in $ ?pb
		  :where
		  [?b :block/refs ?pb]
		  ]
		  }
		  #+END_QUERY
		- Question: what does :today return?
			- #+BEGIN_QUERY
			  {:inputs [:today]
			  :query
			  [:find ?today
			  :in $ ?today
			  :where
			  [_ :block/name _]
			  ]
			  }
			  #+END_QUERY
		- Return `:today` or other inputs from `datascript_query()`
			- ```javascript
			  const result = logseq.api.datascript_query(`
			  [:find ?today
			  :in $ ?today
			  :where
			  [_ :block/name _]
			  ]`, `:today`);
			  return result;
			  ```
				- {{evalparent}}
		- Use **(call-api datascript_query)** inside an advanced query to get the current date!!!
			- #+BEGIN_QUERY
			  {:inputs [:today]
			   :query
			   [:find ?today
			    :in $ ?today
			    :where
			    [_ :block/name _]]
			   :view (fn []
			           [:div
			            (call-api "datascript_query"
			                      "[:find ?today :in $ ?today :where [_ :block/name _]]"
			                      ":today")])}
			  #+END_QUERY
		- Dealing with days in :where clauses
			- ```
			  from https://discuss.logseq.com/t/add-query-input-or-function-day-of-week/18361/22?u=deadbranch
			  #+BEGIN_QUERY
			  {
			   :inputs [:today :+7d :+13d]
			   :query [:find (pull ?b [*])
			   :in $ ?today ?next7 ?next13 %
			   :where
			     (or
			       (and [(+ ?today 1) ?weekBegin] (isWeekDay ?weekBegin 1))
			       (and [(+ ?today 2) ?weekBegin] (isWeekDay ?weekBegin 1))
			       (and [(+ ?today 3) ?weekBegin] (isWeekDay ?weekBegin 1))
			       (and [(+ ?today 4) ?weekBegin] (isWeekDay ?weekBegin 1))
			       (and [(+ ?today 5) ?weekBegin] (isWeekDay ?weekBegin 1))
			       (and [(+ ?today 6) ?weekBegin] (isWeekDay ?weekBegin 1))
			       (and [(+ ?today 7) ?weekBegin] (isWeekDay ?weekBegin 1))
			       (and [(- ?next7 6) ?weekBegin] (isWeekDay ?weekBegin 1))
			       (and [(- ?next7 5) ?weekBegin] (isWeekDay ?weekBegin 1))
			       (and [(- ?next7 4) ?weekBegin] (isWeekDay ?weekBegin 1))
			       (and [(- ?next7 3) ?weekBegin] (isWeekDay ?weekBegin 1))
			       (and [(- ?next7 2) ?weekBegin] (isWeekDay ?weekBegin 1))
			       (and [(- ?next7 1) ?weekBegin] (isWeekDay ?weekBegin 1))
			       (and [(- ?next7 0) ?weekBegin] (isWeekDay ?weekBegin 1))
			     )
			  
			     (or
			       (and [(+ ?next7 0) ?weekEnd] (isWeekDay ?weekEnd 0))
			       (and [(+ ?next7 1) ?weekEnd] (isWeekDay ?weekEnd 0))
			       (and [(+ ?next7 2) ?weekEnd] (isWeekDay ?weekEnd 0))
			       (and [(+ ?next7 3) ?weekEnd] (isWeekDay ?weekEnd 0))
			       (and [(+ ?next7 4) ?weekEnd] (isWeekDay ?weekEnd 0))
			       (and [(+ ?next7 5) ?weekEnd] (isWeekDay ?weekEnd 0))
			       (and [(+ ?next7 6) ?weekEnd] (isWeekDay ?weekEnd 0))
			       (and [(- ?next13 6) ?weekEnd] (isWeekDay ?weekEnd 0))
			       (and [(- ?next13 5) ?weekEnd] (isWeekDay ?weekEnd 0))
			       (and [(- ?next13 4) ?weekEnd] (isWeekDay ?weekEnd 0))
			       (and [(- ?next13 3) ?weekEnd] (isWeekDay ?weekEnd 0))
			       (and [(- ?next13 2) ?weekEnd] (isWeekDay ?weekEnd 0))
			       (and [(- ?next13 1) ?weekEnd] (isWeekDay ?weekEnd 0))
			       (and [(- ?next13 0) ?weekEnd] (isWeekDay ?weekEnd 0))
			     )
			  
			     (task ?b #{"TODO"})
			     (or
			       [?b :block/scheduled ?date]
			       [?b :block/deadline ?date]
			     )
			     [(>= ?date ?weekBegin)]
			     [(<= ?date ?weekEnd)]
			   ]
			  
			   :rules [
			     [(isWeekDay ?date ?num)
			       [(mod ?date 100) ?monthday]
			       [(mod ?date 10000) ?mod]
			       [(quot ?mod 100) ?month]
			       [(- ?month 8) ?month8]
			       [(quot ?month8 6) ?month6]
			       [(* ?month6 12) ?month12]
			       [(- ?month ?month12) ?monthnum]
			       [(inc ?monthnum) ?monthinc]
			       [(* 13 ?monthinc) ?month13]
			       [(quot ?month13 5) ?month5]
			       [(quot ?date 10000) ?year]
			       [(+ ?year ?month6) ?year6]
			       [(mod ?year6 100) ?yearnum]
			       [(quot ?yearnum 4) ?year4]
			       [(quot ?year6 100) ?century]
			       [(quot ?century 4) ?century4]
			       [(* 5 ?century) ?century5]
			       [(+ ?monthday ?month5 ?yearnum ?year4 ?century4 ?century5) ?sum]
			       [(mod ?sum 7) ?d]
			       [(= ?d ?num)]
			     ]
			   ]
			  }
			  #+END_QUERY
			  ```
	- ### tools
		- Prevent "no results found"
			- ```cljs
			   :result-transform (fn [result]
			                       (if (empty? result)
			                         [[]]
			                         (sort-by (comp - (fn [r] (get-in r [:block/page :block/journal-day]))) result)))
			  
			   :view (fn [results]
			           (if (= results [[]]) 
			             "no results"
			             result))
			  ```
	- ## :where
	  *clause expressions*
		- Working with pages and prefix/suffix characters
			- Pages with prefix AND not suffix
				- ```clj
				  {:query
				   [:find ?page-name
				    :where
				  
				    [?b :block/name ?page-name]
				    [(subs ?page-name 0 1) ?prefix]
				    [(= ?prefix "~")]
				    (not
				     [(= (subs ?page-name (count ?page-name))
				         ?prefix)])
				  ]
				   }
				  ```
		- :block/journal-day or [:block/properties :created-on]
			- ```clj
			  
			  ```
		- :-icon value or fallback
			- ```clj
			  :where
			   [?a :block/name ?activity-page]
			   [(contains? ?activity ?activity-page)]
			  
			   (or-join [?a ?icon]
			            (and
			             [?a :block/properties ?activity-props]
			             [(get ?activity-props :-icon) ?icon]
			             [(some? ?icon)]) ;; :-icon exists and is not nil
			            
			            (and
			             [?a :block/properties ?activity-props]
			             [(get ?activity-props :-icon :not-found) ?icon-or-not-found]
			             [(= ?icon-or-not-found :not-found)] ;; :block/properties, but nil icon
			             [(identity "0000") ?icon])
			            
			            (and ;; no block properties
			             [(missing? $ ?a :block/properties)] ;; no :bp
			             [(identity "0000") ?icon])
			   )
			  ```
		- references to page **or alias**
			- ```
			  [?t :block/name ?tag]
			  [?t :block/alias ?ta]
			  (or 
			    [?b :block/refs ?t]
			    [?b :block/refs ?ta])
			  ```
		- blocks **without property** *:property-name*
			- Exclude blocks with property value *x*
			- ```clj
			  (not (property ?b :goods-category "food"))
			  ```
		- blocks **with property** *:property-name*
			- ```datalog
			    [?b :block/properties ?prop]
			    [(contains? ?prop :goods-category)]
			  ```
		- blocks **with :property value** *"value"*
			- ```datalog
			  [?b :block/properties ?props]
			  [(get ?props :goods-category) ?category]
			  [(contains? ?category "mushroom")]
			  ```
		- blocks where **marker isn't #{"DONE" "CANCELED"}**
			- ```datalog
			  [?b :block/marker ?m]
			  (not [(contains? #{"DONE" "CANCELED"} ?m)] )
			  ```
		- blocks **with a given \{\{macro}}**
		  id:: 6638f4e8-101f-4d66-8aa5-0782d73d32f7
			- news!!!
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
		- or-join
			- ```cljs
			    [?a :block/name ?activity-page]
			    [(contains? ?activity ?activity-page)]
			    (or-join [?a ?icon]
			             (and
			              [?a :block/properties ?activity-props]
			              [(get ?activity-props :-icon) ?icon]
			              [(some? ?icon)]) ;; :-icon exists and is not nil
			             (and
			              [?a :block/properties ?activity-props]
			              [(get ?activity-props :-icon :not-found) ?icon-or-not-found]
			              [(= ?icon-or-not-found :not-found)] ;; :block/properties, but nil icon
			              [(identity "0000") ?icon])
			             (and ;; no block properties
			              [(missing? $ ?a :block/properties)] ;; no :bp
			              [(identity "0000") ?icon]))]
			  ```
	- ## :result-transform
	  *function*
		- Sort by result [:block/page **:journal-day**]
			- ```datalog
			  :result-transform
			    (fn [result] 
			      (sort-by (comp - (fn [r] (get-in r [:block/page :block/journal-day]))) result)
			      )
			  ```
		- **Sort by date created** (or failing that, date last modified)
			- {{nested-code-block}}
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
	- ## :view
	  *function*
		- **clickable marker** blocks
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
			   
			   :view (fn [result] 
			     [:table
			      [:thead
			       [:tr [:td "task"] [:td "marker"]]]
			      [:tbody
			       (map (fn [m]
			              (let [marker (get m :block/marker)
			                    content
			                    (clojure.string/replace (get m :block/content)
			                                            (re-pattern "(TODO|LATER|DONE|DOING)\\s")
			                                            "")]
			                [:tr
			                 [:td content]
			                 [:td [:a
			                       {:on-click (fn [_]
			                                    (call-api "update_block"
			                                              (str (:block/uuid m))
			                                              (if
			                                               (= marker "TODO")
			                                                (str "DONE" " " content)
			                                                (str "TODO" " " content))))}
			                       marker]]])) result)]]
			   )
			  } 
			  ```
			- > it can be done with latest call-api ability (logseq nightly)
			- source: https://discord.com/channels/725182569297215569/743139225746145311/1047314074930782308
			- via https://discuss.logseq.com/t/show-todo-toggle-in-query-table-view/12720/5
		- construct **in-graph links**
			- `(make-link)`
				- ```clj
				   [:find ?page-name
				    :where
				    [?b :block/name ?page-name]]
				  
				   :view (fn [results]
				     (defn make-link
				             ([text] (make-link text "link"))
				             ([text class-addition]
				              [:a
				               {:class class-addition
				                :on-click (fn []
				                            (call-api
				                             "push_state"
				                             "page"
				                             text))}
				               text]))
				               
				           [:div
				            (for [r results]
				              [:div (make-link r)]
				              )])
				  ```
		- fetch edn data from a block in graph
			- ```clj
			  (defn get-map-from-block
			    "Retrieve a map from the :edn property of a given block.
			     Has a arity-two version where the key is user-defined"
			    ^{:examples [
			                 "(get-map-from-block \"66f2ece1-ff3f-4b73-a393-0841a49c2c0e\") => \"ef10\""
			                 "(get-map-from-block \"66f2ece1-ff3f-4b73-a393-0841a49c2c0e\" :edn) => \"ef10\""]
			      }
			    ([uuid] (get-map-from-block uuid :edn))
			    ([uuid key]
			     (let [result (call-api "get_block" uuid)
			           processed-result
			           (-> result ;; thread-first
			               (js->clj :keywordize-keys
			                        true)
			               (get-in [:properties key])
			               (read-string))
			           return-value processed-result]
			       return-value)) 
			    )
			  ```
		- define a **function**
			- ```cljs
			   :view 
			   (letfn [(today [] (str "do nothing"))]
			           (fn [result]
			             [:div "hi " (today)])
			     )
			  ```
		- style a **compact** ***table***
			- `[:table.compact]`
			- `[:table.compact.more-compact]`
		- construct a **clickable** ***table***
			- `[:table.stop-click]`
		- make a table ***cell*** **link**
			- `[:td.touch-screen [:a ]]`
		- construct an **unordered list**
			- {{nested-code-block}}
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
		  id:: 663a1f42-6ff8-4a1b-a953-cca70c833e52
			- {{nested-code-block}}
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
	- ## :rules
		- show query **results only**
			- ```
			   :breadcrumb-show? false
			   :children? false
			   :group-by-page? false
			  ```
				-
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
	- #### query predicate functions
	  id:: 6666f9ad-ef7d-455e-8319-906283ee8dcc
	  (*for the* `:where` *clause*)
	  {{il ec1c,datascript/built_ins.cljc:L81,https://https://github.com/tonsky/datascript/blob/9e3ad968ec6b25b53963f3f96c8f6cae6713d918/src/datascript/built_ins.cljc#L81}}
		- concatinated list of functions
			- ```clj
			  =
			  ==
			  not=
			  not=
			  less
			  greater
			  less-equal
			  greater-equal
			  +
			  -
			  *
			  /
			  quot
			  rem
			  mod
			  inc
			  dec
			  max
			  min
			  zero?
			  pos?
			  neg?
			  even?
			  odd?
			  compare
			  rand
			  rand-int
			  true?
			  false?
			  nil?
			  some?
			  not
			  and-fn
			  or-fn
			  complement
			  identical?
			  identity
			  keyword
			  meta
			  name
			  namespace
			  type
			  vector
			  list
			  set
			  hash-map
			  array-map
			  count
			  range
			  not-empty
			  empty?
			  contains?
			  str
			  subs
			  get
			  pr-str
			  print-str
			  println-str
			  prn-str
			  re-find
			  re-matches
			  re-seq
			  re-pattern
			  -differ?
			  -get-else
			  -get-some
			  -missing?
			  identity
			  str/blank?
			  str/includes?
			  str/starts-with?
			  str/ends-with?
			  vector
			  identity
			  ```
		- **raw list** of functions
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
			- ((66749df3-627b-4ef6-8e5d-88f843e2ccbc))
				- {{embed ((66749df3-627b-4ef6-8e5d-88f843e2ccbc))}}
	- #### {{i f3f3}} Database utility functions
	  id:: 65c59bb1-08f0-4e2f-bf0f-a7d9e5a4bb79
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
	  `:where` clause helpers
	  *(e.g. `(page-tags ?p ?t)`)*
	  {{il ec1c,logseq/rules.cljc:63,https://github.com/logseq/logseq/blob/53257d0919713f6096087fc188b80224742fe502/deps/db/src/logseq/db/rules.cljc#L63}}
		- For more information see
		- (page-property ?p ?key ?val)
			- [(page-property ?p ?key ?val)
			       [?p :block/name]
			       [?p :block/properties ?prop]
			       [(get ?prop ?key) ?v]
			       (or [(= ?v ?val)] [(contains? ?v ?val)])]
		- (has-page-property ?p ?key)
			- [(has-page-property ?p ?key)
			       [?p :block/name]
			       [?p :block/properties ?prop]
			       [(get ?prop ?key)]]
		- (task ?b ?markers)
			- [(task ?b ?markers)
			     [?b :block/marker ?marker]
			     [(contains? ?markers ?marker)]]
		- (priority ?b ?priorities)
			- [(priority ?b ?priorities)
			     [?b :block/priority ?priority]
			     [(contains? ?priorities ?priority)]]
		- (page-tags ?p ?tags)
			- [(page-tags ?p ?tags)
			     [?p :block/tags ?t]
			     [?t :block/name ?tag]
			     [(contains? ?tags ?tag)]]
		- (all-page-tags ?p)
			- [(all-page-tags ?p)
			     [_ :block/tags ?p]]
		- (between ?b ?start ?end)
			- [(between ?b ?start ?end)
			     [?b :block/page ?p]
			     [?p :block/journal? true]
			     [?p :block/journal-day ?d]
			     [(>= ?d ?start)]
			     [(<= ?d ?end)]]
		- (has-property ?b ?prop)
			- [(has-property ?b ?prop)
			     [?b :block/properties ?bp]
			     [(missing? $ ?b :block/name)]
			     [(get ?bp ?prop)]]
		- (block-content ?b ?query)
			- [(block-content ?b ?query)
			     [?b :block/content ?content]
			     [(clojure.string/includes? ?content ?query)]]
		- (page ?b ?page-name)
			- [(page ?b ?page-name)
			     [?b :block/page ?bp]
			     [?bp :block/name ?page-name]]
		- (namespace ?p ?namespace)
			- [(namespace ?p ?namespace)
			     [?p :block/namespace ?parent]
			     [?parent :block/name ?namespace]]
		- (property ?b ?key ?val)
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
			- [(page-ref ?b ?page-name)
			     [?b :block/path-refs ?br]
			     [?br :block/name ?page-name]]})
		- *page-tags*
		  `(page-tags ?page #{"tagname"}`
		- block property
		  `(property ?p :type "Player")`
		- get-children
		  `(get-children ?parent ?child)`
	- #### clojure functions
	  available in `:result-transform` and `:view`
		- ((66749df3-8843-473e-bfe7-d32bfce93215))
			- {{embed ((66749df3-8843-473e-bfe7-d32bfce93215))}}
- ## {{i eb6e}} My functions
  for `:result-transform` and `:view` clauses
	- ### {{i f38e}} `:result-transform` functions
		- #### Sort by journal day
		  id:: 663a1fa7-6f8c-4790-b8d5-8d7c0ffff815
		  `:sort-by-journal-day`
			- Implements ((663a1f42-6ff8-4a1b-a953-cca70c833e52))
	- ### {{i f4cb}} `:view` functions
- ## {{i eb6c}} Query prompts
  *For conversations with Co-pilot*
	- ### Query predicate functions
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
	  {{i-github}} [datascript/parser.clj:L548](https://github.com/tonsky/datascript/blob/61edb9e76d92fad2106f9c01bc80e659a4292ea8/src/datascript/parser.cljc#L548)   {{button copy,copy_second_sibling,ea6f,long squat}}
		- {{nested-code-block}}
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
	  {{i-github}} [datascript/parser.clj:L557](https://github.com/tonsky/datascript/blob/61edb9e76d92fad2106f9c01bc80e659a4292ea8/src/datascript/parser.cljc#L557)  {{button copy,copy_second_sibling,ea6f,long squat}}
		- {{nested-code-block}}
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
	  {{i-github}} [datascript/parser.clj:L568](https://github.com/tonsky/datascript/blob/61edb9e76d92fad2106f9c01bc80e659a4292ea8/src/datascript/parser.cljc#L568)  {{button copy,copy_second_sibling,ea6f,long squat}}
		- {{nested-code-block}}
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
	  {{i-github}} [datascript/parser.clj:L43](https://github.com/tonsky/datascript/blob/61edb9e76d92fad2106f9c01bc80e659a4292ea8/src/datascript/parser.cljc#L43)   {{button copy,copy_second_sibling,ea6f,long squat}}
		- {{nested-code-block}}
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
- {{i ef27}} #[[:logseq-journal-buddy-improvement-2024.6]]
