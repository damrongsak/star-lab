import { useState } from "react";

interface RegisterProps {
  data: any;
}

export function Register() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">ลงทะเบียนใช้งาน</h2>
      {/* Company Information */}
      <div className="mb-8 p-6 bg-white rounded shadow">
        <h3 className="text-lg font-semibold mb-4">ข้อมูลบริษัท</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ชื่อบริษัท (อังกฤษ) *
            </label>
            <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              defaultValue="AFTER LAB COMPANY LIMITED"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ชื่อบริษัท (ไทย) *
            </label>
            <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              defaultValue="AFTER LAB COMPANY LIMITED"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              เลขทะเบียนนิติบุคคล *
            </label>
            <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              defaultValue="0135556013461"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            แนบไฟล์ ภพ.20
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4V12a4 4 0 014-4h16m32-4l-3.172 3.172a4 4 0 01-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L40 20"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>วางไฟล์ลงในกรอบ หรือคลิก Add file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">Add file</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Information */}
      <div className="mb-8 p-6 bg-white rounded shadow">
        <h3 className="text-lg font-semibold mb-4">ข้อมูลผู้ปฏิบัติงาน</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              รหัสบัตรประชาชน *
            </label>
            <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              defaultValue="0135556013461"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ตำแหน่ง *
            </label>
            <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
              <option>admin</option>
              <option>user</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              อีเมล *
            </label>
            <input
              type="email"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              defaultValue="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              เบอร์โทรศัพท์ *
            </label>
            <input
              type="tel"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              defaultValue="081-123-4567"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            แนบไฟล์สำเนาบัตรประชาชน
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4V12a4 4 0 014-4h16m32-4l-3.172 3.172a4 4 0 01-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L40 20"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="user-file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>วางไฟล์ลงในกรอบ หรือคลิก Add file</span>
                  <input
                    id="user-file-upload"
                    name="user-file-upload"
                    type="file"
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">Add file</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="mb-8 p-6 bg-white rounded shadow">
        <h3 className="text-lg font-semibold mb-4">
          ที่อยู่ในการจัดส่งใบเสร็จ
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            ที่อยู่ อาคาร / ชั้น / เลขที่ *
          </label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            defaultValue="100/75 หมู่ที่ 2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              จังหวัด *
            </label>
            <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
              <option>ปทุมธานี</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              อำเภอ / แขวง *
            </label>
            <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
              <option>อำเภอเมืองปทุมธานี</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ตำบล / เขต *
            </label>
            <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
              <option>หลักหก</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              รหัสไปรษณีย์ *
            </label>
            <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              defaultValue="12000"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              เบอร์โทรศัพท์
            </label>
            <input
              type="tel"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              defaultValue="02-222-1234"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              เบอร์โทรสาร
            </label>
            <input
              type="tel"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              defaultValue="02-222-1234"
            />
          </div>
        </div>
      </div>

      {/* Register Button */}
      <div className="text-center">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          ลงทะเบียน
        </button>
      </div>
    </div>
  );
}
