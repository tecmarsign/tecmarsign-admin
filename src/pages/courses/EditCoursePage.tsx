import { useState, useEffect } from "react";
import { useOne, useUpdate } from "@refinedev/core";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, BookOpen } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";

interface Course {
  id: string;
  title: string;
  description: string | null;
  category: string;
  thumbnail_url: string | null;
  is_published: boolean;
}

const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  category: z.enum(["tech", "marketing", "design"]),
  thumbnail_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  is_published: z.boolean(),
});

type CourseFormData = z.infer<typeof courseSchema>;

export default function EditCoursePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    description: "",
    category: "tech",
    thumbnail_url: "",
    is_published: false,
  });
  const [error, setError] = useState<string | null>(null);

  const { query } = useOne<Course>({
    resource: "courses",
    id: id!,
  });

  const { data: courseData, isLoading: isLoadingCourse } = query;

  const { mutate: updateCourse, mutation } = useUpdate();

  // Populate form when course data loads
  useEffect(() => {
    if (courseData?.data) {
      const course = courseData.data;
      setFormData({
        title: course.title,
        description: course.description || "",
        category: course.category as "tech" | "marketing" | "design",
        thumbnail_url: course.thumbnail_url || "",
        is_published: course.is_published,
      });
    }
  }, [courseData]);

  const handleChange = (field: keyof CourseFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate form
    const result = courseSchema.safeParse(formData);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    updateCourse(
      {
        resource: "courses",
        id: id!,
        values: {
          title: formData.title,
          description: formData.description || null,
          category: formData.category,
          thumbnail_url: formData.thumbnail_url || null,
          is_published: formData.is_published,
        },
      },
      {
        onSuccess: () => {
          navigate("/courses");
        },
        onError: (err: any) => {
          setError(err.message || "Failed to update course");
        },
      }
    );
  };

  const isSubmitting = mutation.isPending;

  if (isLoadingCourse) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm max-w-2xl">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <div className="grid gap-6 sm:grid-cols-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/courses")}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Edit Course</h1>
          <p className="text-muted-foreground">Update course details</p>
        </div>
      </div>

      {/* Form */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Course Details
          </CardTitle>
          <CardDescription>
            Update the course information below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/50">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Introduction to Web Development"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="bg-secondary/50 border-border/50"
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="A comprehensive course covering..."
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="bg-secondary/50 border-border/50 min-h-[100px]"
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleChange("category", value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="bg-secondary/50 border-border/50">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech">Tech</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Published Status */}
                <div className="space-y-2">
                  <Label>Publish Status</Label>
                  <div className="flex items-center gap-3 h-10">
                    <Switch
                      checked={formData.is_published}
                      onCheckedChange={(checked) => handleChange("is_published", checked)}
                      disabled={isSubmitting}
                    />
                    <span className="text-sm text-muted-foreground">
                      {formData.is_published ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Thumbnail URL */}
              <div className="space-y-2">
                <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
                <Input
                  id="thumbnail_url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.thumbnail_url}
                  onChange={(e) => handleChange("thumbnail_url", e.target.value)}
                  className="bg-secondary/50 border-border/50"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  Optional: Provide a URL to an image for the course thumbnail
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/courses")}
                disabled={isSubmitting}
                className="border-border/50"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/courses/show/${id}`)}
                disabled={isSubmitting}
                className="border-border/50"
              >
                View Course
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="gradient-primary text-primary-foreground shadow-glow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
