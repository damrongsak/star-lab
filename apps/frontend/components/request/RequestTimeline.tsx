"use client";

import { Timeline, TimelineItem } from "@/components/ui/timeline";
import { 
  FileText, 
  Send, 
  CreditCard, 
  FlaskConical, 
  CheckCircle, 
  XCircle 
} from "lucide-react";
import type { TestRequest, TestRequestDocumentStatus, TestRequestStatusHistory } from "@star-lab/shared";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

interface RequestTimelineProps {
  request: TestRequest;
}

const statusConfig: Record<TestRequestDocumentStatus, {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}> = {
  DRAFT: {
    icon: FileText,
    title: "Draft Created",
    description: "Test request was created as draft",
  },
  SUBMITTED: {
    icon: Send,
    title: "Submitted",
    description: "Request submitted for processing",
  },
  PENDING_PAYMENT: {
    icon: CreditCard,
    title: "Pending Payment",
    description: "Waiting for payment confirmation",
  },
  RESULT_READY: {
    icon: FlaskConical,
    title: "Results Ready",
    description: "Lab tests completed, results available",
  },
  APPROVED: {
    icon: CheckCircle,
    title: "Approved",
    description: "Request approved by doctor",
  },
  REJECTED: {
    icon: XCircle,
    title: "Rejected",
    description: "Request rejected",
  },
  CANCELLED: {
    icon: XCircle,
    title: "Cancelled",
    description: "Request was cancelled",
  },
};

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function RequestTimeline({ request }: RequestTimelineProps) {
  // Fetch status history
  const { data: history } = useQuery({
    queryKey: ["request-status-history", request.id],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: TestRequestStatusHistory[] }>(
        `/test-requests/${request.id}/status-history`
      );
      return response.data.data;
    },
    enabled: !!request.id,
  });

  // Build timeline items
  const timelineItems: TimelineItem[] = [];

  if (history && history.length > 0) {
    // Strategy: Combine history items with creation event
    const events: Array<{
      status: TestRequestDocumentStatus;
      date: Date | string;
      description?: string;
      isHistory: boolean;
    }> = [];

    // 1. Add history items
    history.forEach((item) => {
      events.push({
        status: item.toStatus,
        date: item.changedAt,
        description: item.notes || undefined,
        isHistory: true,
      });
    });

    // 2. Add creation event (if not covered by history start)
    // We assume creation is always the oldest event
    // If the oldest history item is NOT DRAFT, and we have a createdAt, add it
    // Actually, just always add creation as "Submitted" or "Draft" based on first history?
    // Let's just add it as "Created" (SUBMITTED) for now, unless we find a DRAFT status in history
    const hasDraftInHistory = history.some(h => h.fromStatus === 'DRAFT' || h.toStatus === 'DRAFT');
    const creationStatus: TestRequestDocumentStatus = hasDraftInHistory ? 'DRAFT' : 'SUBMITTED';
    
    // Only add creation if it's significantly older than the first history item?
    // Or just add it.
    if (request.createdAt) {
       events.push({
        status: creationStatus,
        date: request.createdAt,
        description: "Request created",
        isHistory: false,
      });
    }

    // 3. Sort by date DESC
    // Backend returns history sorted by changedAt DESC.
    // We appended the creation event at the end (oldest).
    // So the array is already sorted.
    // events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // 4. Deduplicate adjacent same statuses (keep the latest one)
    const uniqueEvents = events.filter((event, index, self) => {
      if (index === 0) return true;
      const prev = self[index - 1];
      return event.status !== prev.status;
    });

    // 5. Map to timeline items
    uniqueEvents.forEach((event, index) => {
      const config = statusConfig[event.status];
      const Icon = config.icon;
      
      // Use rejection reason from request if it's the latest item and status is REJECTED
      let description = event.description || config.description;
      if (index === 0 && event.status === 'REJECTED' && request.rejectionReason) {
        description = request.rejectionReason;
      }

      timelineItems.push({
        title: config.title,
        description,
        date: formatDate(event.date),
        icon: <Icon className="h-4 w-4" />,
        isDone: index > 0, // Past items are done
        isActive: index === 0, // Top item is active
      });
    });
  } else {
    // Fallback: Use existing logic (legacy records without history)
    
    // Always show current status first (latest)
    const currentConfig = statusConfig[request.documentStatus];
    const CurrentIcon = currentConfig.icon;
    
    // Determine the date for current status
    let currentDate: string | undefined;
    if (request.documentStatus === "APPROVED" && request.approvedAt) {
      currentDate = formatDate(request.approvedAt);
    } else if (request.documentStatus === "REJECTED" && request.rejectedAt) {
      currentDate = formatDate(request.rejectedAt);
    } else {
      currentDate = formatDate(request.updatedAt);
    }

    // Add current status as first item (latest)
    timelineItems.push({
      title: currentConfig.title,
      description: request.documentStatus === "REJECTED" && request.rejectionReason
        ? request.rejectionReason
        : currentConfig.description,
      date: currentDate,
      icon: <CurrentIcon className="h-4 w-4" />,
      isDone: false,
      isActive: true,
    });

    // Add historical statuses in reverse chronological order
    const historicalStatuses: Array<{
      status: TestRequestDocumentStatus;
      date: Date | string | null | undefined;
      description?: string;
    }> = [];

    // Add creation/submission
    if (request.documentStatus !== "DRAFT" && request.createdAt) {
      historicalStatuses.push({
        status: "SUBMITTED",
        date: request.createdAt,
      });
    }

    // Sort by date (most recent first, excluding current status)
    historicalStatuses.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });

    // Add historical items
    historicalStatuses.forEach((item) => {
      const config = statusConfig[item.status];
      const Icon = config.icon;
      
      timelineItems.push({
        title: config.title,
        description: item.description || config.description,
        date: formatDate(item.date),
        icon: <Icon className="h-4 w-4" />,
        isDone: true,
        isActive: false,
      });
    });
  }

  return <Timeline items={timelineItems} />;
}
