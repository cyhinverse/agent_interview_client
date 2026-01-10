'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CodeEditor } from '@/components/problems/CodeEditor';
import {
  questionBanksAPI,
  QuestionBank,
} from '@/features/questions/questionsApi';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ProblemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const problemId = params.id as string;

  const [problem, setProblem] = useState<QuestionBank | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    score: number;
    comment: string;
  } | null>(null);

  useEffect(() => {
    loadProblem();
  }, [problemId]);

  const loadProblem = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await questionBanksAPI.getQuestionById(problemId);
      setProblem(data);

      // 根据问题语言设置初始代码
      const language = data.difficulty?.toLowerCase().includes('python')
        ? 'python'
        : 'javascript';
      setCode(getInitialCode(language));
    } catch (err) {
      console.error('Failed to load problem:', err);
      setError('Failed to load problem. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getInitialCode = (language: string): string => {
    if (language === 'python') {
      return `def solution():
    # Write your solution here
    pass

# Test your solution
if __name__ == "__main__":
    result = solution()
    print(f"Result: {result}")`;
    }

    // JavaScript/TypeScript
    return `function solution() {
    // Write your solution here
}

// Test your solution
const result = solution();
console.log(\`Result: \${result}\`);`;
  };

  const handleSubmit = async () => {
    if (!problem) return;

    try {
      setSubmitting(true);
      setResult(null);

      // 这里应该调用API提交答案
      // 暂时模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 模拟评分结果
      const score = Math.floor(Math.random() * 40) + 60; // 60-100分
      const success = score >= 70;

      setResult({
        success,
        score,
        comment: success
          ? 'Great job! Your solution passes all test cases and follows best practices.'
          : 'Your solution needs improvement. Consider edge cases and optimize time complexity.',
      });

      toast.success(
        success ? 'Solution accepted!' : 'Solution needs improvement'
      );
    } catch (err) {
      console.error('Failed to submit solution:', err);
      toast.error('Failed to submit solution. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRunCode = () => {
    toast.info('Running code...');
    // 这里可以添加实际的代码执行逻辑
    console.log('Running code:', code);
  };

  const handleResetCode = () => {
    if (problem) {
      const language = problem.difficulty?.toLowerCase().includes('python')
        ? 'python'
        : 'javascript';
      setCode(getInitialCode(language));
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-6rem)] py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="min-h-[calc(100vh-6rem)] py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/problems"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Problems
          </Link>

          <div className="text-center py-20">
            <p className="text-destructive mb-4">
              {error || 'Problem not found'}
            </p>
            <Button onClick={loadProblem}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-6rem)] py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 返回按钮 */}
        <Link
          href="/problems"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Problems
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 问题描述 */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight mb-2">
                    {problem.questionText.substring(0, 100)}
                    {problem.questionText.length > 100 ? '...' : ''}
                  </h1>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-muted text-xs font-medium">
                      {problem.category?.name || 'Uncategorized'}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        problem.difficulty?.toLowerCase() === 'high'
                          ? 'bg-red-500/20 text-red-400'
                          : problem.difficulty?.toLowerCase() === 'medium'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}
                    >
                      {problem.difficulty || 'Medium'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {problem.questionText}
                </div>
              </div>

              {problem.expectedAnswer && (
                <div className="mt-8 pt-6 border-t border-border">
                  <h3 className="text-sm font-semibold mb-3">
                    Expected Answer
                  </h3>
                  <div className="bg-muted rounded-lg p-4 font-mono text-sm">
                    {problem.expectedAnswer}
                  </div>
                </div>
              )}
            </div>

            {/* 提交结果 */}
            {result && (
              <div
                className={`border rounded-2xl p-6 ${
                  result.success
                    ? 'border-green-500/30 bg-green-500/5'
                    : 'border-yellow-500/30 bg-yellow-500/5'
                }`}
              >
                <div className="flex items-start gap-4">
                  {result.success ? (
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <h3 className="font-semibold">
                        {result.success
                          ? 'Solution Accepted!'
                          : 'Solution Needs Improvement'}
                      </h3>
                      <span className="px-3 py-1 rounded-full bg-card text-sm font-medium">
                        Score: {result.score}/100
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {result.comment}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 代码编辑器 */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Code Editor</h2>
                <div className="text-sm text-muted-foreground">
                  {problem.difficulty?.toLowerCase().includes('python')
                    ? 'Python'
                    : 'JavaScript'}
                </div>
              </div>

              <CodeEditor
                value={code}
                onChange={setCode}
                language={
                  problem.difficulty?.toLowerCase().includes('python')
                    ? 'python'
                    : 'javascript'
                }
                height="500px"
                onRun={handleRunCode}
                onReset={handleResetCode}
              />

              <div className="mt-6 flex items-center justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={handleResetCode}
                  disabled={submitting}
                >
                  Reset Code
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="min-w-[120px]"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Solution'
                  )}
                </Button>
              </div>
            </div>

            {/* 提示和建议 */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold mb-4">Tips & Suggestions</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>
                    Read the problem carefully and understand all requirements
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>Consider edge cases and boundary conditions</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>
                    Write clean, readable code with meaningful variable names
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>
                    Test your solution with different inputs before submitting
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
