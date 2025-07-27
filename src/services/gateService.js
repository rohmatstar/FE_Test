import api from "./api";

export const getGerbangs = async () => {
  const res = await api.get("/gerbangs/");
  return res.data;
};

export const createGerbang = async (payload) => {
  const res = await api.post("/gerbangs/", payload);
  return res.data;
};

export const updateGerbang = async (payload) => {
  const res = await api.put(`/gerbangs/`, payload);
  return res.data;
};

export const deleteGerbang = async (payload) => {
  const res = await api.delete(`/gerbangs/`, {
    data: {
      id: payload?.id,
      IdCabang: payload?.IdCabang,
    },
  });
  return res.data;
};

export default getGerbangs;
