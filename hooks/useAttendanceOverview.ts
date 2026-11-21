import useSWR from "swr";

export function useAttendanceOverview() {
  const { data, error, isLoading } = useSWR("/api/attendance/overview");

  return {
    data: data || {
      totalStudents: 0,
      present: 0,
      absent: 0,
      leave: 0,
      od: 0,
    },
    isLoading,
    isError: error,
  };
}
