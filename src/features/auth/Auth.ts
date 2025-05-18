import { SignInIF } from "../../types/SignInIF";
import axios from "axios";
import {ApiResponse} from "../../types/ApiResponse";
import {SignUpIF} from "../../types/SignUpIF";
import api from "../../api/api";

const SignInReq = async (data: SignInIF):Promise<ApiResponse<any>> => {
    try {
        const response = await api.post('/auth/login', data);
        return {data:response.data.token, error: null}
    } catch (error) {
        if(axios.isAxiosError(error)){
            if(error.response?.status===401){
                return {data:null, error: "Invalid username or password."}
            }
            return {data:null, error: error.response?.data}
        }
        return {data:null, error: "An unexpected error occurred. Please try again later."}
    }
}

const SignUpReq = async (data: SignUpIF):Promise<ApiResponse<any>> => {
    try {
        const response = await api.post('/auth/register', data);
        return {data:response.data.token, error: null}
    }catch (error) {
        if(axios.isAxiosError(error)){
            if(error.response?.status===409){
                return {data:null, error: "Email already exists."}
            }
            return {data:null, error: error.response?.data}
        }
        return {data:null, error: "An unexpected error occurred. Please try again later."}
    }
}

export {SignInReq , SignUpReq }
