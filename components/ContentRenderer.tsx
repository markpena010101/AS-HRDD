import React from 'react';

interface ContentRendererProps {
  content: string;
}

const ContentRenderer: React.FC<ContentRendererProps> = ({ content }) => {
  // Regex to detect image URLs (basic check for common extensions)
  const isImageUrl = (url: string) => /\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i.test(url);
  
  // Regex to detect standard URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Check if the entire content is just an image URL
  if (isImageUrl(content.trim())) {
    return (
      <img 
        src={content.trim()} 
        alt="Content" 
        className="max-w-full h-auto rounded-lg shadow-md my-4 hover:scale-105 transition-transform duration-300" 
      />
    );
  }

  // Check if content contains URLs and linkify them
  const parts = content.split(urlRegex);

  return (
    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
      {parts.map((part, i) => {
        if (part.match(urlRegex)) {
          // If it's an image link inside text, maybe render a small preview? 
          // For now, just make it a link.
          return (
            <a 
              key={i} 
              href={part} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:text-blue-800 underline font-medium break-all"
            >
              {part}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
};

export default ContentRenderer;
