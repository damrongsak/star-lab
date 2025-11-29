"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjects, useDeleteProject } from "@/lib/hooks/useProjects";
import { ProjectFormDialog } from "@/components/projects/ProjectFormDialog";
import { Project } from "@star-lab/shared";
import { format } from "date-fns";

export default function ProjectsPage() {
  const [includeInactive, setIncludeInactive] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  const { data: projects, isLoading } = useProjects(includeInactive);
  const deleteProject = useDeleteProject();

  const handleCreate = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (deletingProject) {
      await deleteProject.mutateAsync(deletingProject.id);
      setDeletingProject(null);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-2">
            Manage your projects to organize test requests.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex justify-end mb-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="include-inactive"
              checked={includeInactive}
              onCheckedChange={setIncludeInactive}
            />
            <Label htmlFor="include-inactive">Show Inactive Projects</Label>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requests</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : projects?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No projects found. Create one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                projects?.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.projectCode}</TableCell>
                    <TableCell>{project.name}</TableCell>
                    <TableCell className="max-w-xs truncate" title={project.description || ""}>
                      {project.description || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={project.isActive ? "default" : "secondary"}>
                        {project.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{project.requestCount || 0}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("th-TH", {
                        style: "currency",
                        currency: "THB",
                      }).format(project.totalAmount || 0)}
                    </TableCell>
                    <TableCell>
                      {project.createdAt ? format(new Date(project.createdAt), "dd/MM/yyyy") : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(project)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeletingProject(project)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <ProjectFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        project={editingProject}
      />

      <AlertDialog open={!!deletingProject} onOpenChange={(open) => !open && setDeletingProject(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the project &quot;{deletingProject?.name}&quot; as inactive.
              It will no longer be selectable for new requests, but existing requests will remain associated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
