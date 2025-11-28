import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LabRequestsPage from "@/app/(lab)/lab/requests/page";
import { useLabRequests } from "@/lib/hooks/useLab";

// Mock the hook
jest.mock("@/lib/hooks/useLab");

// Mock the UI components to avoid issues with their complex internal logic or missing providers
jest.mock("@/components/ui/badge", () => ({
  Badge: ({ children, className }: { children: React.ReactNode; className: string }) => (
    <span data-testid="badge" className={className}>{children}</span>
  ),
}));

jest.mock("next/link", () => {
  const MockLink = ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: any }) => (
    <a href={href} {...props}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, asChild, ...rest }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; asChild?: boolean; [key: string]: any }) => {
    if (asChild) {
      // When asChild is true, it means the child (e.g., Link) will handle the rendering
      return <>{children}</>;
    }
    return (
      <button onClick={onClick} disabled={disabled} {...rest}>{children}</button>
    );
  },
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("@/components/ui/input", () => ({
  Input: ({ value, onChange, placeholder }: { value: string; onChange: (e: any) => void; placeholder: string }) => (
    <input data-testid="search-input" value={value} onChange={onChange} placeholder={placeholder} />
  ),
}));

jest.mock("@/components/ui/select", () => ({
  Select: ({ children, onValueChange }: { children: React.ReactNode; onValueChange: (val: string) => void }) => (
    <div data-testid="select" onClick={() => onValueChange("SUBMITTED")}>{children}</div>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectValue: () => <span>Select Value</span>,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock Skeleton to avoid import issues
jest.mock("@/components/ui/skeleton", () => ({
  Skeleton: () => <div data-testid="skeleton" />,
}));

// Mock Lucide icons
jest.mock("lucide-react", () => ({
  CheckCircle2: () => <span>Icon</span>,
  Eye: () => <span>Icon</span>,
  FlaskConical: () => <span>Icon</span>,
  Search: () => <span>Icon</span>,
}));

describe("LabRequestsPage", () => {
  const mockUseLabRequests = useLabRequests as jest.Mock;

  beforeEach(() => {
    mockUseLabRequests.mockClear();
  });

  it("renders loading skeleton when data is loading", () => {
    mockUseLabRequests.mockReturnValue({
      isLoading: true,
      data: undefined,
    });

    render(<LabRequestsPage />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
  });

  it("renders empty state when no requests found", () => {
    mockUseLabRequests.mockReturnValue({
      isLoading: false,
      data: { testRequests: [], total: 0, totalPages: 0, currentPage: 1 },
    });

    render(<LabRequestsPage />);
    expect(screen.getByText("No lab requests found")).toBeInTheDocument();
  });

  it("renders table with requests and pagination", () => {
    const mockData = {
      testRequests: [
        {
          requestNo: "REQ-001",
          createdAt: new Date().toISOString(),
          status: "SUBMITTED",
          customer: { companyNameEn: "Test Company" },
          testRequestSamples: [{}, {}],
        },
      ],
      total: 15,
      totalPages: 2,
      currentPage: 1,
    };

    mockUseLabRequests.mockReturnValue({
      isLoading: false,
      data: mockData,
    });

    render(<LabRequestsPage />);

    expect(screen.getByText("REQ-001")).toBeInTheDocument();
    expect(screen.getByText("Test Company")).toBeInTheDocument();
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeEnabled();
    expect(screen.getByText("Previous")).toBeDisabled();
  });

  it("handles pagination interactions", async () => {
    const mockData = {
      testRequests: [
        {
          requestNo: "REQ-001",
          createdAt: new Date().toISOString(),
          status: "SUBMITTED",
          customer: { companyNameEn: "Test Company" },
          testRequestSamples: [],
        },
      ],
      total: 15,
      totalPages: 2,
      currentPage: 1,
    };

    mockUseLabRequests.mockReturnValue({
      isLoading: false,
      data: mockData,
    });

    render(<LabRequestsPage />);

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(mockUseLabRequests).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 }));
    });
  });

  it("updates search term and resets page", async () => {
    mockUseLabRequests.mockReturnValue({
      isLoading: false,
      data: { testRequests: [], total: 0 },
    });

    render(<LabRequestsPage />);

    const input = screen.getByTestId("search-input");
    fireEvent.change(input, { target: { value: "REQ-999" } });

    await waitFor(() => {
      expect(mockUseLabRequests).toHaveBeenLastCalledWith(expect.objectContaining({ search: "REQ-999", page: 1 }));
    });
  });
});
