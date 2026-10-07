export const services = [
  {
    slug: "air-cargo",
    name: "Air cargo",
    summary: "For goods with a shorter delivery window.",
    description:
      "Discuss air cargo when timing matters. We review the route, dimensions, weight and contents before confirming acceptance and the available movement.",
    suitable:
      "Time-sensitive business supplies, samples and smaller consignments that meet airline acceptance requirements.",
    planning:
      "Share your required delivery date before booking. Flight capacity, cargo acceptance, weather and onward movement affect the final schedule.",
    preparation:
      "Pack securely, provide accurate weights and dimensions, and declare the contents. Ask the team before sending batteries, liquids, fragile items or other goods with special handling requirements.",
  },
  {
    slug: "surface-cargo",
    name: "Surface cargo",
    summary: "For larger loads and more flexible timelines.",
    description:
      "Plan road movement around the size of your consignment and the destination. Surface cargo can suit heavier or bulkier goods when the delivery window allows for a longer journey.",
    suitable:
      "Business stock, packaged household goods and larger consignments, subject to route and goods acceptance.",
    planning:
      "Tell us about loading access, the number of packages and any delivery constraints. Road conditions, consolidation and destination access can affect the schedule.",
    preparation:
      "Use packaging that protects against movement and stacking. Mark each package clearly, secure loose parts and tell the team about goods that cannot be stacked.",
  },
] as const

export const bookingSteps = [
  {
    title: "Tell us what is moving",
    text: "Share the collection and delivery locations, contents, package count, weight, dimensions and your preferred delivery window.",
  },
  {
    title: "Confirm the details",
    text: "Our team reviews service availability, acceptance, charges and handling needs with you. A request for a quote is not a confirmed booking.",
  },
  {
    title: "Prepare and hand over",
    text: "Pack and label the goods, keep the required documents ready and follow the agreed handover arrangements. Keep your booking receipt and AWB number.",
  },
  {
    title: "Follow the journey",
    text: "Use your AWB to check recorded shipment events. Contact the team with that number if an update needs explaining or delivery details change.",
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
