import React, { useEffect, useState } from "react";
import YouTubeVideo from "../Misc/YouTubeVideo";
import DOMPurify from "dompurify";

// Helper to find YouTube links in HTML and replace with a placeholder
function replaceYouTubeLinks(html) {
  return html.replace(
    /<a [^>]*href="(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[^"]+)"[^>]*>[^<]*<\/a>/g,
    (match, url) => `<div data-yt-url="${url}"></div>`
  );
}

// Helper to split HTML into React elements, rendering YouTubeVideo where needed
function renderWithYouTube(html) {
  const parts = html.split(/(<div data-yt-url="[^"]+"><\/div>)/g);
  return parts.map((part, i) => {
    const ytMatch = part.match(/<div data-yt-url="([^"]+)"><\/div>/);
    if (ytMatch) {
      return <YouTubeVideo key={i} url={ytMatch[1]} />;
    }
    return (
      <span
        key={i}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(part),
        }}
      />
    );
  });
}

export default function RichTextRenderer({ html }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  // Add Tailwind classes to HTML tags
  let styledHtml = html
    .replace(/<h1>/g, '<h1 class="text-3xl font-bold text-center mb-6">')
    .replace(/<h2>/g, '<h2 class="text-2xl font-semibold mb-4">')
    .replace(/<h3>/g, '<h3 class="text-xl font-semibold mb-4">')
    .replace(/<p>/g, '<p class="text-lg text-gray-700 mb-4">')
    .replace(/<ul>/g, '<ul class="list-disc list-inside mb-4 text-base">')
    .replace(/<ol>/g, '<ol class="list-decimal list-inside mb-4 text-base">');
  styledHtml = styledHtml.replace(
    /<a href="([^"]+)">/g,
    '<a href="$1" class="text-blue-600 hover:underline">'
  );
  styledHtml = styledHtml.replace(
    /<img /g,
    '<img class="max-w-full h-auto mx-auto my-4 rounded" '
  );
  styledHtml = replaceYouTubeLinks(styledHtml);

  return (
    <div className="prose max-w-none">
      {renderWithYouTube(styledHtml)}
    </div>
  );
}