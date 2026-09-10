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
    text: "List what is inside, the number of packages, the weight and the external dimensions. Differences at handover can change acceptance or charges.",
  },
  {
    title: "Packaging and labels",
    text: "Use a strong outer package, cushion fragile contents and seal openings securely. Put clear sender and recipient details on each package.",
  },
  {
    title: "Documents and declarations",
    text: "Keep the invoice and any applicable transport documents ready. Ask the team which documents your particular goods and route require.",
  },
  {
    title: "Special handling",
    text: "Declare liquids, batteries, perishables, fragile goods and anything needing temperature control before booking. Acceptance must be confirmed by the team.",
  },
]

export const shippingFaqs = [
  {
    question: "Do I need an account to send or track a shipment?",
    answer:
      "No. Customers can contact TAC-XPRESS and track a shipment with an AWB number without signing in. The operations workspace is reserved for provisioned admins and staff.",
  },
  {
    question: "Which service should I choose?",
    answer:
      "Start with your delivery window, the goods and the size of the consignment. Air cargo may suit a shorter delivery window; surface cargo may suit larger loads with more flexible timing. Our team confirms availability and acceptance for your route.",
  },
  {
    question: "How do I request a price?",
    answer:
      "Use the contact form with the origin, destination, contents, number of packages, weight and dimensions. Mention any collection or delivery constraints. The team needs these details to review the service and charges.",
  },
  {
    question: "What is an AWB number?",
    answer:
      "Your Air Waybill or shipment reference identifies your consignment. It is provided with your shipment documentation. Enter the reference on the tracking page; you do not need a customer account.",
  },
  {
    question: "Does tracking show the vehicle’s live location?",
    answer:
      "Public tracking shows the latest recorded shipment events. It is not a continuous GPS feed. An interval without a new scan does not necessarily mean the goods have stopped moving.",
  },
  {
    question: "Can I send fragile goods, batteries or liquids?",
    answer:
      "Tell the team exactly what you plan to send before booking. Some goods require special packaging or documentation and some may not be accepted. Do not hand over restricted goods without confirmation.",
  },
  {
    question: "Is the delivery date guaranteed?",
    answer:
      "The team will discuss an expected delivery window when reviewing your shipment. Actual movement can be affected by cargo acceptance, flight or road conditions, weather and destination access. Ask about the terms that apply to your booking.",
  },
  {
    question: "What should I do if a shipment is delayed or damaged?",
    answer:
      "Contact the team with your AWB and a description of the issue. For visible damage, keep the packaging and any relevant photographs or documents. The team will advise on the next steps for your consignment.",
  },
]
