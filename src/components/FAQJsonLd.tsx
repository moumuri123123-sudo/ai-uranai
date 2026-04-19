import JsonLd from "./JsonLd";
import { faqPageJsonLd } from "@/lib/jsonld";
import type { FaqItem } from "@/lib/faqs";

type Props = {
  id: string;
  items: FaqItem[];
};

export default function FAQJsonLd({ id, items }: Props) {
  if (!items || items.length === 0) return null;
  return <JsonLd id={id} data={faqPageJsonLd(items)} />;
}
