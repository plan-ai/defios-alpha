import React from 'react';
import cn from 'classnames';
import Image from '@/components/ui/image';

export const mappingGHSkill: any = {
  TypeScript: 'TypeScript',
  JavaScript: 'JavaScript',
  CSS: 'CSS',
  Rust: 'Rust',
  HTML: 'HTML',
  PowerShell: 'Powershell-Dark',
  SCSS: 'Sass',
  'C++': 'CPP',
  Python: 'Python-Dark',
  Perl: 'Perl',
  Ruby: 'Ruby',
  Clojure: 'Clojure-Dark',
  PHP: 'PHP-Dark',
  Julia: 'Julia-Dark',
  'Visual Basic .NET': 'DotNet',
  Dockerfile: 'Docker',
  C: 'C',
  'C#': 'CS',
  Pug: 'Pug-Dark',
  Go: 'GoLang',
  Java: 'Java-Dark',
  CoffeeScript: 'CoffeeScript-Dark',
  R: 'R-Dark',
  Dart: 'Dart-Dark',
  Swift: 'Swift',
  Lua: 'Lua-Dark',
};

interface LangTagsProps {
  tag: string;
  assign?: true;
  handleRemove?: any;
  className?: string;
  variant?: 'small' | 'medium' | 'large';
}
const variants = {
  small: 'w-8 h-8',
  medium: 'w-9 h-9',
  large: 'w-10 h-10 sm:w-12 sm:h-12',
};

const LangTags: React.FC<LangTagsProps> = ({
  tag,
  assign,
  handleRemove,
  className,
  variant = 'small',
}) => {
  return (
    <div
      className={cn(
        'mx-1 my-0.5 flex items-center justify-between rounded-full bg-black  shadow-card',
        className
      )}
      onClick={() => {
        if (!assign || assign === undefined) return;
        handleRemove(tag);
      }}
    >
      <div className="flex items-center">
        <div
          className={cn(
            'relative m-0.5 overflow-hidden rounded-full rounded-full',
            variants[variant]
          )}
        >
          <Image
            alt="icon"
            src={`https://raw.githubusercontent.com/tandpfun/skill-icons/59059d9d1a2c092696dc66e00931cc1181a4ce1f/icons/${mappingGHSkill[tag]}.svg`}
            className="object-cover"
            fill
          />
        </div>
        <div className="py-1 px-2 text-3xs font-medium tracking-wider lg:text-2xs 2xl:py-1.5 2xl:px-2.5 2xl:px-3 2xl:text-xs 3xl:py-2">
          {tag}
        </div>
      </div>
    </div>
  );
};

export default LangTags;
