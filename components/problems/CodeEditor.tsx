'use client';

import { useState, useCallback } from 'react';
import Editor, { OnMount, OnChange } from '@monaco-editor/react';
import { Play, RotateCcw, Copy, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { editor } from 'monaco-editor';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
  readOnly?: boolean;
  onRun?: () => void;
  onReset?: () => void;
}

// Map language names to Monaco language identifiers
const languageMap: Record<string, string> = {
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  java: 'java',
  cpp: 'cpp',
  c: 'c',
  csharp: 'csharp',
  go: 'go',
  rust: 'rust',
  ruby: 'ruby',
  php: 'php',
  sql: 'sql',
  html: 'html',
  css: 'css',
  json: 'json',
  markdown: 'markdown',
};

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
  const [editorInstance, setEditorInstance] =
    useState<editor.IStandaloneCodeEditor | null>(null);

  const monacoLanguage = languageMap[language.toLowerCase()] || 'plaintext';

  const handleEditorDidMount: OnMount = useCallback((editor) => {
    setEditorInstance(editor);
    // Focus the editor
    editor.focus();
  }, []);

  const handleEditorChange: OnChange = useCallback(
    (newValue) => {
      onChange(newValue || '');
    },
    [onChange]
  );

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
      console.log('Running code:', value);
    }
  };

  const handleFormat = () => {
    if (editorInstance) {
      editorInstance.getAction('editor.action.formatDocument')?.run();
      toast.success('Code formatted!');
    }
  };

  const lines = value.split('\n').length;

  return (
    <div
      className="border border-border rounded-xl overflow-hidden bg-[#1e1e1e] shadow-lg flex flex-col"
      style={{ height }}
    >
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-border shrink-0">
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

          <Button
            variant="ghost"
            size="sm"
            onClick={handleFormat}
            className="h-8 px-3 text-xs gap-1.5 hover:bg-[#2d2d30]"
          >
            Format
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

      {/* Monaco Editor Container */}
      <div className="flex-1 min-h-0 relative">
        <Editor
          height="100%"
          language={monacoLanguage}
          value={value}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          loading={
            <div className="flex items-center justify-center h-full bg-[#1e1e1e]">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-2 text-sm text-muted-foreground">
                Loading editor...
              </span>
            </div>
          }
          options={{
            readOnly,
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
            lineNumbers: 'on',
            lineNumbersMinChars: 3,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            padding: { top: 16, bottom: 16 },
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            bracketPairColorization: { enabled: true },
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            autoIndent: 'advanced',
            formatOnPaste: true,
            formatOnType: true,
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            snippetSuggestions: 'inline',
            folding: true,
            foldingHighlight: true,
            showFoldingControls: 'mouseover',
            renderLineHighlight: 'all',
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
          }}
        />
      </div>

      {/* Editor Footer Status Bar */}
      <div className="px-4 py-2 bg-[#252526] border-t border-border flex items-center justify-between shrink-0">
        <div className="text-xs text-muted-foreground font-mono">
          Lines: {lines} | Length: {value.length}
        </div>
        <div className="text-xs text-muted-foreground font-mono">
          {language.toUpperCase()} | UTF-8
        </div>
      </div>
    </div>
  );
}
