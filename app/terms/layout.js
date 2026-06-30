export const metadata = {
  title: "Terms & Conditions",
  description: "Terms of Service for Synchronous Build Digital. Read our terms and conditions for utilizing our services.",
  keywords: ["terms of service", "terms and conditions", "agreement"],
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: "Terms & Conditions | Synchronous Build Digital",
    description: "Terms of Service for Synchronous Build Digital. Read our terms and conditions for utilizing our services.",
    url: 'https://synchronousbuilddigital.com/terms',
  }
};

export default function TermsLayout({ children }) {
  return <>{children}</>;
}
