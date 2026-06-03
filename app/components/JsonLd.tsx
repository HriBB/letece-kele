/**
 * Renders a JSON-LD structured-data block as a single `<script type="application/ld+json">`.
 * The data object is built by a pure helper (e.g. `localBusinessJsonLd`) and tested there;
 * this component is just the serialization seam, so search engines and AI answer surfaces
 * read structured data off every rendered page (issue #9).
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
