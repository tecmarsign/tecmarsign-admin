import { useState, useEffect } from "react";
import { useOne, useUpdate } from "@refinedev/core";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, User, Mail, Key } from "lucide-react";
import { z } from "zod";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { supabase } from "@/integrations/supabase/client";

const userSchema = z.object({
  full_name: z.string().min(3, "Full name must be at least 3 characters"),
  phone_number: z.string().regex(/^\+254\d{9}$/, "Phone must be in format +254XXXXXXXXX"),
  role: z.enum(["admin", "tutor", "student"]),
  is_active: z.boolean(),
});

interface UserData {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { query } = useOne<UserData>({
    resource: "users",
    id: id!,
  });

  const { data, isLoading, isError } = query;

  const { mutate: updateUser, mutation: updateMutation } = useUpdate();

  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    role: "student",
    is_active: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoadingCurrentUser, setIsLoadingCurrentUser] = useState(true);

  const user = data?.data;

  // Get current logged-in user to check if they're admin
  useEffect(() => {
    const getCurrentUser = async () => {
      setIsLoadingCurrentUser(true);
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data } = await supabase
          .from('users')
          .select('role')
          .eq('id', authUser.id)
          .single();
        setCurrentUser(data);
      }
      setIsLoadingCurrentUser(false);
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        phone_number: user.phone_number || "",
        role: user.role || "student",
        is_active: user.is_active ?? true,
      });
    }
  }, [user]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validate form
    const result = userSchema.safeParse(formData);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    updateUser(
      {
        resource: "users",
        id: id!,
        values: formData,
      },
      {
        onSuccess: () => {
          setSuccess(true);
        },
        onError: (err: any) => {
          setError(err.message || "Failed to update user");
        },
      }
    );
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;
    
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setError(null);
    }
  };

  // Check if current user is admin
  const isAdmin = currentUser?.role === 'admin';
  const isEditingSelf = currentUser && user && currentUser.id === user.id;

  if (isLoading || isLoadingCurrentUser) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Card className="border-border/50 bg-card/50 max-w-2xl">
          <CardContent className="pt-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate("/users")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>
        <Alert variant="destructive">
          <AlertDescription>User not found or an error occurred.</AlertDescription>
        </Alert>
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
          onClick={() => navigate("/users")}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Edit User</h1>
          <p className="text-muted-foreground">
            Last updated: {format(new Date(user.updated_at), "MMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            User Details
          </CardTitle>
          <CardDescription>
            Update the user's information below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/50">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="bg-emerald-500/10 border-emerald-500/50 text-emerald-500">
                <AlertDescription>Changes saved successfully!</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => handleChange("full_name", e.target.value)}
                  className="bg-secondary/50 border-border/50"
                  disabled={updateMutation.isPending}
                  required
                />
              </div>

              {/* Email (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    value={user.email}
                    className="bg-muted/50 border-border/50"
                    disabled
                    readOnly
                  />
                </div>
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number *</Label>
                <Input
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => handleChange("phone_number", e.target.value)}
                  className="bg-secondary/50 border-border/50"
                  disabled={updateMutation.isPending}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Kenyan format: +254XXXXXXXXX
                </p>
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleChange("role", value)}
                  disabled={updateMutation.isPending || !isAdmin}
                >
                  <SelectTrigger className="bg-secondary/50 border-border/50">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="tutor">Tutor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                {!isAdmin && (
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    ⚠️ Only admins can change user roles
                  </p>
                )}
              </div>

              {/* Active Status */}
              <div className="space-y-2">
                <Label>Active Status</Label>
                <div className="flex items-center gap-3 h-10">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleChange("is_active", checked)}
                    disabled={updateMutation.isPending || (isEditingSelf && !isAdmin)}
                  />
                  <span className="text-sm text-muted-foreground">
                    {formData.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                {isEditingSelf && !isAdmin && (
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    ⚠️ You cannot deactivate your own account
                  </p>
                )}
              </div>

              {/* Reset Password */}
              <div className="space-y-2">
                <Label>Password</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetPassword}
                  disabled={updateMutation.isPending}
                  className="w-full border-border/50"
                >
                  <Key className="mr-2 h-4 w-4" />
                  Send Password Reset Email
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/users")}
                disabled={updateMutation.isPending}
                className="border-border/50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="gradient-primary text-primary-foreground shadow-glow-sm"
              >
                {updateMutation.isPending ? (
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