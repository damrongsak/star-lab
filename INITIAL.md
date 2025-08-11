## FEATURE:

### A. Document Request List

- **Listing & Search**: Customers can view a comprehensive list of all their submitted test requests. This list should be searchable and filterable.
- **Key Information Display**: For each request, display:
    - Request Date
    - Request Number
    - Company Name (customer's)
    - Requester (contact person at customer's company)
    - Current Document Status
- **Document Status Lifecycle (Customer View)**:
    - **Submitted**: Request has been sent to the lab.
    - **Acknowledged and Received Sample**: Lab has received the request and physical samples.
    - **Paid**: Invoice for the request has been paid by the customer.
    - **Approved**: Lab results have been approved by the doctor.
    - **Rejected**: Request or results have been rejected by the lab/doctor.
- **Actions**:
    - **View**: Open a detailed view of the request.
    - **Edit**: Modify the request (only if status is Submitted or Draft).
    - **Delete**: Remove the request (only if status is Draft or Submitted and not yet Acknowledged).
    - **Print Request Summary**: Generate a printable summary of the request.

### B. Add/Edit Requesting Test

- **Auto-Generated Request No.**: The system automatically generates a unique request number upon saving a draft or submitting the request. This number can be based on company identifier, sender details, and date.
- **Sample List Management**: A dynamic, interactive list to add, edit, or remove individual samples associated with the request.
- **Sample Details**: For each sample, capture:
    - Sample ID (customer's own identifier)
    - Sent Sample Date
    - Animal Type
    - Sample Specimen (e.g., blood, tissue)
    - Panel (of tests to be performed)
    - Method (specific analysis method)
    - Sample Quantity
- **Saving Options**:
    - **Save Draft**: Allows customers to save an incomplete request to continue working on it later. Drafts are not sent to the lab.
    - **Submit to Approval Labs**: Finalizes the request and sends it to the lab for processing. This action changes the request status from Draft or Submitted (if editing) to Submitted for the lab.

## EXAMPLES:

> "Read and explain the code in the `examples/` folder."

## DOCUMENTATION:

- **React-router Documentation**: [React Router Official Docs](https://reactrouter.com/7.8.0/home)
- **React Documentation**: [React Official Docs](https://reactjs.org/docs/getting-started.html)
- **TypeScript Documentation**: [TypeScript Official Docs](https://www.typescriptlang.org/docs/)
- **Tailwind CSS Documentation**: [Tailwind CSS Official Docs](https://tailwindcss.com/docs)
- **Prisma Documentation**: [Prisma Official Docs](https://www.prisma.io/docs/)
- **Zod Documentation**: [Zod Official Docs](https://zod.dev/)
- **NextAuth.js Documentation**: [NextAuth.js Official Docs](https://next-auth.js.org/getting-started/introduction)
- **React Hook Form Documentation**: [React Hook Form Official Docs](https://react-hook-form.com/get-started/introduction/)
- **React Query Documentation**: [React Query Official Docs](https://react-query.tanstack.com/overview)
- **Axios Documentation**: [Axios Official Docs](https://axios-http.com/docs/intro)
- **Express.js Documentation**: [Express Official Docs](https://expressjs.com/en/starter/installing.html)

## OTHER CONSIDERATIONS:

ㆍEnsure compatibility with React 19 and React Router version 7 for seamless integration and modern features.
ㆍCode Quality: Ensure all code follows clean code principles and aligns with the SOLID design
principles to maintain readability, scalability, and maintainability.
ㆍFile Size Management: Avoid bloated files - keep each file under 500 lines of code by applying
modular design and separation of concerns.
ㆍDocumentation: Include a comprehensive README.md file with clear instructions on how to
install, configure, and run the project locally to ensure smooth onboarding and setup.
