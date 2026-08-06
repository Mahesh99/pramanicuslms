import type { ModuleSection } from "@/lib/parse-module-md";

function sectionNumber(
  section: ModuleSection,
  moduleNum: number,
  index: number,
): string {
  const fromLabel = section.label.match(/section\s+([\d.]+)/i)?.[1];
  if (fromLabel) return fromLabel;
  if (/^practice$/i.test(section.label) || /exercise/i.test(section.title)) {
    return "✏";
  }
  return `${moduleNum}.${index + 1}`;
}

export function ModuleSidebar({
  moduleNum,
  sections,
}: {
  moduleNum: number;
  sections: ModuleSection[];
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">Module {moduleNum} Contents</div>
      <ul>
        {sections.map((s, i) => (
          <li key={s.id}>
            <a href={`#${s.id}`}>
              <span className="sec-num">{sectionNumber(s, moduleNum, i)}</span>
              {s.title}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
