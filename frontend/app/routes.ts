import {
  type RouteConfig,
  index,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about/", "routes/about.tsx"),
  route("register/", "routes/register.tsx"),
  route("login/", "routes/login.tsx"),

  // User profile management routes
  ...prefix("user", [
    index("routes/user.profile.tsx"), // User profile dashboard
    route("edit-profile/", "routes/user.edit-profile.tsx"), // Edit user profile
    route("change-password/", "routes/user.change-password.tsx"), // Change password
  ]),

  // Company profile management routes
  ...prefix("company", [
    index("routes/company.dashboard.tsx"), // Company profile dashboard
    route("edit-profile/", "routes/company.edit-profile.tsx"), // Edit company profile
    route("manage-users/", "routes/company.manage-users.tsx"), // Manage company users
    route("settings/", "routes/company.settings.tsx"), // Company settings
  ]),

  // Admin routes (for managing users and companies)
  ...prefix("admin", [
    index("routes/admin.dashboard.tsx"), // Admin dashboard
    ...prefix("users", [
      index("routes/admin.users.tsx"), // List all users
      route(":id", "routes/admin.user-details.tsx"), // View/edit a specific user
    ]),
    ...prefix("companies", [
      index("routes/admin.companies.tsx"), // List all companies
      route(":companyId", "routes/admin.company-details.tsx"), // View/edit a specific company
    ]),
    ...prefix("prepare-document", [
      index("routes/admin.requests.tsx"), // List all lab requests
      route(":requestId", "routes/admin.request-details.tsx"), // View/edit a specific lab request
    ]),
    // Add lab result
    ...prefix("entry-lab-result", [
      index("routes/admin.lab-results.tsx"), // List all lab results
      route("add-result/:requestId", "routes/admin.add-result.tsx"),
      route("result/:resultId", "routes/admin.result-details.tsx"),
    ]),
    // Doctor approve result lab docuemnt
    ...prefix("approval", [
      index("routes/approval.requests.tsx"), // List all lab requests
      route(":requestId", "routes/approval.request-details.tsx"), // View/edit a specific lab request
    ]),
  ]),

  // Public customer request lab test
  ...prefix("customer", [
    ...prefix("requests", [
      index("routes/customer.request-list.tsx"), // List all lab requests
      route("add/", "routes/customer.add-request.tsx"), // Add new lab request
      route("detail/:requestId", "routes/customer.request-detail.tsx"), // View/edit a specific lab request
      route("edit/:requestId", "routes/customer.edit-request.tsx"), // Edit lab request
    ]),
    // Add Request Test
    ...prefix("test", [
      index("routes/customer.request-test.tsx"), // List all lab requests
      route("add/:requestId", "routes/customer.add-test-result.tsx"), // Add new lab test result
      route("edit/:resultId", "routes/customer.edit-test-result.tsx"), // Edit lab test result
      route("delete/:resultId", "routes/customer.delete-test-result.tsx"), // Delete lab test result
    ]),
    // Add Sample test to request detail
    ...prefix("sample", [
      route("add-sample/:requestId", "routes/customer.add-sample.tsx"), // Add samle lab test to request detail
      route(":sampleId", "routes/customer.sample-details.tsx"), // View/Edit lab sample test
    ]),
  ]),
] satisfies RouteConfig;
