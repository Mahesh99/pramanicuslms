import type { ModuleDatasetFile } from "@/lib/module-datasets";

export function ModuleDatasetDownloads({ files }: { files: ModuleDatasetFile[] }) {
  if (files.length === 0) return null;

  return (
    <section className="module-datasets" aria-label="Download datasets">
      <div className="module-datasets-header">
        <div className="section-icon" aria-hidden>
          📥
        </div>
        <div>
          <div className="module-datasets-kicker">This module</div>
          <h2>Download datasets</h2>
        </div>
      </div>
      <p className="module-datasets-lead">
        Save these CSVs and open them in Excel. Each file is sized for the exercises on this
        page.
      </p>
      <ul className="module-datasets-list">
        {files.map((file) => (
          <li key={file.href}>
            <a className="module-dataset-link" href={file.href} download={file.filename}>
              <span className="module-dataset-label">{file.label}</span>
              <span className="module-dataset-file">{file.filename}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
