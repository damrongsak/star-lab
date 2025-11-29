import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Project } from "@star-lab/shared";
import { useCreateProject, useUpdateProject } from "@/lib/hooks/useProjects";

const formSchema = z.object({
  projectCode: z.string().min(1, "Project code is required"),
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null;
}

export function ProjectFormDialog({
  open,
  onOpenChange,
  project,
}: ProjectFormDialogProps) {
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectCode: "",
      name: "",
      description: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (project) {
      form.reset({
        projectCode: project.projectCode,
        name: project.name,
        description: project.description || "",
        isActive: project.isActive,
      });
    } else {
      form.reset({
        projectCode: "",
        name: "",
        description: "",
        isActive: true,
      });
    }
  }, [project, form, open]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (project) {
        await updateProject.mutateAsync({
          id: project.id,
          data: {
            name: values.name,
            description: values.description,
            isActive: values.isActive,
          },
        });
      } else {
        await createProject.mutateAsync({
          projectCode: values.projectCode,
          name: values.name,
          description: values.description,
        });
      }
      onOpenChange(false);
    } catch {
      // Error is handled by the mutation hook
    }
  };

  const isSubmitting = createProject.isPending || updateProject.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {project ? "Edit Project" : "Create New Project"}
          </DialogTitle>
          <DialogDescription>
            {project
              ? "Update project details below."
              : "Enter the details for your new project."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="projectCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. PROJ-001"
                      {...field}
                      disabled={!!project}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Q3 Research" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Optional description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {project && (
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Active Status</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : project
                  ? "Update Project"
                  : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
