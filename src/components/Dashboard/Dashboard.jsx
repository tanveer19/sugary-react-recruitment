import React from "react";
import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { useState } from "react";
import { useEffect } from "react";
import axiosInstance from "../hooks/axiosInstance";

const Dashboard = () => {
  const { accessToken } = useContext(AuthContext);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);
      const filter = {
        skip: 0,
        Limit: 20,
        Types: [1],
      };
      const filterBase64 = btoa(JSON.stringify(filter));
      try {
        const res = await axiosInstance.get("/Materials/GetAll/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            filter: filterBase64,
          },
        });
        setMaterials(res.data.Materials || []);
      } catch (err) {
        setMaterials([]);
      }
      setLoading(false);
    };
    fetchMaterials();
  }, [accessToken]);
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Materials</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {materials.map((item) => (
            <div key={item.Id} className="border rounded shadow">
              <img
                src={`https://d1wh1xji6f82aw.cloudfront.net/${item.CoverPhoto}`}
                alt={item.title}
                className="w-full h-40 object-cover mb-2"
              />
              <h3 className="font-semibold">{item.Title}</h3>
              <p className="text-sm">{item.BrandName}</p>
              <p className="font-bold">{item.SalesPriceInUsd.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
