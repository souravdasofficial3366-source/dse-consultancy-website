export type CaseStudy = {
  slug: string;
  title: string;
  businessType: string;
  city: string;
  summary: string;
  result: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "local-grocery-shop",
    title: "Local Grocery Shop Website",
    businessType: "Grocery shop",
    city: "Kolkata",
    summary:
      "A simple website structure for a grocery shop that wants calls and WhatsApp orders from nearby customers.",
    result: "Customers can view timings, delivery details, contact number, and WhatsApp link in one place."
  },
  {
    slug: "family-clinic",
    title: "Family Clinic Website",
    businessType: "Clinic",
    city: "Patna",
    summary:
      "A clear clinic website structure with doctor details, timings, address, and patient enquiry form.",
    result: "Patients can understand the clinic services and call before visiting."
  }
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((caseStudy) => caseStudy.slug === slug);
}
