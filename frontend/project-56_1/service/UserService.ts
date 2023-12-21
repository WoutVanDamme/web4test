import { User, UserWithEmail } from '@/types/BlogTypes';

const  loginUser = async(username: string, password: string) => {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_URL + "/login", {
        method: "POST",
        body: JSON.stringify({
            user : {
              username,
              password,
            },
        }),
        headers: {
          "content-type": "application/json",
        },
      });

    return res;
    }catch(error) {
      return undefined;
    }

}

const registerUser = async(user: UserWithEmail) => {
  try {
    return await fetch(process.env.NEXT_PUBLIC_URL + "/register", {
      method: "POST",
      body: JSON.stringify({
        username: user.username,
        email: user.email,
        password: user.password,
        admin: user.admin,
      }),
      headers: {
        "content-type": "application/json",
      },
    });
  }catch(error) {
    return undefined;
  }
  
}

const getAllUsers= async() => {
  try {
    const token = sessionStorage.getItem("token");
    return await fetch(process.env.NEXT_PUBLIC_API_URL + "/users", {
      method: "GET",
      headers: {
      "Content-Type": "application/json", 
      Authorization: `Bearer ${token}`,
      },
    });
  }catch(error) {
    return undefined;
  }
  
}


const getUser= async() => {

  try {
    const token = sessionStorage.getItem("token");

    return await fetch(process.env.NEXT_PUBLIC_URL + "/user", {
      method: "GET",
  
      headers: {
      "Content-Type": "application/json", 
      Authorization: `Bearer ${token}`,
      },
    });
  }catch(error) {
    return undefined;
  }
  
}

const banUser= async(userId: number, days: number) => {

  try {
    
  const token = sessionStorage.getItem("token");

  return await fetch(process.env.NEXT_PUBLIC_URL + "/ban/" + userId, {
    method: "POST",
    body: JSON.stringify({
      days: days,
    }),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  }catch(error) {
    return undefined;
  }
  
}

const UserService = {
 loginUser,
 registerUser,
 getAllUsers,
 getUser,
 banUser
}

export default UserService;