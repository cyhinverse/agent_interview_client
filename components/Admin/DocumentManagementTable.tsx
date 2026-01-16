'use client';

import {
  FileText,
  Edit,
  Trash2,
  Upload,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
} from 'lucide-react';
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
import { KnowledgeDocument } from '@/features/admin/adminApi';
import { useDeleteDocument } from '@/hooks/useAdmin';
import { toast } from 'sonner';

interface DocumentManagementTableProps {
  documents: KnowledgeDocument[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onEdit?: (document: KnowledgeDocument) => void;
}

export function DocumentManagementTable({
  documents,
  isLoading,
  onRefresh,
  onEdit,
}: DocumentManagementTableProps) {
  const { mutate: deleteDocument } = useDeleteDocument();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'PROCESSING':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusVariant = (
    status: string
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'COMPLETED':
        return 'default';
      case 'PROCESSING':
        return 'secondary';
      case 'FAILED':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatFileSize = (bytes: number | null | undefined) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDelete = async (documentId: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this document? All chunks will also be deleted.'
      )
    )
      return;
    try {
      await deleteDocument(documentId);
      onRefresh?.();
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border p-8 text-center text-muted-foreground">
        Loading documents...
      </div>
    );
  }

  if (!documents?.length) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
        <p className="text-muted-foreground">No documents found</p>
        <p className="text-sm text-muted-foreground mt-2">
          Upload documents to build your knowledge base for AI interviews
        </p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Chunks</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{doc.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.fileName}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {doc.category?.name || 'Uncategorized'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="uppercase text-xs">
                    {doc.fileType}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatFileSize(doc.fileSize)}
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium">{doc.totalChunks}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(doc.status)}
                    <Badge variant={getStatusVariant(doc.status)}>
                      {doc.status}
                    </Badge>
                  </div>
                  {doc.errorMessage && (
                    <p className="text-xs text-red-500 mt-1 max-w-[200px] truncate">
                      {doc.errorMessage}
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onEdit?.(doc)}
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
                          onClick={() => handleDelete(doc.id)}
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
