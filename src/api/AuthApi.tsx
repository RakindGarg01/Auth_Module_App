// // const BASE_URL = 'https://some-actors-hammer.loca.lt/api/auth/login';
// const BASE_URL = 'https://rockiness-passable-gibberish.ngrok-free.dev/api/auth';
// // const BASE_URL = 'http://176.168.2.43:3000/api/auth';


import {apiRequest} from './Client';

export type LoginResponse = {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
};

export function loginApi( email: string , password: string ): Promise<LoginResponse> {
    return apiRequest<LoginResponse>( '/auth/login', undefined, 'POST',{
        email,
        password,
      });
}
