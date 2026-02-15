import { useQuery } from "@tanstack/react-query";
import { getAllUsers, getOwners } from "../../services/users";

export const useGetOwners = () => {
    return useQuery({
        queryKey: ['owners'],
        queryFn: getOwners,
    });
}