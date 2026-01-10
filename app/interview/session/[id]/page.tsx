'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Send,
  Loader2,
  Bot,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CodeEditor } from '@/components/problems/CodeEditor';
import {
  interviewCategoriesAPI,
  InterviewSession,
} from '@/features/interview/interviewApi';
import { questionBanksAPI } from '@/features/questions/questionsApi';
import { toast } from 'sonner';
import Link from 'next/link';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function InterviewSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [session, setSession] = useState<InterviewSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hello! Welcome to the interview. I'll be asking you technical questions to assess your skills. Are you ready to begin?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'code'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadSession = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await interviewCategoriesAPI.getSessionById(sessionId);
      setSession(data);

      // 加载第一个问题
      await loadNextQuestion();
    } catch (err) {
      console.error('Failed to load session:', err);
      setError('Failed to load interview session. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const loadNextQuestion = async () => {
    try {
      // 这里应该从API获取下一个问题
      // 暂时使用模拟数据
      const questions = await questionBanksAPI.getQuestions(
        session?.categoryId
      );
      if (questions.length > 0) {
        const question = questions[0];
        addMessage('assistant', question.questionText);
      }
    } catch (err) {
      console.error('Failed to load question:', err);
    }
  };

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    addMessage('user', inputMessage);
    setInputMessage('');

    // 模拟AI回复
    setTimeout(() => {
      const responses = [
        "That's a good approach. Can you explain the time complexity of your solution?",
        'Interesting! How would you handle edge cases in this scenario?',
        'Great answer! Let me ask you a follow-up question...',
        'I see. Could you implement that solution in code?',
        "That's correct. Now let's move on to the next question.",
      ];
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];
      addMessage('assistant', randomResponse);
    }, 1000);
  };

  const handleSubmitCode = async () => {
    try {
      toast.info('Submitting code for evaluation...');
      // 这里应该调用API提交代码
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('Code submitted successfully!');

      // 添加AI反馈
      addMessage(
        'assistant',
        "Thanks for submitting your code. I can see you've implemented the solution correctly. The time complexity is O(n) which is optimal for this problem."
      );
    } catch (err) {
      console.error('Failed to submit code:', err);
      toast.error('Failed to submit code');
    }
  };

  const handleEndInterview = async () => {
    try {
      await interviewCategoriesAPI.updateSession(sessionId, {
        status: 'COMPLETED',
      });
      toast.success('Interview completed successfully!');
      router.push('/interview');
    } catch (err) {
      console.error('Failed to end interview:', err);
      toast.error('Failed to end interview');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

  if (error || !session) {
    return (
      <div className="min-h-[calc(100vh-6rem)] py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/interview"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Interviews
          </Link>

          <div className="text-center py-20">
            <p className="text-destructive mb-4">
              {error || 'Session not found'}
            </p>
            <Button onClick={loadSession}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-6rem)] py-6 px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 头部 */}
        <div className="flex items-center justify-between">
          <Link
            href="/interview"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Interviews
          </Link>

          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Status:{' '}
              <span className="font-medium text-foreground">
                {session.status}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleEndInterview}>
              End Interview
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：视频和基本信息 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 视频区域 */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="aspect-video bg-black rounded-lg mb-4 flex items-center justify-center">
                {isVideoOn ? (
                  <div className="text-center text-muted-foreground">
                    <Video className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">Video feed would appear here</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <VideoOff className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Video is off
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-4">
                <Button
                  variant={isVideoOn ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className="gap-2"
                >
                  {isVideoOn ? (
                    <VideoOff className="w-4 h-4" />
                  ) : (
                    <Video className="w-4 h-4" />
                  )}
                  {isVideoOn ? 'Turn Off' : 'Turn On'}
                </Button>

                <Button
                  variant={isRecording ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={() => setIsRecording(!isRecording)}
                  className="gap-2"
                >
                  {isRecording ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                  {isRecording ? 'Stop' : 'Record'}
                </Button>
              </div>
            </div>

            {/* 面试信息 */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold mb-4">Interview Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="font-medium">{session.category.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Started</p>
                  <p className="font-medium">
                    {new Date(session.createdAt).toLocaleDateString()} at{' '}
                    {new Date(session.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Room URL</p>
                  <p className="font-medium text-sm truncate">
                    {session.dailyRoomUrl}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 中间：聊天和代码编辑器 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 标签页 */}
            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === 'chat'
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Chat
                {activeTab === 'chat' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === 'code'
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Code Editor
                {activeTab === 'code' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            </div>

            {/* 聊天内容 */}
            {activeTab === 'chat' && (
              <div
                className="bg-card border border-border rounded-2xl shadow-sm flex flex-col"
                style={{ height: '600px' }}
              >
                {/* 消息列表 */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role === 'user' ? 'justify-end' : ''
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-primary" />
                        </div>
                      )}

                      <div
                        className={`max-w-[70%] ${
                          message.role === 'user' ? 'order-first' : ''
                        }`}
                      >
                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground rounded-tr-none'
                              : 'bg-muted rounded-tl-none'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 px-1">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>

                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* 输入框 */}
                <div className="border-t border-border p-4">
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && handleSendMessage()
                      }
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} className="gap-2">
                      <Send className="w-4 h-4" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* 代码编辑器 */}
            {activeTab === 'code' && (
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Code Challenge</h3>
                  <p className="text-sm text-muted-foreground">
                    Implement the solution for the current question. Your code
                    will be evaluated for correctness and efficiency.
                  </p>
                </div>

                <CodeEditor
                  value={code}
                  onChange={setCode}
                  language="javascript"
                  height="400px"
                  onRun={() => toast.info('Running code...')}
                  onReset={() => setCode('')}
                />

                <div className="mt-6 flex items-center justify-end gap-3">
                  <Button variant="outline" onClick={() => setCode('')}>
                    Clear Code
                  </Button>
                  <Button onClick={handleSubmitCode} className="min-w-30">
                    Submit Code
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
