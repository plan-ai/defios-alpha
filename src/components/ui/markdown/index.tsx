import React from 'react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import cn from 'classnames';

interface MarkdownRendererProps {
  className?: string;
}

const MarkdownRenderer = ({
  children,
  className,
}: React.PropsWithChildren<MarkdownRendererProps>) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      className={cn(className)}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline ? (
            <SyntaxHighlighter
              {...props}
              style={nightOwl}
              language={match ? match[1] : 'text'}
              PreTag="div"
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code {...props} className={className}>
              {children}
            </code>
          );
        },
      }}
    >
      {children as string}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
