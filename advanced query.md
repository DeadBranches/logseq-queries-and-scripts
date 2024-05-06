description:: Saved or otherwise in-progress Logseq advanced queries. Also currently query reference and library (needs ???)
tags:: collector, page
collection:: [[logseq queries]]

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
- ## {{i eb6e}} query language reference
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
	- #### Database utility functions
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
		- [(page-property ?p ?key ?val)]
		  template:: query dsl page-property
			- [(page-property ?p ?key ?val)
			       [?p :block/name]
			       [?p :block/properties ?prop]
			       [(get ?prop ?key) ?v]
			       (or [(= ?v ?val)] [(contains? ?v ?val)])]
		- [(has-page-property ?p ?key)]
		  template:: query dsl has-page-property
			- [(has-page-property ?p ?key)
			       [?p :block/name]
			       [?p :block/properties ?prop]
			       [(get ?prop ?key)]]
		- [(task ?b ?markers)]
		  template:: query dsl task
			- [(task ?b ?markers)
			     [?b :block/marker ?marker]
			     [(contains? ?markers ?marker)]]
		- [(priority ?b ?priorities)]
		  template:: query dsl priority
			- [(priority ?b ?priorities)
			     [?b :block/priority ?priority]
			     [(contains? ?priorities ?priority)]]
		- [(page-tags ?p ?tags)]
		  template:: query dsl page-tags
			- [(page-tags ?p ?tags)
			     [?p :block/tags ?t]
			     [?t :block/name ?tag]
			     [(contains? ?tags ?tag)]]
		- [(all-page-tags ?p)]
		  template:: query dsl all-page-tags
			- [(all-page-tags ?p)
			     [_ :block/tags ?p]]
		- [(between ?b ?start ?end)]
		  template:: query dsl between
			- [(between ?b ?start ?end)
			     [?b :block/page ?p]
			     [?p :block/journal? true]
			     [?p :block/journal-day ?d]
			     [(>= ?d ?start)]
			     [(<= ?d ?end)]]
		- [(has-property ?b ?prop)]
		  template:: query dsl has-property
			- [(has-property ?b ?prop)
			     [?b :block/properties ?bp]
			     [(missing? $ ?b :block/name)]
			     [(get ?bp ?prop)]]
		- [(block-content ?b ?query)]
		  template:: query dsl block-content
			- [(block-content ?b ?query)
			     [?b :block/content ?content]
			     [(clojure.string/includes? ?content ?query)]]
		- [(page ?b ?page-name)]
		  template:: query dsl page
			- [(page ?b ?page-name)
			     [?b :block/page ?bp]
			     [?bp :block/name ?page-name]]
		- [(namespace ?p ?namespace)]
		  template:: query dsl namespace
			- [(namespace ?p ?namespace)
			     [?p :block/namespace ?parent]
			     [?parent :block/name ?namespace]]
		- [(property ?b ?key ?val)]
		  template:: query dsl property
			- [(property ?b ?key ?val)
			     [?b :block/properties ?prop]
			     [(missing? $ ?b :block/name)]
			     [(get ?prop ?key) ?v]
			     [(str ?val) ?str-val]
			     (or [(= ?v ?val)]
			         [(contains? ?v ?val)]
			         ;; For integer pages that aren't strings
			         [(contains? ?v ?str-val)])]
		- [(page-ref ?b ?page-name)]
		  template:: query dsl page-ref
			- [(page-ref ?b ?page-name)
			     [?b :block/path-refs ?br]
			     [?br :block/name ?page-name]]})
		- *page-tags*
		  `(page-tags ?page #{"tagname"}`
		- block property
		  `(property ?p :type "Player")`
		- get-children
		  `(get-children ?parent ?child)`
	- #### Query predicate functions
	  collapsed:: true
	  *(e.g. `not=`)*
	  {{il ec1c,datascript/built_ins.cljc:L81,https://https://github.com/tonsky/datascript/blob/9e3ad968ec6b25b53963f3f96c8f6cae6713d918/src/datascript/built_ins.cljc#L81}}
		- ```clj
		  (def query-fns {
		    '= =, '== ==,
		    'not= not=,
		    '!= not=,
		    '< less, '> greater,
		    '<= less-equal,
		    '>= greater-equal,
		    '+ +, '- -, 
		    '* *, '/ /,
		    'quot quot, 'rem rem,
		    'mod mod, 'inc inc,
		    'dec dec, 'max max, 
		    'min min, 'zero? zero?,
		    'pos? pos?, 'neg? neg?,
		    'even? even?, 'odd? odd?,
		    'compare compare,
		    'rand rand, 
		    'rand-int rand-int,
		    'true? true?, 
		    'false? false?, 
		    'nil? nil?, 'some? some?,
		    'not not, 'and and-fn,
		    'or or-fn,
		    'complement complement,
		    'identical? identical?,
		    'identity identity,
		    'keyword keyword, 
		    'meta meta, 'name name, 
		    'namespace namespace,
		    'type type,
		    'vector vector,
		    'list list, 'set set,
		    'hash-map hash-map,
		    'array-map array-map,
		    'count count,
		    'range range, 
		    'not-empty not-empty,
		    'empty? empty?, 
		    'contains? contains?,
		    'str str, 'subs, subs,
		    'get get, 'pr-str pr-str,
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
		    'tuple vector, 'untuple identity
		  })
		  ```
- ## {{i efd3}} query concept snippets
	- **show first line** of each result
	  collapsed:: true
	    `:result-transform` `:view`
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
	- Results as an **unordered list**
	  collapsed:: true
	    `:result-transform` `:view`
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
	- **Sort by date created** (or failing that, date last modified)
	  collapsed:: true
	    `:result-transform`
		- {{il eb6c,Bing: sort by date created,https://sl.bing.net/4TV8A6wblI}}
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
	- **Click to complete** TODO blocks via *call-api*
	  collapsed:: true
	    `:result-transform` `:view`
		- > it can be done with latest call-api ability (logseq nightly)
		- source: https://discord.com/channels/725182569297215569/743139225746145311/1047314074930782308
		- via https://discuss.logseq.com/t/show-todo-toggle-in-query-table-view/12720/5
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
	- Clickable **links** using `call-api` and `push_state()`
	  collapsed:: true
	    `:result-transform` `:view`
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
- ## {{i eff2}} Query library
  id:: 65fb267e-f677-4130-a1b8-501b291c805b
  query:: ((65f7767a-9fe3-4b51-a564-c36be58ce5fa))
  collapsed:: true
  *Advanced queries I reuse*
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
    :inputs [:current-block #{1 2 3 4 5}]
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
	-
	- #### Section contents
	  id:: 65f7767a-9fe3-4b51-a564-c36be58ce5fa
	  collapsed:: true
	  Linked list of children w/ headers (dynamically specified)
		- ```datalog
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
		    :inputs [:current-block #{1 2 3}]
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
	  ![image.png](../assets/image_1713994770190_0.png)
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
	- Individual **medication dose**
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
	- Current **medication list** and dose
	  collapsed:: true
	  {{I ea06}} #IN-PROGRESS
		- Test
			- TODO hi
			- {{button button,button}}
				- button:
				  ```js
				  const medications = logseq.api.datascript_query(` [:find ?mname ?date ?day ?dose
				   :keys mname date day dose
				   :where
				   [?m :block/properties ?props]
				   [(get ?props :medication) ?mname]
				   [(get ?props :dose) ?dose]
				    ;;[(contains? ?mname ?medication)]
				    ;; ^- :medication contains name of current page
				   [?m :block/page ?p]
				   [?p :block/original-name ?day]
				   [?p :block/journal-day ?date]
				  ]`)?.flat();
				  
				  const medicationDoses = medications.reduce((acc, { mname, dose }) => {
				    acc[mname[0]] = dose;
				    return acc;
				  }, {});
				        //.flat()[0];
				  //.at(0);
				  copy_to_clipboard(JSON.stringify(medicationDoses,null,2));
				  ```
			- ```edn
			  {:query
			   [:find ?mname ?date ?day ?dose 
			    :keys mname date day dose
			    :in $ ?medication
			    :where
			    [?m :block/properties ?props]
			    [(get ?props :medication) ?mname]
			    [(get ?props :dose) ?dose]
			    ;;[(contains? ?mname ?medication)]
			    ;; ^- :medication contains name of current page
			    [?m :block/page ?p]
			    [?p :block/original-name ?day]
			    [?p :block/journal-day ?date]
			    ]
			   :inputs ["propranolol"]
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
			                              [:th "Date"]
			                              ]] [:tbody (for [r rows] [:tr
			                                                        [:td (get-in r [:mname])]
			                                                        [:td (get-in r [:dose])]
			                                                        [:td (get-in r [:day])]
			                                                        ]
			                                              )
			                                  
			                                  ]])
			  
			   }
			  ```
			- #+BEGIN_QUERY
			  {:query
			   [:find ?mname ?date ?day ?dose 
			    :keys mname date day dose
			    :in $ ?medication
			    :where
			    [?m :block/properties ?props]
			    [(get ?props :medication) ?mname]
			    [(get ?props :dose) ?dose]
			    ;;[(contains? ?mname ?medication)]
			    ;; ^- :medication contains name of current page
			    [?m :block/page ?p]
			    [?p :block/original-name ?day]
			    [?p :block/journal-day ?date]
			    ]
			   :inputs ["propranolol"]
			   :result-transform (fn [result]
			                       (sort-by (fn [h] (get h :date)) 
			                                (fn [a b] (compare b a)) 
			                                result))
			    :view (fn [rows] [:table
			                     [:thead [:tr
			                              [:th "Medication name"]
			                              [:th "Dose"]
			                              [:th "Date"]
			                              ]] [:tbody (for [r rows] [:tr
			                                                        [:td (get-in r [:mname])]
			                                                        [:td (get-in r [:dose])]
			                                                        [:td (get-in r [:day])]
			                                                        ]
			                                              )
			                                  
			                                  ]])
			  
			   }
			  
			  #+END_QUERY
			- #+BEGIN_QUERY
			  {:query
			   [:find ?date ?day ?dose
			    :keys date day dose
			    :in $ ?medication
			    :where
			    [?m :block/properties ?props]
			    [(get ?props :medication) ?mname]
			    [(get ?props :dose) ?dose]
			    ;[(contains? ?mname ?medication)]
			    ;; ^- :medication contains name of current page
			    [?m :block/page ?p]
			    [?p :block/original-name ?day]
			    [?p :block/journal-day ?date]]
			  
			   :inputs [:query-page]
			   :result-transform (fn [result]
			                       (sort-by (fn [h] (get h :date))
			                                (fn [a b] (compare b a))
			                                result))
			  
			   :view (fn [rows] [:div 
			                     (for [r rows] 
			                       (get-in r [:mname])
			                       (str ": current dose is ") 
			                       [:i (get-in r :dose)])
			                     ;[:i (get-in r (first rows) :dose)])
			                                         ;
			           ])
			   }
			   
			   
			  
			  #+END_QUERY
			- /prompt
			- Think about this issue at length. Try to make some mistakes that beginners would make, and then offer corrections from the perspective of an expert. Reserve your final contributions until the end of the conversation, and throughout your reply use a process where you propose an idea, test the idea in writing, and then come to some conclusions. For example:
			  > My goal is to write a javascript hello world. So, I think one possible best way to do this is with a print statement. A print statement would look like `print("Hello world');`. However, now that I think about it, print() is not syntactically correct javascript. So, perhaps using console.log() would work better. Such an approach could look like: `console.log('hello world');`. Now that I've reviewed the two previous methods for writing a hello world statement my conclusion is that the second option (`console.log('hello world');`) is the best approach. So, I will now write a more in-depth hello-world statement using the aformentioned best approach ...
		- ```datalog
		  #+BEGIN_QUERY
		  
		  {:query 
		   [:find ?date ?day ?dose ?mname
		    :keys date day dose mname 
		    :where
		    [?m :block/properties ?props]
		    [(get ?props :medication) str ?mname]
		    [(get ?props :dose) ?dose]
		    ;; ^- :medication contains name of current page
		    [?m :block/page ?p]
		    [?p :block/original-name ?day]
		    [?p :block/journal-day ?date]
		    ] 
		   :result-transform (fn [result] (sort-by (fn [r] (get-in r [:mname]))
		                                                result))
		  :view :pprint
		  }
		  #+END_QUERY
		  ```
		- ```
		  #+BEGIN_QUERY
		  {:query 
		   [:find ?date ?day ?dose ?mname
		    :keys date day dose mname 
		    :where
		    [?m :block/properties ?props]
		    [(get ?props :medication) ?mname]
		    [(get ?props :dose) ?dose]
		    ;; ^- :medication contains name of current page
		    [?m :block/page ?p]
		    [?p :block/original-name ?day]
		    [?p :block/journal-day ?date]
		    ] 
		   :result-transform (fn [result]
		                       (sort-by 
		                       (juxt
		                        (fn [h] (get h :mname))
		                        ;(fn [h] (get h :date))
		                        )
		                        result)
		                       )
		  }
		  #+END_QUERY
		  ```
		- ```
		  #+BEGIN_QUERY
		  {:query
		   [:find ?date ?day ?dose ?mname
		    :keys date day dose mname
		    
		    :where
		    [?m :block/properties ?props]
		    [(get ?props :medication) ?mname]
		    [(get ?props :dose) ?dose]
		   
		    ;; ^- :medication contains name of current page
		    [?m :block/page ?p]
		    [?p :block/original-name ?day]
		    [?p :block/journal-day ?date]
		    ]
		   
		  :result-transform (fn [result]
		                       (sort-by (fn [h] 
		                                  (get h :date)) 
		                                 
		                                result))
		  
		  
		  }
		  #+END_QUERY
		  ```
		  #[[advanced query]]
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
- ## {{i eb6c}} Query prompts
  collapsed:: true
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
- ### {{I eade}} resources
  collapsed:: true
	- https://charleschiugit.github.io/page/logseq/queries/
	- https://www.reddit.com/r/logseq/comments/15yib2v/advanced_query_bootstrap_please_check_and_comment/