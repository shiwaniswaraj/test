import axios from "axios";
import { CALL_API } from "../../config/";
import { Toast } from "native-base";

export const LOGIN = "LOGIN";
export const ERROR = "ERROR";
export const FORGOT = "FORGOT";
export const LOGOUT = "LOGOUT";
export const SUCCESS = "SUCCESS";
export const REGISTER = "REGISTER";
export const RESENDOTP = "RESENDOTP";
export const VERIFYOTP = "VERIFYOTP";
export const PROFILE = "PROFILE";
export const CHATDATA = "CHATDATA";
export const CHANGEDATA = "CHANGEDATA";
export const CHECK_EMAIL_MOBILE = "CHECK_EMAIL_MOBILE";

const notify = (message, type) => {
	Toast.show({
		text: message,
		buttonText: "Okay",
		duration: 3000,
		position: "top",
		type,
	});
};

export const logoutAction = () => {
	return async (dispatch, getState) => {
		dispatch({ type: LOGOUT });
	};
};

const checkEmail = (em) => {
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(em)) {
		return true;
	}
	return false;
};

export const CheckEmailMobile = (
	email,
	password,
	countrycode,
	phonenumber,
	token
) => {
	console.log("check email mobile");
	return async (dispatch, getState) => {
		// show loader
		dispatch({ type: "showloading", paylod: true });

		var dataToSend = new FormData();
		dataToSend.append("action", "checkemailmobile");
		dataToSend.append("email", email.toLowerCase());
		dataToSend.append("password", password);
		dataToSend.append("countrycode", countrycode);
		dataToSend.append("phonenumber", phonenumber);
		//dataToSend.append("devicetoken",token);

		return await CALL_API("post", "Customer/Checkemailmobile", dataToSend)
			.then((res) => {
				console.log("check = ", res);
				if (res.data.status == 200) {
					dispatch({ type: CHECK_EMAIL_MOBILE, paylod: dataToSend });
					notify(res.data.message, "success");
				} else {
					notify(res.data.message, "danger");
				}
				return res;
			})
			.catch((err) => {
				return err;
			})
			.finally(() => {
				dispatch({ type: "hideloading", paylod: true });
			});
	};
};

export const RegisterAction = (registerData) => {
	const {
		email,
		password,
		ccode,
		tel,
		token,
		txtcountrycode,
		fname,
		lname,
		address,
		city,
		userstate,
		pincode,
	} = registerData;

	return async (dispatch, getState) => {
		var data = new FormData();
		data.append("action", "register");
		data.append("email", email.toLowerCase());
		data.append("password", password);
		data.append("countrycode", ccode);
		data.append("phonenumber", tel);
		data.append("devicetoken", token);
		data.append("txtcountrycode", txtcountrycode);
		data.append("fname", fname);
		data.append("lname", lname);
		data.append("address", address);
		data.append("city", city);
		data.append("state", userstate);
		data.append("pincode", pincode);
		dispatch({ type: "showloading", paylod: true });

		return await CALL_API("post", "Customer/register", data)
			.then((res) => {
				if (res.data.status == 200) {
					dispatch({ type: "ErrorRegister", paylod: false });
					dispatch({ type: REGISTER, paylod: res.data });
					notify(res.data.message, "success");
				} else {
					dispatch({ type: "ErrorRegister", paylod: true });

					notify(res.data.message, "danger");
				}
				setTimeout(() => {
					dispatch({ type: "hideloading", paylod: true });
				}, 1000);
				return res;
			})
			.catch((err) => {
				dispatch({ type: "hideloading", paylod: true });
				return err;
			});
	};
};

export const VerifyOtp = (phonenumber, countrycode, otp) => {
	console.log("verify otp =", phonenumber, "  ", countrycode, "  ", otp);
	return async (dispatch, getState) => {
		var data = new FormData();
		data.append("action", "verifyotp");
		data.append("countrycode", countrycode);
		data.append("phonenumber", phonenumber);
		data.append("otp", otp);

		dispatch({ type: "showloading", paylod: true });

		return await CALL_API("post", "Customer/Verifyotp", data)
			.then((res) => {
				console.log(res);
				if (res.data.status == 200) {
					dispatch({ type: VERIFYOTP, paylod: true });
					notify(res.data.message, "success");
				} else {
					dispatch({ type: VERIFYOTP, paylod: false });
					notify(res.data.message, "danger");
				}
				setTimeout(() => {
					dispatch({ type: "hideloading", paylod: true });
				}, 1000);
				return res;
			})
			.catch((err) => {
				dispatch({ type: "hideloading", paylod: true });
				return err;
			});
	};
};

export const ResendOtp = (phonenumber, countrycode) => {
	console.log("resend = ", phonenumber, countrycode);
	return async (dispatch, getState) => {
		var data = new FormData();
		data.append("action", "resendotp");
		data.append("countrycode", countrycode);
		data.append("phonenumber", phonenumber);
		dispatch({ type: "showloading", paylod: true });
		CALL_API("post", "Customer/Resendotp", data)
			.then((res) => {
				console.log(res.data);
				if (res.data.status == 200) {
					dispatch({ type: RESENDOTP, paylod: res.data });
					notify(res.data.message, "success");
				} else {
					notify(res.data.message, "danger");
				}
				setTimeout(() => {
					dispatch({ type: "hideloading", paylod: true });
				}, 1000);
			})
			.catch((err) => {
				dispatch({ type: "hideloading", paylod: true });
			});
	};
};

export const LoginAction = (em, pass, token) => {
	return async (dispatch, getState) => {
		dispatch({ type: "showloading", paylod: true });
		var data = new FormData();
		data.append("action", "login");
		data.append("email", em);
		data.append("password", pass);
		data.append("devicetoken", token);

		return await CALL_API("post", "Customer/login", data)
			.then((res) => {
				if (res.data.status == 200) {
					dispatch({ type: LOGIN, paylod: res.data.data });
					notify(res.data.message, "success");
				} else {
					notify(res.data.message, "danger");
				}
				dispatch({ type: "hideloading", paylod: true });
				/* setTimeout(()=>{
              dispatch({type:"hideloading",paylod:true});
							},1000); */
				return res;
			})
			.catch((err) => {
				dispatch({ type: "hideloading", paylod: true });
				return err;
			});
	};
};

export const GetProfile = (id) => {
	return async (dispatch, getState) => {
		var data = new FormData();
		data.append("action", "getcustomerprofile");
		data.append("id_customer", id);
		dispatch({ type: "showloading", paylod: true });

		return await CALL_API("post", "Customer/getcustomerprofile", data)
			.then((res) => {
				if (res.data.status == 200) {
					dispatch({ type: PROFILE, paylod: res.data.data });
					notify(res.data.message, "success");
				} else {
					notify(res.data.message, "danger");
				}
				setTimeout(() => {
					dispatch({ type: "hideloading", paylod: true });
				}, 1000);
				return res;
			})
			.catch((err) => {
				dispatch({ type: "hideloading", paylod: true });
				return err;
			});
	};
};

export const passChange = (
	oldpassword,
	newpassword,
	confirmpassword,
	id_customer
) => {
	return async (dispatch, getState) => {
		var data = new FormData();
		data.append("action", "changepassword");
		data.append("oldpassword", oldpassword);
		data.append("newpassword", newpassword);
		data.append("id_customer", id_customer);
		data.append("confirmpassword", confirmpassword);
		dispatch({ type: "showloading", paylod: true });

		CALL_API("post", "Customer/changepassword", data)
			.then((res) => {
				console.log(res);
				if (res.data.status == 200) {
					// dispatch({type:PROFILE,paylod:res.data.data});
					notify(res.data.message, "success");
				} else {
					notify(res.data.message, "danger");
				}
				setTimeout(() => {
					dispatch({ type: "hideloading", paylod: true });
				}, 1000);
			})
			.catch((err) => {
				dispatch({ type: "hideloading", paylod: true });
			});
	};
};

export const SaveProfile = (dataToSend) => {
	return async (dispatch, getState) => {
		let {
			fname,
			lname,
			email,
			address,
			city,
			userstate,
			id,
			pincode,
			ccode,
			tel,
			txtcountrycode,
			result,
		} = dataToSend;
		var data = new FormData();

		if (Boolean(result)) {
			let { uri } = result;
			let uriParts = uri.split(".");
			let fileType = uriParts[uriParts.length - 1];
			data.append("image", {
				uri,
				name: `profile.${fileType}`,
				type: `image/${fileType}`,
			});
		} else {
			data.append("image", "");
		}

		data.append("action", "editprofile");
		data.append("fname", fname);
		data.append("lname", lname);
		data.append("id_customer", id);
		data.append("email", email);
		data.append("countrycode", ccode);
		data.append("phonenumber", tel);
		data.append("address", address);
		data.append("city", city);
		data.append("state", userstate);
		data.append("pincode", pincode);
		data.append("txtcountrycode", txtcountrycode);

		dispatch({ type: "showloading", paylod: true });
		console.log("before call = ");
		await CALL_API("post", "Customer/editprofile", data)
			.then((res) => {
				console.log(res);
				if (res.data.status == 200) {
					dispatch({ type: PROFILE, paylod: res.data.data });
					notify(res.data.message, "success");
				} else {
					notify(res.data.message, "danger");
				}
				setTimeout(() => {
					dispatch({ type: "hideloading", paylod: true });
				}, 1000);

				return "success";
			})
			.catch((err) => {
				dispatch({ type: "hideloading", paylod: true });
			});
	};
};

export const Getmessagebycustomerid = (id_customer) => {
	return async (dispatch, getState) => {
		var data = new FormData();
		data.append("action", "getmessage");
		data.append("id_customer", id_customer);
		dispatch({ type: "showloading", paylod: true });

		await CALL_API("post", "message/Getmessagebycustomerid", data)
			.then((res) => {
				console.log(res);
				if (res.data.status == 200) {
					dispatch({ type: CHATDATA, paylod: res.data.data });
					// notify(res.data.message,"success");
				} else {
					notify(res.data.message, "danger");
				}
				setTimeout(() => {
					dispatch({ type: "hideloading", paylod: true });
				}, 1000);

				return "success";
			})
			.catch((err) => {
				dispatch({ type: "hideloading", paylod: true });
			});
	};
};

export const addMessage = (id_customer, message) => {
	return async (dispatch, getState) => {
		var data = new FormData();
		data.append("action", "addmessage");
		data.append("id_sender", id_customer);
		data.append("message", message);
		dispatch({ type: "showloading", paylod: true });

		await CALL_API("post", "message/Addmessage", data)
			.then((res) => {
				console.log(res);
				if (res.data.status == 200) {
					// dispatch({type:CHATDATA,paylod:res.data.data});
					// notify(res.data.message,"success");
				} else {
					notify(res.data.message, "danger");
				}
				setTimeout(() => {
					dispatch({ type: "hideloading", paylod: true });
				}, 1000);

				return "success";
			})
			.catch((err) => {
				dispatch({ type: "hideloading", paylod: true });
			});
	};
};

export const changeData = (data) => {
	return async (dispatch, getState) => {
		dispatch({ type: LOGIN, paylod: data });
	};
};
