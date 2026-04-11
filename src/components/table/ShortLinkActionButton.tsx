import { useState } from "react";

interface ShortLinkActionButtonProps {
  url: string;
  onDelete: () => void;
}

function CopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`btn btn-secondary btn-sm ${copied ? "btn-copy-success" : ""}`}
      title="Copy to clipboard"
    >
      {copied ? "✓ Copied" : "⎘ Copy"}
    </button>
  );
}

export default function ShortLinkActionButton({
  url,
  onDelete,
}: ShortLinkActionButtonProps) {
  return (
    <div className="actions-cell">
      <CopyButton url={url} />
      <button
        onClick={onDelete}
        className="btn btn-danger btn-sm"
        title="Delete link"
      >
        Delete
      </button>
    </div>
  );
}
