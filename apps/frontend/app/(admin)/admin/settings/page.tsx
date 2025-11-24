"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Save, Building2, Mail, FlaskRound, Users } from "lucide-react";

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  // Placeholder state for settings
  const [generalSettings, setGeneralSettings] = useState({
    companyName: "Star-Lab Laboratory",
    companyEmail: "contact@star-lab.com",
    companyPhone: "+66 2 123 4567",
    companyAddress: "123 Laboratory Street, Bangkok, Thailand",
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "",
    enableEmailNotifications: true,
  });

  const [labSettings, setLabSettings] = useState({
    defaultTurnaroundTime: "3",
    maxSamplesPerRequest: "50",
    requireDoctorApproval: true,
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Settings saved successfully");
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground mt-1">Manage system-wide configuration and preferences</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="general">
            <Building2 className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="lab">
            <FlaskRound className="h-4 w-4 mr-2" />
            Lab
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Basic company details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={generalSettings.companyName}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, companyName: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="companyEmail">Email Address</Label>
                <Input
                  id="companyEmail"
                  type="email"
                  value={generalSettings.companyEmail}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, companyEmail: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="companyPhone">Phone Number</Label>
                <Input
                  id="companyPhone"
                  value={generalSettings.companyPhone}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, companyPhone: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="companyAddress">Address</Label>
                <Input
                  id="companyAddress"
                  value={generalSettings.companyAddress}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, companyAddress: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SMTP Configuration</CardTitle>
              <CardDescription>Configure email server settings for sending notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send automated email notifications to users</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={emailSettings.enableEmailNotifications}
                  onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, enableEmailNotifications: checked })}
                />
              </div>
              <Separator />
              <div className="grid gap-2">
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input
                  id="smtpHost"
                  value={emailSettings.smtpHost}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input
                  id="smtpPort"
                  value={emailSettings.smtpPort}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="smtpUser">SMTP Username</Label>
                <Input
                  id="smtpUser"
                  type="email"
                  value={emailSettings.smtpUser}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtpUser: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lab Settings */}
        <TabsContent value="lab" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Laboratory Configuration</CardTitle>
              <CardDescription>Configure laboratory operations and workflow settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="turnaroundTime">Default Turnaround Time (days)</Label>
                <Input
                  id="turnaroundTime"
                  type="number"
                  value={labSettings.defaultTurnaroundTime}
                  onChange={(e) => setLabSettings({ ...labSettings, defaultTurnaroundTime: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="maxSamples">Maximum Samples Per Request</Label>
                <Input
                  id="maxSamples"
                  type="number"
                  value={labSettings.maxSamplesPerRequest}
                  onChange={(e) => setLabSettings({ ...labSettings, maxSamplesPerRequest: e.target.value })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="doctorApproval">Require Doctor Approval</Label>
                  <p className="text-sm text-muted-foreground">Results must be approved by a doctor before release</p>
                </div>
                <Switch
                  id="doctorApproval"
                  checked={labSettings.requireDoctorApproval}
                  onCheckedChange={(checked) => setLabSettings({ ...labSettings, requireDoctorApproval: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Settings */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management Settings</CardTitle>
              <CardDescription>Configure default user roles and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <h4 className="font-medium mb-2">Default Role Permissions</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure which roles have access to specific features
                </p>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label className="font-normal">Customers can view lab results</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="font-normal">Technicians can assign tests</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="font-normal">Doctors can reject results</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
