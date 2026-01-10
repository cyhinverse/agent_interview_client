'use client';

import { FileText, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { QuestionBank } from '@/features/questions/questionsApi';
import { useDeleteQuestion } from '@/hooks/useAdmin';
import { toast } from 'sonner';

interface QuestionManagementTableProps {
  questions: QuestionBank[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onEdit?: (question: QuestionBank) => void;
}

export function QuestionManagementTable({
  questions,
  isLoading,
  onRefresh,
  onEdit,
}: QuestionManagementTableProps) {
  const { mutate: deleteQuestion } = useDeleteQuestion();

  const getDifficultyVariant = (
    difficulty: string | null
  ): 'default' | 'secondary' | 'destructive' => {
    switch (difficulty) {
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const truncateText = (text: string, maxLength: number = 80) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleDelete = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      await deleteQuestion(questionId);
      toast.success('Question deleted successfully');
      onRefresh?.();
    } catch (error) {
      console.error('Failed to delete question:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border p-8 text-center text-muted-foreground">
        Loading questions...
      </div>
    );
  }

  if (!questions?.length) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
        <p className="text-muted-foreground">No questions found</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.map((question) => (
              <TableRow key={question.id}>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium text-sm">
                      {truncateText(question.questionText, 60)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {truncateText(question.expectedAnswer, 50)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {question.category?.name || 'Uncategorized'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getDifficultyVariant(question.difficulty)}>
                    {question.difficulty || 'Medium'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onEdit?.(question)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(question.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
