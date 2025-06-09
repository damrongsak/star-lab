import { NavLink } from "react-router";
import {
  FaHome,
  FaClipboardList,
  FaFileAlt,
  FaFlask,
  FaCheckCircle,
} from "react-icons/fa"; // Import icons

interface UserData {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
}

interface SidebarProps {
  data?: UserData;
}

export default function Sidebar({ data }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 shadow-md">
      <div className="p-4">
        <nav>
          <ul className="space-y-4">
            {/** If role is custormer */}
            {data?.role === "customer" && (
              <li>
                <NavLink
                  to={`/${data.role}/requests`}
                  className={({ isActive }) =>
                    `flex items-center p-2 hover:bg-gray-100 rounded ${
                      isActive ? "bg-gray-100" : ""
                    }`
                  }
                >
                  <FaHome className="mr-2 text-xl text-gray-600" />
                  <span className="text-gray-800">Document Request List</span>
                </NavLink>
              </li>
            )}
            {/** If role is customer */}
            {data?.role === "customer" && (
              <li>
                <NavLink
                  to={`/${data.role}/test`}
                  className={({ isActive }) =>
                    `flex items-center p-2 hover:bg-gray-100 rounded ${
                      isActive ? "bg-gray-100" : ""
                    }`
                  }
                >
                  <FaClipboardList className="mr-2 text-xl text-gray-600" />
                  <span className="text-gray-800">Request Test</span>
                </NavLink>
              </li>
            )}
            {/** If role is admin */}
            {data?.role === "admin" && (
              <li>
                <NavLink
                  to={`/${data.role}/prepare-document`}
                  className={({ isActive }) =>
                    `flex items-center p-2 hover:bg-gray-100 rounded ${
                      isActive ? "bg-gray-100" : ""
                    }`
                  }
                >
                  <FaFileAlt className="mr-2 text-xl text-gray-600" />
                  <span className="text-gray-800">Prepare Document</span>
                </NavLink>
              </li>
            )}
            {/** If role is admin */}
            {data?.role === "admin" && (
              <li>
                <NavLink
                  to={`/${data.role}/entry-lab-result`}
                  className={({ isActive }) =>
                    `flex items-center p-2 hover:bg-gray-100 rounded ${
                      isActive ? "bg-gray-100" : ""
                    }`
                  }
                >
                  <FaFlask className="mr-2 text-xl text-gray-600" />
                  <span className="text-gray-800">Entry Lab Result</span>
                </NavLink>
              </li>
            )}
            {/** If role is doctor */}
            {data?.role === "admin" && (
              <li>
                <NavLink
                  to={`/${data.role}/approval`}
                  className={({ isActive }) =>
                    `flex items-center p-2 hover:bg-gray-100 rounded ${
                      isActive ? "bg-gray-100" : ""
                    }`
                  }
                >
                  <FaCheckCircle className="mr-2 text-xl text-gray-600" />
                  <span className="text-gray-800">Approval</span>
                </NavLink>
              </li>
            )}
            {/* Add more menu items */}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
