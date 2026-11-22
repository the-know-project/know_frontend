interface ArtTagsFilterProps {
  tags: string[];
}

const ArtTagsFilter = ({ tags }: ArtTagsFilterProps) => {
  if (tags.length === 0) return null;

  return (
    <section
      aria-label="Artwork tags"
      className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <h2 className="font-grotesk mb-3 text-xs font-semibold tracking-[0.16em] text-neutral-400 uppercase">
        Tags
      </h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="font-grotesk inline-flex min-h-8 items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 text-xs font-medium text-[#1E3A8A] uppercase"
          >
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
};

export default ArtTagsFilter;
