'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
  readOnly?: boolean;
  onRun?: () => void;
  onReset?: () => void;
}

export function CodeEditor({
  value,
  onChange,
  language = 'javascript',
  height = '400px',
  readOnly = false,
  onRun,
  onReset,
}: CodeEditorProps) {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  // 语法高亮映射
  const highlightSyntax = (code: string): string => {
    if (language === 'javascript' || language === 'typescript') {
      return code
        .replace(/\b(const|let|var|function|return|if|else|for|while|class|import|export|from|default)\b/g, '<span class="text-blue-400">$&</span>')
        .replace(/\b(console|log|error|warn|info)\b/g, '<span class="text-yellow-400">$&</span>')
        .replace(/\b(true|false|null|undefined)\b/g, '<span class="text-purple-400">$&</span>')
        .replace(/\b(\d+)\b/g, '<span class="text-green-400">$&</span>')
        .replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="text-red-400">$&</span>')
        .replace(/\/\/.*$/gm, '<span class="text-gray-500">$&</span>')
        .replace(/\/\*[\s\S]*?\*\//g, '<span class="text-gray-500">$&</span>');
    }
    
    if (language === 'python') {
      return code
        .replace(/\b(def|class|return|if|elif|else|for|while|import|from|as|try|except|finally|with)\b/g, '<span class="text-blue-400">$&</span>')
        .replace(/\b(print|len|range|str|int|float|bool|list|dict|tuple|set)\b/g, '<span class="text-yellow-400">$&</span>')
        .replace(/\b(True|False|None)\b/g, '<span class="text-purple-400">$&</span>')
        .replace(/\b(\d+)\b/g, '<span class="text-green-400">$&</span>')
        .replace(/(".*?"|'.*?'|f".*?"|f'.*?')/g, '<span class="text-red-400">$&</span>')
        .replace(/#.*$/gm, '<span class="text-gray-500">$&</span>');
    }
    
    return code;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
      toast.error('Failed to copy code');
    }
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      onChange('');
    }
    toast.info('Code editor reset');
  };

  const handleRun = () => {
    if (onRun) {
      onRun();
    } else {
      toast.info('Running code...');
      // 这里可以添加实际的代码执行逻辑
      console.log('Running code:', value);
    }
  };

  // 同步滚动
  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  // 处理tab键
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      
      // 设置光标位置
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const highlightedCode = highlightSyntax(value);
  const lines = value.split('\n').length;

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-[#1e1e1e] shadow-lg">
      {/* 编辑器头部 */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            {language.toUpperCase()}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 px-3 text-xs gap-1.5 hover:bg-[#2d2d30]"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          
          {onReset && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-8 px-3 text-xs gap-1.5 hover:bg-[#2d2d30]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </Button>
          )}
          
          {onRun && (
            <Button
              size="sm"
              onClick={handleRun}
              className="h-8 px-3 text-xs gap-1.5 bg-green-600 hover:bg-green-700"
            >
              <Play className="w-3.5 h-3.5" />
              Run
            </Button>
          )}
        </div>
      </div>

      {/* 编辑器主体 */}
      <div className="relative" style={{ height }}>
        {/* 行号 */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#1e1e1e] border-r border-border overflow-hidden select-none">
          <div className="py-4 text-right pr-3 font-mono text-xs text-muted-foreground">
            {Array.from({ length: lines }, (_, i) => (
              <div key={i} className="leading-6">
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* 代码高亮背景 */}
        <pre
          ref={preRef}
          className="absolute left-12 right-0 top-0 bottom-0 overflow-auto py-4 px-4 font-mono text-sm whitespace-pre"
          style={{ 
            height: '100%',
            backgroundColor: 'transparent',
            pointerEvents: 'none',
            zIndex: 1,
          }}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />

        {/* 可编辑的textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          className="absolute left-12 right-0 top-0 bottom-0 w-full bg-transparent py-4 px-4 font-mono text-sm whitespace-pre resize-none outline-none text-transparent caret-white"
          style={{ 
            height: '100%',
            zIndex: 2,
            lineHeight: '1.5rem',
          }}
          spellCheck="false"
          placeholder={`// Write your ${language} code here...`}
        />
      </div>

      {/* 编辑器底部状态栏 */}
      <div className="px-4 py-2 bg-[#252526] border-t border-border flex items-center justify-between">
        <div className="text-xs text-muted-foreground font-mono">
          Lines: {lines} | Length: {value.length}
        </div>
        <div className="text-xs text-muted-foreground font-mono">
          {language.toUpperCase()}
        </div>
      </div>
    </div>
  );
}
