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
import type { TestRequest, TestRequestDocumentStatus } from "@star-lab/shared";

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
  // Build timeline from current request status
  const timelineItems: TimelineItem[] = [];

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

  return <Timeline items={timelineItems} />;
}
