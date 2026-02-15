import { useGetOwners } from "../../hooks/admin/GetOwnersHook"
export default function SuperDashboard() {
    const { data, isLoading, isFetching } = useGetOwners()
    console.log(data, "data")
    return (
        <>
            <div className="w-full flex justify-center items-center">
                <h1 className="text-gray-500 uppercase">Super Admin Dashboard</h1>
            </div>

            <div className="p-6">
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">

                        {/* Table Head */}
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                    Total Employees
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody>
                            {
                                data?.map((item) => {
                                    return (
                                        <>
                                            <tr className="border-t hover:bg-gray-50">
                                                <td className="px-6 py-4">{item?.name}</td>
                                                <td className="px-6 py-4">{item?.empl_count}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-600">
                                                        {item?.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 space-x-2">
                                                    <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                                                        Edit
                                                    </button>
                                                    <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        </>
                                    )
                                })
                            }
                        </tbody>

                    </table>
                </div>
            </div>

        </>
    )
}