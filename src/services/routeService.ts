import { addCity, editCity, removeCity } from "@/api/cityApi";
import { getAllRoute } from "@/api/routeApi";
import { CityInfo } from "@/types/city.types";
import { CustomError } from "@/types/error.types";
import { notification } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";

const useRouteService = () => {
  const queryClient = useQueryClient();

  const fetchRoutes = async (page: number) => {
    const res = await getAllRoute(page);
    const { data, headers } = res;
    const pagination = JSON.parse(headers["x-pagination"]);
    const totalCount = pagination.TotalCount;
    return { data, totalCount };
  };

  // const getInfoPostDetail = async (postId: string) => {
  //   const res = await getDetailPost(postId);
  //   return res.data.postInfo;
  // };

  const deleteCity = async (cityId: number) => {
    await removeCity(cityId);
    return cityId;
  };

  const addNewCity = async (formValues: CityInfo) => {
    await addCity(formValues);
  };

  const updateCity = async (formValues: CityInfo) => {
    await editCity(formValues);
  };

  const { data: routesData, isLoading: isFetching } = useQuery(
    ["routes", 1],
    () => fetchRoutes(1),
    {
      retry: 3,
      retryDelay: 5000,
    },
  );

  const addNewCityMutation = useMutation(addNewCity, {
    onSuccess: () => {
      notification.success({
        message: "Tạo thành công",
        description: "Tạo thành phố thành công",
        duration: 2,
      });
      queryClient.invalidateQueries("cities");
    },
    onError: (err: CustomError) => {
      notification.error({
        message: "Tạo thất bại",
        description: `${err?.response?.data?.message}`,
        duration: 2,
      });
    },
  });

  const deleteCityMutation = useMutation(deleteCity, {
    onSuccess: () => {
      notification.success({
        message: "Xóa thành công",
        description: "Xóa thành phố thành công",
        duration: 2,
      });
      queryClient.invalidateQueries("cities");
    },
    onError: (err: CustomError) => {
      notification.error({
        message: "Xóa thất bại",
        description: `${err?.response?.data?.message}`,
        duration: 2,
      });
    },
  });

  const updateCityMutation = useMutation(updateCity, {
    onSuccess: () => {
      notification.success({
        message: "Chỉnh sửa thành công",
        description: "Chỉnh sửa thành phố thành công",
        duration: 2,
      });
      queryClient.invalidateQueries("cities");
    },
    onError: (err: CustomError) => {
      console.error("Xóa thành công", err);
      notification.error({
        message: "Update Failed",
        description: `${err?.response?.data?.message}`,
        duration: 2,
      });
    },
  });

  const addNewCityItem = async (formValues: CityInfo) => {
    await addNewCityMutation.mutateAsync(formValues);
  };

  const deleteCityItem = async (cityId: number) => {
    await deleteCityMutation.mutateAsync(cityId);
  };

  const updateCityItem = async (formValues: CityInfo) => {
    await updateCityMutation.mutateAsync(formValues);
  };

  const routes = routesData?.data || [];
  const totalCount = routesData?.totalCount || 0;

  return {
    isFetching,
    routes,
    totalCount,
    deleteCityItem,
    addNewCityItem,
    updateCityItem,
  };
};

export default useRouteService;