"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, FileText } from "lucide-react";
import { toast } from "sonner";

/**
 * Edit Request Page
 * Redirects to view page with message that only DRAFT requests can be edited
 *
 * Note: For a full implementation, this would import and reuse the form components
 * from the new request page, pre-populated with existing data.
 */
export default function EditRequestPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking if request exists and is editable
    setTimeout(() => {
      setIsLoading(false);
      // For now, show a message that edit functionality is coming soon
      toast.info("Edit functionality will be available in the next update");
      // Redirect back to the detail view
      router.push(`/requests/${requestId}`);
    }, 1000);
  }, [requestId, router]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.push(`/requests/${requestId}`)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Request
      </Button>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Edit Functionality Coming Soon</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            The ability to edit requests is currently under development.
            You&apos;ll be able to modify DRAFT requests in the next update.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
