export const services = [
  {
    slug: "air-cargo",
    name: "Air cargo",
    summary: "High-priority commercial cargo with 24–48 hour gateway delivery.",
    description:
      "Scheduled belly-hold air freight connecting Delhi Central Consolidation directly to Northeast India regional airport stations.",
    suitable:
      "Time-sensitive commercial cargo, electronics, medical inventory, and urgent consignments requiring verified belly-hold allocation.",
    planning:
      "Corridor capacity, pre-flight terminal cutoffs, airline security screening, and regional airport weather determine daily manifest allocations.",
    preparation:
      "Enclose in rigid multi-wall corrugated packaging. Affix dual waterproof AWB barcodes and enclose mandatory GST Tax Invoices before dispatch.",
  },
  {
    slug: "surface-cargo",
    name: "Surface cargo",
    summary: "High-capacity linehaul road transit for volume freight and bulk inventory.",
    description:
      "Dedicated arterial highway linehaul optimized for consolidated pallets, heavy industrial goods, and cost-controlled commercial supply chains.",
    suitable:
      "Palletized manufacturing components, industrial equipment, retail inventory, and full-truckload (FTL) bulk consignments.",
    planning:
      "Highway corridor routing, vehicle gross axle weights, multi-state commercial checkpoints, and destination dock access govern the transit timetable.",
    preparation:
      "Utilize reinforced pallets, heavy-duty banding, and weather-sealed wrap. Mark center-of-gravity and stackability guidelines on all crates.",
  },
] as const

export const bookingSteps = [
  {
    title: "Consignment Parameter Intake",
    lead: "Origin, corridor & parcel specs.",
    text: "Declare collection and destination pincodes, package count, gross weight, L × W × H external dimensions, and required delivery window.",
  },
  {
    title: "Capacity & Spot Rate Review",
    lead: "Statutory pricing confirmation.",
    text: "Our operations desk confirms flight belly-hold or multi-axle slot availability, itemized 18% GST estimate, and mandatory DG compliance.",
  },
  {
    title: "Packaging & Custodial Intake",
    lead: "Rigid packaging and statutory AWB.",
    text: "Apply dual AWB barcoded shipping labels, prepare statutory GST E-Way documents, and execute physical scale verification at the intake terminal.",
  },
  {
    title: "Optical Milestone Traceability",
    lead: "Physical barcode scan checkpoints.",
    text: "Trace physical barcode scans at linehaul checkpoints and flight manifests, backed by single-custody delivery reconciliation.",
  },
]

export const preparation = [
  {
    title: "Accurate shipment details",
    text: "<p>List the exact contents, piece count, <strong>gross weight</strong>, and external <strong>length × width × height</strong> dimensions.</p><p class='mt-1 text-xs text-muted-foreground'>Differences discovered at cargo handover can alter airline acceptance or chargeable pricing.</p>",
  },
  {
    title: "Packaging and labels",
    text: "<p>Use rigid corrugated boxes, cushion fragile contents with high-density wrap, and seal all seams with heavy-duty tape.</p><p class='mt-1 text-xs text-muted-foreground'>Affix dual waterproof consignor and consignee address labels on opposite sides.</p>",
  },
  {
    title: "Documents and declarations",
    text: "<p>Keep statutory documents ready prior to dispatch:</p><ul class='mt-1 list-disc pl-4 text-xs space-y-0.5'><li>GST Tax Invoice / E-Way Bill (consignment &gt; ₹50,000)</li><li>Consignor photo ID declaration for regional flights</li></ul>",
  },
  {
    title: "Special handling",
    text: "<p>Strictly declare restricted cargo prior to dispatch confirmation:</p><ul class='mt-1 list-disc pl-4 text-xs space-y-0.5'><li>Lithium batteries (UN 3480/3481) &amp; electronic devices</li><li>Flammables, aerosols, pressurized liquids &amp; perishables</li></ul>",
  },
]

export const shippingFaqs = [
  {
    question: "Do I need an account to send or track a shipment?",
    answer:
      "<p><strong>No account required.</strong> Customers can directly contact TAC-XPRESS and trace consignments using their 10-digit Air Waybill reference on the <a href='/track' class='text-primary underline underline-offset-4'>public tracking console</a>.</p>",
  },
  {
    question: "Which service should I choose?",
    answer:
      "<p>Choose based on your operational urgency and physical freight profile:</p><ul class='mt-1.5 list-disc pl-4 space-y-1'><li><strong>Express Air:</strong> 24–48 hour transit window for high-priority parts, medical supplies, and sensitive documents.</li><li><strong>Surface Cargo:</strong> Cost-optimized road freight for bulk cartons, palletized industrial goods, and scheduled restocking.</li></ul>",
  },
  {
    question: "How do I request a price?",
    answer:
      "<p>Submit an inquiry with your <strong>corridor</strong> (e.g., Delhi Central to Imphal RDS), package dimensions, weight, and nature of goods. Our dispatch team computes dimensional volumetric weight and returns an itemized GST estimate.</p>",
  },
  {
    question: "What is an AWB number?",
    answer:
      "<p>Your <strong>Air Waybill (AWB)</strong> is the statutory document and unique cargo barcode issued upon booking confirmation. It binds carrier liability under the <em>Carriage by Air Act</em> and tracks every milestone from hub scan to proof of delivery.</p>",
  },
  {
    question: "Does tracking show the vehicle’s live location?",
    answer:
      "<p>Public tracking reports verified <strong>optical physical barcode milestone events</strong> across linehaul gateway hubs, flight manifest departures, and regional delivery stations. Continuous GPS telemetry is reserved for internal fleet dispatch controllers.</p>",
  },
  {
    question: "Can I send fragile goods, batteries or liquids?",
    answer:
      "<p>Yes, provided mandatory statutory packing declarations are filed before dispatch. <strong>Lithium batteries</strong> require Section II IATA compliance certificates; fragile glassware requires wooden crating and shock-absorption verification.</p>",
  },
  {
    question: "Is the delivery date guaranteed?",
    answer:
      "<p>We operate within calibrated <strong>SLA transit target windows</strong>. Severe weather disruptions, airline belly-hold capacity changes, or hill road transit advisories are flagged on tracking milestone records with status updates.</p>",
  },
  {
    question: "What should I do if a shipment is delayed or damaged?",
    answer:
      "<p>Initiate an immediate inquiry through our <a href='/contact' class='text-primary underline underline-offset-4'>Support Desk</a> citing your AWB number. For visible transit damage, preserve all intact packaging, document clear photographs, and share them with the operations team during claim review under our transit insurance protocol.</p>",
  },
]
