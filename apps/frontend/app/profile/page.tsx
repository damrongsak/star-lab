"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Save, X, Key } from "lucide-react";
import { toast } from "sonner";
import { useProfile, useUpdateProfile, useChangePassword, UpdateProfileData } from "@/lib/hooks/useProfile";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Profile Page
 * Display and edit customer profile information
 */
export default function ProfilePage() {
  const { data: profile, isLoading, error } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Local state for editing
  const [editedProfile, setEditedProfile] = useState<UpdateProfileData>({});

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Initialize edited profile when entering edit mode
  useEffect(() => {
    if (isEditing && profile) {
      setEditedProfile({
        companyNameEn: profile.companyNameEn,
        companyNameTh: profile.companyNameTh,
        companyPhone: profile.companyPhone,
        companyFax: profile.companyFax,
        companyAddressLine1: profile.companyAddressLine1,
        companyProvince: profile.companyProvince,
        companyDistrict: profile.companyDistrict,
        companySubDistrict: profile.companySubDistrict,
        companyZipCode: profile.companyZipCode,
        operatorPrefix: profile.operatorPrefix,
        operatorFirstName: profile.operatorFirstName,
        operatorLastName: profile.operatorLastName,
        operatorMobilePhone: profile.operatorMobilePhone,
        operatorPhone: profile.operatorPhone,
        companyDescription: profile.companyDescription,
      });
    }
  }, [isEditing, profile]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile({});
  };

  const handleSave = () => {
    updateProfileMutation.mutate(editedProfile, {
      onSuccess: () => {
        setIsEditing(false);
      }
    });
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    
    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    }, {
      onSuccess: () => {
        setIsChangingPassword(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if (error) {
    console.error("Error loading profile:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return (
      <div className="p-8 text-center text-red-500">
        <p>Error loading profile. Please try again later.</p>
        <p className="text-sm text-muted-foreground mt-2">{errorMessage}</p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your company information and account settings
          </p>
        </div>
        {!isEditing && (
          <Button onClick={handleEdit}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>
            Your registered company details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="companyNameEn">Company Name (English)</Label>
              {isEditing ? (
                <Input
                  id="companyNameEn"
                  value={editedProfile.companyNameEn || ""}
                  onChange={(e) =>
                    setEditedProfile({ ...editedProfile, companyNameEn: e.target.value })
                  }
                />
              ) : (
                <p className="text-sm">{profile.companyNameEn}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyNameTh">Company Name (Thai)</Label>
              {isEditing ? (
                <Input
                  id="companyNameTh"
                  value={editedProfile.companyNameTh || ""}
                  onChange={(e) =>
                    setEditedProfile({ ...editedProfile, companyNameTh: e.target.value })
                  }
                />
              ) : (
                <p className="text-sm">{profile.companyNameTh}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="legalEntityId">Legal Entity ID</Label>
              <p className="text-sm">{profile.legalEntityId}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyPhone">Company Phone</Label>
              {isEditing ? (
                <Input
                  id="companyPhone"
                  value={editedProfile.companyPhone || ""}
                  onChange={(e) =>
                    setEditedProfile({ ...editedProfile, companyPhone: e.target.value })
                  }
                />
              ) : (
                <p className="text-sm">{profile.companyPhone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyFax">Company Fax</Label>
              {isEditing ? (
                <Input
                  id="companyFax"
                  value={editedProfile.companyFax || ""}
                  onChange={(e) =>
                    setEditedProfile({ ...editedProfile, companyFax: e.target.value })
                  }
                />
              ) : (
                <p className="text-sm">{profile.companyFax || "-"}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyDescription">Company Description</Label>
            {isEditing ? (
              <Textarea
                id="companyDescription"
                value={editedProfile.companyDescription || ""}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, companyDescription: e.target.value })
                }
                rows={3}
              />
            ) : (
              <p className="text-sm">{profile.companyDescription || "-"}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Company Address */}
      <Card>
        <CardHeader>
          <CardTitle>Company Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="addressLine1">Address Line 1</Label>
            {isEditing ? (
              <Input
                id="addressLine1"
                value={editedProfile.companyAddressLine1 || ""}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, companyAddressLine1: e.target.value })
                }
              />
            ) : (
              <p className="text-sm">{profile.companyAddressLine1}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="province">Province</Label>
              {isEditing ? (
                <Input
                  id="province"
                  value={editedProfile.companyProvince || ""}
                  onChange={(e) =>
                    setEditedProfile({ ...editedProfile, companyProvince: e.target.value })
                  }
                />
              ) : (
                <p className="text-sm">{profile.companyProvince}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="district">District</Label>
              {isEditing ? (
                <Input
                  id="district"
                  value={editedProfile.companyDistrict || ""}
                  onChange={(e) =>
                    setEditedProfile({ ...editedProfile, companyDistrict: e.target.value })
                  }
                />
              ) : (
                <p className="text-sm">{profile.companyDistrict}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subDistrict">Sub-District</Label>
              {isEditing ? (
                <Input
                  id="subDistrict"
                  value={editedProfile.companySubDistrict || ""}
                  onChange={(e) =>
                    setEditedProfile({ ...editedProfile, companySubDistrict: e.target.value })
                  }
                />
              ) : (
                <p className="text-sm">{profile.companySubDistrict}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code</Label>
              {isEditing ? (
                <Input
                  id="zipCode"
                  value={editedProfile.companyZipCode || ""}
                  onChange={(e) =>
                    setEditedProfile({ ...editedProfile, companyZipCode: e.target.value })
                  }
                />
              ) : (
                <p className="text-sm">{profile.companyZipCode}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operator Information */}
      <Card>
        <CardHeader>
          <CardTitle>Operator Information</CardTitle>
          <CardDescription>Primary contact person details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="operatorPrefix">Prefix</Label>
              {isEditing ? (
                <Input
                  id="operatorPrefix"
                  value={editedProfile.operatorPrefix || ""}
                  onChange={(e) =>
                    setEditedProfile({ ...editedProfile, operatorPrefix: e.target.value })
                  }
                />
              ) : (
                <p className="text-sm">{profile.operatorPrefix}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="operatorFirstName">First Name</Label>
              {isEditing ? (
                <Input
                  id="operatorFirstName"
                  value={editedProfile.operatorFirstName || ""}
                  onChange={(e) =>
                    setEditedProfile({ ...editedProfile, operatorFirstName: e.target.value })
                  }
                />
              ) : (
                <p className="text-sm">{profile.operatorFirstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="operatorLastName">Last Name</Label>
              {isEditing ? (
                <Input
                  id="operatorLastName"
                  value={editedProfile.operatorLastName || ""}
                  onChange={(e) =>
                    setEditedProfile({ ...editedProfile, operatorLastName: e.target.value })
                  }
                />
              ) : (
                <p className="text-sm">{profile.operatorLastName}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="operatorMobilePhone">Mobile Phone</Label>
              {isEditing ? (
                <Input
                  id="operatorMobilePhone"
                  value={editedProfile.operatorMobilePhone || ""}
                  onChange={(e) =>
                    setEditedProfile({ ...editedProfile, operatorMobilePhone: e.target.value })
                  }
                />
              ) : (
                <p className="text-sm">{profile.operatorMobilePhone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="operatorPhone">Phone</Label>
              {isEditing ? (
                <Input
                  id="operatorPhone"
                  value={editedProfile.operatorPhone || ""}
                  onChange={(e) =>
                    setEditedProfile({ ...editedProfile, operatorPhone: e.target.value })
                  }
                />
              ) : (
                <p className="text-sm">{profile.operatorPhone || "-"}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>Manage your password and security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isChangingPassword ? (
            <Button variant="outline" onClick={() => setIsChangingPassword(true)}>
              <Key className="mr-2 h-4 w-4" />
              Change Password
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleChangePassword} disabled={changePasswordMutation.isPending}>
                  <Save className="mr-2 h-4 w-4" />
                  {changePasswordMutation.isPending ? "Updating..." : "Update Password"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save/Cancel Buttons */}
      {isEditing && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={updateProfileMutation.isPending}>
            <Save className="mr-2 h-4 w-4" />
            {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  );
}