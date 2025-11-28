import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";

const customerSchema = z.object({
  companyNameEn: z.string().min(1, "Company Name (EN) is required"),
  companyNameTh: z.string().min(1, "Company Name (TH) is required"),
  companyPhone: z.string().min(1, "Company Phone is required"),
  companyFax: z.string().optional(),
  companyAddressLine1: z.string().min(1, "Address is required"),
  companyProvince: z.string().min(1, "Province is required"),
  companyDistrict: z.string().min(1, "District is required"),
  companySubDistrict: z.string().min(1, "Sub-district is required"),
  companyZipCode: z.string().min(1, "Zip Code is required"),
  operatorFirstName: z.string().min(1, "Operator First Name is required"),
  operatorLastName: z.string().min(1, "Operator Last Name is required"),
  operatorMobilePhone: z.string().min(1, "Operator Mobile is required"),
  operatorPhone: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string | null;
  mode: "edit" | "view";
  onSuccess: () => void;
}

export function CustomerFormDialog({
  open,
  onOpenChange,
  customerId,
  mode,
  onSuccess,
}: CustomerFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      companyNameEn: "",
      companyNameTh: "",
      companyPhone: "",
      companyFax: "",
      companyAddressLine1: "",
      companyProvince: "",
      companyDistrict: "",
      companySubDistrict: "",
      companyZipCode: "",
      operatorFirstName: "",
      operatorLastName: "",
      operatorMobilePhone: "",
      operatorPhone: "",
    },
  });

  useEffect(() => {
    if (open && customerId) {
      setIsFetching(true);
      apiClient
        .get(`/admin/customers/${customerId}`)
        .then((res) => {
          const customer = res.data.customer;
          form.reset({
            companyNameEn: customer.companyNameEn,
            companyNameTh: customer.companyNameTh,
            companyPhone: customer.companyPhone,
            companyFax: customer.companyFax || "",
            companyAddressLine1: customer.companyAddressLine1,
            companyProvince: customer.companyProvince,
            companyDistrict: customer.companyDistrict,
            companySubDistrict: customer.companySubDistrict,
            companyZipCode: customer.companyZipCode,
            operatorFirstName: customer.operatorFirstName,
            operatorLastName: customer.operatorLastName,
            operatorMobilePhone: customer.operatorMobilePhone,
            operatorPhone: customer.operatorPhone || "",
          });
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to load customer details");
          onOpenChange(false);
        })
        .finally(() => setIsFetching(false));
    } else {
      form.reset();
    }
  }, [open, customerId, form, onOpenChange]);

  const onSubmit = async (data: CustomerFormValues) => {
    if (mode === "view") return;

    setIsLoading(true);
    try {
      await apiClient.put(`/admin/customers/${customerId}`, data);
      toast.success("Customer updated successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update customer");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Customer" : "Customer Details"}
          </DialogTitle>
        </DialogHeader>

        {isFetching ? (
          <div className="p-8 text-center">Loading...</div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Company Info */}
                <div className="col-span-2 font-semibold text-lg border-b pb-2 mt-2">
                  Company Information
                </div>
                
                <FormField
                  control={form.control}
                  name="companyNameEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name (EN)</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={mode === "view"} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyNameTh"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name (TH)</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={mode === "view"} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={mode === "view"} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyFax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fax</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={mode === "view"} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Address */}
                <div className="col-span-2 font-semibold text-lg border-b pb-2 mt-4">
                  Address
                </div>

                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="companyAddressLine1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 1</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={mode === "view"} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="companySubDistrict"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sub-district</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={mode === "view"} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyDistrict"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>District</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={mode === "view"} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyProvince"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Province</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={mode === "view"} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyZipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={mode === "view"} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Operator Info */}
                <div className="col-span-2 font-semibold text-lg border-b pb-2 mt-4">
                  Operator Information
                </div>

                <FormField
                  control={form.control}
                  name="operatorFirstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={mode === "view"} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="operatorLastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={mode === "view"} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="operatorMobilePhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Phone</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={mode === "view"} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="operatorPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Office Phone</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={mode === "view"} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Close
                </Button>
                {mode === "edit" && (
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                )}
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
