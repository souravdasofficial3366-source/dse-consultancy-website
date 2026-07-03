export const siteConfig = {
  name: "DSE Consultancy",
  basePrice: "₹3,999",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  phone: process.env.NEXT_PUBLIC_DSE_PHONE || "+91 62913 06377",
  whatsapp: process.env.NEXT_PUBLIC_DSE_WHATSAPP || "916291306377",
  email: process.env.NEXT_PUBLIC_DSE_EMAIL || "hello@dseconsultancy.in",
  socialLinks: [
    { label: "LinkedIn", shortLabel: "in", url: process.env.NEXT_PUBLIC_LINKEDIN_URL },
    { label: "Facebook", shortLabel: "f", url: process.env.NEXT_PUBLIC_FACEBOOK_URL },
    { label: "Instagram", shortLabel: "ig", url: process.env.NEXT_PUBLIC_INSTAGRAM_URL }
  ].filter((link): link is { label: string; shortLabel: string; url: string } =>
    Boolean(link.url)
  )
};

export function hasConfiguredPhone() {
  return !siteConfig.phone.includes("X");
}

export function hasConfiguredWhatsApp() {
  return !siteConfig.whatsapp.includes("X");
}

export const businessTypes = [
  "grocery shop",
  "salon",
  "clinic",
  "clothing store",
  "mobile repair shop",
  "restaurant",
  "pharmacy",
  "tuition centre",
  "hardware shop",
  "real estate office"
];

export const focusCities = [
  "kolkata",
  "delhi",
  "mumbai",
  "bengaluru",
  "chennai",
  "hyderabad",
  "pune",
  "ahmedabad",
  "jaipur",
  "lucknow",
  "patna",
  "bhubaneswar"
];

export const industryCards = [
  {
    title: "Grocery Shops",
    text: "Show your timing, phone number, and delivery details.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBmZVhN8pNnzAIjKJ61RsyiFEXb8BBMyUaTCQAVD3VxGgWRsNp6UAJQLYUqNoJ12rel2HsB-Jnz3objcV0wQYtnn4LLY2Rk37OiG0tQPMO7aVPm0qSww_yCoPxegjxb19ips2MPjGUfLSxhtGaAxW1uk8b2YzkXg3biBlVCUFIG9bOBnm-IsT3jcbmqefilZzCZtB_6WnCg_SLHkYJtBBdkeHi7iTOmMq8u5ZIKIDf4VbK4PYzzuyCpjBNqK2Z1ULmjwydDlvkF1QFA1g"
  },
  {
    title: "Doctors & Clinics",
    text: "Help patients call, find your address, and book visits.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCsRqu05BSl6PdI2M3Ue1xSPxcCx5fSw9-ZtYXRf7ObW5xoosoLCKPW53lCqU4k94jFOD8nTmh4mcjK9G9UYzg0kV34d3zMLDAU2swvtdaWOkJ-WPpujg8P1-pl8zbO2XaPEgsC5bkj51K1KdznrN3l6zrxt0tieHzI64J-fO058tFzuX3M4gUlKfFmM_6Mv26fK23jDiT_D4B0Hj4E74wSpOQEt_ijStv_SRC_z2uKsgXDYkfL_Xw1_-iQM92D7nyybQ4KZUIK-pnFqw"
  },
  {
    title: "Tuition Centres",
    text: "Share courses, fees, photos, and parent enquiry forms.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDqNEhL4u5IjltRa20QmJjn1Ps2vcwJedbK0AtN-tryFbH6VWVRw2wY121JNB4C3uCw0LjrHxuxHD-7GRES024_SfEXFSmV69GBjQLEiUhmLs7xd6J6E_-ZjyK-UDY9_hywu28iVXvJBNab-GyDnCZ9i4y1mJtbqXIyhPPWZ0ZwEIjgsGAZIeJOB4zrbZjaSlP0xNqfy0ag_i0Z-SMnMgeG5L2GXobD_VSU62KjBUXQqK1TEpa-PzSKIIEx9A1_F4Mm1TiZtqzqjLnhjg"
  },
  {
    title: "Repair Shops",
    text: "Get more calls from nearby customers who need quick help.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBLp-em42blgPqtjrRLqdZ9ZIHwyvAsGXMCukJvbK-or0sleBU6QOvXm3RaPcttjqXE487TNRZKEt9f9KTaHISThWqrm3B7tTxBcxe8fMaj8N48kEb2OAUSP3E19f8xQ3dylUXQrU1uG6RKIy8mV3Mu-1ORlt1ITXiOQDXsJKAPb6bUFFNvrI1Xae0XUbt_IDW0Q9PEIcGVtvrZDozclDTuMhjALxfWSBL1mpjSivXqHOTeWmoz5hLa_jB6UjOClu4zmYj7NDjQAoY"
  },
  {
    title: "Real Estate Offices",
    text: "Display properties and collect buyer calls on mobile.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCJAb7R0YSqDQ65sJ-cnlNO32OZCQCa0mQ3-Qx_11kMQD2R087FSqoht5YrBY3EV1iVbZQvOy7dPImsPyvTZWWOBQBerL8kuzfeZL2CdSyVJnBbL8fC6LMOQFxLdkMeh4Nw0UGCpHxsfuY__2eqnl_Q_Jth3irzpQ1ZTUZKOLwcx-D7SkiN2vOXkg9IX9wN-0_m_6YEUtfC4vbi4oaCvR4vT3RhY0IrI4sgpHqosS3afu3EW13_zD9MNiUFF5wHfwKRjZmBXMwvHNE"
  },
  {
    title: "Clothing Stores",
    text: "Show new stock, offers, WhatsApp ordering, and directions.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBs_1Df2DUUGPYeED6fknw2oaCUwCL8VDhai4y7N6gtihgR7Nxv_8VZO-ze62GXVd7uJUCLgNfatnoge2u4Z6u5-uyvxUUo3HdfL2RmPPYW38YPsijXRDI05LCR_PYiwwVHf6TlhIOHTqKKBjhnVGLHZ1YPhUryZK2ul-87j4MxxR7IFuQPK23UyYrsOnzLxb75q9pFGnGBhxwhQ-d4mqBoVXQUT4tNeef2nivFDL3S6FB1XF3k1AGcF-eoBS4ovlPIc_M4K4Uv91I"
  }
];
