// --- app/routes/test-requests.tsx ---
// Test Requests page displaying a dynamic table of test requests.
import React from "react";
import { testRequestsData } from "~/libs/mock-data"; // Import mock data from libs
import { Link } from "react-router"; // For hypothetical view details page
import { Badge } from "~/components/ui/badge"; // Using Badge component
import { Card } from "~/components/ui/card"; // Using Card component

const TestRequests: React.FC = () => {
  return (
    <section>
      <h3 className="text-3xl font-semibold" /* text color handled by body */>
        Test Requests
      </h3>
      <p className="mt-2 text-secondary">
        รายการคำขอทดสอบทั้งหมดพร้อมสถานะปัจจุบัน เพื่อการจัดการและติดตามงาน
      </p>
      <Card className="mt-6 p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="text-left font-semibold border-b border-custom bg-secondary">
                <th className="px-6 py-3">หมายเลขคำขอ</th>
                <th className="px-6 py-3">ลูกค้า</th>
                <th className="px-6 py-3">วันที่ส่งคำขอ</th>
                <th className="px-6 py-3">สถานะ</th>
                <th className="px-6 py-3 text-center">จำนวนตัวอย่าง</th>
                <th className="px-6 py-3 text-right">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y border-custom">
              {testRequestsData.map((req) => (
                <tr key={req.id} className="hover:bg-secondary/50">
                  <td className="px-6 py-4 font-medium">{req.id}</td>
                  <td className="px-6 py-4">{req.customer}</td>
                  <td className="px-6 py-4 text-secondary">{req.date}</td>
                  <td className="px-6 py-4">
                    <Badge className={req.statusColor}>
                      {req.status.replace(/_/g, " ")}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-center">{req.samples}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/test-requests/${req.id}`}
                      className="accent hover:underline text-sm font-medium"
                    >
                      ดูรายละเอียด
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
};

export default TestRequests;
