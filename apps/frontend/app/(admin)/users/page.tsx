"use client";

import { useState, useMemo } from "react";
import { useDebounce } from "use-debounce";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define user type
type UserRole = "CUSTOMER" | "TECHNICIAN" | "DOCTOR" | "LAB_ADMIN" | "ADMIN" | "APPROVAL";
type UserStatus = "Active" | "Inactive";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

// Placeholder data
const placeholderUsers: User[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "CUSTOMER", status: "Active" },
  { id: "2", name: "Bob Smith", email: "bob@lab.com", role: "TECHNICIAN", status: "Active" },
  { id: "3", name: "Dr. Carol White", email: "carol@hospital.com", role: "DOCTOR", status: "Active" },
  { id: "4", name: "Dave Admin", email: "dave@admin.com", role: "ADMIN", status: "Active" },
  { id: "5", name: "Eve Manager", email: "eve@lab.com", role: "LAB_ADMIN", status: "Active" },
  { id: "6", name: "Frank Approver", email: "frank@finance.com", role: "APPROVAL", status: "Active" },
  { id: "7", name: "Grace Lee", email: "grace@example.com", role: "CUSTOMER", status: "Inactive" },
  { id: "8", name: "Henry Ford", email: "henry@lab.com", role: "TECHNICIAN", status: "Active" },
  { id: "9", name: "Dr. Ian Black", email: "ian@hospital.com", role: "DOCTOR", status: "Inactive" },
  { id: "10", name: "Jane Doe", email: "jane@example.com", role: "CUSTOMER", status: "Active" },
];

const roleColors: Record<UserRole, "default" | "secondary" | "destructive" | "outline"> = {
  CUSTOMER: "secondary",
  TECHNICIAN: "default",
  DOCTOR: "outline",
  LAB_ADMIN: "default",
  ADMIN: "destructive",
  APPROVAL: "outline",
};

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 300);
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Filter users
  const filteredUsers = useMemo(() => {
    return placeholderUsers.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [debouncedSearch, roleFilter]);

  const handleDelete = () => {
    console.log("Deleting user:", selectedUser?.id);
    setIsDeleteOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add New User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground">User form placeholder</p>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value="CUSTOMER">Customer</SelectItem>
                <SelectItem value="TECHNICIAN">Technician</SelectItem>
                <SelectItem value="DOCTOR">Doctor</SelectItem>
                <SelectItem value="LAB_ADMIN">Lab Admin</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="APPROVAL">Approval</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={roleColors[user.role]}>{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === "Active" ? "default" : "secondary"} className={user.status === "Active" ? "bg-green-500 hover:bg-green-600" : ""}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" title="Edit">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete"
                            className="text-destructive hover:text-destructive/90"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsDeleteOpen(true);
                            }}
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
        </CardContent>
      </Card>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the user
              account for <span className="font-bold">{selectedUser?.name}</span>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
