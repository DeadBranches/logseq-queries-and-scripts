tags:: page
future-events-activity-chips:: ["anticipated", "appointment"]

- ### previous grocery purchase icon data.
	- {{i-info}} The {{i f287}} [*Previous grocery purchases*](((670573d6-fb31-4f86-ab91-e536af8c6760))) tool checks this map for tabler-icon hex codes associated with a given grocery item.
	- id:: 66f30d33-c7ed-409c-8b9e-175cf9ded264
	  edn:: {:apples "ef21" :cream "ef13" :frozen-berries "f511" :yogurt "f4c8" :cat-food "f287" :naan "efa3" :patties "feb5" :eggs "f500" :water "ef0b" :sour-cream "ee9f" :milk "ef13" :cheese "ef26" :cheese-powder "ee92" :cat-litter "f65b" :salad "f50a" :tomato-sauce "edbb" :automatic-toilet-bowl-cleaner-pucks "efd3" :fries "fae9" :detergent "f30e" :wax-paper "eb2f" :perogies "feb5" :potatoes "eb8a" :sapporo-ramen-noodle "fd90" :frozen-veg "f21c" :butter "fab5" :berries "f511" :sodium-bicarbonate "ef16" :peanut-oil "ef60" :dried-meat "ef17" :smokies "ef17" :brioche "efa3" :brioche-hotdog-buns "f3a5" :sodium-bicarbonate-laundry-booster "f311" :garbage-bags "f02f" :downy-rinse-and-refresh-laundry-stripper "f311" :borax-laundry-booster "f311" :little-tissues "f4c9" :harvest-crunch "fd91" :mushrooms "ef14" :pancakes "fc14" :oats "ee93" :cat-litter-bags "f506" :fruit-cocktail "ef10" :grapes "f511" :frozen-chicken "ef52" :granola-bars "ee93" :crackers "fae3" }
	- data-for:: previous grocery purchases tool
	  data-type:: icons
	  apples:: ef21
	  automatic-toilet-bowl-cleaner-pucks:: efd3
	  bananas:: f511
	  baked-beans:: f02f
	  bagal-bites:: efb1
	  butter:: fab5
	  berries:: f511
	  beef-jerky:: fcb4
	  brioche-hotdog-buns:: f3a5
	  borax-laundry-booster:: f311
	  brioche:: efa3
	  cat-food:: f287
	  cat-litter:: f65b
	  cat-litter-bags:: f506
	  crackers-and-cheese:: f35c
	  croissant-buns:: fcb4
	  cream:: ef13
	  crackers:: fae3
	  cheese:: ef26
	  cheese-powder:: ee92
	  cheeze-nips:: f59a
	  detergent:: f30e
	  dried-meat:: ef17
	  downy-rinse-and-refresh-laundry-stripper:: f311
	  eggs:: f500
	  eggnog:: ef13
	  fruit-cocktail:: ef10
	  frozen-chicken:: ef52
	  frozen-berries:: f511
	  fries:: fae9
	  frozen-veg:: f21c
	  garbage-bags:: f02f
	  grapes:: f511
	  granola-bars:: ee93
	  hash-browns:: ed36
	  harvest-crunch:: fd91
	  instant-coffee:: eafb
	  little-tissues:: f4c9
	  mushrooms:: ef14
	  milk:: ef13
	  mint-chocolate:: efcc
	  naan:: efa3
	  oats:: ee93
	  onion:: fcb4
	  patties:: feb5
	  pancakes:: fc14
	  pea-soup-with-ham:: ef2e
	  peanut-oil:: ef60
	  perogies:: feb5
	  potatoes:: eb8a
	  red-pepper:: ef15
	  tomato-sauce:: edbb
	  salad:: f50a
	  sapporo-ramen-noodle:: fd90
	  sodium-bicarbonate-laundry-booster:: f311
	  sodium-bicarbonate:: ef16
	  sour-cream:: ee9f
	  smokies:: ef17
	  twinkies:: f00f
	  triscuits:: fae3
	  toilet-paper:: efd3
	  wax-paper:: eb2f
	  water:: ef0b
	  yogurt:: f4c8
- ```javascript
  const queryResults = logseq.api.datascript_query(`
  [:find (pull ?b [*])
  :where
  [?b :block/properties ?props]
  [(get ?props :data-for) ?data-for]
  ]`);
  return JSON.stringify(queryResults);
  ```
	- {{evalparent}}
- ```clj :results
  (defn get-properties-from-block-for [data-for]
    (let [query-string (str "[:find (pull ?b [:block/properties])"
                            ":where "
                            "[?b :block/properties ?props]"
                            "[(get ?props :data-for) ?data-for]"
                            "[(= ?data-for \"" data-for "\")]"
                            "]")
          query-result (call-api "datascript_query" query-string)
          processed-result (-> query-result
                               (js->clj :keywordize-keys true)
                               (flatten)
                               (first)
                               :properties
                               ;;(read-string)
                              )]
      processed-result))
  
  ;; (flatten (get-properties-from-block "ok"))
  ;; => ({:properties {:detergent "f30e", :milk "ef13", :apples "ef21", :garbage-bags "f02f", :tomato-sauce "edbb", :granola-bars "ee93"}})
  
  (get (get-properties-from-block-for "previous grocery purchases tool") (keyword "perogies"))
  ;; => [[{:properties {:detergent "f30e", :milk "ef13", :apples "ef21", :garbage-bags "f02f", :tomato-sauce "edbb", :granola-bars "ee93"}}]]
  ```
