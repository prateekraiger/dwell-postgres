const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";


export const tokenManager = {
  getToken: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  },

  setToken: (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  },

  removeToken: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  },
};


const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = tokenManager.getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }

  return response.json();
};


export const authApi = {
  register: async (data: {
    email: string;
    password: string;
    name: string;
    role: "GUEST" | "OWNER";
  }) => {
    const result = await fetchWithAuth("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (result.data?.token) {
      tokenManager.setToken(result.data.token);
    }

    return result;
  },

  login: async (data: { email: string; password: string }) => {
    const result = await fetchWithAuth("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (result.data?.token) {
      tokenManager.setToken(result.data.token);
    }

    return result;
  },

  logout: () => {
    tokenManager.removeToken();
  },

  getMe: async () => {
    return fetchWithAuth("/auth/me");
  },
};


export const userApi = {
  updateRole: async (role: "GUEST" | "OWNER") => {
    return fetchWithAuth("/users/role", {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
  },

  updateProfile: async (data: { name?: string }) => {
    return fetchWithAuth("/users/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};


export const roomApi = {
  getRooms: async () => {
    return fetchWithAuth(`/rooms`);
  },

  getRoom: async (id: string) => {
    return fetchWithAuth(`/rooms/${id}`);
  },

  getMyRooms: async () => {
    return fetchWithAuth("/rooms/my/rooms");
  },

  createRoom: async (data: {
    title: string;
    location: string;
    pricePerNight: number;
    description: string;
    photos: string[];
    maxGuests: number;
    highlights: string[];
  }) => {
    return fetchWithAuth("/rooms", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateRoom: async (id: string, data: any) => {
    return fetchWithAuth(`/rooms/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  deleteRoom: async (id: string) => {
    return fetchWithAuth(`/rooms/${id}`, {
      method: "DELETE",
    });
  },
};


export const bookingApi = {
  getMyBookings: async () => {
    return fetchWithAuth("/bookings/my-bookings");
  },

  getOwnerBookings: async () => {
    return fetchWithAuth("/bookings/owner-bookings");
  },

  getBooking: async (id: string) => {
    return fetchWithAuth(`/bookings/${id}`);
  },

  getRoomAvailability: async (roomId: string) => {
    return fetchWithAuth(`/bookings/room/${roomId}/availability`);
  },

  createBooking: async (data: {
    roomId: string;
    checkIn: string;
    checkOut: string;
  }) => {
    return fetchWithAuth("/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateBooking: async (
    id: string,
    status: "PENDING" | "CONFIRMED" | "CANCELLED"
  ) => {
    return fetchWithAuth(`/bookings/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  cancelBooking: async (id: string) => {
    return fetchWithAuth(`/bookings/${id}`, {
      method: "DELETE",
    });
  },
};


export const paymentApi = {
  createCheckoutSession: async (bookingId: string) => {
    return fetchWithAuth("/payments/create-checkout-session", {
      method: "POST",
      body: JSON.stringify({ bookingId }),
    });
  },
};
