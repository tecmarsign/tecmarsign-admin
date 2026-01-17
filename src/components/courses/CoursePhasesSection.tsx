import { useState } from "react";
import { useList, useCreate, useUpdate, useDelete } from "@refinedev/core";
import { Plus, Pencil, Trash2, Layers, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { EmptyState } from "@/components/ui/empty-state";

interface CoursePhase {
  id: string;
  course_id: string;
  phase_number: number;
  name: string;
  duration_weeks: number;
  price: number;
}

interface CoursePhasesProps {
  courseId: string;
}

interface PhaseFormData {
  phase_number: number;
  name: string;
  duration_weeks: number;
  price: number;
}

export function CoursePhasesSection({ courseId }: CoursePhasesProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPhase, setEditingPhase] = useState<CoursePhase | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PhaseFormData>({
    phase_number: 1,
    name: "",
    duration_weeks: 4,
    price: 0,
  });

  const { query } = useList<CoursePhase>({
    resource: "course_phases",
    filters: [{ field: "course_id", operator: "eq", value: courseId }],
    sorters: [{ field: "phase_number", order: "asc" }],
  });

  const { data, isLoading, refetch } = query;
  const phases = data?.data ?? [];

  const { mutate: createPhase, mutation: createMutation } = useCreate();
  const { mutate: updatePhase, mutation: updateMutation } = useUpdate();
  const { mutate: deletePhase, mutation: deleteMutation } = useDelete();

  const handleOpenDialog = (phase?: CoursePhase) => {
    if (phase) {
      setEditingPhase(phase);
      setFormData({
        phase_number: phase.phase_number,
        name: phase.name,
        duration_weeks: phase.duration_weeks,
        price: phase.price,
      });
    } else {
      setEditingPhase(null);
      setFormData({
        phase_number: phases.length + 1,
        name: "",
        duration_weeks: 4,
        price: 0,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPhase(null);
    setFormData({
      phase_number: 1,
      name: "",
      duration_weeks: 4,
      price: 0,
    });
  };

  const handleChange = (field: keyof PhaseFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (editingPhase) {
      updatePhase(
        {
          resource: "course_phases",
          id: editingPhase.id,
          values: formData,
        },
        {
          onSuccess: () => {
            handleCloseDialog();
            refetch();
          },
        }
      );
    } else {
      createPhase(
        {
          resource: "course_phases",
          values: {
            ...formData,
            course_id: courseId,
          },
        },
        {
          onSuccess: () => {
            handleCloseDialog();
            refetch();
          },
        }
      );
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deletePhase(
        { resource: "course_phases", id: deleteId },
        {
          onSuccess: () => {
            setDeleteId(null);
            refetch();
          },
        }
      );
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(price);
  };

  return (
    <>
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Layers className="h-5 w-5 text-primary" />
              Course Phases
            </CardTitle>
            <Button
              onClick={() => handleOpenDialog()}
              size="sm"
              className="gradient-primary text-primary-foreground shadow-glow-sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Phase
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton columns={5} rows={3} />
          ) : phases.length === 0 ? (
            <EmptyState
              icon={Layers}
              title="No phases yet"
              description="Add phases to structure your course content and pricing."
              actionLabel="Add Phase"
              onAction={() => handleOpenDialog()}
            />
          ) : (
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="w-[80px]">Phase</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {phases.map((phase) => (
                    <TableRow
                      key={phase.id}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      <TableCell>
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary/20 text-primary font-semibold text-sm">
                          {phase.phase_number}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{phase.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {phase.duration_weeks} {phase.duration_weeks === 1 ? "week" : "weeks"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatPrice(phase.price)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleOpenDialog(phase)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(phase.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Phase Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-strong border-border/50 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingPhase ? "Edit Phase" : "Add Phase"}
            </DialogTitle>
            <DialogDescription>
              {editingPhase
                ? "Update the phase details below."
                : "Fill in the details for the new phase."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phase_number">Phase Number</Label>
                <Input
                  id="phase_number"
                  type="number"
                  min={1}
                  value={formData.phase_number}
                  onChange={(e) => handleChange("phase_number", parseInt(e.target.value))}
                  className="bg-secondary/50 border-border/50"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration_weeks">Duration (weeks)</Label>
                <Input
                  id="duration_weeks"
                  type="number"
                  min={1}
                  value={formData.duration_weeks}
                  onChange={(e) => handleChange("duration_weeks", parseInt(e.target.value))}
                  className="bg-secondary/50 border-border/50"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Phase Name</Label>
              <Input
                id="name"
                placeholder="e.g., Fundamentals"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="bg-secondary/50 border-border/50"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (KES)</Label>
              <Input
                id="price"
                type="number"
                min={0}
                step={100}
                value={formData.price}
                onChange={(e) => handleChange("price", parseFloat(e.target.value))}
                className="bg-secondary/50 border-border/50"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseDialog}
              disabled={isSubmitting}
              className="border-border/50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.name}
              className="gradient-primary text-primary-foreground shadow-glow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingPhase ? "Saving..." : "Adding..."}
                </>
              ) : editingPhase ? (
                "Save Changes"
              ) : (
                "Add Phase"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="glass-strong border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Phase</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this phase? This action cannot be
              undone and may affect existing enrollments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border/50">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
