'use client';

import { useState, useEffect } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useCreateQuestion, useUpdateQuestion } from '@/hooks/useAdmin';
import { useInterviewCategories } from '@/hooks/useInterviewCategories';
import { QuestionBank } from '@/features/questions/questionsApi';
import { toast } from 'sonner';

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: QuestionBank | null;
  onSuccess?: () => void;
}

const difficulties = [
  { value: 'Low', label: 'Low', variant: 'secondary' as const },
  { value: 'Medium', label: 'Medium', variant: 'default' as const },
  { value: 'High', label: 'High', variant: 'destructive' as const },
];

export function QuestionModal({
  isOpen,
  onClose,
  question,
  onSuccess,
}: QuestionModalProps) {
  const [formData, setFormData] = useState({
    categoryId: '',
    questionText: '',
    expectedAnswer: '',
    difficulty: 'Medium',
  });

  const { data: categories } = useInterviewCategories();
  const { mutate: createQuestion, isPending: isCreating } = useCreateQuestion();
  const { mutate: updateQuestion, isPending: isUpdating } = useUpdateQuestion();

  const isPending = isCreating || isUpdating;
  const isEditing = !!question;

  useEffect(() => {
    if (question) {
      setFormData({
        categoryId: question.categoryId,
        questionText: question.questionText,
        expectedAnswer: question.expectedAnswer,
        difficulty: question.difficulty || 'Medium',
      });
    } else {
      setFormData({
        categoryId: '',
        questionText: '',
        expectedAnswer: '',
        difficulty: 'Medium',
      });
    }
  }, [question, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.categoryId ||
      !formData.questionText ||
      !formData.expectedAnswer
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (isEditing && question) {
      updateQuestion(
        { questionId: question.id, data: formData },
        {
          onSuccess: () => {
            toast.success('Question updated successfully');
            onSuccess?.();
            onClose();
          },
        }
      );
    } else {
      createQuestion(formData, {
        onSuccess: () => {
          toast.success('Question created successfully');
          onSuccess?.();
          onClose();
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle>
                {isEditing ? 'Edit Question' : 'Add Question'}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? 'Update question details'
                  : 'Create a new interview question'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Category *</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, categoryId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Difficulty</Label>
            <Select
              value={formData.difficulty}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, difficulty: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((diff) => (
                  <SelectItem key={diff.value} value={diff.value}>
                    <Badge variant={diff.variant}>{diff.label}</Badge>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="questionText">Question *</Label>
            <textarea
              id="questionText"
              value={formData.questionText}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  questionText: e.target.value,
                }))
              }
              placeholder="Enter the interview question..."
              rows={3}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedAnswer">Expected Answer *</Label>
            <textarea
              id="expectedAnswer"
              value={formData.expectedAnswer}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  expectedAnswer: e.target.value,
                }))
              }
              placeholder="Enter the expected answer..."
              rows={3}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
