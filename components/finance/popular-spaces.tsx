import Link from "next/link";
import type { PopularSpace } from "@/types/finance";

type PopularSpacesProps = {
  spaces: PopularSpace[];
};

export function PopularSpaces({ spaces }: PopularSpacesProps) {
  return (
    <section id="predictions" className="scroll-mt-28" aria-labelledby="spaces-heading">
      <h2 id="spaces-heading" className="mb-3 text-[17px] font-semibold text-neutral-900">
        Popular Spaces for Finance Research
      </h2>
      {spaces.length === 0 ? (
        <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center shadow-sm">
          <p className="text-[15px] font-semibold text-neutral-900">No spaces available</p>
          <p className="mt-2 text-[13px] leading-relaxed text-neutral-600">
            Check back later for popular finance research spaces.
          </p>
        </div>
      ) : (
        <div className="grid gap-2 md:grid-cols-3">
          {spaces.map((space) => (
            <Link
              key={space.id}
              href={space.href}
              className="flex flex-col rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <p className="text-[15px] font-semibold text-neutral-900">{space.title}</p>
              <p className="mt-2 flex-1 text-[13px] leading-relaxed text-neutral-600">
                {space.description}
              </p>
              <span className="mt-4 text-[13px] font-medium text-emerald-700">{space.cta} →</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
