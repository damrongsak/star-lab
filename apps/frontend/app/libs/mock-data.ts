// --- app/libs/mock-data.ts ---
// Centralized mock data for your application.
export interface TestRequest {
  id: string;
  customer: string;
  date: string;
  status: string;
  samples: number;
  statusColor: string;
}

export const testRequestsData: TestRequest[] = [
  {
    id: "Req-20240909-001",
    customer: "Bovogen Biologicals",
    date: "22 มิ.ย. 2568",
    status: "APPROVED",
    samples: 3,
    statusColor: "bg-green-500/20 text-green-400",
  },
  {
    id: "Req-20240909-002",
    customer: "Pharma Inc.",
    date: "21 มิ.ย. 2568",
    status: "IN_PROGRESS",
    samples: 1,
    statusColor: "bg-blue-500/20 text-blue-400",
  },
  {
    id: "Req-20240909-003",
    customer: "AgriFuture",
    date: "21 มิ.ย. 2568",
    status: "PENDING_REVIEW",
    samples: 5,
    statusColor: "bg-yellow-500/20 text-yellow-400",
  },
  {
    id: "Req-20240909-004",
    customer: "Vet Clinic Plus",
    date: "20 มิ.ย. 2568",
    status: "PENDING_PAYMENT",
    samples: 2,
    statusColor: "bg-orange-500/20 text-orange-400",
  },
  {
    id: "Req-20240909-005",
    customer: "CP Foods",
    date: "18 มิ.ย. 2568",
    status: "REJECTED",
    samples: 1,
    statusColor: "bg-red-500/20 text-red-400",
  },
  {
    id: "Req-20240909-006",
    customer: "Thai Union",
    date: "15 มิ.ย. 2568",
    status: "COMPLETED",
    samples: 8,
    statusColor: "bg-purple-500/20 text-purple-400",
  },
];

// --- app/libs/rolesPermissions.ts ---
// Placeholder for role-based permissions logic.
export const hasPermission = (
  userRole: string,
  requiredRoles: string[],
): boolean => {
  return requiredRoles.includes(userRole);
};
