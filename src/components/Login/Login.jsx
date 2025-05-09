import axios from "axios";
import { useContext } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../providers/AuthProvider";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        "https://sugarytestapi.azurewebsites.net/AdminAccount/Login",
        {
          UserName: data.email,
          Password: data.password,
        }
      );
      console.log("Res: ", res.data);

      if (res.data.Success) {
        // save to localstorage
        localStorage.setItem("accessToken", res.data.Token);
        localStorage.setItem("refreshToken", res.data.RefreshToken);

        // set user in context
        login({ email: data.email }, res.data.Token);

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Login Successfull.",
          showConfirmButton: false,
          timer: 1500,
        });
        // redirect to home
        navigate("/");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      console.error("Error:", err.response ? err.response.data : err.message);
      setError("An error occurred");
    }
  };
  return (
    <div>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left"></div>
          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <div className="card-body text-center ">
              <p className="my-4 text-center">
                <Link className="btn btn-primary " to="/">
                  Home
                </Link>
              </p>
              <form onSubmit={handleSubmit(onSubmit)} className="card-body">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    {...register("email", { required: true })}
                    name="email"
                    placeholder="email"
                    className="input input-bordered"
                  />
                  {errors.email && (
                    <span className="text-red-600">{errors.email.message}</span>
                  )}
                </div>

                {/*  password field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    type="password"
                    {...register("password", {
                      required: true,
                    })}
                    placeholder="password"
                    className="input input-bordered"
                  />
                  {errors.password && (
                    <p className="text-red-600">{errors.password.message}</p>
                  )}

                  <label className="label">
                    <a href="#" className="label-text-alt link link-hover">
                      Forgot password?
                    </a>
                  </label>
                </div>

                <div className="form-control mt-6">
                  <input
                    className="btn btn-primary"
                    type="submit"
                    value="Login"
                  />
                </div>

                {error && <p className="text-red-600 mt-4">{error}</p>}
              </form>

              <p className="bg-error">{error}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
