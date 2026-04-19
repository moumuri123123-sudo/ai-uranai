import JsonLd from "./JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";

type Props = {
  id: string;
  segments: { name: string; path: string }[];
};

export default function BreadcrumbJsonLd({ id, segments }: Props) {
  return <JsonLd id={id} data={breadcrumbJsonLd(segments)} />;
}
