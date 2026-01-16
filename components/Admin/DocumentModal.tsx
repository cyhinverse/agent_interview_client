'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import { FileText, Loader2, Upload, X, CheckCircle, File } from 'lucide-react';
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
import {
  useUploadDocumentMutation,
  useUpdateDocumentMutation,
} from '@/features/admin/adminApi';
import { useInterviewCategories } from '@/hooks/useInterviewCategories';
import { KnowledgeDocument } from '@/features/admin/adminApi';
import { toast } from 'sonner';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: KnowledgeDocument | null;
  onSuccess?: () => void;
}

const fileTypeLabels: Record<string, string> = {
  pdf: 'PDF',
  docx: 'Word Document',
  txt: 'Text File',
  md: 'Markdown',
};

const ACCEPTED_TYPES = '.pdf,.docx,.txt,.md';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Wrapper component that uses key to reset inner form
export function DocumentModal({
  isOpen,
  onClose,
  document,
  onSuccess,
}: DocumentModalProps) {
  // Key changes when document changes, causing React to remount the form
  const formKey = document?.id ?? 'new';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DocumentModalContent
        key={formKey}
        document={document}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    </Dialog>
  );
}

// Inner component with form state - gets remounted when key changes
function DocumentModalContent({
  document,
  onClose,
  onSuccess,
}: Omit<DocumentModalProps, 'isOpen'>) {
  // Initial state derived from document prop (only computed once per mount)
  const initialFormData = useMemo(
    () => ({
      categoryId: document?.categoryId ?? '',
      title: document?.title ?? '',
    }),
    [document?.categoryId, document?.title] // Empty deps - only compute on mount
  );

  const [formData, setFormData] = useState(initialFormData);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: categories } = useInterviewCategories();
  const [uploadDocument, { isLoading: isUploading }] =
    useUploadDocumentMutation();
  const [updateDocument, { isLoading: isUpdating }] =
    useUpdateDocumentMutation();

  const isPending = isUploading || isUpdating;
  const isEditing = !!document;

  // Get file type from extension
  const getFileType = (filename: string): string | null => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext && ['pdf', 'docx', 'txt', 'md'].includes(ext)) {
      return ext;
    }
    return null;
  };

  const handleFileSelect = useCallback(
    (file: File) => {
      const fileType = getFileType(file.name);
      if (!fileType) {
        toast.error(
          'Unsupported file type. Please upload PDF, DOCX, TXT, or MD files.'
        );
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error('File too large. Maximum size is 10MB.');
        return;
      }

      setSelectedFile(file);

      if (!formData.title) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        setFormData((prev) => ({ ...prev, title: nameWithoutExt }));
      }
    },
    [formData.title]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.categoryId || !formData.title) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (isEditing && document) {
      try {
        await updateDocument({
          documentId: document.id,
          data: {
            title: formData.title,
            categoryId: formData.categoryId,
          },
        }).unwrap();
        toast.success('Document updated successfully');
        onSuccess?.();
        onClose();
      } catch {
        toast.error('Failed to update document');
      }
    } else {
      if (!selectedFile) {
        toast.error('Please select a file to upload');
        return;
      }

      try {
        await uploadDocument({
          file: selectedFile,
          categoryId: formData.categoryId,
          title: formData.title,
        }).unwrap();
        toast.success(
          'Document uploaded successfully! Processing in background...'
        );
        onSuccess?.();
        onClose();
      } catch {
        toast.error('Failed to upload document');
      }
    }
  };

  const detectedFileType = selectedFile ? getFileType(selectedFile.name) : null;

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <DialogTitle>
              {isEditing ? 'Edit Document' : 'Upload Document'}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Update document details'
                : 'Upload a knowledge document for AI interviews'}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Upload Zone - Only show for new documents */}
        {!isEditing && (
          <div className="space-y-2">
            <Label>File *</Label>
            <div
              className={`
                relative border-2 border-dashed rounded-xl p-6 text-center
                transition-colors cursor-pointer
                ${
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : selectedFile
                    ? 'border-green-500 bg-green-500/5'
                    : 'border-border hover:border-primary/50'
                }
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_TYPES}
                onChange={handleFileInputChange}
                className="hidden"
              />

              {selectedFile ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {detectedFileType && fileTypeLabels[detectedFileType]} •{' '}
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    Drag and drop or click to upload
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, DOCX, TXT, MD • Max 10MB
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Display current file info for editing */}
        {isEditing && document && (
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <File className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{document.fileName}</p>
              <p className="text-xs text-muted-foreground">
                {fileTypeLabels[document.fileType] || document.fileType} •{' '}
                {document.fileSize
                  ? `${(document.fileSize / 1024).toFixed(1)} KB`
                  : 'Unknown size'}
              </p>
            </div>
          </div>
        )}

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
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Document title..."
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
            {isEditing ? 'Update' : 'Upload'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
